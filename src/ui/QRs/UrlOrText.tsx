import { ChangeEvent, useEffect } from "react"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { connect } from "react-redux"

import WithCommonControllers from "./Base"
import { CommonState, setCommon } from "@ui/store/commonSlice"
import urlOrTextSelector from "@ui/store/selectors/urlOrTextSelector"
import { IDispatch } from "@ui/store"

interface UrlOrTextProps extends Partial<CommonState> {
    actions?: {
        setCommon: (state: Partial<CommonState>) => void
    }
}

const UrlOrText = ({ text, actions }: UrlOrTextProps) => {
    useEffect(() => {
        actions.setCommon({ canShow: true })
        return () => {
            actions.setCommon({ text: "", canShow: false })
        }
    }, [actions])

    const handleOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => actions.setCommon({ text: event.target.value })

    return (
        <WithCommonControllers>
            <Grid size={12}>Basic QR for URLs or just plain text</Grid>
            <Grid size={6}>
                <TextField label="Content" variant="standard" value={text} onChange={handleOnChange} />
            </Grid>
        </WithCommonControllers>
    )
}

const mapStateToProps = urlOrTextSelector

const mapDispatchToProps = (dispatch: IDispatch) => ({
    actions: {
        setCommon: (data: Partial<CommonState>) => dispatch(setCommon(data)),
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(UrlOrText)
