import { dialog, ipcMain } from "electron"
import type { QRPreviewInfo, QRTextInfo } from "types/interface"
import createFile from "./qr/createFile"
import { preview } from "./qr/preview"

ipcMain.handle("qr:generate", (_event, info: QRTextInfo) =>
    createFile(
        {
            path: info.fileName,
            text: info.text,
            options: {
                errorCorrectionLevel: info.errorCorrectionLevel || "H",
                // Use scale OR width, not both (scale takes priority)
                ...(info.scale !== undefined ? { scale: info.scale } : { width: info.size }),
                type: "png",
            },
            logo: info.logo,
            margin: info.margin,
            moduleColor: info.moduleColor,
            backgroudnColor: info.backgroudnColor,
            maskPattern: info.maskPattern,
            version: info.version,
            errorCorrectionLevel: info.errorCorrectionLevel,
        },
        console.error
    )
)

ipcMain.handle("qr:preview", (_event, info: QRPreviewInfo) =>
    preview({
        text: info.text,
        size: info.size,
        margin: info.margin,
        moduleColor: info.moduleColor,
        backgroudnColor: info.backgroudnColor,
        maskPattern: info.maskPattern,
        version: info.version,
        scale: info.scale,
        errorCorrectionLevel: info.errorCorrectionLevel,
    })
)

ipcMain.handle("dialog:save-file", async (_event, fileName: string) => {
    const result = await dialog.showSaveDialog({
        title: "Guardar imagen",
        defaultPath: fileName,
        filters: [{ name: "Imágenes", extensions: ["png"] }],
    })
    return result
})
