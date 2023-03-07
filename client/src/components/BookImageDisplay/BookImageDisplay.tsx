import { Book } from "../../types/Book"

import "./BookImageDisplay.css"

type BookImageDisplayProps = {
    book: Book
}

const BookImageDisplay: React.FC<BookImageDisplayProps> = ({ book }) => {
    const placeholder = require("../../assets/book.jpeg")
    const url =
        "https://nouvelle-bucket.s3.us-east-1.amazonaws.com/d3fb509e-0f07-44fa-8381-eb4283f1bb80?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5Z7FQICVPTQXMH7V%2F20230307%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230307T025005Z&X-Amz-Expires=3600&X-Amz-Signature=f7c45312d214a0940adf68a2c67d6a60290d681e7889f4d0225f749e7d2d5fd4&X-Amz-SignedHeaders=host&x-id=GetObject"
    return (
        <div className="book-image-display-container">
            <img className="book-cover" src={url} />
            <div className="book-title-container">{book.title}</div>
        </div>
    )
}

export { BookImageDisplay }
