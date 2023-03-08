type BookFormat = "epub" | "pdf" | "mobi"
type BookCategory = "non-fiction" | "fiction"

interface Book {
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

export type { Book, BookFormat, BookCategory }
