import { CommonState } from "@ui/store/slices/commonSlice"
import { SaveDialogReturnValue } from "electron"

type QRTextInfo = {
    /**
     * Full path to file
     */
    fileName: string
    /**
     * QR content
     */
    text: string
    /**
     * size of qr on pixels
     */
    size: number
    /**
     * logo base64
     */
    logo?: {
        content: string
        /**
         * logo border radius
         */
        radius: number
    }
    /**
     * Margin around QR code
     */
    margin?: number
    /**
     * Dark color (modules)
     */
    moduleColor?: string
    /**
     * Light color (background)
     */
    backgroudnColor?: string
    /**
     * Advanced QR parameters
     */
    maskPattern?: number
    version?: number
    scale?: number
    errorCorrectionLevel?: CommonState["errorCorrectionLevel"]
}

type QRPreviewInfo = {
    /**
     * QR content
     */
    text: string
    /**
     * size of qr on pixels
     */
    size: number
    /**
     * Margin around QR code
     */
    margin?: number
    /**
     * Dark color (modules)
     */
    moduleColor?: string
    /**
     * Light color (background)
     */
    backgroudnColor?: string
    /**
     * Advanced QR parameters
     */
    maskPattern?: number
    version?: number
    scale?: number
    errorCorrectionLevel?: CommonState["errorCorrectionLevel"]
}

export type CreateFile = (info: QRTextInfo) => void
export type Preview = (info: QRPreviewInfo) => Promise<string>
export type SaveDialog = (fileName: string) => Promise<SaveDialogReturnValue>

export interface IAPI {
    createFile: CreateFile
    preview: Preview
    saveDialog: SaveDialog
}

export type BorderRadius =
    | number
    | {
          topLeft: number
          topRight: number
          bottomRight: number
          bottomLeft: number
      }

declare global {
    interface Window {
        API: IAPI
        __LIBREQR_ENV__: "web" | "electron"
    }
}
