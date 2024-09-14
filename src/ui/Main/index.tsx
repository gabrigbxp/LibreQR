import { lazy, Suspense, useState } from "react"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Grid from "@mui/material/Grid2"
import { CircularProgress } from "@mui/material"

const views = {
    Base: { component: lazy(async () => import("@ui/QRs/UrlOrText")), label: "URL or Text" },
    WiFi: { component: lazy(async () => import("@ui/QRs/WiFi")), label: "Connect to WiFi" },
}

const viewsKeys = Object.keys(views)

const Main = () => {
    const [selectedView, setSelectedView] = useState<keyof typeof views>(viewsKeys[0] as keyof typeof views)
    const handleChange = (event: SelectChangeEvent) => setSelectedView(event.target.value as keyof typeof views)
    const Component = selectedView ? views[selectedView].component : null

    return (
        <Grid container spacing={2}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" aria-label="QR options selector">
                    What do yo need?
                </InputLabel>
                <Select labelId="demo-simple-select-label" value={selectedView} label="What do yo need?" onChange={handleChange}>
                    {viewsKeys.map((key: keyof typeof views) => (
                        <MenuItem key={`menu-item-${key}`} value={key}>
                            {views[key].label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Suspense fallback={<CircularProgress />}>{selectedView && <Component />}</Suspense>
        </Grid>
    )
}

export default Main
