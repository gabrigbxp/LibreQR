import { connect } from "react-redux"
import { RootState, AppDispatch } from ".."
import { setCommon, CommonState } from "../slices/commonSlice"

const mapStateToProps = (state: RootState) => ({
    text: state.common.text,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)
