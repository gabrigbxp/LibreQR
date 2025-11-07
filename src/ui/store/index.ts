import { combineReducers, configureStore } from "@reduxjs/toolkit"
import commonReducer from "./slices/commonSlice"
import wiFiReducer from "./slices/wiFiSlice"
import geoReducer from "./slices/geoSlice"
import vCardReducer from "./slices/vCardSlice"
import vCalendarReducer from "./slices/vCalendarSlice"
import localeReducer from "./slices/localeSlice"

const reducer = combineReducers({
    common: commonReducer,
    wiFi: wiFiReducer,
    geo: geoReducer,
    vCard: vCardReducer,
    vCalendar: vCalendarReducer,
    locale: localeReducer,
})

export const setupStore = (preloadedState?: Partial<RootState>) =>
    configureStore({
        reducer,
        preloadedState,
    })

export type RootState = ReturnType<typeof reducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]

export default setupStore()
