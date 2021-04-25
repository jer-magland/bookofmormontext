import { Chapter } from '../bookofmormon'
import React, {FunctionComponent, useCallback, useMemo, useState} from 'react'
import VerseView from './VerseView'
import { useCustomPunctuatedChapters, usePreferences } from '../common/hooks'
import { IconButton } from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'
import CheckIcon from '@material-ui/icons/Check'
import EditChapterText from './EditChapterText'

type ChapterViewProps = {
    chapter: Chapter
    showHeading: boolean
}

function isLetter(str: string) {
    if (!str) return false
    return str.length === 1 && str.match(/[a-zA-Z-]/i);
}

const mergePunctuation = (baseText: string, text: string) => {
    if (!text) return baseText

    // do not include "-"
    const txt = baseText.replace(/[^a-zA-Z- ]/g, '')
    const words = txt.split(' ').filter(w => (w))

    const tokens: string[] = []
    let currentToken: string[] = []
    for (let i = 0; i < text.length; i++) {
        if (isLetter(text[i])) {
            currentToken.push(text[i])
        }
        else {
            if (currentToken.length > 0) {
                tokens.push(currentToken.join(''))
                currentToken = []
            }
            tokens.push(text[i])
        }
    }
    if (currentToken.length > 0) {
        tokens.push(currentToken.join(''))
    }
    const tokens2: string[] = []
    for (let t of tokens) {
        if (!isLetter(t[0])) {
            if (tokens2.length > 0) {
                tokens2[tokens2.length - 1] = tokens2[tokens2.length - 1] + t
            }
            else tokens2.push(t)
        }
        else {
            tokens2.push(t)
        }
    }
    const tokens3: string[] = []
    for (let i = 0; i < words.length; i++) {
        const a = tokens2[i] || ''
        if ((a.toLowerCase().startsWith(words[i].toLowerCase())) && (!isLetter(a[words[i].length]))) {
            tokens3.push(tokens2[i])
        }
        else {
            tokens3.push(words[i] + ' ')
        }
    }

    return tokens3.join('')
}

export const decapitalizeSentences = (txt: string) => {
    let txt2 = [...txt] // convert to array of characters
    let atStartOfSentence = true
    for (let i = 0; i < txt2.length; i++) {
        if (atStartOfSentence) {
            if (txt2[i] !== ' ') {
                txt2[i] = txt2[i].toLowerCase()
                atStartOfSentence = false
            }
        }
        else {
            if (txt2[i] === '.') atStartOfSentence = true
        }
    }
    return txt2.join() // convert array of characters to string
}

const ChapterView: FunctionComponent<ChapterViewProps> = ({ chapter, showHeading }) => {
    const {preferences} = usePreferences()
    const {customPunctuatedChapters, setCustomPunctuatedChapters, saveCustomPunctuatedChapters} = useCustomPunctuatedChapters()
    const {chapterText, containsCustomText} = useMemo(() => {
        let txt: string
        let custom = false
        if ((preferences.showPunctuation) && (!preferences.showCustomPunctuation)) {
            // just join verses
            txt = chapter.verses.map(v => (v.text)).join(' ')
        }
        else {
            // remove punctuation
            // important to decapatilize sentences in each verse separately
            txt = chapter.verses.map(v => (v.text)).map(verseText => decapitalizeSentences(verseText)).join(' ')

            // do not include "-"
            txt = txt.replaceAll('—', '— ') // make sure there is a space after the em-dashes
            txt = txt.replace(/[^a-zA-Z- ]/g, '')
            txt = txt.replace('  ', ' ')
        }
        if (preferences.showCustomPunctuation) {
            const txt2 = customPunctuatedChapters[chapter.reference] || null
            if ((txt2) && (txt2 !== txt)) {
                txt = mergePunctuation(txt, txt2)
                custom = true
            }
        }

        return {chapterText: txt, containsCustomText: custom}
    }, [chapter, preferences.showPunctuation, preferences.showCustomPunctuation, customPunctuatedChapters])
    const [editing, setEditing] = useState(false)
    const [editedChapterText, setEditedChapterText] = useState<string>('')
    const handleEdit = useCallback(() => {
        setEditing(true)
        setEditedChapterText(chapterText)
    }, [chapterText])
    const handleSave = useCallback(() => {
        const x = {...customPunctuatedChapters, [chapter.reference]: editedChapterText}
        setCustomPunctuatedChapters(x)
        saveCustomPunctuatedChapters(x)
        setEditing(false)
    }, [editedChapterText, chapter.reference, customPunctuatedChapters, setCustomPunctuatedChapters, saveCustomPunctuatedChapters])
    const editingProblem = useMemo(() => {
        return (mergePunctuation(chapterText, editedChapterText) !== editedChapterText)
    }, [chapterText, editedChapterText])
    return <div>
        {
            showHeading ? (
                <span>
                    <h1 className="ChapterTitle">{chapter.reference}</h1>
                    {
                        chapter.heading && (
                            <div className="ChapterHeading">{chapter.heading}</div>
                        )
                    }
                </span>
            ) : (
                <div style={{height: 15}} />
            )
        }
        {
            (preferences.separateVerses) && (!preferences.showCustomPunctuation) ? (
                chapter.verses.map((v, i) => (
                    <VerseView key={i} verse={v} verseNumber={i + 1} />
                ))
            ) : preferences.showCustomPunctuation ? (
                <div>
                    {
                        editing ? (
                            <span>
                                <IconButton onClick={handleSave} ><CheckIcon /></IconButton>
                                {
                                    editingProblem && <span>Problem with edited text</span>
                                }
                                <EditChapterText text={editedChapterText} onTextChange={setEditedChapterText} />
                            </span>
                        ) : (
                            <span>
                                <IconButton onClick={handleEdit}><CreateIcon /></IconButton>
                                <pre style={{whiteSpace: 'pre-line', color: containsCustomText ? 'rgb(20, 20, 120)' : 'inherit'}} className="VerseText">{chapterText}</pre>
                            </span>
                        )
                    }
                </div>
            ) : (
                <div>
                    <span className="VerseText">{chapterText}</span>
                </div>
            )
        }
    </div>
}

export default ChapterView