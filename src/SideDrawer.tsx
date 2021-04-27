import { Book, Chapter } from './bookofmormon'
import React, {FunctionComponent, useCallback, useState} from 'react'
import Hyperlink from './DefaultTextView/Hyperlink'
import { Button, Drawer, FormControlLabel, IconButton, Switch } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useHistory, useLocation } from 'react-router'
import { CustomPunctuatedChapters, Preferences, useBookOfMormon, useCustomPunctuatedChapters, useMode, usePreferences } from './common/hooks'
import GoogleDriveControl from './googledrive/GoogleDriveControl'


const BookLink: FunctionComponent<{book: Book, onClick: (book: Book) => void}> = ({onClick, book}) => {
    const handleClick = useCallback(() => {
        onClick(book)
    }, [onClick, book])
    return <Hyperlink onClick={handleClick}>{book.name}</Hyperlink>
}

const ChapterLink: FunctionComponent<{chapter: Chapter, onClick: (chapter: Chapter) => void}> = ({onClick, chapter}) => {
    const handleClick = useCallback(() => {
        onClick(chapter)
    }, [onClick, chapter])
    return <Hyperlink onClick={handleClick}>{chapter.reference}</Hyperlink>
}

const SetModeLink: FunctionComponent<{mode: 'default' | 'experimental1', onClick: () => void}> = ({mode, onClick}) => {
    const location = useLocation()
    const history = useHistory()
    const handleClick = useCallback(() => {
        history.push({...location, search: `?mode=${mode}`})
        onClick()
    }, [location, history, mode, onClick])
    return <Hyperlink onClick={handleClick}>{mode}</Hyperlink>
}

const SideDrawer: FunctionComponent = () => {
    const bookOfMormon = useBookOfMormon()
    const {customPunctuatedChapters, setCustomPunctuatedChapters, saveCustomPunctuatedChapters} = useCustomPunctuatedChapters()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const handleOpen = useCallback(() => {
        setDrawerOpen(true)
        setSelectedBook(null)
    }, [])
    const handleClose = useCallback(() => {
        setDrawerOpen(false)
    }, [])
    const location = useLocation()
    const history = useHistory()
    const handleOpenChapter = useCallback((chapter: Chapter) => {
        const l = {...location}
        l.pathname = `/${chapter.book.ldsSlug}/${chapter.number}`
        history.push(l)
        handleClose()
    }, [location, history, handleClose])
    const handleOpenBook = useCallback((book: Book) => {
        const l = {...location}
        l.pathname = `/${book.ldsSlug}`
        history.push(l)
        handleClose()
    }, [location, history, handleClose])
    const mode = useMode()
    const handleClickBook = useCallback((book: Book) => {
        if (mode === 'experimental1') {
            handleOpenBook(book)
        }
        else {
            setSelectedBook(book)
        }
    }, [mode, handleOpenBook, setSelectedBook])
    const handleClickChapter = useCallback((chapter: Chapter) => {
        handleOpenChapter(chapter)
    }, [handleOpenChapter])
    const handleClickEntireBook = useCallback((book: Book) => {
        handleOpenBook(book)
    }, [handleOpenBook])
    const handleViewBookOfMormon = useCallback(() => {
        const l = {...location}
        l.pathname = `/`
        history.push(l)
        handleClose()
    }, [history, location, handleClose])
    const handleLoadPunctuation = useCallback((p: CustomPunctuatedChapters) => {
        setCustomPunctuatedChapters(p)
        saveCustomPunctuatedChapters(p)
    }, [setCustomPunctuatedChapters, saveCustomPunctuatedChapters])
    return (
        <div>
            <IconButton onClick={handleOpen}><MenuIcon /></IconButton>
            <Drawer open={drawerOpen} ModalProps={{ onBackdropClick: handleClose }}>
                <div style={{padding: 10}}>
                    {
                        selectedBook === null ? (
                            <span>
                                <div key="_bom"><Hyperlink onClick={handleViewBookOfMormon}>Book of Mormon</Hyperlink></div>
                                {
                                    bookOfMormon.books.map(b => (
                                        <div key={b.name}><BookLink book={b} onClick={handleClickBook} /></div>
                                    ))
                                }
                            </span>
                        ) : (
                            <span>
                                <div key="_entire"><BookLink book={selectedBook} onClick={handleClickEntireBook} /></div>
                                {
                                    selectedBook.chapters.map(c => (
                                        <div key={c.reference}><ChapterLink chapter={c} onClick={handleClickChapter} /></div>
                                    ))
                                }
                            </span>
                        )
                    }
                    <div style={{height: 30}} />
                    <PreferencesControl />
                    <div style={{height: 30}} />
                    <GoogleDriveControl punctuation={customPunctuatedChapters} onLoadPunctuation={handleLoadPunctuation} />
                    <div style={{height: 30}} />
                    <h3>Select mode</h3>
                    <div><SetModeLink mode="default" onClick={handleClose} /></div>
                    <div><SetModeLink mode="experimental1" onClick={handleClose} /></div>
                </div>
            </Drawer>
        </div>
    )
}

const prefs = [
    {
        key: 'separateVerses',
        label: 'Separate verses',
        disabled: (preferences: Preferences) => {return preferences.showCustomPunctuation}
    },
    {
        key: 'showChapterTitles',
        label: 'Chapter titles'
    },
    {
        key: 'showPunctuation',
        label: 'Show punctuation',
        disabled: (preferences: Preferences) => {return preferences.showCustomPunctuation}
    },
    {
        key: 'showCustomPunctuation',
        label: 'Custom punctuation'
    }
]

const PrefControl: FunctionComponent<{pref: {key: string, label: string, disabled?: (preferences: Preferences) => boolean}}> = ({pref}) => {
    const {preferences, setPreferences} = usePreferences()
    const handleChange = useCallback((evt: any, checked: boolean) => {
        setPreferences({...preferences, [pref.key]: checked})
    }, [setPreferences, preferences, pref])
    return (
        <div>
            <FormControlLabel
                control={
                    <Switch
                        checked={(preferences as any)[pref.key]}
                        onChange={handleChange}
                        name={pref.key}
                        color="primary"
                        disabled={pref.disabled ? pref.disabled(preferences) : false}
                    />
                }
                label={pref.label}
            />
        </div>
    )
}

const PreferencesControl: FunctionComponent = () => {
    const {preferences, savePreferences} = usePreferences()
    const handleClick = useCallback(() => {
        savePreferences(preferences)
    }, [preferences, savePreferences])
    return (
        <span>
            {
                prefs.map(p => (
                    <PrefControl key={p.key} pref={p} />
                ))
            }
            <Button onClick={handleClick}>Save preferences</Button>
        </span>
    )
}

export default SideDrawer