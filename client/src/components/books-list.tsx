import React, { useState } from "react"
import download from "downloadjs"
import { Book } from "./book"

import "./books-list.css"

const BooksListComponent = ({ books }: { books: Book[] }) => {
    return (
        <div className="books-container">
            {books.map(BookComponent)}
        </div>
    )
}

const fetchBook = async (md5: string): Promise<File | undefined> => {
    let response = await fetch(`http://localhost:8080/libgen/download/${md5}`, {
        method: "GET"
    })

    if (!response.ok) {
        return undefined
    }
    let fileBlob: any = await response.blob()
    fileBlob.lastModifiedDate = new Date()
    fileBlob.name = "book"
    return fileBlob as File
     
}
const BookComponent = ({ title, author, coverurl, extension, md5 }: Book) => {
    const [book, setBook] = useState<File>()
    const [useAlternate, setUseAlternate] = useState<boolean>(false)

    const onDownload = async () => {
        let bookFile = await fetchBook(md5)
        if (bookFile  === undefined) {
            return 
        }

        setBook(bookFile)
        download(bookFile, `${title}.${extension}`)
    }

    return (
        <div className="book" key={md5}>
            <img
                src={useAlternate ? "../assets/book.jpeg" : coverurl}
                onError={() => setUseAlternate(true)}
                alt="Book Cover"
                className="book-cover"
                referrerPolicy="no-referrer"
            />
            <div className="info">
                <p className="book-title">{title}</p>
                {/* <p className="book-author">{author}</p> */}
                <button
                    className="download"
                    onClick={e => onDownload()}
                >
                    Download
                </button>
            </div>
        </div>
    )
}

export { BooksListComponent }
