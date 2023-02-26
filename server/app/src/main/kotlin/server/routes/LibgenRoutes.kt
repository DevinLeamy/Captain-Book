package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.libgen.*
import server.store

val libgen = LibgenAPI()

fun Route.libgenRouting() {
    route("/libgen") {
        /**
         * Fetch the metadata of all books results from the search query.
         *
         * TODO: Handle these errors globally as per: https://ktor.io/docs/status-pages.html#exceptions
         */
        post("/search") {
            val search: LibgenSearch
            try {
                search = call.receive()
            } catch (error: Throwable) {
                return@post call.respondText(
                    "Failed to parse search parameters.",
                    status = HttpStatusCode.BadRequest
                )
            }
            println("Search: ${search}")

            println("Querying for books with title: ${search.query.text}")

            val books = libgen.search(search)

            println("Found ${books.size} books matching search")
            call.respond(books)
        }

        /**
         * Fetch a book file given the book data.
         */
        post("/download") {
            val book: LibgenBook
            try {
                book = call.receive()
            } catch (error: Throwable) {
                return@post call.respondText(
                    "Failed to parse book.",
                    status = HttpStatusCode.BadRequest
                )
            }

            // Return book that has already been downloaded.
            if (store.downloadedBooks.containsKey(book.md5)) {
                call.respondFile(store.downloadedBooks[book.md5]!!)
                return@post
            }

            println("Fetching book with md5: ${book.md5}")

            val bookDownload = libgen.download(book)
            if (bookDownload.isEmpty) {
                call.respondText(
                    "Failed to fetch book",
                    status = HttpStatusCode.InternalServerError
                )
            } else {
                store.downloadedBooks[book.md5] = bookDownload.get()
                call.respondFile(store.downloadedBooks[book.md5]!!)
            }
        }
    }
}