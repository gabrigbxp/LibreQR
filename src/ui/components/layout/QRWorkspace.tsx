import { useCallback, useEffect, useState, type ChangeEvent, type ReactNode } from "react"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import Grid from "@mui/material/Grid2"
import IconButton from "@mui/material/IconButton"
import Modal from "@mui/material/Modal"
import Paper from "@mui/material/Paper"
import Slider from "@mui/material/Slider"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close"
import HelpIcon from "@mui/icons-material/Help"
import Image from "@mui/icons-material/Image"
import PaletteIcon from "@mui/icons-material/Palette"
import QrCodeIcon from "@mui/icons-material/QrCode"
import SettingsIcon from "@mui/icons-material/Settings"
import { useDropzone } from "react-dropzone"

import ColorPickerField from "@ui/components/common/ColorPickerField"
import { useDispatch, useSelector, useTranslation } from "@ui/hooks"
import useDebouncedCallback from "@ui/hooks/useDebouncedCallback"
import { setCommon } from "@ui/store/slices/commonSlice"
import { API } from "@utils/environment"
import AdvanceSettings from "./AdvanceSettings"

interface QRWorkspaceProps {
    children?: ReactNode
}

const QRWorkspace = ({ children }: QRWorkspaceProps) => {
    const {
        canShow,
        characterLimit,
        moduleColor,
        errorCorrectionLevel,
        hasLogo,
        imagePreviewSize,
        isLogoLoaded,
        backgroudnColor,
        logoContent,
        logoRadius,
        margin,
        maskPattern,
        preview,
        scale,
        size,
        text,
        version,
    } = useSelector((state) => state.common)
    const dispatch = useDispatch()
    const maxRadius = Math.floor(imagePreviewSize / 4 / 4)
    const realRadius = (logoRadius * maxRadius) / 100
    const { t } = useTranslation()
    const [isCharacterLimitModalOpen, setIsCharacterLimitModalOpen] = useState(false)

    // Estimate QR modules based on version or text length
    const estimateQRModules = (text: string, version?: number): number => {
        if (version) {
            // QR version to modules: version 1 = 21x21, each version adds 4 modules
            return 21 + (version - 1) * 4
        }

        // Estimate version based on text length (rough approximation)
        const textLength = text.length
        if (textLength <= 25) return 21 // Version 1
        if (textLength <= 47) return 25 // Version 2
        if (textLength <= 77) return 29 // Version 3
        if (textLength <= 114) return 33 // Version 4
        if (textLength <= 154) return 37 // Version 5
        if (textLength <= 195) return 41 // Version 6
        if (textLength <= 224) return 45 // Version 7
        if (textLength <= 279) return 49 // Version 8
        if (textLength <= 335) return 53 // Version 9
        return 57 // Version 10+ (for longer texts)
    }

    const handleFileChange = (files: File[]) => {
        const reader = new FileReader()
        reader.onload = () => {
            dispatch(setCommon({ isLogoLoaded: true, logoContent: reader.result as string }))
        }
        reader.readAsDataURL(files[0])
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: { "image/*": [] },
        multiple: false,
    })

    const updatePreview = useCallback(async () => {
        if (text && size) {
            API.preview({ text, size, margin, moduleColor, backgroudnColor, maskPattern, version, scale, errorCorrectionLevel }).then((preview) => {
                // Calculate actual preview size based on scale or size
                let actualPreviewSize = size
                if (scale !== undefined) {
                    // Calculate real QR size when using scale
                    const estimatedModules = estimateQRModules(text, version)
                    const totalModules = estimatedModules + 2 * margin
                    actualPreviewSize = totalModules * scale
                }
                dispatch(setCommon({ preview, imagePreviewSize: actualPreviewSize }))
            })
        } else {
            dispatch(setCommon({ preview: "" }))
        }
    }, [text, size, margin, moduleColor, backgroudnColor, maskPattern, version, scale, errorCorrectionLevel, dispatch])

    const debouncedUpdatePreview = useDebouncedCallback(updatePreview, 300)

    useEffect(() => {
        debouncedUpdatePreview()
    }, [debouncedUpdatePreview])

    const handleClickGenerateQr = () => {
        API.saveDialog("qr.png").then((file) => {
            if (!file.canceled && file.filePath) {
                const logo = isLogoLoaded ? { content: logoContent, radius: realRadius } : undefined
                API.create({ text, size, logo, fileName: file.filePath, margin, moduleColor, backgroudnColor, maskPattern, version, scale, errorCorrectionLevel })
            }
        })
    }

    const handleChangeSize = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newSize = +event.target.value
        if (!isNaN(newSize)) dispatch(setCommon({ size: newSize < 100 ? 100 : newSize }))
    }
    const handleChangeRadius = (_: Event, value: number | number[]) => dispatch(setCommon({ logoRadius: +value }))

    const handlemoduleColorChange = useDebouncedCallback((color: string) => {
        dispatch(setCommon({ moduleColor: color }))
    }, 100)

    const handlebackgroudnColorChange = useDebouncedCallback((color: string) => {
        dispatch(setCommon({ backgroudnColor: color }))
    }, 100)

    const currentLength = text.length
    const isNearLimit = currentLength > characterLimit * 0.8
    const isAtLimit = currentLength >= characterLimit

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <Paper sx={{ p: 2, bgcolor: "background.default" }}>
                    <Typography variant="caption" color={isAtLimit ? "error" : isNearLimit ? "warning" : "textSecondary"}>
                        {t("general.characterCount", { current: currentLength, limit: characterLimit })}
                    </Typography>
                    <IconButton onClick={() => setIsCharacterLimitModalOpen(true)} size="small">
                        <HelpIcon fontSize="small" />
                    </IconButton>
                    <Modal open={isCharacterLimitModalOpen} onClose={() => setIsCharacterLimitModalOpen(false)}>
                        <Box p={2} bgcolor="background.paper" borderRadius={1} maxWidth={400} mx="auto" my="20vh" sx={{ position: "relative" }}>
                            <Typography variant="h6">{t("general.characterLimit")}</Typography>
                            <Typography variant="body2">{t("general.characterLimitDescription")}</Typography>
                            <IconButton onClick={() => setIsCharacterLimitModalOpen(false)} sx={{ position: "absolute", top: 0, right: 0 }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Modal>
                </Paper>
            </Grid>
            <Grid size={12}>
                <Card>
                    <CardContent>{children}</CardContent>
                </Card>
            </Grid>
            <Grid size={12}>
                <Card>
                    <CardContent>
                        <Box display="flex" gap={1} mb={2} alignItems="center">
                            <SettingsIcon color="primary" />
                            <Typography variant="h6">{t("qr.basicSettings")}</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t("qr.size")}
                                    variant="outlined"
                                    value={size}
                                    onChange={handleChangeSize}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            step: "any",
                                            min: 100,
                                            max: 3000,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t("qr.margin")}
                                    variant="outlined"
                                    value={margin}
                                    onChange={(e) => {
                                        const newMargin = +e.target.value
                                        if (!isNaN(newMargin) && newMargin >= 0) {
                                            dispatch(setCommon({ margin: newMargin }))
                                        }
                                    }}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    helperText={t("qr.marginHelper")}
                                    error={!margin}
                                    slotProps={{
                                        htmlInput: {
                                            min: 0,
                                            max: 10,
                                        },
                                    }}
                                />
                            </Grid>
                            {!margin && (
                                <Grid size={12}>
                                    <Alert severity="warning">
                                        <strong>{t("general.warning")}:</strong> {t("general.margin0")}
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={12}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <PaletteIcon color="primary" />
                            <Typography variant="h6">{t("qr.colors")}</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ColorPickerField label={t("qr.moduleColor")} value={moduleColor} onChange={handlemoduleColorChange} helperText={""} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ColorPickerField label={t("qr.backgroudnColor")} value={backgroudnColor} onChange={handlebackgroudnColorChange} helperText={""} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={12}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <Image color="primary" />
                            <Typography variant="h6">{t("qr.logo")}</Typography>
                        </Box>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch onChange={(_, checked) => dispatch(setCommon({ hasLogo: checked }))} checked={hasLogo} />}
                                label={t("qr.includeLogo")}
                            />
                        </FormGroup>
                        {hasLogo &&
                            (API.isWeb ? (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <strong>{t("general.warning")}:</strong> {t("qr.logoWebWarning")}
                                </Alert>
                            ) : (
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Box {...getRootProps()}>
                                            <Button role="button" variant="outlined" startIcon={<Image />} fullWidth sx={{ py: 2 }}>
                                                {isDragActive ? t("qr.dropLogoActive") : t("qr.dropLogo")}
                                                <input {...getInputProps()} />
                                            </Button>
                                        </Box>
                                    </Grid>
                                    {isLogoLoaded && (
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                {t("qr.roundCorner")}
                                            </Typography>
                                            <Stack spacing={2} direction="row" sx={{ alignItems: "center" }}>
                                                <Box component="span" sx={{ fontSize: "0.75rem" }}>
                                                    0%
                                                </Box>
                                                <Slider aria-label={t("qr.radiusLabel")} value={logoRadius} onChange={handleChangeRadius} min={0} max={100} />
                                                <Box component="span" sx={{ fontSize: "0.75rem" }}>
                                                    100%
                                                </Box>
                                            </Stack>
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={12}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <QrCodeIcon color="primary" />
                            <Typography variant="h6">{t("general.preview")}</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 200,
                                bgcolor: preview && canShow ? "grey.50" : backgroudnColor,
                                borderRadius: 2,
                                position: "relative",
                                py: 2,
                            }}
                        >
                            {preview && canShow ? (
                                <Box sx={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={preview}
                                        style={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            borderRadius: 8,
                                        }}
                                    />
                                    {hasLogo && isLogoLoaded && (
                                        <img
                                            src={logoContent}
                                            style={{
                                                width: imagePreviewSize / 4,
                                                height: imagePreviewSize / 4,
                                                borderRadius: logoRadius,
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                display: "block",
                                            }}
                                        />
                                    )}
                                </Box>
                            ) : (
                                <Typography variant="body2" color={moduleColor}>
                                    {t("qr.previewMessage")}
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <AdvanceSettings />
            <Grid size={12}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Button
                        disabled={!preview || !canShow}
                        variant="contained"
                        onClick={handleClickGenerateQr}
                        size="large"
                        startIcon={<QrCodeIcon />}
                        sx={{ minWidth: 200, py: 1.5 }}
                    >
                        {t(API.isWeb ? "general.downloadQr" : "general.generateQr")}
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default QRWorkspace
