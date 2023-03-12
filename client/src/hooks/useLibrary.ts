import { useState, useEffect } from "react"
import { NouvelleAPI } from "../api/api"

import { useAuth } from "../hooks/useAuth"
import { Book } from "../types/Book"

type useLibraryT = {
    books: Book[]
    updateBook: (updatedBook: Book, pushChanges: boolean) => void
}

const useLibrary = (): useLibraryT => {
    const { authenticated, token } = useAuth()
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
        if (!authenticated) {
            return
        }

        // prettier-ignore
        (async () => {
            let books = await NouvelleAPI.getLibraryBooks(token!!)
            setBooks(books)
        })()
    }, [authenticated])

    const updateBook = (updatedBook: Book, pushChanges: boolean) => {
        setBooks(
            books.map((book) => {
                if (book.id == updatedBook.id) {
                    return updatedBook
                } else {
                    return book
                }
            })
        )
    }

    if (!authenticated) {
        return {
            books: [],
            updateBook,
        }
    }

    return {
        books,
        updateBook,
    }
}

export { useLibrary }
