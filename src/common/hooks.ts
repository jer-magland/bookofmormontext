import { createContext, useContext, useMemo } from "react"
import { useLocation } from "react-router"
import { BookOfMormon, load as loadBookOfMormon } from "../bookofmormon"
import QueryString from 'querystring'

export const BookOfMormonProviderContext = createContext<{
    bookOfMormon: BookOfMormon
}>({
    bookOfMormon: loadBookOfMormon()
})


export const useBookOfMormon = () => {
    const { bookOfMormon } = useContext(BookOfMormonProviderContext)
    return bookOfMormon
}

export const useCurrentBookChapter = () => {
    const location = useLocation()
    const bookOfMormon = useBookOfMormon()
    const {book, chapter} = useMemo(() => {
        const vals = location.pathname.slice(1).split('/').filter(x => (x))
        if (vals.length === 2) {
            return {
                book: bookOfMormon.book(vals[0]),
                chapter: bookOfMormon.chapter(`${vals[0]} ${vals[1]}`)
            }
        }
        else if (vals.length === 1) {
            return {
                book: bookOfMormon.book(vals[0]),
                chapter: undefined
            }
        }
        else {
            return {
                book: undefined,
                chapter: undefined
            }
        }
    }, [bookOfMormon, location])
    return {book, chapter}
}

export const useMode = () => {
    const location = useLocation()
    const query = QueryString.parse(location.search.slice(1));
    const mode = (query.mode || 'default') as 'default' | 'experimental1'
    return mode
}