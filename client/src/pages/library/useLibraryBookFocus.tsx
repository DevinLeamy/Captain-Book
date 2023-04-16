import { useState } from "react"

import { Book } from "../../types/Book"

type useLibraryBookFocusT = {
    focused: boolean
    focusedBook: Book | undefined
    onFocusBook: (book: Book) => void
    onFocusNext: () => void
    onFocusPrevious: () => void
    onFocusStop: () => void
}

const useLibraryBookFocus = (books: Book[]): useLibraryBookFocusT => {
    const [focused, setFocused] = useState<boolean>(false)
    const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0)

    const focusedBook = (): Book | undefined => {
        if (!focused) {
            return undefined
        } else {
            return books[selectedBookIndex!]
        }
    }

    const onFocusBook = (book: Book) => {
        let index = books.indexOf(book)
        setFocused(true)
        if (index === -1) {
            console.error("[useLibraryBookFocus] Could not find the selected book.")
            setSelectedBookIndex(0)
        } else {
            setSelectedBookIndex(index)
        }
    }

    const onFocusNext = () => {
        if (focused) {
            setSelectedBookIndex((selectedBookIndex + 1) % books.length)
        }
    }

    const onFocusPrevious = () => {
        if (focused) {
            let newIndex = selectedBookIndex - 1
            if (newIndex == -1) {
                newIndex = books.length - 1
            }
            setSelectedBookIndex(newIndex)
        }
    }

    const onFocusStop = () => {
        setFocused(false)
    }

    return {
        focused,
        focusedBook: focusedBook(),
        onFocusBook,
        onFocusNext,
        onFocusPrevious,
        onFocusStop,
    }
}

export { useLibraryBookFocus }
