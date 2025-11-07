import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Locale = "en" | "es"

const detectBrowserLang = (): Locale => {
    const lang = navigator.language.toLowerCase()
    if (lang.startsWith("es")) return "es"
    return "en"
}

interface LocaleState {
    current: Locale
}

const initialState: LocaleState = {
    current: detectBrowserLang(),
}

const localeSlice = createSlice({
    name: "locale",
    initialState,
    reducers: {
        setLocale: (_state, action: PayloadAction<Locale>) => ({ current: action.payload }),
        toggleLocale: (state) => ({ current: state.current === "en" ? "es" : "en" }),
    },
})

export const { setLocale, toggleLocale } = localeSlice.actions
export default localeSlice.reducer
