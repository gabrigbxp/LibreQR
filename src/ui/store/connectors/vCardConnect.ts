import type { RootState, AppDispatch } from ".."
import { connect } from "react-redux"
import { setCommon, CommonState } from "../slices/commonSlice"
import { setVCard, setVCardAddress, VCardState } from "../slices/vCardSlice"

const mapStateToProps = ({ vCard }: RootState) => vCard

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
        setVCard: (data: Partial<VCardState>) => dispatch(setVCard(data)),
        setVCardAddress: (data: Partial<VCardState["address"]>) => dispatch(setVCardAddress(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)
