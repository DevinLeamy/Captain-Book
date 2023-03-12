import { Button } from "@mui/material"
import { default as downloadLocally } from "downloadjs"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"
import CircularProgress from "@mui/material/CircularProgress"
import SendIcon from "@mui/icons-material/Send"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"

import { LibgenBook } from "../../types/Book"
import { NouvelleAPI } from "../../api/api"
import { useAuth } from "../../hooks/useAuth"
import { LoadingContainer } from "../Common"

import "./BookTableRow.css"
import { useAsyncAction } from "../../hooks/useAsyncAction"

type BookTableRowProps = {
    book: LibgenBook
}

// TODO: This should be part of the User data.
const KINDLE_EMAIL = "devinleamy@gmail.com"
// const KINDLE_EMAIL = "the420kindle@kindle.com"
const downloadBook = async (book: LibgenBook) => {
    let bookFile = await NouvelleAPI.downloadLibgenBook(book)
    if (bookFile === undefined) {
        alert("Failed to download.")
        return
    }
    downloadLocally(bookFile, `${book.title}.${book.extension.toLowerCase()}`)
}

const sendToKindle = async (book: LibgenBook) => {
    let success = await NouvelleAPI.sendLibgenBookToKindle(KINDLE_EMAIL, book)
    if (success) {
        alert("Send to kindle.")
        console.log("Sent to kindle.")
    } else {
        alert("Failed to send to the kindle.")
    }
}

export const BookTableRow = ({ book }: BookTableRowProps) => {
    const { token } = useAuth()
    const [onDownload, downloadStatus] = useAsyncAction(async () => downloadBook(book))
    const [onSendToKindle, sendToKindleStatus] = useAsyncAction(async () => sendToKindle(book))
    const [onAddToLibrary, addToLibraryStatus] = useAsyncAction(async () => {
        const success = await NouvelleAPI.addToLibrary(book, token!)
        alert(`[BOOK] Add to library succeeded: ${success}`)
    })

    return (
        <tr className="book-row">
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.year}</td>
            <td>{book.extension.toUpperCase()}</td>
            <td>
                <LoadingContainer
                    loading={downloadStatus === "waiting"}
                    beforeLoaded={
                        <div className="loading-circle-container">
                            <CircularProgress size={20} />
                        </div>
                    }
                >
                    <Button size="medium" fullWidth variant="contained" onClick={onDownload}>
                        <CloudDownloadIcon />
                    </Button>
                </LoadingContainer>
            </td>
            <td>
                <LoadingContainer
                    loading={sendToKindleStatus === "waiting"}
                    beforeLoaded={
                        <div className="loading-circle-container">
                            <CircularProgress size={20} />
                        </div>
                    }
                >
                    <Button size="medium" fullWidth variant="contained" onClick={onSendToKindle}>
                        <SendIcon />
                    </Button>
                </LoadingContainer>
            </td>
            <td>
                <LoadingContainer
                    loading={addToLibraryStatus === "waiting"}
                    beforeLoaded={
                        <div className="loading-circle-container">
                            <CircularProgress size={20} />
                        </div>
                    }
                >
                    <Button size="medium" fullWidth variant="contained" onClick={onAddToLibrary}>
                        <LibraryAddIcon />
                    </Button>
                </LoadingContainer>
            </td>
        </tr>
    )
}
