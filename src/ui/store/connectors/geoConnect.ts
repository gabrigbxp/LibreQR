import type { RootState, AppDispatch } from ".."
import { connect } from "react-redux"
import { setCommon, CommonState } from "../slices/commonSlice"
import { setGeo, GeoState } from "../slices/geoSlice"

const mapStateToProps = ({ geo }: RootState) => geo

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
        setGeo: (data: Partial<GeoState>) => dispatch(setGeo(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)
