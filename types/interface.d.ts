import type { QRCodeSegment } from "qrcode"

type QRTextInfo = {
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
}

export type CreateQRText = (info: QRTextInfo) => void
export type PreviewQRText = (info: QRPreviewInfo) => Promise<string>

export interface IAPI {
    createQRText: CreateQRText
    previewQRText: PreviewQRText
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
    }
}
