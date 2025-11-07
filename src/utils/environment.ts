import { CommonState } from "@ui/store/slices/commonSlice"
import type { QRPreviewInfo } from "../../types/interface"
import { createQRDataURL, preview } from "../qr/qr-web"

// Flexible QR creation info that works for both environments
interface UnifiedQRInfo {
    text: string
    size: number
    logo?: {
        content: string
        radius: number
    }
    fileName?: string
    path?: string
    margin?: number
    moduleColor?: string
    backgroudnColor?: string
    maskPattern?: number
    version?: number
    scale?: number
    errorCorrectionLevel?: CommonState["errorCorrectionLevel"]
}

export const isElectron = () => window.__LIBREQR_ENV__ === "electron"
export const isWeb = () => window.__LIBREQR_ENV__ === "web"

// Web-compatible implementations of Electron APIs
export const webAPI = {
    create: async (info: UnifiedQRInfo) => {
        if (isElectron() && window.API?.createFile) {
            // For Electron, convert fileName to path for the expected interface
            const electronInfo = {
                ...info,
                fileName: info.path || info.fileName,
            }
            return window.API.createFile(electronInfo)
        }

        // Web implementation: trigger download
        try {
            const qrDataUrl = await createQRDataURL({
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

            // Convert data URL to blob and download
            const response = await fetch(qrDataUrl)
            const blob = await response.blob()

            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = info.fileName || info.path || "qr-code.png"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error("Error creating QR code:", error)
            throw error
        }
    },

    preview: async (info: QRPreviewInfo) => {
        if (isElectron() && window.API?.preview) {
            return window.API.preview(info)
        }

        try {
            return await preview(info)
        } catch (error) {
            console.error("Error previewing QR code:", error)
            throw error
        }
    },

    saveDialog: async (fileName: string) => {
        if (isElectron() && window.API?.saveDialog) {
            return window.API.saveDialog(fileName)
        }

        return {
            canceled: false,
            filePath: fileName,
        }
    },
}

export const API = {
    create: webAPI.create,
    preview: webAPI.preview,
    saveDialog: webAPI.saveDialog,
    isElectron: isElectron(),
    isWeb: isWeb(),
}
