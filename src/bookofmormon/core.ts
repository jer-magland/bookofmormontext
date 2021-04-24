import bookOfMormonData from './book-of-mormon.json'

type VerseData = {
    reference: string
    text: string
    verse: number
}

type ChapterData = {
    chapter: number
    reference: string
    verses: VerseData[]
    heading?: string
}

type BookData = {
    book: string
    chapters: ChapterData[]
    full_subtitle?: string
    full_title: string
    heading?: string
    lds_slug: string
}

type TestimonyData = {
    text: string
    title: string
    witnesses: string[]
}

type TitlePageData = {
    subtitle: string
    text: string[]
    title: string
    translated_by: string
}

type BookOfMormonData = {
    books: BookData[]
    last_modified: string
    lds_slug: string
    subtitle: string
    testimonies: TestimonyData[]
    title: string
    title_page: TitlePageData
    version: number
}

export const load = () => {
    return new BookOfMormon(bookOfMormonData)
}

const _abbreviations: {[key: string]: string} = {
    '1 Ne': '1 Nephi',
    '2 Ne': '2 Nephi',
    'W of M': 'Words of Mormon',
    'Hel': 'Helaman',
    '3 Ne': '3 Nephi',
    '4 Ne': '4 Nephi',
    'Morm': 'Mormon',
    'Moro': 'Moroni'
}

for (let k of Object.keys(_abbreviations)) {
    _abbreviations[k + '.'] = _abbreviations[k]
}
for (let k of Object.keys(_abbreviations)) {
    _abbreviations[k.toLowerCase()] = _abbreviations[k]
}
for (let b of ['1 Nephi', '2 Nephi', 'Jacob', 'Enos', 'Jarom', 'Omni', 'Words of Mormon', 'Mosiah', 'Alma', 'Helaman', '3 Nephi', '4 Nephi', 'Mormon', 'Ether', 'Moroni']) {
    _abbreviations[b.toLowerCase()] = b    
}

const replaceAbbreviations = (x: string) => {
    let y = x
    for (let k in _abbreviations) {
        if (y === k) y = _abbreviations[k]
        if (y.startsWith(k + ' ')) y = _abbreviations[k] + x.slice(k.length)
    }
    return y
}

const removePunctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

const removePunctuation = (x: string) => {
  return x.replace(removePunctuationRegex, '');
}

export class Verse {
    #words: string[] = []
    constructor(private data: VerseData) {
        this.#words = removePunctuation(data.text).split(' ').filter(x => (x !== ''))
    }
    get words() {
        return this.#words
    }
    get text() {
        return this.data.text
    }
    get reference() {
        return this.data.reference
    }
}

export class Chapter {
    #verses: Verse[] = []
    constructor(private data: ChapterData, private _book: Book, private _number: number) {
        data.verses.forEach(v => {
            this.#verses.push(new Verse(v))
        })
    }
    get verses() {
        return [...this.#verses]
    }
    verse(num: number) {
        const ret = this.verses[num - 1]
        if (!ret) throw Error(`Unable to find verse ${num} of ${this.data.reference}`)
        return ret
    }
    get text() {
        return this.verses.map(v => (v.text)).join('\n')
    }
    get reference() {
        return this.data.reference
    }
    get heading() {
        return this.data.heading
    }
    get book() {
        return this._book
    }
    get number() {
        return this._number
    }
}

export class Book {
    #chapters: Chapter[] = []
    constructor(private data: BookData) {
        data.chapters.forEach((c, i) => {
            this.#chapters.push(new Chapter(c, this, i + 1))
        })
    }
    get name() {
        return this.data.book
    }
    get chapters() {
        return [...this.#chapters]
    }
    get verses() {
        return this.chapters.reduce((prev, c, i) => ([...prev, ...c.verses]), [] as Verse[])
    }
    get words() {
        return this.verses.reduce((prev, v, i) => ([...prev, ...v.words]), [] as string[])
    }
    chapter(num: number) {
        const ret = this.chapters[num - 1]
        if (!ret) throw Error(`Unable to find chapter ${num} of ${this.name}`)
        return ret
    }
    verse(name: string) {
        const name2 = name.startsWith(this.name + ' ') ? name.slice(this.name.length + 1) : name
        const v = name2.split(':')
        if (v.length !== 2) throw Error(`Invalid chapter/verse: ${name}`)
        const cn = parseInt(v[0])
        const vn = parseInt(v[1])
        return this.chapter(cn).verse(vn)
    }
    matchesReference(ref: string) {
        const ref2 = replaceAbbreviations(ref)
        return ((ref2 === this.name) || (ref2.startsWith(this.name + ' ')) || (ref2 === this.ldsSlug) || (ref2.startsWith(this.ldsSlug + ' ')))
    }
    get fullTitle() {
        return this.data.full_title
    }
    get fullSubtitle() {
        return this.data.full_subtitle
    }
    get heading() {
        return this.data.heading
    }
    get ldsSlug() {
        return this.data.lds_slug
    }
}

export class Testimony {
    constructor (private data: TestimonyData) {
    }
    get text() {
        return this.data.text
    }
    get title() {
        return this.data.title
    }
    get witnesses() {
        return [...this.data.witnesses]
    }
}

export class TitlePage {
    constructor(private data: TitlePageData) {
    }
    get title() {
        return this.data.title
    }
    get subtitle() {
        return this.data.subtitle
    }
    get text() {
        return this.data.text
    }
    get translatedBy() {
        return this.data.translated_by
    }
}

export class BookOfMormon {
    #books: Book[] = []
    #testimonies: Testimony[] = []
    #titlePage: TitlePage
    constructor(private data: BookOfMormonData) {
        data.books.forEach(b => {
            this.#books.push(new Book(b))
        })
        data.testimonies.forEach(t => {
            this.#testimonies.push(new Testimony(t))
        })
        this.#titlePage = new TitlePage(data.title_page)
    }
    get books() {
        return [...this.#books]
    }
    get chapters() {
        return this.#books.reduce((prev, b, i) => ([...prev, ...b.chapters]), [] as Chapter[])
    }
    get verses() {
        return this.chapters.reduce((prev, c, i) => ([...prev, ...c.verses]), [] as Verse[])
    }
    get words() {
        return this.verses.reduce((prev, v, i) => ([...prev, ...v.words]), [] as string[])
    }
    book(name: string) {
        const ret = this.books.filter(b => (b.matchesReference(name)))[0]
        if (!ret) throw Error(`Unable to find book: ${name}`)
        return ret
    }
    chapter(name: string) {
        for (let b of this.books) {
            if (b.matchesReference(name)) {
                const i = name.lastIndexOf(' ')
                if (i >= 0) {
                    const num = parseInt(name.slice(i + 1))
                    return b.chapter(num)
                }
            }
        }
        throw Error(`Unable to find chapter ${name}`)
    }
    verse(name: string) {
        const name2 = replaceAbbreviations(name)
        for (let b of this.books) {
            if (name2.startsWith(b.name + ' ')) {
                const n = name2.slice(b.name.length + 1)
                return b.verse(n)
            }
        }
        throw Error(`Unable to find chapter ${name}`)
    }
    get title() {
        return this.data.title
    }
    get subtitle() {
        return this.data.subtitle
    }
    get lastModified() {
        return this.data.last_modified
    }
    get ldsSlug() {
        return this.data.lds_slug
    }
    get version() {
        return this.data.version
    }
    get testimonies() {
        return [...this.#testimonies]
    }
    get titlePage() {
        return this.#titlePage
    }
}