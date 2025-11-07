import { connect } from "react-redux"
import { RootState, AppDispatch } from ".."
import { setCommon, CommonState } from "../slices/commonSlice"
import { setWiFi, WiFiState } from "../slices/wiFiSlice"

const mapStateToProps = (state: RootState) => ({
    ...state.wiFi,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
        setWiFi: (data: Partial<WiFiState>) => dispatch(setWiFi(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)
