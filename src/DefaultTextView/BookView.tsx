import { Book } from '../bookofmormon'
import React, {FunctionComponent} from 'react'
import ChapterView from './ChapterView'
import { usePreferences } from '../common/hooks'


type BookViewProps = {
    book: Book
}

const BookView: FunctionComponent<BookViewProps> = ({ book }) => {
    const {preferences} = usePreferences()
    return <div>
        <h1 className="BookTitle">{book.fullTitle}</h1>
        {
            book.fullSubtitle && (
                <div className="BookSubtitle">{book.fullSubtitle}</div>
            )
        }
        {
            book.heading && (
                <div style={{paddingLeft: 6, paddingRight: 6}} className="BookHeading">{book.heading}</div>
            )
        }
        {
            book.chapters.map(chapter => (
                <ChapterView key={chapter.reference} chapter={chapter} showHeading={preferences.showChapterTitles} />
            ))
        }
    </div>
}

export default BookView