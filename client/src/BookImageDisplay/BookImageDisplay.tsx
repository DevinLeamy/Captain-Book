import { Book } from "../types/Book"

import "./BookImageDisplay.css"

type BookImageDisplayProps = {
    book: Book
    onClick: (book: Book) => void
}

const BookImageDisplay: React.FC<BookImageDisplayProps> = ({ book, onClick }) => {
    return (
        <div className="book-image-display-container" onClick={() => onClick(book)}>
            <img className="book-cover" src={book.coverurl} />
            <div className="book-info-container">
                <span className="book-title">{book.title}</span>
                <span className="book-author">{book.author}</span>
            </div>
        </div>
    )
}

export { BookImageDisplay }
