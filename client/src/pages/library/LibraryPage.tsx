import React, { ReactNode, useState } from "react"
import { useLibrary } from "../../hooks/useLibrary"
import { SearchBar } from "../../components/SearchBar/SearchBar"
import { BookImageDisplay } from "../../components/BookImageDisplay/BookImageDisplay"
import SendIcon from "@mui/icons-material/Send"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import VisibilityIcon from "@mui/icons-material/Visibility"

import { useLibraryBookFocus } from "./useLibraryBookFocus"
import { BookDetailsDisplay } from "./BookDetailsDisplay"

import "./Library.css"
import "./BookContainer.css"
import "./BookFilterOption.css"
import { Button, Grid } from "@mui/material"
import { BookFilter } from "../../utils/BookFilter"
import { Book } from "../../types/Book"

const LibraryPage: React.FC = () => {
    const { books, updateBook } = useLibrary()
    const { focused, focusedBook, onFocusBook, onFocusNext, onFocusPrevious, onFocusStop } =
        useLibraryBookFocus(books)
    const [bookFilter, setBookFilter] = useState<BookFilter>(
        BookFilter.allowAllFilter()
            .addFilter("read", (book) => book.completed)
            .addFilter("unread", (book) => !book.completed)
            .addFilter("kindle", (book) => book.sentToKindle)
    )

    const onSubmitSearch = (queryString: string) => {}
    let filteredBooks = bookFilter.filterBooks(books)

    const updateActiveFilter = (newFilter: string) => {
        let filter = BookFilter.allowAllFilter()
            .addFilter("read", (book) => book.completed)
            .addFilter("unread", (book) => !book.completed)
            .addFilter("kindle", (book) => book.sentToKindle)
        if (!bookFilter.enabledFilter(newFilter)) {
            // Enable the new filter.
            filter.toggleFilter(newFilter)
        }

        setBookFilter(filter)
    }

    return (
        <div className="library-container">
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
                                <BookImageDisplay key={book.id} book={book} onClick={onFocusBook} />
                            ))}
                        </BookContainer>
                    )}
                </Grid>
                <Grid item xs={3}>
                    <div className="book-filters-container">
                        <BookFilterOption
                            active={bookFilter.enabledFilter("read")}
                            icon={<VisibilityIcon />}
                            onClick={() => updateActiveFilter("read")}
                        >
                            Read
                        </BookFilterOption>
                        <BookFilterOption
                            icon={<VisibilityOffIcon />}
                            active={bookFilter.enabledFilter("unread")}
                            onClick={() => updateActiveFilter("unread")}
                        >
                            Unread
                        </BookFilterOption>
                        <BookFilterOption
                            active={bookFilter.enabledFilter("kindle")}
                            icon={<SendIcon />}
                            onClick={() => updateActiveFilter("kindle")}
                        >
                            Sent to Kindle
                        </BookFilterOption>
                    </div>
                </Grid>
            </Grid>
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
    active: Boolean
    children: ReactNode
    icon: ReactNode
    onClick: () => void
}

const BookFilterOption: React.FC<BookFilterOptionProps> = ({ active, children, icon, onClick }) => {
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

export default LibraryPage
