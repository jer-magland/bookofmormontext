import { BookOfMormon } from './bookofmormon'
import React, {FunctionComponent} from 'react'
import DefaultTextView from './DefaultTextView/DefaultTextView'
import Exp1FullTextView from './Exp1FullTextView'

type Props = {
    mode: 'default' | 'experimental1'
    bookOfMormon: BookOfMormon
    width: number
    height: number
}

const FullTextView: FunctionComponent<Props> = ({ bookOfMormon, mode, width, height }) => {
    if (mode === 'default') {
        return <DefaultTextView bookOfMormon={bookOfMormon} />
    }
    else if (mode === 'experimental1') {
        return <Exp1FullTextView bookOfMormon={bookOfMormon} width={width} height={height} />
    }
    else {
        throw Error(`Invalid mode: ${mode}`)
    }
}

export default FullTextView