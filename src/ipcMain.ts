import { ipcMain } from "electron"
import { createQRText, previewQRText } from "./qr"
import type { QRPreviewInfo, QRTextInfo } from "types/interface"

ipcMain.handle("generate-qr", (_event, info: QRTextInfo) =>
    createQRText(
        {
            path: "qrcode.png",
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

ipcMain.handle("preview-qr", (_event, info: QRPreviewInfo) => previewQRText(info))
