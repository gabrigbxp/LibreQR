import { useState } from "react"
import Box from "@mui/material/Box"
import Popover from "@mui/material/Popover"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import ColorPicker from "@rc-component/color-picker"

import "@rc-component/color-picker/assets/index.css"

interface ColorPickerProps {
    label: string
    value: string
    onChange: (color: string) => void
    helperText: string
}

const ColorPickerField = ({ label, value: initialValue, onChange, helperText }: ColorPickerProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [value, setValue] = useState<string>(initialValue)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

    return (
        <Box>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: "block" }}>
                {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                    onClick={handleClick}
                    sx={{
                        width: 40,
                        height: 56,
                        backgroundColor: !value.startsWith("#") ? `#${value}` : value,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": {
                            border: "1px solid #999",
                        },
                    }}
                />
                <TextField
                    value={value}
                    slotProps={{ htmlInput: { maxLength: 7 } }}
                    onChange={(e) => {
                        const hexColor = e.target.value
                        setValue(e.target.value)
                        if (/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
                            onChange(!hexColor.startsWith("#") ? `#${hexColor}` : hexColor)
                        }
                    }}
                />
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Box sx={{ p: 1 }}>
                    <ColorPicker
                        value={value}
                        onChange={(color) => {
                            setValue(color.toHexString())
                            onChange(color.toHexString())
                        }}
                    />
                </Box>
            </Popover>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: "block" }}>
                {helperText}
            </Typography>
        </Box>
    )
}

export default ColorPickerField
