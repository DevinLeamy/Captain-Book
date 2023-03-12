type BookFormat = "epub" | "pdf" | "mobi"
type BookCategory = "non-fiction" | "fiction"

/**
 * A book fetched from Libgen.
 */
interface LibgenBook {
    id: string
    title: string
    author: string
    year: string
    language: string
    pages: string
    publisher: string
    edition: string
    extension: string
    md5: string
    coverurl: string
    bookFileUrl: string
    category: BookCategory
}

/**
 * A book fetch from a user library.
 */
interface Book {
    id: number
    title: string
    author: string
    filesize: string
    year: string
    language: string
    pages: string
    publisher: string
    edition: string
    extension: string
    coverurl: string
    bookFileUrl: string
    category: BookCategory
    sentToKindle: boolean
    completed: boolean
}

export type { LibgenBook, Book, BookFormat, BookCategory }
