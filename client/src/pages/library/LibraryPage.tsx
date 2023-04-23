import React, { ReactNode, useEffect, useState } from "react"
import { useLibrary } from "../../hooks/useLibrary"
import { SearchBar } from "../../components/SearchBar/SearchBar"
import SendIcon from "@mui/icons-material/Send"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import VisibilityIcon from "@mui/icons-material/Visibility"

import { useLibraryBookFocus } from "./useLibraryBookFocus"
import { BookDetailsDisplay } from "./BookDetailsDisplay"

import { Button, Grid } from "@mui/material"
import { BookFilter } from "utils/BookFilter"
import { Book } from "types/Book"
import { BookContainer } from "./BookContainer"

import "./Library.css"
import "./BookFilterOption.css"

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
    useEffect(() => {}, [books, focused, focusedBook])

    const onSubmitSearch = (queryString: string) => {}

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
            <Grid container spacing={4}>
                <Grid item xs={9}>
                    <BookContainer
                        onFocusBook={onFocusBook}
                        books={bookFilter.filterBooks(books)}
                    ></BookContainer>
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

type BookFilterOptionProps = {
    active: boolean
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
