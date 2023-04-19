import { Button } from "@mui/material"
import { default as downloadLocally } from "downloadjs"
import CloudDownloadIcon from "@mui/icons-material/CloudDownload"
import CircularProgress from "@mui/material/CircularProgress"
import SendIcon from "@mui/icons-material/Send"
import LibraryAddIcon from "@mui/icons-material/LibraryAdd"

import { LibgenBook } from "types/Book"
import { NouvelleAPI } from "api/api"
import { useAuth } from "hooks/useAuth"
import { LoadingContainer } from "components/LoadingContainer/LoadingContainer"

import { useAsyncAction } from "../../hooks/useAsyncAction"
import { useUserData } from "hooks/useUserData"

type BookTableRowProps = {
    book: LibgenBook
}

export const LibgenBookTableRow = ({ book }: BookTableRowProps) => {
    const { token } = useAuth()
    const { kindleEmail } = useUserData()
    const [onDownload, downloadStatus] = useAsyncAction(async () => downloadBook(book))
    const [onSendToKindle, sendToKindleStatus] = useAsyncAction(async () => sendToKindle(book))
    const [onAddToLibrary, addToLibraryStatus] = useAsyncAction(async () => {
        const success = await NouvelleAPI.addToLibrary(book, token!)
        alert(`[BOOK] Add to library succeeded: ${success}`)
    })

    const downloadBook = async (book: LibgenBook) => {
        let bookFile = await NouvelleAPI.downloadLibgenBook(book)
        if (bookFile === undefined) {
            alert("Failed to download.")
            return
        }
        downloadLocally(bookFile, `${book.title}.${book.extension.toLowerCase()}`)
    }

    const sendToKindle = async (book: LibgenBook) => {
        if (kindleEmail === undefined) {
            alert("Set your kindle email, on the Account page.")
            return
        }
        let success = await NouvelleAPI.sendLibgenBookToKindle(kindleEmail, book)
        if (success) {
            alert("Send to kindle.")
            console.log("Sent to kindle.")
        } else {
            alert("Failed to send to the kindle.")
        }
    }

    const formatBookTitle = (title: string): string => {
        if (title.length >= 35) {
            return title.substring(0, 22) + "..."
        } else {
            return title
        }
    }

    return (
        <tr className="book-row">
            <td>{formatBookTitle(book.title)}</td>
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
