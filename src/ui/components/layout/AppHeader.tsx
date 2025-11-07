import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import QrCodeIcon from "@mui/icons-material/QrCode"
import GitHubIcon from "@mui/icons-material/GitHub"
import CoffeeIcon from "@mui/icons-material/Coffee"

import { LocaleToggle, ThemeToggle } from "../common"

const AppHeader = () => (
    <AppBar
        position="sticky"
        color="transparent"
        sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
        }}
    >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, sm: 64 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
                <QrCodeIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: "primary.main" }} />
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        backgroundClip: "text",
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    LibreQR
                </Typography>
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        fontWeight: 600,
                        backgroundClip: "text",
                        display: { xs: "block", sm: "none" },
                    }}
                >
                    LibreQR
                </Typography>
            </Box>
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
                <Tooltip title="GitHub Repository">
                    <IconButton component="a" href="https://github.com/gabrigbxp/LibreQR" target="_blank" rel="noopener noreferrer" color="inherit" size="small">
                        <GitHubIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Buy me a Ko-fi">
                    <IconButton
                        component="a"
                        href="https://ko-fi.com/gabri_xp"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "inherit",
                            "&:hover": {
                                color: "#FF5E5B",
                            },
                        }}
                        size="small"
                    >
                        <CoffeeIcon />
                    </IconButton>
                </Tooltip>
                <LocaleToggle />
                <ThemeToggle />
            </Stack>
        </Toolbar>
    </AppBar>
)

export default AppHeader
