import { useEffect, useState } from "react"
import { Box, Input } from "@mui/material"
import Button from "@mui/material/Button"

const QRType = () => {
    const [logoLoaded, setLogoLoaded] = useState(false)
    const [logoContent, setLogoContent] = useState<string | null>(null)
    const [text, setText] = useState("https://forms.gle/VonvriQh9zmhQZ2N9")
    const [radius, setRadius] = useState(0)
    const [size, setSize] = useState(300)
    const [preview, setPreview] = useState("")
    const maxRadius = Math.floor(size / 4 / 4)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setLogoLoaded(true)
                setLogoContent(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (text && size) {
            window.API.previewQRText({ text, size }).then(setPreview)
        }
    }, [text])

    const handleClickGenerateQr = () => {
        const logo = logoLoaded ? { content: logoContent, radius } : undefined
        console.debug({ text, size, logo })
        window.API.createQRText({ text, size, logo })
    }

    return (
        <Box>
            Logo <Input type="file" onChange={handleFileChange} inputProps={{ accept: "image/*" }} />
            <br />
            Text: <Input type="text" value={text} onChange={(event) => setText(event.target.value)} />
            <br />
            Radius: <Input type="number" value={radius} onChange={(event) => setRadius(+event.target.value)} inputProps={{ min: 0, max: maxRadius }} />
            <br />
            Size: <Input type="number" value={size} onChange={(event) => setSize(+event.target.value)} />
            <br />
            Preview
            {preview && (
                <Box
                    sx={{
                        backgroundImage: `url("${preview}")`,
                        width: size,
                        height: size,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {logoLoaded && <img src={logoContent} style={{ width: size / 4, height: size / 4, borderRadius: radius }} />}
                </Box>
            )}
            <br />
            <Button variant="contained" onClick={handleClickGenerateQr}>
                Generate QR
            </Button>
        </Box>
    )
}
export default QRType
