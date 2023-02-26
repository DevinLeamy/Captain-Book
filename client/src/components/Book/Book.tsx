import { Button } from "@mui/material";
import { default as downloadLocally } from "downloadjs";
import { useState } from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";

import { Book } from "../../types/Book";
const image = require("../../assets/book.jpeg");
import { NouvelleAPI } from "../../api/api";
import "./Book.css";

type BookComponentProps = {
    book: Book;
};

type RequestStatus = "waiting" | "done";

export const BookComponent = ({ book }: BookComponentProps) => {
    const [downloadStatus, setDownloadStatus] = useState<RequestStatus | undefined>();
    const [sendToKindleStatus, setSendToKindleStatus] = useState<RequestStatus | undefined>();
    const KINDLE_EMAIL = "devinleamy@gmail.com";
    // const KINDLE_EMAIL = "the420kindle@kindle.com"
    const onDownload = async () => {
        setDownloadStatus("waiting");
        let bookFile = await NouvelleAPI.download(book);
        if (bookFile === undefined) {
            alert("Failed to download.");
            setDownloadStatus("done");
            return;
        }
        setDownloadStatus("done");

        downloadLocally(bookFile, `${book.title}.${book.extension.toLowerCase()}`);
    };

    const onSendToKindle = async () => {
        setSendToKindleStatus("waiting");
        let success = await NouvelleAPI.sendToKindle(KINDLE_EMAIL, book);
        if (success) {
            alert("Send to kindle.");
            console.log("Sent to kindle.");
        } else {
            alert("Failed to send to the kindle.");
        }
        setSendToKindleStatus("done");
    };

    return (
        <tr className="book-row">
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.extension.toUpperCase()}</td>
            {/* TODO: Extract these "waiting" buttons into a component */}
            <td>
                {downloadStatus === "waiting" && (
                    <div className="loading-circle-container">
                        <CircularProgress size={20} />
                    </div>
                )}
                {(downloadStatus === "done" || downloadStatus === undefined) && (
                    <Button size="medium" fullWidth variant="contained" onClick={onDownload}>
                        <CloudDownloadIcon />
                    </Button>
                )}
            </td>
            <td>
                {sendToKindleStatus === "waiting" && (
                    <div className="loading-circle-container">
                        <CircularProgress size={20} />
                    </div>
                )}
                {(sendToKindleStatus === "done" || sendToKindleStatus === undefined) && (
                    <Button size="medium" fullWidth variant="contained" onClick={onSendToKindle}>
                        <SendIcon />
                    </Button>
                )}
            </td>
        </tr>
    );
};
