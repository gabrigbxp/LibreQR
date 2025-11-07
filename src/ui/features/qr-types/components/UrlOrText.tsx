import { ChangeEvent } from "react"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"

import QRWorkspace from "@ui/components/layout/QRWorkspace"
import urlOrTextSelector from "@ui/store/connectors/urlOrTextConnect"
import { useTranslation } from "@ui/hooks"
import type { CommonState } from "@ui/store/slices/commonSlice"

interface UrlOrTextProps extends Partial<CommonState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
    }
}

const UrlOrText = ({ text, actions }: UrlOrTextProps) => {
    const { t } = useTranslation()

    const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newText = event.target.value
        actions?.setCommon({ text: newText, canShow: true })
    }

    return (
        <QRWorkspace>
            <Grid size={12}>
                <TextField
                    label={t("qrTypes.urlOrText.content")}
                    variant="outlined"
                    size="small"
                    value={text || ""}
                    onChange={handleOnChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={t("qrTypes.urlOrText.placeholder")}
                />
            </Grid>
        </QRWorkspace>
    )
}

export default urlOrTextSelector(UrlOrText)
