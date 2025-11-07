import { Fragment, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Container, CssBaseline } from "@mui/material"
import { Provider } from "react-redux"

import { AppHeader } from "./components/layout"
import ErrorBoundary from "./ErrorBoundary"
import { QRTypeSelector } from "./features/qr-generator"
import store from "./store"
import AppThemeProvider from "./theme/AppThemeProvider"
import env from "./.env.json"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const App = () => {
    const Wrapper = env.NODE_ENV === "production" ? StrictMode : Fragment
    return (
        <Wrapper>
            <Provider store={store}>
                <AppThemeProvider>
                    <ErrorBoundary>
                        <CssBaseline />
                        <AppHeader />
                        <Container
                            maxWidth="lg"
                            sx={{
                                py: { xs: 2, sm: 3 },
                                px: { xs: 1, sm: 2 },
                            }}
                        >
                            <QRTypeSelector />
                        </Container>
                    </ErrorBoundary>
                </AppThemeProvider>
            </Provider>
        </Wrapper>
    )
}

const root = createRoot(document.querySelector("#root"))
root.render(App())
