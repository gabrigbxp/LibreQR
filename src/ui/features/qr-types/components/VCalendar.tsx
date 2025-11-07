import { ChangeEvent, useEffect } from "react"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid2"
import Switch from "@mui/material/Switch"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import QRWorkspace from "@ui/components/layout/QRWorkspace"
import { useTranslation } from "@ui/hooks"
import vCalendarSelector from "@ui/store/connectors/vCalendarConnect"
import type { CommonState } from "@ui/store/slices/commonSlice"
import type { VCalendarState } from "@ui/store/slices/vCalendarSlice"

interface VCalendarProps extends Partial<VCalendarState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
        setVCalendar: (state: Partial<VCalendarState>) => void
    }
}

const VCalendar = ({ title, description, location, startDate, endDate, allDay, organizer, url, actions }: VCalendarProps) => {
    const { t } = useTranslation()

    // Generate vCalendar format (iCalendar)
    const generateVCalendar = (): string => {
        if (!title || !startDate) return ""

        // YYYYMMDDTHHMMSSZ
        const formatDate = (dateStr: string, isAllDay = false): string => {
            const date = new Date(dateStr)
            if (isAllDay) {
                return date.toISOString().split("T")[0].replace(/-/g, "")
            }
            return date
                .toISOString()
                .replace(/[-:]/g, "")
                .replace(/\.\d{3}/, "")
        }

        const now = new Date()
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, "")

        let vcal = "BEGIN:VCALENDAR\n"
        vcal += "VERSION:2.0\n"
        vcal += "PRODID:-//LibreQR//QR Calendar Event//EN\n"
        vcal += "BEGIN:VEVENT\n"

        // Unique ID
        vcal += `UID:${now}@libreqr.com\n`

        // Creation timestamp
        vcal += `DTSTAMP:${now}\n`

        // Start date
        if (allDay) {
            const startDateTime = new Date(startDate)
            startDateTime.setDate(startDateTime.getDate() + 1)
            vcal += `DTSTART;VALUE=DATE:${formatDate(startDateTime.toISOString(), true)}\n`
        } else {
            vcal += `DTSTART:${formatDate(startDate)}\n`
        }

        // End date
        if (endDate) {
            if (allDay) {
                const endDateTime = new Date(endDate)
                endDateTime.setDate(endDateTime.getDate() + 1)
                vcal += `DTEND;VALUE=DATE:${formatDate(endDateTime.toISOString(), true)}\n`
            } else {
                vcal += `DTEND:${formatDate(endDate)}\n`
            }
        }

        // Title (summary)
        vcal += `SUMMARY:${title.replace(/\n/g, "\\n")}\n`

        // Description
        if (description) {
            vcal += `DESCRIPTION:${description.replace(/\n/g, "\\n")}\n`
        }

        // Location
        if (location) {
            vcal += `LOCATION:${location.replace(/\n/g, "\\n")}\n`
        }

        // Organizer
        if (organizer) {
            vcal += `ORGANIZER:${organizer.includes("@") ? `mailto:${organizer}` : organizer}\n`
        }

        // URL
        if (url) {
            vcal += `URL:${url}\n`
        }

        vcal += "END:VEVENT\n"
        vcal += "END:VCALENDAR"

        return vcal
    }

    const vCalendarQRCode = generateVCalendar()

    useEffect(() => {
        const isValid = !!(title && startDate)
        actions?.setCommon({
            text: vCalendarQRCode,
            canShow: isValid,
        })
    }, [vCalendarQRCode, actions, title, startDate])

    const handleChange = (field: keyof VCalendarState) => (event: ChangeEvent<HTMLInputElement>) => {
        actions?.setVCalendar({ [field]: event.target.value })
    }

    const handleAllDayChange = (event: ChangeEvent<HTMLInputElement>) => {
        actions?.setVCalendar({ allDay: event.target.checked })
    }

    return (
        <QRWorkspace>
            <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                    {t("qrTypes.vcalendar.title")}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    {t("qrTypes.vcalendar.description")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Grid>
            <Box gap={2} display="flex" flexWrap="wrap">
                <Grid size={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        {t("qrTypes.vcalendar.eventInfo")}
                    </Typography>
                    <TextField label={t("qrTypes.vcalendar.eventTitle")} variant="outlined" size="small" value={title || ""} onChange={handleChange("title")} fullWidth required />
                </Grid>
                <Grid size={12}>
                    <TextField
                        label={t("qrTypes.vcalendar.eventDescription")}
                        variant="outlined"
                        size="small"
                        multiline
                        rows={3}
                        value={description || ""}
                        onChange={handleChange("description")}
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <TextField label={t("qrTypes.vcalendar.location")} variant="outlined" size="small" value={location || ""} onChange={handleChange("location")} fullWidth />
                </Grid>
                <Grid size={12}>
                    <Typography variant="subtitle1">{t("qrTypes.vcalendar.dateTime")}</Typography>
                    <FormControlLabel control={<Switch checked={allDay || false} onChange={handleAllDayChange} />} label={t("qrTypes.vcalendar.allDay")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={t("qrTypes.vcalendar.startDateTime")}
                        variant="outlined"
                        size="small"
                        type={allDay ? "date" : "datetime-local"}
                        value={startDate || ""}
                        onChange={handleChange("startDate")}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        label={t("qrTypes.vcalendar.endDateTime")}
                        variant="outlined"
                        size="small"
                        type={allDay ? "date" : "datetime-local"}
                        value={endDate || ""}
                        onChange={handleChange("endDate")}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid size={12} gap={2} display="flex" flexWrap="wrap" alignItems="flex-end">
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {t("qrTypes.vcalendar.additionalInfo")}
                        </Typography>
                        <TextField
                            label={t("qrTypes.vcalendar.organizer")}
                            variant="outlined"
                            size="small"
                            type="email"
                            value={organizer || ""}
                            onChange={handleChange("organizer")}
                            placeholder={t("general.emailPlaceholder")}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label={t("qrTypes.vcalendar.eventUrl")}
                            variant="outlined"
                            size="small"
                            type="url"
                            value={url || ""}
                            onChange={handleChange("url")}
                            placeholder={t("general.websitePlaceholder")}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Box>
            <Grid size={12}>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                        {t("qrTypes.vcalendar.requiredFields")}
                    </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                        {t("qrTypes.vcalendar.compatibility")}
                    </Typography>
                </Box>
            </Grid>
        </QRWorkspace>
    )
}

export default vCalendarSelector(VCalendar)
