import { Button } from "@mui/material";
import { default as downloadLocally } from "downloadjs";
import React from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SendIcon from "@mui/icons-material/Send";

import { Book } from "../../types/Book";
const image = require("../../assets/book.jpeg");
import { NouvelleAPI } from "../../api/api";
import "./Book.css";

type BookComponentProps = {
    book: Book;
};

export const BookComponent = ({ book }: BookComponentProps) => {
    const KINDLE_EMAIL = "devinleamy@gmail.com";
    // const KINDLE_EMAIL = "the420kindle@kindle.com"
    const onDownload = async () => {
        let bookFile = await NouvelleAPI.download(book);
        if (bookFile === undefined) {
            return;
        }

        downloadLocally(bookFile, `${book.title}.${book.extension.toLowerCase()}`);
    };

    const onSendToKindle = async () => {
        let success = await NouvelleAPI.sendToKindle(KINDLE_EMAIL, book);
        if (success) {
            console.log("Sent to kindle.");
        } else {
            console.log("Failed to send to the kindle.");
        }
    };

    return (
        <tr className="book-row">
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.extension.toUpperCase()}</td>
            <td>
                <Button size="medium" fullWidth variant="contained" onClick={onDownload}>
                    <CloudDownloadIcon />
                </Button>
            </td>
            <td>
                <Button size="medium" fullWidth variant="contained" onClick={onSendToKindle}>
                    <SendIcon />
                </Button>
            </td>
        </tr>
    );
};
