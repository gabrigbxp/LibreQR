import { dialog, ipcMain } from "electron"
import { createQRText, previewQRText } from "./qr"
import type { QRPreviewInfo, QRTextInfo } from "types/interface"

ipcMain.handle("qr:generate", (_event, info: QRTextInfo) =>
    createQRText(
        {
            path: info.fileName,
            text: info.text,
            options: {
                errorCorrectionLevel: "H",
                width: info.size,
                type: "png",
            },
            logo: info.logo,
        },
        console.debug
    )
)

ipcMain.handle("qr:preview", (_event, info: QRPreviewInfo) => previewQRText(info))

ipcMain.handle("dialog:save-file", async (_event, fileName: string) => {
    const result = await dialog.showSaveDialog({
        title: "Guardar imagen",
        defaultPath: fileName,
        filters: [{ name: "Imágenes", extensions: ["png"] }],
    })
    return result
})
