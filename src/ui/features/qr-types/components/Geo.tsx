import { ChangeEvent, useEffect } from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import QRWorkspace from "@ui/components/layout/QRWorkspace"
import geoSelector from "@ui/store/connectors/geoConnect"
import { useTranslation } from "@ui/hooks"
import type { CommonState } from "@ui/store/slices/commonSlice"
import type { GeoState } from "@ui/store/slices/geoSlice"

interface GeoProps extends Partial<GeoState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
        setGeo: (state: Partial<GeoState>) => void
    }
}

const Geo = ({ latitude, longitude, altitude, label, actions }: GeoProps) => {
    const { t } = useTranslation()

    // RFC 5870
    const geoQRCode = `geo:${latitude},${longitude}${altitude ? `,${altitude}` : ""}${label ? `;u=${encodeURIComponent(label)}` : ""}`

    useEffect(() => {
        const isValid = latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
        actions?.setCommon({
            text: geoQRCode,
            canShow: isValid,
        })
    }, [geoQRCode, actions, latitude, longitude])

    const handleChangeLatitude = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        actions?.setGeo({ latitude: value === "" ? undefined : parseFloat(value) })
    }

    const handleChangeLongitude = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        actions?.setGeo({ longitude: value === "" ? undefined : parseFloat(value) })
    }

    const handleChangeAltitude = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        actions?.setGeo({ altitude: value === "" ? undefined : parseFloat(value) })
    }

    const handleChangeLabel = (event: ChangeEvent<HTMLInputElement>) => actions?.setGeo({ label: event.target.value })

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    actions?.setGeo({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        altitude: position.coords.altitude || undefined,
                    })
                },
                (error) => {
                    console.error("Error getting location:", error)
                    alert(t("qrTypes.geo.locationError"))
                }
            )
        } else {
            alert(t("qrTypes.geo.geolocationNotSupported"))
        }
    }

    return (
        <QRWorkspace>
            <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                    {t("qrTypes.geo.title")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {t("qrTypes.geo.description")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid size={12}>
                <Button variant="outlined" onClick={getCurrentLocation} fullWidth sx={{ mb: 2 }}>
                    {t("qrTypes.geo.useCurrentLocation")}
                </Button>
            </Grid>
            <Box gap={2} display="flex" flexWrap="wrap">
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={t("qrTypes.geo.latitude")}
                        variant="outlined"
                        size="small"
                        type="number"
                        value={latitude ?? ""}
                        onChange={handleChangeLatitude}
                        slotProps={{
                            htmlInput: {
                                step: "any",
                                min: -90,
                                max: 90,
                            },
                        }}
                        helperText={t("qrTypes.geo.latitudeHelper")}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={t("qrTypes.geo.longitude")}
                        variant="outlined"
                        size="small"
                        type="number"
                        value={longitude ?? ""}
                        onChange={handleChangeLongitude}
                        slotProps={{
                            htmlInput: {
                                step: "any",
                                min: -180,
                                max: 180,
                            },
                        }}
                        helperText={t("qrTypes.geo.longitudeHelper")}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={t("qrTypes.geo.altitude")}
                        variant="outlined"
                        size="small"
                        type="number"
                        value={altitude ?? ""}
                        onChange={handleChangeAltitude}
                        slotProps={{
                            htmlInput: {
                                step: "any",
                            },
                        }}
                        helperText={t("qrTypes.geo.altitudeHelper")}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={t("qrTypes.geo.label")}
                        variant="outlined"
                        size="small"
                        value={label}
                        onChange={handleChangeLabel}
                        helperText={t("qrTypes.geo.labelHelper")}
                        fullWidth
                    />
                </Grid>
            </Box>
            <Grid size={12}>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                    {t("qrTypes.geo.compatibility")}
                </Typography>
            </Grid>
        </QRWorkspace>
    )
}

export default geoSelector(Geo)
