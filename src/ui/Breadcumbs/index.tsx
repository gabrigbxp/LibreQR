import { Box, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import QRType from "../QRType"

const TabPanel = (props: { children?: React.ReactNode; index: number; value: number }) => {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

const Breadcrumbs = () => {
    const [value, setValue] = useState(0)

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Home" />
                <Tab label="About" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <QRType />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <h1>About</h1>
            </TabPanel>
        </Box>
    )
}

export default Breadcrumbs
