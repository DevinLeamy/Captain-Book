import React, { ReactNode } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useLibrary } from "../../hooks/useLibrary"
import { SearchBar } from "../SearchBar/SearchBar"
import { BookImageDisplay } from "../BookImageDisplay/BookImageDisplay"

import { useLibraryBookFocus } from "./useLibraryBookFocus"
import { BookDetailsDisplay } from "./BookDetailsDisplay"

import "./Library.css"
import "./BookContainer.css"

type LibraryComponentProps = {
    unauthenticated: ReactNode
}

export const LibraryComponent: React.FC<LibraryComponentProps> = ({ unauthenticated }) => {
    const { authenticated } = useAuth()
    const { books } = useLibrary()
    const { focused, focusedBook, onFocusBook, onFocusNext, onFocusPrevious, onFocusStop } =
        useLibraryBookFocus(books)

    const onSubmitSearch = (queryString: string) => {}

    return (
        <div className="library-container">
            {!authenticated && unauthenticated}
            {authenticated && (
                <>
                    {focused && (
                        <BookDetailsDisplay
                            book={focusedBook!}
                            onFocusNext={onFocusNext}
                            onFocusPrevious={onFocusPrevious}
                            onFocusStop={onFocusStop}
                        />
                    )}
                    <SearchBar onSubmit={onSubmitSearch} />
                    <BookContainer>
                        {books.map((book) => (
                            <BookImageDisplay key={book.id} book={book} onClick={onFocusBook} />
                        ))}
                    </BookContainer>
                </>
            )}
        </div>
    )
}

type BookContainerProps = {
    children: ReactNode
}

const BookContainer: React.FC<BookContainerProps> = ({ children }) => {
    return <div className="library-book-container">{children}</div>
}
