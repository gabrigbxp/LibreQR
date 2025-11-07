import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface GeoState {
    latitude: number
    longitude: number
    altitude?: number
    label?: string
}

const initialState: GeoState = {
    latitude: undefined,
    longitude: undefined,
    altitude: undefined,
    label: "",
}

export const geoSlice = createSlice({
    name: "geo",
    initialState,
    reducers: {
        setGeo: (state, action: PayloadAction<Partial<GeoState>>) => ({ ...state, ...action.payload }),
        resetGeo: () => initialState,
    },
})

export const { setGeo, resetGeo } = geoSlice.actions
export default geoSlice.reducer
