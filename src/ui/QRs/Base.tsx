import { ChangeEvent, ReactNode, useEffect } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Button from "@mui/material/Button"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import Slider from "@mui/material/Slider"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Image from "@mui/icons-material/Image"
import { useDropzone } from "react-dropzone"
import { connect } from "react-redux"

import { CommonState, setCommon } from "@ui/store/commonSlice"
import baseSelector from "@ui/store/selectors/baseSelector"
import { IDispatch } from "@ui/store"

interface WithCommonControllersProps extends Partial<CommonState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
    }
    children?: ReactNode
}

const WithCommonControllers = ({ text, canShow, size, preview, hasLogo, isLogoLoaded, logoContent, logoRadius, children, actions }: WithCommonControllersProps) => {
    const maxRadius = Math.floor(size / 4 / 4)
    const realRadius = (logoRadius * maxRadius) / 100

    const handleFileChange = (files: File[]) => {
        const reader = new FileReader()
        reader.onload = () => {
            actions.setCommon({ isLogoLoaded: true, logoContent: reader.result as string })
        }
        reader.readAsDataURL(files[0])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: { "image/*": [] },
        multiple: false,
    })

    useEffect(() => {
        if (text && size) {
            window.API.previewQRText({ text, size }).then((preview) => actions.setCommon({ preview }))
        } else {
            actions.setCommon({ preview: "" })
        }
    }, [actions, size, text])

    const handleClickGenerateQr = () => {
        window.API.saveDialog("qr.png").then((file) => {
            if (!file.canceled && file.filePath) {
                const logo = isLogoLoaded ? { content: logoContent, radius: realRadius } : undefined
                window.API.createQRText({ text, size, logo, fileName: file.filePath })
            }
        })
    }

    const handleChangeSize = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newSize = +event.target.value
        if (!isNaN(newSize)) actions.setCommon({ size: newSize < 100 ? 100 : newSize })
    }
    const handleChangeRadius = (_: Event, value: number | number[]) => actions.setCommon({ logoRadius: value as number })

    return (
        <Grid container spacing={2}>
            {children}
            <Grid size={6}>
                <TextField label="QR Size" variant="standard" value={size} onChange={handleChangeSize} inputMode="numeric" />
            </Grid>
            <Grid size={12}>
                <FormGroup>
                    <FormControlLabel control={<Switch onChange={(_, checked) => actions.setCommon({ hasLogo: checked })} checked={hasLogo} />} label="Include a logo?" />
                </FormGroup>
            </Grid>
            <Grid sx={{ display: hasLogo ? "inherit" : "none" }} container size={12}>
                <Grid size={8}>
                    <Box {...getRootProps()}>
                        <Button role="button" variant="contained" startIcon={<Image />} fullWidth>
                            {isDragActive ? "Drop the logo here..." : "Drag 'n' drop here, or click to select"}
                            <input {...getInputProps()} />
                        </Button>
                    </Box>
                </Grid>
                {isLogoLoaded && (
                    <Grid size={4}>
                        <Box>Round corner</Box>
                        <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
                            <Box component={"span"}>0%</Box>
                            <Slider aria-label="Radius" value={logoRadius} onChange={handleChangeRadius} min={0} max={100} />
                            <Box component={"span"}>100%</Box>
                        </Stack>
                    </Grid>
                )}
            </Grid>
            <Grid size={12}>
                Preview
                {preview && canShow && (
                    <Grid
                        sx={{
                            backgroundImage: `url("${preview}")`,
                            width: size,
                            height: size,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {hasLogo && isLogoLoaded && <img src={logoContent} style={{ width: size / 4, height: size / 4, borderRadius: realRadius }} />}
                    </Grid>
                )}
            </Grid>
            <Grid size={12}>
                <Button variant="contained" onClick={handleClickGenerateQr}>
                    Generate QR
                </Button>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = baseSelector

const mapDispatchToProps = (dispatch: IDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(WithCommonControllers)
