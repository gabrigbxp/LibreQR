import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface WiFiState {
    ssid: string
    encryptation: string
    password: string
    hidden: boolean
}

const initialState: WiFiState = {
    ssid: "",
    encryptation: "WPA",
    password: "",
    hidden: false,
}

export const wiFiSlice = createSlice({
    name: "wiFi",
    initialState,
    reducers: {
        setWiFi: (state, action: PayloadAction<Partial<WiFiState>>) => ({ ...state, ...action.payload }),
    },
})

export const { setWiFi } = wiFiSlice.actions
export default wiFiSlice.reducer
