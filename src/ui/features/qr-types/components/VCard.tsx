import { ChangeEvent, useEffect } from "react"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import QRWorkspace from "@ui/components/layout/QRWorkspace"
import { useTranslation } from "@ui/hooks"
import type { CommonState } from "@ui/store/slices/commonSlice"
import type { VCardState } from "@ui/store/slices/vCardSlice"
import vCardSelector from "@ui/store/connectors/vCardConnect"

interface VCardProps extends Partial<VCardState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
        setVCard: (state: Partial<VCardState>) => void
        setVCardAddress: (state: Partial<VCardState["address"]>) => void
    }
}

const VCard = ({ firstName, lastName, organization, title, phone, email, website, address, note, actions }: VCardProps) => {
    const { t } = useTranslation()

    // Generate vCard format (version 3.0)
    const generateVCard = (): string => {
        let vcard = "BEGIN:VCARD\n"
        vcard += "VERSION:3.0\n"

        if (firstName || lastName) {
            vcard += `FN:${firstName || ""} ${lastName || ""}`.trim() + "\n"
            vcard += `N:${lastName || ""};${firstName || ""};;;\n`
        }
        if (organization) {
            vcard += `ORG:${organization}\n`
        }
        if (title) {
            vcard += `TITLE:${title}\n`
        }
        if (phone) {
            vcard += `TEL:${phone}\n`
        }
        if (email) {
            vcard += `EMAIL:${email}\n`
        }
        if (website) {
            vcard += `URL:${website}\n`
        }
        if (address && (address.street || address.city || address.state || address.zipCode || address.country)) {
            const addrLine = `;;${address.street || ""};${address.city || ""};${address.state || ""};${address.zipCode || ""};${address.country || ""}`
            vcard += `ADR:${addrLine}\n`
        }
        if (note) {
            vcard += `NOTE:${note}\n`
        }
        vcard += "END:VCARD"
        return vcard
    }

    const vCardQRCode = generateVCard()

    useEffect(() => {
        const isValid = !!(firstName || lastName || phone || email)
        actions?.setCommon({
            text: vCardQRCode,
            canShow: isValid,
        })
    }, [vCardQRCode, actions, firstName, lastName, phone, email])

    const handleChange = (field: keyof VCardState) => (event: ChangeEvent<HTMLInputElement>) => {
        actions?.setVCard({ [field]: event.target.value })
    }

    const handleAddressChange = (field: keyof NonNullable<VCardState["address"]>) => (event: ChangeEvent<HTMLInputElement>) => {
        actions?.setVCardAddress({ [field]: event.target.value })
    }

    return (
        <QRWorkspace>
            <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                    {t("qrTypes.vcard.title")}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                    {t("qrTypes.vcard.description")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
            </Grid>
            <Box gap={2} display="flex" flexWrap="wrap">
                <Grid size={12} gap={2} display="flex" flexWrap="wrap" alignItems="flex-end">
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {t("qrTypes.vcard.personalInfo")}
                        </Typography>
                        <TextField label={t("qrTypes.vcard.firstName")} variant="outlined" size="small" value={firstName} onChange={handleChange("firstName")} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label={t("qrTypes.vcard.lastName")} variant="outlined" size="small" value={lastName} onChange={handleChange("lastName")} fullWidth />
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label={t("qrTypes.vcard.organization")} variant="outlined" size="small" value={organization} onChange={handleChange("organization")} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label={t("qrTypes.vcard.position")} variant="outlined" size="small" value={title} onChange={handleChange("title")} fullWidth />
                </Grid>
                <Grid size={12} gap={2} display="flex" flexWrap="wrap" alignItems="flex-end">
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {t("qrTypes.vcard.contactInfo")}
                        </Typography>
                        <TextField label={t("qrTypes.vcard.phone")} variant="outlined" size="small" type="tel" value={phone} onChange={handleChange("phone")} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label={t("qrTypes.vcard.email")} variant="outlined" size="small" type="email" value={email} onChange={handleChange("email")} fullWidth />
                    </Grid>
                </Grid>
                <Grid size={12}>
                    <TextField
                        label={t("qrTypes.vcard.website")}
                        variant="outlined"
                        size="small"
                        type="url"
                        value={website}
                        onChange={handleChange("website")}
                        placeholder={t("general.websitePlaceholder")}
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        {t("qrTypes.vcard.address")}
                    </Typography>
                    <TextField label={t("qrTypes.vcard.street")} variant="outlined" size="small" value={address?.street} onChange={handleAddressChange("street")} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label={t("qrTypes.vcard.city")} variant="outlined" size="small" value={address?.city} onChange={handleAddressChange("city")} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label={t("qrTypes.vcard.state")} variant="outlined" size="small" value={address?.state} onChange={handleAddressChange("state")} fullWidth />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField label={t("qrTypes.vcard.zipCode")} variant="outlined" size="small" value={address?.zipCode} onChange={handleAddressChange("zipCode")} fullWidth />
                </Grid>
                <Grid size={12}>
                    <TextField label={t("qrTypes.vcard.country")} variant="outlined" size="small" value={address?.country} onChange={handleAddressChange("country")} fullWidth />
                </Grid>
                <Grid size={12}>
                    <Typography gutterBottom variant="subtitle1">
                        {t("qrTypes.vcard.additionalInfo")}
                    </Typography>
                    <TextField label={t("qrTypes.vcard.notes")} variant="outlined" size="small" multiline rows={2} value={note} onChange={handleChange("note")} fullWidth />
                </Grid>
            </Box>
            <Grid size={12}>
                <Typography variant="caption" color="textSecondary">
                    {t("qrTypes.vcard.requiredFields")}
                </Typography>
            </Grid>
        </QRWorkspace>
    )
}

export default vCardSelector(VCard)
