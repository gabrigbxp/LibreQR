import { CommonState } from "@ui/store/slices/commonSlice"
import { QRCodeMaskPattern, toDataURL } from "qrcode"
export { default as preview } from "./preview"

interface QROptions {
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

export const createQRDataURL = ({
    text,
    size,
    margin = 2,
    moduleColor = "#000000",
    backgroudnColor = "#FFFFFF",
    maskPattern,
    version,
    scale,
    errorCorrectionLevel = "H",
}: QROptions): Promise<string> => {
    const baseOptions = {
        // Use scale OR width, not both (scale takes priority)
        ...(scale !== undefined ? { scale } : { width: size }),
        errorCorrectionLevel,
        margin,
        color: { dark: moduleColor, light: backgroudnColor },
    }

    // Add advanced options only if they are valid
    const options = {
        ...baseOptions,
        maskPattern: maskPattern as QRCodeMaskPattern,
        version,
    }

    return toDataURL(text, options) as Promise<string>
}
