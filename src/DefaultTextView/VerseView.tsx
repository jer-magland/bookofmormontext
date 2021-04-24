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
            // thanks https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
            // added —
            txt = txt.replace(/[.,/#!$%^&*;:{}=\-_`~()—]/g,"").toLowerCase()
        }
        return txt
    }, [preferences.showPunctuation, verse])
    return <div style={{paddingBottom: 10}}>
        <span className="VerseNumber">{verseNumber}</span> <span className="VerseText">{text}</span>
    </div>
}

export default VerseView