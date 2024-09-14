import { ChangeEvent, useEffect } from "react"
import Grid from "@mui/material/Grid2"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { connect } from "react-redux"

import WithCommonControllers from "./Base"
import { CommonState, setCommon } from "@ui/store/commonSlice"
import { setWiFi, WiFiState } from "@ui/store/wiFiSlice"
import wiFiSelector from "@ui/store/selectors/wiFiSelector"
import { IDispatch } from "@ui/store"

interface WiFiProps extends Partial<WiFiState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
        setWiFi: (state: Partial<WiFiState>) => void
    }
}

const WiFi = ({ ssid, encryptation, password, hidden, escapar, actions }: WiFiProps) => {
    const isEncrypted = encryptation !== "nopass"
    const WiFiQRCode = `WIFI:T:${encryptation};S:${ssid}${encryptation ? `;P:${escapar ? password.replace(/([;,:])/g, "\\$1") : password}` : ""}${hidden ? ";H:true" : ""};;`

    useEffect(
        () => () => {
            actions.setCommon({ text: "", canShow: false })
        },
        [actions]
    )

    useEffect(() => {
        actions.setCommon({ text: WiFiQRCode, canShow: !!(ssid && (!isEncrypted || (isEncrypted && password))) })
    }, [WiFiQRCode, actions, isEncrypted, password, ssid])

    const handleChangeSSID = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => actions.setWiFi({ ssid: event.target.value })
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => actions.setWiFi({ password: event.target.value })
    const handleChangeEncryptation = (event: SelectChangeEvent) => actions.setWiFi({ encryptation: event.target.value })

    return (
        <WithCommonControllers>
            <Grid size={6}>
                <TextField label="Network name" variant="standard" value={ssid} onChange={handleChangeSSID} />
            </Grid>
            <Grid size={6}>
                <FormControl fullWidth>
                    <InputLabel id="encryptation-selector" aria-label="Select WiFi encryptation type">
                        Encryptation type
                    </InputLabel>
                    <Select labelId="encryptation-selector" value={encryptation} label="Encryptation type" onChange={handleChangeEncryptation}>
                        <MenuItem value="WPA">WPA</MenuItem>
                        <MenuItem value="WEP">WEP</MenuItem>
                        <MenuItem value="nopass">No password</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={6}>
                <TextField
                    label={isEncrypted ? "Password" : "No password"}
                    variant="standard"
                    value={!isEncrypted ? "" : password}
                    onChange={handleChangePassword}
                    disabled={!isEncrypted}
                />
            </Grid>
            <Grid size={6}>
                <FormGroup>
                    <FormControlLabel control={<Switch onChange={(_, checked) => actions.setWiFi({ hidden: checked })} checked={hidden} />} label="Hidden network?" />
                </FormGroup>
            </Grid>
            <Grid size={6}>
                <FormGroup>
                    <FormControlLabel control={<Switch onChange={(_, checked) => actions.setWiFi({ escapar: checked })} checked={escapar} />} label="Escapar" />
                </FormGroup>
            </Grid>
        </WithCommonControllers>
    )
}

const mapStateToProps = wiFiSelector

const mapDispatchToProps = (dispatch: IDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
        setWiFi: (data: Partial<WiFiState>) => dispatch(setWiFi(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(WiFi)
