import { lazy, Suspense, useState, useEffect, useCallback } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import ContactsIcon from "@mui/icons-material/Contacts"
import EventIcon from "@mui/icons-material/Event"
import LinkIcon from "@mui/icons-material/Link"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WifiIcon from "@mui/icons-material/Wifi"
import Grid from "@mui/material/Grid2"

import { useDispatch, useTranslation } from "@ui/hooks"
import { setCommon } from "@ui/store/slices/commonSlice"

const views = {
    Base: {
        component: lazy(async () => import("@ui/features/qr-types/components/UrlOrText")),
        label: "qrTypes.selector.urlOrText.label",
        icon: LinkIcon,
        description: "qrTypes.selector.urlOrText.description",
        urlKey: "",
    },
    WiFi: {
        component: lazy(async () => import("@ui/features/qr-types/components/WiFi")),
        label: "qrTypes.selector.wifi.label",
        icon: WifiIcon,
        description: "qrTypes.selector.wifi.description",
        urlKey: "wifi",
    },
    Geo: {
        component: lazy(async () => import("@ui/features/qr-types/components/Geo")),
        label: "qrTypes.selector.geo.label",
        icon: LocationOnIcon,
        description: "qrTypes.selector.geo.description",
        urlKey: "geo",
    },
    VCard: {
        component: lazy(async () => import("@ui/features/qr-types/components/VCard")),
        label: "qrTypes.selector.vcard.label",
        icon: ContactsIcon,
        description: "qrTypes.selector.vcard.description",
        urlKey: "vcard",
    },
    VCalendar: {
        component: lazy(async () => import("@ui/features/qr-types/components/VCalendar")),
        label: "qrTypes.selector.vcalendar.label",
        icon: EventIcon,
        description: "qrTypes.selector.vcalendar.description",
        urlKey: "vcalendar",
    },
}

const urlToViewMap: Record<string, keyof typeof views> = {
    wifi: "WiFi",
    geo: "Geo",
    vcard: "VCard",
    vcalendar: "VCalendar",
}

const QRTypeSelector = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const viewsKeys = Object.keys(views)

    const getInitialView = (): keyof typeof views => {
        const urlParams = new URLSearchParams(window.location.search)
        const typeParam = urlParams.get("type")

        if (typeParam && urlToViewMap[typeParam]) {
            return urlToViewMap[typeParam]
        }

        return viewsKeys[0] as keyof typeof views
    }

    const [selectedView, setSelectedView] = useState<keyof typeof views>(getInitialView())
    const Component = views[selectedView].component

    const handleViewChange = (viewKey: keyof typeof views) => {
        const urlKey = views[viewKey].urlKey
        let qs = ""
        if (urlKey) {
            qs = `?type=${urlKey}`
        }
        const newURL = `${window.location.pathname}${qs}`
        window.history.pushState(null, "", newURL)

        setSelectedView(viewKey)
        reset()
    }

    const reset = useCallback(() => {
        dispatch(setCommon({ text: "", canShow: false }))
    }, [dispatch])

    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search)
            const typeParam = urlParams.get("type")

            if (typeParam && urlToViewMap[typeParam]) {
                setSelectedView(urlToViewMap[typeParam])
            } else {
                setSelectedView(viewsKeys[0] as keyof typeof views)
            }
            reset()
        }

        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [reset, viewsKeys])

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                    {t("general.whatDoYouNeed")}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        pb: 1,
                        pt: 2,
                        pl: 1,
                        overflowX: "auto",
                        "&::-webkit-scrollbar": {
                            height: 8,
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "grey.100",
                            borderRadius: 1,
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "grey.400",
                            borderRadius: 1,
                            "&:hover": {
                                backgroundColor: "grey.500",
                            },
                        },
                    }}
                >
                    {viewsKeys.map((key: keyof typeof views) => {
                        const view = views[key]
                        const IconComponent = view.icon
                        const isSelected = selectedView === key

                        const urlKey = view.urlKey
                        const href = urlKey ? `?type=${urlKey}` : window.location.pathname

                        return (
                            <Card
                                key={key}
                                component="a"
                                href={href}
                                sx={{
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    transform: isSelected ? "translateY(-2px)" : "none",
                                    boxShadow: isSelected ? (theme) => `0 0 3px 5px ${theme.palette.primary.main}40` : 1,
                                    border: isSelected ? (theme) => `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "block",
                                    "&:hover": {
                                        border: (theme) => `2px solid ${theme.palette.primary.main}`,
                                        transform: isSelected ? undefined : "translateY(-1px)",
                                        boxShadow: isSelected ? undefined : 3,
                                        textDecoration: "none",
                                    },
                                    "&:focus": {
                                        outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                                        outlineOffset: "2px",
                                    },
                                    minWidth: { xs: 140, sm: 160, md: 180 },
                                    maxWidth: { xs: 140, sm: 160, md: 180 },
                                    flexShrink: 0,
                                }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleViewChange(key)
                                }}
                            >
                                <CardContent
                                    sx={{
                                        textAlign: "center",
                                        p: { xs: 1, sm: 1.5 },
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: { xs: 100, sm: 120, md: 130 },
                                    }}
                                >
                                    <IconComponent
                                        sx={{
                                            fontSize: { xs: 24, sm: 28, md: 32 },
                                            color: isSelected ? "primary.main" : "text.secondary",
                                            mb: 0.5,
                                            transition: "color 0.2s ease-in-out",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={isSelected ? 600 : 500}
                                        color={isSelected ? "primary.main" : "text.primary"}
                                        sx={{
                                            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                                            lineHeight: 1.1,
                                            textAlign: "center",
                                            mb: { xs: 0, sm: 0.5 },
                                        }}
                                    >
                                        {t(view.label as Parameters<typeof t>[0])}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                                            lineHeight: 1.1,
                                            textAlign: "center",
                                            display: { xs: "none", md: "block" },
                                        }}
                                    >
                                        {t(view.description as Parameters<typeof t>[0])}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Box>
            </Grid>
            <Grid size={12}>
                <Suspense fallback={<CircularProgress />}>{selectedView && <Component />}</Suspense>
            </Grid>
        </Grid>
    )
}

export default QRTypeSelector
