import { Book } from "types/Book"
import { BookImageDisplay } from "components/BookImageDisplay/BookImageDisplay"

interface BookContainerProps {
    books: Book[]
    onFocusBook: (book: Book) => void
}

const BookContainer: React.FC<BookContainerProps> = ({ books, onFocusBook }) => {
    const groupBooksByYear = (books: Book[]): Book[][] => {
        if (books.length === 0) return []

        let currentYear = books[0].dateAdded.getFullYear()
        let bookGroups: Book[][] = [[]]

        for (let book of books) {
            if (currentYear !== book.dateAdded.getFullYear()) {
                bookGroups.push([])
            }
            bookGroups[bookGroups.length - 1].push(book)
            currentYear = book.dateAdded.getFullYear()
        }

        return bookGroups
    }

    let groups = groupBooksByYear(books)

    if (books.length === 0) {
        return <h3>No results</h3>
    }
    return (
        <div className="w-full flex flex-col gap-y-3">
            {groups.map((group) => (
                <div className="w-full" key={group[0].id}>
                    <div className="w-full text-center pt-2 font-bold">
                        {group[0].dateAdded.getFullYear()}
                    </div>
                    <div className="flex w-full gap-x-7 pt-5 gap-y-3 relative flex-wrap">
                        {group.map((book) => (
                            <BookImageDisplay key={book.id} book={book} onClick={onFocusBook} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { BookContainer }
