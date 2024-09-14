import { configureStore } from "@reduxjs/toolkit"
import commonReducer from "./commonSlice"
import wiFiReducer from "./wiFiSlice"

const store = configureStore({
    reducer: {
        common: commonReducer,
        wiFi: wiFiReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type IDispatch = typeof store.dispatch

export default store
