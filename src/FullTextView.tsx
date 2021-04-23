import { BookOfMormon } from './bookofmormon'
import React, {FunctionComponent, useMemo} from 'react'
import DefaultFullTextView from './DefaultFullTextView'

type Props = {
    mode: 'default'
    bookOfMormon: BookOfMormon
}

const FullTextView: FunctionComponent<Props> = ({ bookOfMormon, mode }) => {
    if (mode === 'default') {
        return <DefaultFullTextView bookOfMormon={bookOfMormon} />
    }
    else {
        throw Error(`Invalid mode: ${mode}`)
    }
}

export default FullTextView