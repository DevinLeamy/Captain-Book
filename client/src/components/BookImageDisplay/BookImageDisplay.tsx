import { Book } from "../../types/Book"

import "./BookImageDisplay.css"

type BookImageDisplayProps = {
    book: Book
}

const BookImageDisplay: React.FC<BookImageDisplayProps> = ({ book }) => {
    const placeholder = require("../../assets/book.jpeg")
    return (
        <div className="book-image-display-container">
            <img className="book-cover" src={`https://libgen.is${book.coverurl}`} />
            <div className="book-title-container">{book.title}</div>
        </div>
    )
}

export { BookImageDisplay }
