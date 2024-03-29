import { Book, LibgenBook, parseBookJSON } from "../types/Book"
import { LibgenSearch } from "../types/LibgenSearch"
import { request } from "./utils"
import { API_URL } from "./config"

interface INouvelleAPI {
    search: (search: LibgenSearch) => Promise<LibgenBook[] | undefined>
    downloadLibgenBook: (book: LibgenBook) => Promise<File | undefined>
    sendLibgenBookToKindle: (kindleEmail: string, book: LibgenBook) => Promise<boolean>
    sendLibraryBookToKindle: (kindleEmail: string, book: Book, token: string) => Promise<boolean>
    addToLibrary: (book: LibgenBook, token: string) => Promise<boolean>
    getLibraryBooks: (token: string) => Promise<Book[]>
    toggleBookSentToKindle: (bookId: number, token: string) => Promise<boolean>
    toggleBookCompleted: (bookId: number, token: string) => Promise<boolean>
    getKindleEmail: (token: string) => Promise<string | undefined>
    updateKindleEmail: (kindleEmail: string, token: string) => Promise<boolean>
}

const search = async (search: LibgenSearch): Promise<LibgenBook[] | undefined> => {
    let response = await fetch(`${API_URL}/libgen/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(search),
    })

    if (!response.ok) {
        return undefined
    }

    response = await response.json()
    return response as unknown as LibgenBook[]
}

const downloadLibgenBook = async (book: LibgenBook): Promise<File | undefined> => {
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
const sendLibgenBookToKindle = async (kindleEmail: string, book: LibgenBook): Promise<boolean> => {
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
 * Add a libgen book to the user's collection.
 */
const addToLibrary = async (book: LibgenBook, token: string): Promise<boolean> => {
    let response = await request("/library/books/add", {
        body: book,
        accessToken: token,
    })
    return response.ok
}

/**
 * Fetch books from a user's collection.
 */
const getLibraryBooks = async (token: string): Promise<Book[]> => {
    let response = await request("/library/books/", {
        accessToken: token,
    })
    if (!response.ok) {
        console.log("[API] Failed to fetch books.")
        return []
    }

    let books = (await response.json()) as Book[]
    books = books.map(parseBookJSON)
    return books
}

/**
 * Toggle the send to kindle status of a book.
 */
const toggleBookSentToKindle = async (bookId: number, token: string): Promise<boolean> => {
    let response = await request(`/library/books/${bookId}/toggleSentToKindle`, {
        accessToken: token,
    })
    return response.ok
}

/**
 * Toggle the send to kindle status of a book.
 */
const toggleBookCompleted = async (bookId: number, token: string): Promise<boolean> => {
    let response = await request(`/library/books/${bookId}/toggleCompleted`, {
        accessToken: token,
    })
    return response.ok
}

/**
 * Get the user's kindle email.
 */
const getKindleEmail = async (token: string): Promise<string | undefined> => {
    let response = await request(`/kindle/email`, {
        accessToken: token,
    })
    if (!response.ok) {
        return undefined
    }

    let json = await response.json()
    return json.kindleEmail
}

/**
 * Update the user's kindle email.
 */
const updateKindleEmail = async (kindleEmail: string, token: string): Promise<boolean> => {
    let response = await request("/kindle/email", {
        accessToken: token,
        body: {
            newKindleEmail: kindleEmail,
        },
    })
    return response.ok
}

export const NouvelleAPI: INouvelleAPI = {
    search,
    downloadLibgenBook,
    sendLibgenBookToKindle,
    sendLibraryBookToKindle,
    addToLibrary,
    getLibraryBooks,
    toggleBookSentToKindle,
    toggleBookCompleted,
    getKindleEmail,
    updateKindleEmail,
}
