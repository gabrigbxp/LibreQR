import { toBuffer, toDataURL, toFile } from "qrcode"
import type { QRCodeSegment, QRCodeToBufferOptions } from "qrcode"
import Jimp from "jimp"
import { BorderRadius } from "types/interface"

const roundCorners = (img: Jimp, borderRadius: BorderRadius): void => {
    const radius = {
        topLeft: typeof borderRadius === "number" ? borderRadius : borderRadius.topLeft,
        topRight: typeof borderRadius === "number" ? borderRadius : borderRadius.topRight,
        bottomRight: typeof borderRadius === "number" ? borderRadius : borderRadius.bottomRight,
        bottomLeft: typeof borderRadius === "number" ? borderRadius : borderRadius.bottomLeft,
    }
    img.scanQuiet(0, 0, img.bitmap.width, img.bitmap.height, function (x: number, y: number, idx: number) {
        const centerX = img.bitmap.width / 2
        const centerY = img.bitmap.height / 2

        const offsetX = x - centerX
        const offsetY = y - centerY

        const currentRadius = offsetX >= 0 ? (offsetY < 0 ? radius.topRight : radius.bottomRight) : offsetY < 0 ? radius.topLeft : radius.bottomLeft

        const absOffsetX = offsetX >= 0 ? offsetX : -offsetX
        const absOffsetY = offsetY >= 0 ? offsetY : -offsetY

        const xFactor = absOffsetX < centerX - currentRadius ? 0 : Math.pow((absOffsetX - (centerX - currentRadius)) / currentRadius, 2)
        const yFactor = absOffsetY < centerY - currentRadius ? 0 : Math.pow((absOffsetY - (centerY - currentRadius)) / currentRadius, 2)
        const distance = xFactor + yFactor

        let alpha = distance > 1 ? 0 : 255
        const smoothness = Math.floor(Math.min(img.bitmap.width, img.bitmap.height) / (2 * currentRadius)) * 10

        if (smoothness && distance > 1 - 1 / smoothness && distance <= 1) {
            alpha = Math.round(255 * (1 - (distance - (1 - 1 / smoothness)) * smoothness))
        }

        img.bitmap.data[idx + 3] = alpha
    })
}

type onErrorType = (reason?: unknown) => void

interface QRTextType {
    path: string
    text: string | QRCodeSegment[]
    options: QRCodeToBufferOptions
    logo?: { content: string; radius: number }
}

export const createQRText = ({ path, text, options, logo }: QRTextType, onError: onErrorType): void => {
    if (logo) {
        toBuffer(text, options, (err: Error | null | undefined, qrBuffer: Buffer) => {
            if (err) return onError(err)
            Jimp.read(qrBuffer)
                .then((qrCode) => {
                    const base64Data = logo.content.replace(/^data:image\/\w+;base64,/, "")
                    const buffer = Buffer.from(base64Data, "base64")
                    Jimp.read(buffer)
                        .then((_logo) => {
                            _logo.resize(qrCode.bitmap.width / 4, Jimp.AUTO)
                            roundCorners(_logo, logo.radius)
                            const posX = qrCode.bitmap.width / 2 - _logo.bitmap.width / 2
                            const posY = qrCode.bitmap.height / 2 - _logo.bitmap.height / 2
                            qrCode.composite(_logo, posX, posY)
                            qrCode.write(path)
                        })
                        .catch(onError)
                })
                .catch(onError)
        })
    } else {
        toFile(path, text, options)
    }
}

export const previewQRText = ({ text, size }: { text: string; size: number }): Promise<string> => toDataURL(text, { width: size, errorCorrectionLevel: "H" })
