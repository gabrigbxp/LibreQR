// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { IAPI } from "types/interface"

const API: IAPI = {
    createFile: (...args) => {
        ipcRenderer.invoke("qr:generate", ...args)
    },
    preview: (...args) => ipcRenderer.invoke("qr:preview", ...args),
    saveDialog: (...args) => ipcRenderer.invoke("dialog:save-file", ...args),
}

contextBridge.exposeInMainWorld("API", API)
