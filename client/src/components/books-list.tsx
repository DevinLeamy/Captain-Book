import React from "react"
import { Book } from "./book"

import "./books-list.css"

const BooksListComponent = ({ books }: { books: Book[] }) => {
    return (
        <div className="books-container">
            {books.map(BookComponent)}
        </div>
    )
}
const BookComponent = ({ title, author, coverurl, md5 }: Book) => {
    return (
        <div className="book" key={md5}>
            <img
                src={coverurl}
                alt="Book Cover"
                className="book-cover"
                referrerPolicy="no-referrer"
            />
            <div className="info">
                <p className="book-title">{title}</p>
                <p className="book-author">{author}</p>
                <a
                    className="download"
                    href={`http://libgen.io/get.php?md5=${md5.toLowerCase()}`}
                >
                    Download
                </a>
            </div>
        </div>
    )
}

export { BooksListComponent }
