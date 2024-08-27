import { createRoot } from "react-dom/client"
import { CssBaseline } from "@mui/material"
import Breadcrumbs from "./Breadcumbs"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const App = () => (
    <>
        <CssBaseline />
        <Breadcrumbs />
    </>
)

const root = createRoot(document.querySelector("#root"))
root.render(App())
