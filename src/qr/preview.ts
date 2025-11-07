import { CommonState } from "@ui/store/slices/commonSlice"
import * as QRCode from "qrcode"

interface PreviewOptions {
    text: string
    size: number
    margin?: number
    moduleColor?: string
    backgroudnColor?: string
    maskPattern?: number
    version?: number
    scale?: number
    errorCorrectionLevel?: CommonState["errorCorrectionLevel"]
}

export const preview = ({
    text,
    size,
    margin = 2,
    moduleColor = "#000000",
    backgroudnColor = "#FFFFFF",
    maskPattern,
    version,
    scale,
    errorCorrectionLevel = "H",
}: PreviewOptions): Promise<string> => {
    const options = {
        // Use scale OR width, not both (scale takes priority)
        ...(scale !== undefined ? { scale } : { width: size }),
        margin,
        color: {
            dark: moduleColor,
            light: backgroudnColor,
        },
        errorCorrectionLevel,
        maskPattern,
        version,
    }

    return QRCode.toDataURL(text, options as QRCode.QRCodeToDataURLOptions)
}

export default preview
