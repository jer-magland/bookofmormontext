import React, {FunctionComponent} from 'react'
import DefaultTextView from './DefaultTextView/DefaultTextView'
import Exp1FullTextView from './Exp1FullTextView'

type Props = {
    mode: 'default' | 'experimental1'
    width: number
    height: number
}

const FullTextView: FunctionComponent<Props> = ({ mode, width, height }) => {
    if (mode === 'default') {
        return <DefaultTextView width={width} height={height} />
    }
    else if (mode === 'experimental1') {
        return <Exp1FullTextView width={width} height={height} />
    }
    else {
        throw Error(`Invalid mode: ${mode}`)
    }
}

export default FullTextView