import { Book, BookOfMormon, Chapter, Testimony, TitlePage, Verse } from './bookofmormon'
import React, {FunctionComponent, useMemo} from 'react'

type Props = {
    bookOfMormon: BookOfMormon
}

const DefaultFullTextView: FunctionComponent<Props> = ({ bookOfMormon }) => {
    return (
        <div className="FullText">
            <TitlePageView titlePage={bookOfMormon.titlePage} />
            {
                bookOfMormon.testimonies.map(testimony => (
                    <div key={testimony.title}>
                        <TestimonyView testimony={testimony} />
                    </div>
                ))
            }
            {
                bookOfMormon.books.map(b => (
                    <div key={b.name}>
                        <BookView book={b} />
                    </div>
                ))
            }
        </div>
    )
}

//////////////////////////////////////////////////////////////////////////////////////
type TestimonyViewProps = {
    testimony: Testimony
}

const TestimonyView: FunctionComponent<TestimonyViewProps> = ({ testimony }) => {
    return <div>
        <h1 className="TestimonyTitle">{testimony.title}</h1>
        <div className="TestimonyText">{testimony.text}</div>
        {
            testimony.witnesses.map(witness => (
                <div className="TestimonyWitness">{witness}</div>
            ))
        }
    </div>
}

//////////////////////////////////////////////////////////////////////////////////////
type TitlePageViewProps = {
    titlePage: TitlePage
}

const TitlePageView: FunctionComponent<TitlePageViewProps> = ({ titlePage }) => {
    return <div>
        <h1 className="TitlePageTitle">{titlePage.title}</h1>
        <div className="TitlePageSubtitle">{titlePage.subtitle}</div>
        {
            titlePage.text.map(txt => (
                <div className="TitlePageText">{txt}</div>
            ))
        }
    </div>
}

//////////////////////////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////////////////////////
type VerseViewProps = {
    verse: Verse
    verseNumber: number
}

const VerseView: FunctionComponent<VerseViewProps> = ({ verse, verseNumber }) => {
    return <div style={{paddingBottom: 10}}>
        <span className="VerseNumber">{verseNumber}</span> <span className="VerseText">{verse.text}</span>
    </div>
}

export default DefaultFullTextView