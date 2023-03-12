import { Button, Grid } from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"
import SendIcon from "@mui/icons-material/Send"

import { Book } from "../../types/Book"

import "./BookDetailsDisplay.css"
import { useAuth } from "../../hooks/useAuth"
import { NouvelleAPI } from "../../api/api"

type BookDetailsDisplayT = {
    book: Book
    onFocusNext: () => void
    onFocusPrevious: () => void
    onFocusStop: () => void
}

/**
 * Display the details of the book that the user has selected,
 * and navigate between adjacent books in a collection.
 */
const BookDetailsDisplay: React.FC<BookDetailsDisplayT> = ({
    book,
    onFocusNext,
    onFocusPrevious,
    onFocusStop,
}) => {
    const { token } = useAuth()
    let kindleEmail = "devinleamy@gmail.com"
    // let kindleEmail = "the420kindle@kindle.com"

    const onSendToKindle = async () => {
        let success = await NouvelleAPI.sendLibraryBookToKindle(kindleEmail, book, token!)
        alert(`Send to kindle: ${success}`)
    }

    return (
        <div className="book-details-display-container">
            <div className="book-details-inner-container">
                {/* Exit focus button. */}
                <div className="book-details-exit-button">
                    <Button variant="outlined" onClick={onFocusStop}>
                        <ClearIcon />
                    </Button>
                </div>
                <Grid container spacing={4}>
                    <Grid item xs={5}>
                        <img className="book-details-image" src={book.coverurl} />
                        <div className="book-actions">
                            <a>
                                <Button onClick={onSendToKindle} variant="outlined" size="small">
                                    <SendIcon className="rotate-plane" />
                                </Button>
                            </a>
                            <a href={book.bookFileUrl}>
                                <Button variant="outlined" size="small">
                                    <CloudDownloadIcon />
                                </Button>
                            </a>
                        </div>
                        <h3>{`Read: ${book.completed}`}</h3>
                        <h3>{`Sent to kindle: ${book.sentToKindle}`}</h3>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="book-details-book-title">{`${book.title}`}</div>
                        <h3>{`Author: ${book.author}`}</h3>
                        <h3>{`Pages: ${book.pages}`}</h3>
                        <h3>{`Year: ${book.year}`}</h3>
                        <h3>{`Language: ${book.language}`}</h3>
                        <h3>{`Format: ${book.extension.toLowerCase()}`}</h3>
                        <h3>{`Publisher: ${book.publisher}`}</h3>
                        <h3>{`Edition: ${book.edition}`}</h3>
                    </Grid>
                </Grid>

                {/* Bottom navigation buttons. */}
                <div className="change-book-button previous-book-button">
                    <Button variant="outlined" onClick={onFocusPrevious}>
                        <ArrowBackIosNewIcon />
                    </Button>
                </div>
                <div className="change-book-button next-book-button">
                    <Button variant="outlined" onClick={onFocusNext}>
                        <ArrowForwardIosIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export { BookDetailsDisplay }
