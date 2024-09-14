import { Fragment, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { CssBaseline } from "@mui/material"
import ErrorBoundary from "./ErrorBoundary"
import Main from "./Main"
import env from "./.env.json"
import store from "./store"
import { Provider } from "react-redux"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const App = () => {
    env.NODE_ENV === "production" ? StrictMode : Fragment
    return (
        <StrictMode>
            <Provider store={store}>
                <ErrorBoundary>
                    <CssBaseline />
                    <Main />
                </ErrorBoundary>
            </Provider>
        </StrictMode>
    )
}

const root = createRoot(document.querySelector("#root"))
root.render(App())
