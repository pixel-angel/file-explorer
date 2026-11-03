
import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args

    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    )
  },

  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args

    return ipcRenderer.off(channel, ...omit)
  },

  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args

    return ipcRenderer.send(channel, ...omit)
  },

  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args

    return ipcRenderer.invoke(channel, ...omit)
  },

  getDemoRoot() {
    return ipcRenderer.invoke('folio:get-demo-root')
  },

  ensureDemoFolder() {
    return ipcRenderer.invoke('folio:ensure-demo-folder')
  },

  backendRequest(request: Record<string, unknown>) {
    return ipcRenderer.invoke('folio:backend-request', request)
  },
})
