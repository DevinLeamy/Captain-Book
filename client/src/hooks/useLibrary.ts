import { useState } from "react"

import { useAuth } from "../hooks/useAuth"
import { Book } from "../types/Book"

type useLibraryT = {
    books: Book[]
}

const useLibrary = (): useLibraryT => {
    const { authenticated, token } = useAuth()
    const [books, setBooks] = useState<Book[]>([])

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
