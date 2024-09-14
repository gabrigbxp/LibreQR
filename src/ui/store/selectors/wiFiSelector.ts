import { RootState } from ".."

const wiFiSelector = (state: RootState, _ownProps: unknown) => ({ ...state.wiFi })

export default wiFiSelector
