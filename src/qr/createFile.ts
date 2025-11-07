import { toBuffer, toFile } from "qrcode"
import type { QRCodeSegment, QRCodeToBufferOptions } from "qrcode"
import Jimp from "jimp"
import { BorderRadius } from "types/interface"
import { CommonState } from "@ui/store/slices/commonSlice"

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
    margin?: number
    moduleColor?: string
    backgroudnColor?: string
    maskPattern?: number
    version?: number
    errorCorrectionLevel?: CommonState["errorCorrectionLevel"]
}

const createFile = ({ path, text, options, logo, margin, moduleColor, backgroudnColor, maskPattern, version, errorCorrectionLevel }: QRTextType, onError: onErrorType): void => {
    const finalOptions = {
        ...options,
        ...{ errorCorrectionLevel, margin, maskPattern },
        ...{ color: { dark: moduleColor ?? "#000000", light: backgroudnColor ?? "#FFFFFF" } },
        ...(version !== undefined && version >= 1 && version <= 40 && { version }),
    } as QRCodeToBufferOptions
    if (logo) {
        toBuffer(text, finalOptions, (err: Error | null | undefined, qrBuffer: Buffer) => {
            if (err) return onError(err)
            Jimp.read(qrBuffer)
                .then((qrCode) => {
                    const base64Data = logo.content.replace(/^data:image\/\w+;base64,/, "")
                    const buffer = Buffer.from(base64Data, "base64")
                    Jimp.read(buffer)
                        .then((logoBuffer) => {
                            logoBuffer.resize(qrCode.bitmap.width / 4, Jimp.AUTO)
                            roundCorners(logoBuffer, logo.radius)
                            const posX = qrCode.bitmap.width / 2 - logoBuffer.bitmap.width / 2
                            const posY = qrCode.bitmap.height / 2 - logoBuffer.bitmap.height / 2
                            qrCode.composite(logoBuffer, posX, posY)
                            qrCode.write(path)
                        })
                        .catch(onError)
                })
                .catch(onError)
        })
    } else {
        toFile(path, text, finalOptions)
    }
}

export default createFile
