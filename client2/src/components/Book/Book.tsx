import { Card, Grid, CardActions, Button, CardContent } from "@mui/material"
import { default as downloadLocally } from "downloadjs"

import { Book } from "../../types/Book"
const image = require("../../assets/book.jpeg")
import "./Book.css"

type BookComponentProps = {
    book: Book
}

const download = async (book: Book): Promise<File | undefined> => {
    const response = await fetch("http://localhost:8080/libgen/download", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(book)
    })
    if (!response.ok) {
        return undefined
    }
    let fileBlob: any = await response.blob()
    fileBlob.lastModifiedDate = new Date()
    fileBlob.name = book.title
    return fileBlob as File

}

export const BookComponent = ({ book }: BookComponentProps) => {
    const onDownload = async () => {
        let bookFile = await download(book)
        if (bookFile  === undefined) {
            return 
        }

        downloadLocally(bookFile, `${book.title}.${book.extension.toLowerCase()}`)
    }
    return (
        <Grid key={book.md5} xs={3} item>
            <Card>
                <div>{book.title}</div>
                <img className="book-cover-image" src={image}/>
                <div>{book.author}</div>
                <CardActions>
                    <Button 
                        size="medium" 
                        variant="contained"
                        onClick={onDownload}
                    >Download</Button>
                    <Button 
                        size="medium" 
                        variant="contained"
                    >Send to Kindle</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}
