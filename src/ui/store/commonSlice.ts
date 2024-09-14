import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface CommonState {
    text: string
    canShow: boolean
    size: number
    preview: string
    hasLogo: boolean
    isLogoLoaded: boolean
    logoContent: string | null
    logoRadius: number
}

const initialState: CommonState = {
    text: "",
    canShow: false,
    size: 100,
    preview: "",
    hasLogo: false,
    isLogoLoaded: false,
    logoContent: null,
    logoRadius: 0,
}

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setCommon: (state, action: PayloadAction<Partial<CommonState>>) => ({ ...state, ...action.payload }),
    },
})

export const { setCommon } = commonSlice.actions
export default commonSlice.reducer
