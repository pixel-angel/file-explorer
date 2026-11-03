
import { app, BrowserWindow,shell, ipcMain } from 'electron'

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createInterface } from 'node:readline'
import { mkdir } from 'node:fs/promises'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null = null

const demoRoot = path.join(app.getPath('documents'), 'FolioDemo')
const backendPath = path.join(
  process.env.APP_ROOT,
  'backend',
  'build',
  'file_explorer_backend.exe',
)

let backend: ChildProcessWithoutNullStreams | null = null
let requestCounter = 0

const pendingRequests = new Map<
  string,
  {
    resolve: (value: any) => void
    reject: (reason: Error) => void
  }
>()

function startBackend() {
  if (backend && !backend.killed) {
    return backend
  }

  backend = spawn(backendPath, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  })

  const currentBackend = backend

  const lines = createInterface({
    input: currentBackend.stdout,
  })

  lines.on('line', (line) => {
    try {
      const response = JSON.parse(line)
      const id = String(response.id ?? '')

      const pending = pendingRequests.get(id)

      if (pending) {
        pendingRequests.delete(id)
        pending.resolve(response)
      }
    } catch {
      // Ignore invalid backend output lines.
    }
  })

  currentBackend.stderr.on('data', (data) => {
    console.error('[Folio backend]', data.toString())
  })

  currentBackend.on('error', (error) => {
    console.error('[Folio backend error]', error)

    for (const pending of pendingRequests.values()) {
      pending.reject(error)
    }

    pendingRequests.clear()
    backend = null
  })

  currentBackend.on('close', () => {
    for (const pending of pendingRequests.values()) {
      pending.reject(new Error('Folio backend stopped.'))
    }

    pendingRequests.clear()
    backend = null
  })

  return currentBackend
}

function backendRequest(request: Record<string, unknown>) {
  return new Promise<any>((resolve, reject) => {
    let process: ChildProcessWithoutNullStreams

    try {
      process = startBackend()
    } catch (error) {
      reject(error)
      return
    }

    const id = String(++requestCounter)

    pendingRequests.set(id, { resolve, reject })

    try {
      process.stdin.write(
        JSON.stringify({ ...request, id }) + '\n',
        (error) => {
          if (error) {
            pendingRequests.delete(id)
            reject(error)
          }
        },
      )
    } catch (error) {
      pendingRequests.delete(id)
      reject(error)
    }
  })
}

function isInsideDemoFolder(targetPath: string) {
  const root = path.resolve(demoRoot)
  const target = path.resolve(targetPath)

  const relative = path.relative(root, target)

  return (
    relative === '' ||
    (!relative.startsWith('..') && !path.isAbsolute(relative))
  )
}

function validateRequestPaths(request: Record<string, unknown>) {
  const pathFields = ['path', 'source', 'destination']

  for (const field of pathFields) {
    const value = request[field]

    if (typeof value === 'string' && !isInsideDemoFolder(value)) {
      throw new Error(
        'For safety, Folio can currently access only the FolioDemo folder.',
      )
    }
  }
}

ipcMain.handle('folio:get-demo-root', async () => {
  return demoRoot
})

ipcMain.handle('folio:ensure-demo-folder', async () => {
  try {
    await mkdir(demoRoot, { recursive: true })

    return {
      success: true,
      path: demoRoot,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Could not create folder.',
    }
  }
})

ipcMain.handle(
  'folio:backend-request',
  async (_event, request: Record<string, unknown>) => {
    try {
      if (!request || typeof request !== 'object') {
        return {
          success: false,
          error: 'Invalid backend request.',
        }
      }

      validateRequestPaths(request)

      return await backendRequest(request)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backend request failed.',
      }
    }
  },
)
ipcMain.handle(
  'folio:open-file',
  async (_event, filePath: unknown) => {
    try {
      if (
        typeof filePath !== 'string' ||
        !path.isAbsolute(filePath)
      ) {
        return {
          success: false,
          error: 'Invalid file path.',
        };
      }

      if (!isInsideDemoFolder(filePath)) {
        return {
          success: false,
          error: 'File is outside the FolioDemo folder.',
        };
      }

      const error = await shell.openPath(filePath);

      if (error) {
        return {
          success: false,
          error,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Could not open file.',
      };
    }
  },
);

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send(
      'main-process-message',
      new Date().toLocaleString(),
    )
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.whenReady().then(async () => {
  await mkdir(demoRoot, { recursive: true })
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    backend?.kill()
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
