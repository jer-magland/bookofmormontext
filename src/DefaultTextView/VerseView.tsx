import { Verse } from '../bookofmormon'
import React, {FunctionComponent, useMemo} from 'react'
import { usePreferences } from '../common/hooks'

type VerseViewProps = {
    verse: Verse
    verseNumber: number
}

const VerseView: FunctionComponent<VerseViewProps> = ({ verse, verseNumber }) => {
    const {preferences} = usePreferences()
    const text = useMemo(() => {
        let txt = verse.text
        if (!preferences.showPunctuation) {
            txt = txt.replaceAll('—', '— ') // make sure there is a space after the em-dashes
            txt = txt.replace(/[^a-zA-Z- ]/g, '')
            txt = txt.replace('  ', ' ')
        }
        return txt
    }, [preferences.showPunctuation, verse])
    return <div style={{paddingBottom: 10}}>
        <span className="VerseNumber">{verseNumber}</span> <span className="VerseText">{text}</span>
    </div>
}

export default VerseView