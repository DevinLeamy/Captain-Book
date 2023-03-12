import { Book } from "../types/Book"

type BookPredicate = (book: Book) => boolean

class BookFilter {
    predicates: BookPredicate[]

    constructor(predicates: BookPredicate[]) {
        this.predicates = predicates
    }

    static allowAllFilter(): BookFilter {
        return new BookFilter([])
    }

    filterBooks(books: Book[]): Book[] {
        return books.filter((book: Book) => this.passesFilter(book))
    }

    passesFilter(book: Book): boolean {
        let passes = true
        for (let predicate of this.predicates) {
            passes &&= predicate(book)
        }

        return passes
    }
}

class BookFilterBuilder {
    predicates: BookPredicate[]

    constructor() {
        this.predicates = []
    }

    readBooks(): BookFilterBuilder {
        this.predicates.push((book: Book) => book.completed)
        return this
    }

    unreadBooks(): BookFilterBuilder {
        this.predicates.push((book: Book) => !book.completed)
        return this
    }

    sentToKindleBooks(): BookFilterBuilder {
        this.predicates.push((book: Book) => book.sentToKindle)
        return this
    }

    build(): BookFilter {
        return new BookFilter(this.predicates)
    }
}

export { BookFilter, BookFilterBuilder }
