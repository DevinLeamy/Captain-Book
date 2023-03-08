import { Book } from "../types/Book"
import { LibgenSearch } from "../types/LibgenSearch"
import { request } from "./utils"

const API_URL = "http://127.0.0.1:8080"

interface INouvelleAPI {
    search: (search: LibgenSearch) => Promise<Book[]>
    download: (book: Book) => Promise<File | undefined>
    sendToKindle: (kindleEmail: string, book: Book) => Promise<boolean>
    sendLibraryBookToKindle: (kindleEmail: string, book: Book, token: string) => Promise<boolean>
    addToLibrary: (book: Book, token: string) => Promise<boolean>
    getBooks: (token: string) => Promise<Book[]>
}

const search = async (search: LibgenSearch): Promise<Book[]> => {
    let response = await fetch(`${API_URL}/libgen/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(search),
    })
    response = await response.json()

    return response as unknown as Book[]
}

const download = async (book: Book): Promise<File | undefined> => {
    const response = await fetch(`${API_URL}/libgen/download`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    })
    if (!response.ok) {
        return undefined
    }
    let fileBlob: any = await response.blob()
    fileBlob.lastModifiedDate = new Date()
    fileBlob.name = book.title
    return fileBlob as File
}

/**
 * Sends {book} to {kindleEmail}.
 * Returns whether the request succeeded.
 */
const sendToKindle = async (kindleEmail: string, book: Book): Promise<boolean> => {
    const request = await fetch(`${API_URL}/kindle/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            kindleEmail,
            book,
        }),
    })

    return request.ok
}

/**
 * Send {book} to {kindleEmail}, where {book} is in the user's library.
 * Returns whether the request succeeded.
 */
const sendLibraryBookToKindle = async (
    kindleEmail: string,
    book: Book,
    token: string
): Promise<boolean> => {
    const response = await request("/library/books/send", {
        body: {
            kindleEmail,
            book,
        },
        accessToken: token,
    })
    return response.ok
}

/**
 * Add a book to the user's collection.
 */
const addToLibrary = async (book: Book, token: string): Promise<boolean> => {
    let response = await request("/library/books/add", {
        body: book,
        accessToken: token,
    })
    return response.ok
}

/**
 * Fetch books from a user's collection.
 */
const getBooks = async (token: string): Promise<Book[]> => {
    let response = await request("/library/books/", {
        accessToken: token,
    })
    if (!response.ok) {
        console.log("[API] Failed to fetch books.")
        return []
    }

    let books = await response.json()
    return books as Book[]
}

export const NouvelleAPI: INouvelleAPI = {
    search,
    download,
    sendToKindle,
    sendLibraryBookToKindle,
    addToLibrary,
    getBooks,
}
