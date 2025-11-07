import type { PropsWithChildren } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { enUS, esES } from "@mui/material/locale"
import { useSelector } from "@ui/hooks/useRedux"
import { theme as baseTheme } from "./theme"

const AppThemeProvider = ({ children }: PropsWithChildren) => {
    const locale = useSelector((state) => state.locale.current)
    const localeData = locale === "es" ? esES : enUS
    const theme = { ...localeData, ...baseTheme }

    return (
        <ThemeProvider theme={theme} noSsr defaultMode="system">
            {children}
        </ThemeProvider>
    )
}

export default AppThemeProvider
