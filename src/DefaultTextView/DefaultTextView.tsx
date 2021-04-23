import { BookOfMormon } from '../bookofmormon'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import TitlePageView from './TitlePageView'
import TestimonyView from './TestimonyView'
import BookView from './BookView'

type Props = {
    bookOfMormon: BookOfMormon
    bookReference?: string
    chapterReference?: string
}

// thanks: https://usehooks-typescript.com/react-hook/use-interval
function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<(() => void) | null>(null)
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    });
    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (typeof (savedCallback === null || savedCallback === void 0 ? void 0 : savedCallback.current) !== 'undefined') {
                savedCallback === null || savedCallback === void 0 ? void 0 : savedCallback.current && savedCallback.current()
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const DefaultTextView: FunctionComponent<Props> = ({ bookOfMormon, bookReference, chapterReference }) => {
    const showTitlePage = ((!bookReference) && (!chapterReference))
    const showTestimonies = ((!bookReference) && (!chapterReference))
    const [maxNumBooks, setMaxNumBooks] = useState(2)
    useInterval(() => {
        setMaxNumBooks((m) => (m + 1))
    }, 300)
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
                bookOfMormon.books.filter(b => {
                    if (bookReference) return (b.matchesReference(bookReference))
                    else if (chapterReference) return (b.matchesReference(chapterReference))
                    else return true
                }).filter((b, i) => (i < maxNumBooks)).map(b => (
                    <div key={b.name}>
                        <BookView book={b} />
                    </div>
                ))
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