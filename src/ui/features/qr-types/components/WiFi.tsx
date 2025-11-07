import { ChangeEvent, useEffect } from "react"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import Grid from "@mui/material/Grid2"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Switch from "@mui/material/Switch"
import TextField from "@mui/material/TextField"

import QRWorkspace from "@ui/components/layout/QRWorkspace"
import wiFiSelector from "@ui/store/connectors/wiFiConnect"
import { useTranslation } from "@ui/hooks"
import type { CommonState } from "@ui/store/slices/commonSlice"
import type { WiFiState } from "@ui/store/slices/wiFiSlice"

interface WiFiProps extends Partial<WiFiState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
        setWiFi: (state: Partial<WiFiState>) => void
    }
}

const WiFi = ({ ssid, encryptation, password, hidden, actions }: WiFiProps) => {
    const { t } = useTranslation()
    const isEncrypted = encryptation !== "nopass"
    const WiFiQRCode = `WIFI:T:${encryptation};S:${ssid}${encryptation ? `;P:${password.replace(/([;,:])/g, "\\$1")}` : ""}${hidden ? ";H:true" : ""};;`

    useEffect(() => {
        actions?.setCommon({ text: WiFiQRCode, canShow: !!(ssid && (!isEncrypted || (isEncrypted && password))) })
    }, [WiFiQRCode, actions, isEncrypted, password, ssid])

    const handleChangeSSID = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => actions?.setWiFi({ ssid: event.target.value })
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => actions?.setWiFi({ password: event.target.value })
    const handleChangeEncryptation = (event: SelectChangeEvent) => actions?.setWiFi({ encryptation: event.target.value })

    return (
        <QRWorkspace>
            <Box gap={2} display="flex" flexWrap="wrap">
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label={t("qrTypes.wifi.networkName")} variant="outlined" size="small" value={ssid || ""} onChange={handleChangeSSID} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="encryptation-selector">{t("qrTypes.wifi.encryptationType")}</InputLabel>
                        <Select
                            labelId="encryptation-selector"
                            value={encryptation || "WPA"}
                            label={t("qrTypes.wifi.encryptationType")}
                            onChange={handleChangeEncryptation}
                            variant="outlined"
                        >
                            <MenuItem value="WPA">WPA</MenuItem>
                            <MenuItem value="WEP">WEP</MenuItem>
                            <MenuItem value="nopass">{t("qrTypes.wifi.noPassword")}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={isEncrypted ? t("qrTypes.wifi.password") : t("qrTypes.wifi.noPassword")}
                        variant="outlined"
                        size="small"
                        value={!isEncrypted ? "" : password || ""}
                        onChange={handleChangePassword}
                        disabled={!isEncrypted}
                        fullWidth
                        type={isEncrypted ? "password" : "text"}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch onChange={(_, checked) => actions?.setWiFi({ hidden: checked })} checked={hidden || false} />}
                            label={t("qrTypes.wifi.hiddenNetwork")}
                        />
                    </FormGroup>
                </Grid>
            </Box>
        </QRWorkspace>
    )
}

export default wiFiSelector(WiFi)
