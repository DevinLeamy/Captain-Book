import React, { PropsWithChildren, ReactNode } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useLibrary } from "../../hooks/useLibrary"
import { SearchBar } from "../SearchBar/SearchBar"
import { BookImageDisplay } from "../BookImageDisplay/BookImageDisplay"

import "./Library.css"
import "./BookContainer.css"

type LibraryComponentProps = {
    unauthenticated: ReactNode
}

export const LibraryComponent: React.FC<LibraryComponentProps> = ({ unauthenticated }) => {
    const { authenticated } = useAuth()
    const { books } = useLibrary()

    const onSubmitSearch = (queryString: string) => {}

    return (
        <div className="library-container">
            {!authenticated && unauthenticated}
            {authenticated && (
                <>
                    <SearchBar onSubmit={onSubmitSearch} />
                    <h1>- Library -</h1>
                    <BookContainer>
                        {books.map((book) => (
                            <BookImageDisplay key={book.id} book={book} />
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
