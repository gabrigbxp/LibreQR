import type { RootState, AppDispatch } from ".."
import { connect } from "react-redux"
import { setCommon, CommonState } from "../slices/commonSlice"
import { setVCalendar, VCalendarState } from "../slices/vCalendarSlice"

const mapStateToProps = ({ vCalendar }: RootState) => vCalendar

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
        setVCalendar: (data: Partial<VCalendarState>) => dispatch(setVCalendar(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)
