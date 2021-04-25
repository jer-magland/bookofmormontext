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

export type Preferences = {
    separateVerses: boolean
    showChapterTitles: boolean
    showPunctuation: boolean
    showCustomPunctuation: boolean
}

export const PreferencesProviderContext = createContext<{
    preferences: Preferences
    setPreferences: (p: Preferences) => void
    savePreferences: (p: Preferences) => void
}>({
    preferences: {
        separateVerses: true,
        showChapterTitles: true,
        showPunctuation: true,
        showCustomPunctuation: false
    },
    setPreferences: (p: Preferences) => {},
    savePreferences: (p: Preferences) => {}
})

export const usePreferences = () => {
    const {preferences, setPreferences, savePreferences} = useContext(PreferencesProviderContext)
    return {preferences, setPreferences, savePreferences}
}

export type CustomPunctuatedChapters = {[key: string]: string}

export const CustomPunctuatedChaptersProviderContext = createContext<{
    customPunctuatedChapters: CustomPunctuatedChapters
    setCustomPunctuatedChapters: (cpc: CustomPunctuatedChapters) => void
    saveCustomPunctuatedChapters: (cpc: CustomPunctuatedChapters) => void
}>({
    customPunctuatedChapters: {},
    setCustomPunctuatedChapters: (cpc: CustomPunctuatedChapters) => {},
    saveCustomPunctuatedChapters: (cpc: CustomPunctuatedChapters) => {}
})

export const useCustomPunctuatedChapters = () => {
    const {customPunctuatedChapters, setCustomPunctuatedChapters, saveCustomPunctuatedChapters} = useContext(CustomPunctuatedChaptersProviderContext)
    return {customPunctuatedChapters, setCustomPunctuatedChapters, saveCustomPunctuatedChapters}
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