import React, {FunctionComponent} from 'react'
import TitlePageView from './TitlePageView'
import TestimonyView from './TestimonyView'
import BookView from './BookView'
import { useBookOfMormon, useCurrentBookChapter } from '../common/hooks'
import ChapterView from './ChapterView'

type Props = {
    width: number
    height: number
}

const DefaultTextView: FunctionComponent<Props> = ({width, height}) => {
    const bookOfMormon = useBookOfMormon()
    const {book, chapter} = useCurrentBookChapter()

    const showTitlePage = ((!book) && (!chapter))
    const showTestimonies = ((!book) && (!chapter))
    // const [maxNumBooks, setMaxNumBooks] = useState(2)
    // useInterval(() => {
    //     setMaxNumBooks((m) => (m + 1))
    // }, 300)
    return (
        
        <div className="FullText">
            {
                showTitlePage && (
                    <TitlePageView titlePage={bookOfMormon.titlePage} />
                )
            }
            {
                showTestimonies && (
                    bookOfMormon.testimonies.map(testimony => (
                        <div key={testimony.title}>
                            <TestimonyView testimony={testimony} />
                        </div>
                    ))
                )
            }
            {
                chapter ? (
                    <ChapterView chapter={chapter} />
                ) : book ? (
                    <BookView book={book} />
                ) : (
                    <span>
                        {
                            bookOfMormon.books.map(b => (
                                <div key={b.name}>
                                    <BookView book={b} />
                                </div>
                            ))
                        }
                    </span>
                )
            }
            <hr />
            <span style={{fontStyle: "italic"}}>
                <p>Book of Mormon text data obtained from: <a href="https://github.com/bcbooks/scriptures-json">https://github.com/bcbooks/scriptures-json</a></p>
                <p>This is an open source project: <a href="https://github.com/jer-magland/bookofmormontext">https://github.com/jer-magland/bookofmormontext</a></p>
                <p>This is not an official website of The Church of Jesus Christ of Latter-day Saints</p>
            </span>
        </div>
    )
}

export default DefaultTextView