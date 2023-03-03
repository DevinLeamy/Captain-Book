import { useState } from "react"

import { useAuth } from "../hooks/useAuth"
import { Book } from "../types/Book"

type useLibraryT = {
    books: Book[]
    test: () => void
}

const useLibrary = (): useLibraryT => {
    const { authenticated, token } = useAuth()
    const [books, setBooks] = useState<Book[]>([])

    const test = async () => {
        console.log(token)
        let response = await fetch(`http://127.0.0.1:8080/private/test`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        response = await response.json()
    }

    if (!authenticated) {
        return {
            books: [],
            test,
        }
    }

    return {
        books,
        test,
    }
}

export { useLibrary }
