import { BookOfMormon, Verse } from './bookofmormon'
import React, {FunctionComponent, useMemo} from 'react'
import Splitter from './Splitter'
import DefaultFullTextView from './DefaultFullTextView'

type Props = {
    bookOfMormon: BookOfMormon
    width: number
    height: number
}

const Exp1FullTextView: FunctionComponent<Props> = ({ bookOfMormon, width, height }) => {
    return (
        <Splitter
            width={width}
            height={height}
            initialPosition={Math.floor(2 * width / 3)}
        >
            <VerseBoxes bookOfMormon={bookOfMormon} width={0} />
            {/* <DefaultFullTextView bookOfMormon={bookOfMormon} /> */}
        </Splitter>
    )
}

/////////////////////////////////////////////////////////////////////////
type VerseBoxesProps = {
    bookOfMormon: BookOfMormon
    width: number
}

type VerseRecord = {
    type: 'verse' | 'chapter' | 'book'
    width: number
    marginRight: number
    reference: string
    color: string
}

const VerseBoxes: FunctionComponent<VerseBoxesProps> = ({bookOfMormon, width}) => {
    const verseWidth = (v: Verse) => {
        return Math.max(10, v.words.length * 0.4)
    }
    const verseColor = (v: Verse) => {
        return v.words.map(w => (w.toLowerCase())).includes('charity') || v.words.map(w => (w.toLowerCase())).includes('love') ? 'rgb(200, 150, 150)': 'lightgray'
    }
    const verseRows = useMemo(() => {
        const W = width - 15
        const list: VerseRecord[] = []
        bookOfMormon.books.forEach(book => {
            list.push({type: 'book', width: 0, marginRight: 0, reference: book.name, color: 'black'})
            book.chapters.forEach(chapter => {
                list.push({type: 'chapter', width: 0, marginRight: 0, reference: chapter.reference, color: 'black'})
                chapter.verses.forEach(v => {
                    list.push({type: 'verse', width: verseWidth(v), marginRight: 1, reference: v.reference, color: verseColor(v)})
                })
            })
        })
        let currentRow: {records: VerseRecord[], width: number} = {records: [], width: 0}
        const rows: {records: VerseRecord[], width: number}[] = []
        list.forEach((vr, ii) => {
            if ((currentRow.width + vr.width + vr.marginRight >= W) || (vr.type === 'book')) {
                if (vr.type !== 'book') {
                    let numiter = 0
                    while ((currentRow.width < W) && (currentRow.records.length > 1) && (numiter < 100)) {
                        for (let i=0; i < currentRow.records.length - 1; i++) {
                            if (currentRow.width < W) {
                                if (currentRow.records[i].type === 'verse') {
                                    currentRow.records[i].marginRight += 1
                                    currentRow.width += 1
                                }
                            }
                        }
                        numiter += 1
                    }
                }
                rows.push(currentRow)
                currentRow = {records: [], width: 0}
            }
            currentRow.records.push(vr)
            currentRow.width += vr.width + vr.marginRight
            if (vr.type === 'book') {
                rows.push(currentRow)
                currentRow = {records: [], width: 0}
            }
        })
        if (currentRow.records.length > 0) {
            rows.push(currentRow)
        }
        return rows
    }, [bookOfMormon, width])
    const verseHeight = 6
    return (
        <div style={{padding: 10}}>
            {
                verseRows.map((row, i) => (
                    <span>
                        <div key={i} style={{display: 'flex'}}>
                            {
                                row.records.map((v, j) => (
                                    v.type === 'verse' ? (
                                        <div key={j} style={{width: v.width - 2, height: verseHeight, border: `solid 1px gray`, background: v.color, marginLeft: 0, marginRight: v.marginRight, marginBottom: 1}} title={v.reference} />
                                    ) : v.type === 'chapter' ? (
                                        <span />
                                    ) : (
                                        <div style={{marginTop: 5}}>{v.reference}</div>
                                    )
                                ))
                            }
                        </div>
                        
                    </span>
                ))
            }
        </div>
    )
}

export default Exp1FullTextView