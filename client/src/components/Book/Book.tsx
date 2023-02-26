import { Card, Grid, CardActions, Button, CardContent } from "@mui/material";
import { default as downloadLocally } from "downloadjs";
import React from "react";

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
        <Grid style={{ width: "200px" }} key={book.md5} xs={3} item>
            <Card>
                <div>{book.title}</div>
                <img className="book-cover-image" src={image} />
                <div>{book.author}</div>
                <CardActions>
                    <Button size="medium" variant="contained" onClick={onDownload}>
                        Download
                    </Button>
                    <Button size="medium" variant="contained" onClick={onSendToKindle}>
                        Send to Kindle
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};
