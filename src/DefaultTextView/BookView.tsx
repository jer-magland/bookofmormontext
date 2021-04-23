import { Book } from '../bookofmormon'
import React, {FunctionComponent} from 'react'
import ChapterView from './ChapterView'
import WhenVisible from './WhenVisible'


type BookViewProps = {
    book: Book
}

const BookView: FunctionComponent<BookViewProps> = ({ book }) => {
    return <div>
        <h1 className="BookTitle">{book.fullTitle}</h1>
        {
            book.fullSubtitle && (
                <div className="BookSubtitle">{book.fullSubtitle}</div>
            )
        }
        {
            book.heading && (
                <div className="BookHeading">{book.heading}</div>
            )
        }
        {
            book.chapters.map(chapter => (
                <ChapterView key={chapter.reference} chapter={chapter} />
            ))
        }
    </div>
}

export default BookView