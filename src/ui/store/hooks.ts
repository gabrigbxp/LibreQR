import { useDispatch as useDispatchOriginal, useSelector as useSelectorOriginal } from "react-redux"
import type { RootState, IDispatch } from "."

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = useDispatchOriginal.withTypes<IDispatch>()
export const useSelector = useSelectorOriginal.withTypes<RootState>()
