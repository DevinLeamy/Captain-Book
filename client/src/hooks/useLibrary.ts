import { useState, useEffect } from "react"
import { NouvelleAPI } from "../api/api"

import { useAuth } from "../hooks/useAuth"
import { Book } from "../types/Book"

type useLibraryT = {
    books: Book[]
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

    if (!authenticated) {
        return {
            books: [],
        }
    }

    return {
        books,
    }
}

export { useLibrary }
