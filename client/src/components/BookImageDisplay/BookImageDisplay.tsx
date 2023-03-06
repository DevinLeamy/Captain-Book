import { Book } from "../../types/Book"

import "./BookImageDisplay.css"

type BookImageDisplayProps = {
    book: Book
}

const BookImageDisplay: React.FC<BookImageDisplayProps> = ({ book }) => {
    return (
        <div className="book-image-display-container">
            <img className="book-cover" src={require("../../assets/book.jpeg")} />
            <div className="book-title-container">{book.title}</div>
        </div>
    )
}

export { BookImageDisplay }
