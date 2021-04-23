import { Verse } from '../bookofmormon'
import React, {FunctionComponent} from 'react'

type VerseViewProps = {
    verse: Verse
    verseNumber: number
}

const VerseView: FunctionComponent<VerseViewProps> = ({ verse, verseNumber }) => {
    return <div style={{paddingBottom: 10}}>
        <span className="VerseNumber">{verseNumber}</span> <span className="VerseText">{verse.text}</span>
    </div>
}

export default VerseView