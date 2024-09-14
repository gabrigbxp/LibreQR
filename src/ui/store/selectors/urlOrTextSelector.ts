import { RootState } from ".."

const urlOrTextSelector = (state: RootState, _ownProps: unknown) => ({ text: state.common.text })

export default urlOrTextSelector
