import React, { ReactNode, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useLibrary } from "../../hooks/useLibrary"
import { SearchBar } from "../SearchBar/SearchBar"
import { BookImageDisplay } from "../BookImageDisplay/BookImageDisplay"
import SendIcon from "@mui/icons-material/Send"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import VisibilityIcon from "@mui/icons-material/Visibility"

import { useLibraryBookFocus } from "./useLibraryBookFocus"
import { BookDetailsDisplay } from "./BookDetailsDisplay"

import "./Library.css"
import "./BookContainer.css"
import "./BookFilterOption.css"
import { Button, Grid } from "@mui/material"
import { BookFilter, BookFilterBuilder } from "../../utils/BookFilter"
import { Book } from "../../types/Book"

type LibraryComponentProps = {
    unauthenticated: ReactNode
}

export const LibraryComponent: React.FC<LibraryComponentProps> = ({ unauthenticated }) => {
    const { authenticated } = useAuth()
    const { books, updateBook } = useLibrary()
    const { focused, focusedBook, onFocusBook, onFocusNext, onFocusPrevious, onFocusStop } =
        useLibraryBookFocus(books)
    const [bookFilter, setBookFilter] = useState<BookFilter>(BookFilter.allowAllFilter())
    const [activeFilter, setActiveFilter] = useState<string>("")

    const onSubmitSearch = (queryString: string) => {}
    let filteredBooks = bookFilter.filterBooks(books)

    const updateActiveFilter = (newFilter: string) => {
        if (newFilter === activeFilter) {
            newFilter = ""
        }

        switch (newFilter) {
            case "read": {
                setBookFilter(new BookFilterBuilder().readBooks().build())
                break
            }
            case "unread": {
                setBookFilter(new BookFilterBuilder().unreadBooks().build())
                break
            }
            case "kindle": {
                setBookFilter(new BookFilterBuilder().sentToKindleBooks().build())
                break
            }
            default: {
                setActiveFilter("")
                setBookFilter(BookFilter.allowAllFilter())
                return
            }
        }

        setActiveFilter(newFilter)
    }

    return (
        <div className="library-container">
            {!authenticated && unauthenticated}
            {authenticated && (
                <>
                    {focused && (
                        <BookDetailsDisplay
                            onUpdateBook={(book: Book) => updateBook(book, false)}
                            book={focusedBook!}
                            onFocusNext={onFocusNext}
                            onFocusPrevious={onFocusPrevious}
                            onFocusStop={onFocusStop}
                        />
                    )}
                    <SearchBar onSubmit={onSubmitSearch} />
                    <Grid
                        style={{
                            height: "100%",
                        }}
                        container
                        spacing={4}
                    >
                        <Grid item xs={9}>
                            {filteredBooks.length == 0 && <h3>No results</h3>}
                            {filteredBooks.length > 0 && (
                                <BookContainer>
                                    {filteredBooks.map((book) => (
                                        <BookImageDisplay
                                            key={book.id}
                                            book={book}
                                            onClick={onFocusBook}
                                        />
                                    ))}
                                </BookContainer>
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            <div className="book-filters-container">
                                <BookFilterOption
                                    active={activeFilter === "read"}
                                    icon={<VisibilityIcon />}
                                    onClick={() => updateActiveFilter("read")}
                                >
                                    Read
                                </BookFilterOption>
                                <BookFilterOption
                                    icon={<VisibilityOffIcon />}
                                    active={activeFilter === "unread"}
                                    onClick={() => updateActiveFilter("unread")}
                                >
                                    Unread
                                </BookFilterOption>
                                <BookFilterOption
                                    active={activeFilter === "kindle"}
                                    icon={<SendIcon />}
                                    onClick={() => updateActiveFilter("kindle")}
                                >
                                    Sent to Kindle
                                </BookFilterOption>
                            </div>
                        </Grid>
                    </Grid>
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

type BookFilterOptionProps = {
    icon: ReactNode
    children: ReactNode
    active: boolean
    onClick: () => void
}

const BookFilterOption: React.FC<BookFilterOptionProps> = ({ icon, children, active, onClick }) => {
    return (
        <div className="book-filter-option-container">
            <Button
                variant={active ? "contained" : "outlined"}
                startIcon={icon}
                style={{
                    justifyContent: "flex-start",
                    borderRadius: "0px",
                }}
                fullWidth
                onClick={onClick}
            >
                {children}
            </Button>
        </div>
    )
}
