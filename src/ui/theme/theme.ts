import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "class",
    },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: "#4F46E5" },
                secondary: { main: "#0EA5E9" },
                background: {
                    default: "#f7f7fb",
                    paper: "#ffffff",
                },
            },
        },
        dark: {
            palette: {
                primary: { main: "#8EA0FF" },
                secondary: { main: "#5ED0FB" },
                background: {
                    default: "#0b0f19",
                    paper: "#0d1426",
                },
            },
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        h1: { fontWeight: 700, fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)" },
        h2: { fontWeight: 700, fontSize: "clamp(1.6rem, 1.2rem + 1.4vw, 2.2rem)" },
        h3: { fontWeight: 700, fontSize: "clamp(1.3rem, 1.05rem + 0.9vw, 1.8rem)" },
        h4: { fontWeight: 700 },
        subtitle1: { opacity: 0.9 },
        body1: { lineHeight: 1.7 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                },
                "*::-webkit-scrollbar-track": {
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                },
                "*::-webkit-scrollbar-thumb": {
                    backgroundColor: "#8EA0FF",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#6B7FE8",
                    },
                },
                // Firefox
                "*": {
                    scrollbarWidth: "thin",
                    scrollbarColor: "#8EA0FF rgba(0,0,0,0.1)",
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingTop: 24,
                    paddingBottom: 24,
                },
            },
        },
        MuiLink: {
            defaultProps: {
                underline: "none",
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 1,
            },
            styleOverrides: {
                rounded: {
                    borderRadius: 12,
                },
            },
        },
        MuiChip: {
            defaultProps: {
                size: "small",
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
        },
    },
})

export type AppTheme = typeof theme
