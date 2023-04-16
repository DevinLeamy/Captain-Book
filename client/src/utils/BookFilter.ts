import { Book } from "types/Book"

type BookPredicate = (book: Book) => boolean

class FilterPass {
    predicate: BookPredicate
    enabled: boolean

    constructor(predicate: BookPredicate, enabled: boolean = true) {
        this.predicate = predicate
        this.enabled = enabled
    }

    passesFilter(book: Book): boolean {
        if (!this.enabled) {
            return true
        }
        return this.predicate(book)
    }

    toggle() {
        this.enabled = !this.enabled
    }

    disable() {
        this.enabled = false
    }
}

class BookFilter {
    passes: Map<string, FilterPass> = new Map()

    constructor(predicates: Map<string, BookPredicate>) {
        predicates.forEach((predicate: BookPredicate, key: string) => {
            this.passes.set(key, new FilterPass(predicate, false))
        })
    }

    static allowAllFilter(): BookFilter {
        return new BookFilter(new Map())
    }

    filterBooks(books: Book[]): Book[] {
        return books.filter((book: Book) => this.passesFilter(book))
    }

    passesFilter(book: Book): boolean {
        let passes = true
        this.passes.forEach((pass: FilterPass) => {
            passes &&= pass.passesFilter(book)
        })

        return passes
    }

    addFilter(key: string, predicate: BookPredicate): BookFilter {
        this.passes.set(key, new FilterPass(predicate, false))
        return this
    }

    removeFilter(key: string): BookFilter {
        this.passes.delete(key)
        return this
    }

    hasFilter(key: string): Boolean {
        return this.passes.has(key)
    }

    enabledFilter(key: string): boolean {
        if (!this.hasFilter(key)) {
            return false
        }
        return this.passes.get(key)!.enabled
    }

    toggleFilter(key: string): BookFilter {
        this.passes.get(key)?.toggle()
        return this
    }

    toggleOffAllFilters(): BookFilter {
        this.passes.forEach((pass: FilterPass) => {
            pass.disable()
        })
        return this
    }
}

export { BookFilter }
export type { BookPredicate }
