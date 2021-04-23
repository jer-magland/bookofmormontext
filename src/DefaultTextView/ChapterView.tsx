import { Chapter } from '../bookofmormon'
import React, {FunctionComponent} from 'react'
import VerseView from './VerseView'


type ChapterViewProps = {
    chapter: Chapter
}

const ChapterView: FunctionComponent<ChapterViewProps> = ({ chapter }) => {
    return <div>
        <h1 className="ChapterTitle">{chapter.reference}</h1>
        {
            chapter.heading && (
                <div className="ChapterHeading">{chapter.heading}</div>
            )
        }
        {
            chapter.verses.map((v, i) => (
                <VerseView verse={v} verseNumber={i + 1} />
            ))
        }
    </div>
}

export default ChapterView