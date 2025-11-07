import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid2"
import MenuItem from "@mui/material/MenuItem"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import SettingsIcon from "@mui/icons-material/Settings"

import { useDispatch, useSelector, useTranslation } from "@ui/hooks"
import { CommonState, resetAdvancedSettings, setCommon } from "@ui/store/slices/commonSlice"

const AdvanceSettings = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { errorCorrectionLevel, maskPattern, scale, size, version } = useSelector((state) => state.common)

    return (
        <Grid size={12}>
            <Card>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <SettingsIcon color="action" />
                            <Typography variant="h6">{t("advanced.title")}</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t("advanced.errorCorrectionLevel")}
                                    variant="outlined"
                                    value={errorCorrectionLevel}
                                    onChange={(e) => dispatch(setCommon({ errorCorrectionLevel: e.target.value as CommonState["errorCorrectionLevel"] }))}
                                    select
                                    size="small"
                                    helperText={t("advanced.errorCorrectionHelper")}
                                    fullWidth
                                >
                                    <MenuItem value="L">{t("advanced.errorLevels.L")}</MenuItem>
                                    <MenuItem value="M">{t("advanced.errorLevels.M")}</MenuItem>
                                    <MenuItem value="Q">{t("advanced.errorLevels.Q")}</MenuItem>
                                    <MenuItem value="H">{t("advanced.errorLevels.H")}</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t("advanced.maskPattern")}
                                    variant="outlined"
                                    value={maskPattern ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        const numValue = value === "" ? undefined : +value
                                        if (value === "" || (!isNaN(numValue) && numValue >= 0 && numValue <= 7)) {
                                            dispatch(setCommon({ maskPattern: numValue }))
                                        }
                                    }}
                                    type="number"
                                    size="small"
                                    helperText={t("advanced.maskPatternHelper")}
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            min: 0,
                                            max: 7,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t("advanced.qrVersion")}
                                    variant="outlined"
                                    value={version ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        const numValue = value === "" ? undefined : +value
                                        if (value === "" || (!isNaN(numValue) && numValue >= 1 && numValue <= 40)) {
                                            dispatch(setCommon({ version: numValue }))
                                        }
                                    }}
                                    type="number"
                                    size="small"
                                    helperText={t("advanced.qrVersionHelper")}
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            min: 1,
                                            max: 40,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t("advanced.scale")}
                                    variant="outlined"
                                    value={scale ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        const numValue = value === "" ? undefined : +value
                                        if (value === "" || (!isNaN(numValue) && numValue > 0)) {
                                            dispatch(setCommon({ scale: numValue }))
                                        }
                                    }}
                                    type="number"
                                    size="small"
                                    helperText={t("advanced.scaleHelper")}
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            min: 1,
                                            step: 1,
                                        },
                                    }}
                                />
                            </Grid>
                            {scale !== undefined && (
                                <Grid size={12}>
                                    <Alert severity="info">{t("advanced.scaleActive", { scale: scale.toString(), size: size.toString() })}</Alert>
                                </Grid>
                            )}
                            <Grid size={12}>
                                <Divider sx={{ my: 2 }} />
                                <Button variant="outlined" onClick={() => dispatch(resetAdvancedSettings())} startIcon={<RestartAltIcon />} size="small">
                                    {t("advanced.resetSettings")}
                                </Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid>
    )
}

export default AdvanceSettings
