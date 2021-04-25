import { TextField } from '@material-ui/core'
import React, { useCallback } from 'react'
import { FunctionComponent } from "react"

type Props = {
    text: string
    onTextChange: (text: string) => void
}

const EditChapterText: FunctionComponent<Props> = ({text, onTextChange}) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        let text = e.target.value
        onTextChange(text)
    }, [onTextChange])
    return (
        <TextField
            multiline
            rowsMax={30}
            value={text}
            onChange={handleChange}
            fullWidth
        />
    )
}

export default EditChapterText