import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface VCardState {
    firstName: string
    lastName: string
    organization?: string
    title?: string
    phone?: string
    email?: string
    website?: string
    address?: {
        street?: string
        city?: string
        state?: string
        zipCode?: string
        country?: string
    }
    note?: string
}

const initialState: VCardState = {
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    },
    note: "",
}

export const vCardSlice = createSlice({
    name: "vCard",
    initialState,
    reducers: {
        setVCard: (state, action: PayloadAction<Partial<VCardState>>) => ({ ...state, ...action.payload }),
        setVCardAddress: (state, action: PayloadAction<Partial<VCardState["address"]>>) => ({
            ...state,
            address: { ...state.address, ...action.payload },
        }),
        resetVCard: () => initialState,
    },
})

export const { setVCard, setVCardAddress, resetVCard } = vCardSlice.actions
export default vCardSlice.reducer
