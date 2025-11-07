import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export interface VCalendarState {
    title: string
    description?: string
    location?: string
    startDate: string // ISO format
    endDate?: string // ISO format
    allDay?: boolean
    organizer?: string
    url?: string
}

const getLocalDateTime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const today = new Date()
const tomorrow = new Date(today.getTime() + 60 * 60 * 1000)

const initialState: VCalendarState = {
    title: "",
    description: "",
    location: "",
    startDate: getLocalDateTime(today),
    endDate: getLocalDateTime(tomorrow),
    allDay: false,
    organizer: "",
    url: "",
}

export const vCalendarSlice = createSlice({
    name: "vCalendar",
    initialState,
    reducers: {
        setVCalendar: (state, action: PayloadAction<Partial<VCalendarState>>) => {
            const { allDay } = action.payload
            const newState = { ...state, ...action.payload }
            if (allDay !== undefined && allDay !== state.allDay) {
                if (allDay) {
                    newState.startDate = newState.startDate.slice(0, 10)
                    if (newState.endDate) {
                        newState.endDate = newState.endDate.slice(0, 10)
                    }
                } else {
                    const now = new Date()
                    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

                    if (newState.startDate.length === 10) {
                        newState.startDate = `${newState.startDate}T${currentTime}`
                    }
                    if (newState.endDate && newState.endDate.length === 10) {
                        const endTime = new Date(now.getTime() + 60 * 60 * 1000)
                        const endTimeFormatted = `${String(endTime.getHours()).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`
                        newState.endDate = `${newState.endDate}T${endTimeFormatted}`
                    }
                }
            }
            return newState
        },
        resetVCalendar: () => initialState,
    },
})

export const { setVCalendar, resetVCalendar } = vCalendarSlice.actions
export default vCalendarSlice.reducer
