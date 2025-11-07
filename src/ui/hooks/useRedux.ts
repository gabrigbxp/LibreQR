import { TypedUseSelectorHook, useDispatch as useDispatchOriginal, useSelector as useSelectorOriginal } from "react-redux"
import type { RootState, AppDispatch } from "../store"

export const useDispatch: () => AppDispatch = useDispatchOriginal
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorOriginal
