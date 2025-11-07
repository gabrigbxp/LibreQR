import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import LanguageIcon from "@mui/icons-material/Language"

import { useDispatch, useSelector, useTranslation } from "@ui/hooks"
import { toggleLocale } from "@ui/store/slices/localeSlice"

const LocaleToggle = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const locale = useSelector((state) => state.locale.current)

    return (
        <Tooltip title={t(`general.toggleLanguage`)}>
            <Button startIcon={<LanguageIcon fontSize="small" />} onClick={() => dispatch(toggleLocale())} size="small" color="inherit">
                {locale === "en" ? "Español" : "English"}
            </Button>
        </Tooltip>
    )
}

export default LocaleToggle
