// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { IAPI } from "types/interface"

const arrojar = (reaseon?: unknown) => {
    throw reaseon
}

const API: IAPI = {
    createQRText: (...args) => {
        ipcRenderer.invoke("generate-qr", ...args).catch(arrojar)
    },
    previewQRText: (...args) => ipcRenderer.invoke("preview-qr", ...args),
}

contextBridge.exposeInMainWorld("API", API)
