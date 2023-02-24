import { Card, Grid, CardActions, Button, CardContent } from "@mui/material"

import { Book } from "../../Book"
const image = require("../../assets/book.jpeg")
import "./Book.css"

type BookComponentProps = {
    book: Book
}

export const BookComponent = ({ book }: BookComponentProps) => {
    console.log(`[BOOK] ${book.md5}`)
    return (
        <Grid key={book.md5} xs={3} item>
            <Card>
                <div>{book.title}</div>
                <img className="book-cover-image" src={book.coverurl}/>
                <div>{book.author}</div>
                <CardActions>
                    <Button size="medium" variant="contained">Download</Button>
                    <Button size="medium" variant="contained">Send to Kindle</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}
