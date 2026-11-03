
/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    VITE_PUBLIC: string
    VITE_DEV_SERVER_URL?: string
  }
}

interface FolioBackendRequest {
  operation: string
  [key: string]: unknown
}

interface FolioBackendResponse {
  success: boolean
  error?: string
  message?: string
  warning?: string
  path?: string
  items?: unknown[]
  item?: unknown
  content?: string
}

interface FolioIPC {
  on(
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void,
  ): Electron.IpcRenderer

  off(
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void,
  ): Electron.IpcRenderer

  send(channel: string, ...args: unknown[]): void

  invoke(channel: string, ...args: unknown[]): Promise<unknown>

  getDemoRoot(): Promise<string>

  ensureDemoFolder(): Promise<{
    success: boolean
    path?: string
    error?: string
  }>

  backendRequest(
    request: FolioBackendRequest,
  ): Promise<FolioBackendResponse>
}

interface Window {
  ipcRenderer: FolioIPC
}
