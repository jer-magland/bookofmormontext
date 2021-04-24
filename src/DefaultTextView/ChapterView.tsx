import { Chapter } from '../bookofmormon'
import React, {FunctionComponent, useMemo} from 'react'
import VerseView from './VerseView'
import { usePreferences } from '../common/hooks'


type ChapterViewProps = {
    chapter: Chapter
    showHeading: boolean
}

const ChapterView: FunctionComponent<ChapterViewProps> = ({ chapter, showHeading }) => {
    const {preferences} = usePreferences()
    const chapterText = useMemo(() => {
        if (preferences.separateVerses) return ''
        else {
            let txt = chapter.verses.map(v => v.text).join(' ')
            if (!preferences.showPunctuation) {
                // thanks https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
                // added —, ?
                txt = txt.replace(/[.,/#!$%^&*;:{}=\-_`~()—?]/g,"").toLowerCase()
            }
            return txt
        }
    }, [chapter, preferences.separateVerses, preferences.showPunctuation])
    return <div>
        {
            showHeading ? (
                <span>
                    <h1 className="ChapterTitle">{chapter.reference}</h1>
                    {
                        chapter.heading && (
                            <div className="ChapterHeading">{chapter.heading}</div>
                        )
                    }
                </span>
            ) : (
                <div style={{height: 15}} />
            )
        }
        {
            preferences.separateVerses ? (
                chapter.verses.map((v, i) => (
                    <VerseView key={i} verse={v} verseNumber={i + 1} />
                ))
            ) : (
                <div><span className="VerseText">{chapterText}</span></div>
            )
        }
    </div>
}

export default ChapterView