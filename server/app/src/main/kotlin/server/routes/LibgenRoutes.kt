package server.routes

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.libgen.*
import server.store
import server.utils.BlanketException

val libgen = LibgenAPI()

fun Route.libgenRouting() {
    route("/libgen") {
        /**
         * Fetch the metadata of all books results from the search query.
         */
        post("/search") {
            val search = call.receive<LibgenSearch>()
            println("Search: $search")
            println("Querying for books with title: ${search.query.text}")
            val books = libgen.search(search)

            println("Found ${books.size} books matching search")
            call.respond(books)
        }

        /**
         * Fetch a book file given the book data.
         */
        post("/download") {
            val book = call.receive<LibgenBook>()

            // Return book that has already been downloaded.
            if (store.downloadedBooks.containsKey(book.md5)) {
                call.respondFile(store.downloadedBooks[book.md5]!!)
                return@post
            }

            println("Fetching book with md5: ${book.md5}")

            val bookDownload = libgen.download(book)
            if (bookDownload.isEmpty) {
                throw BlanketException("Failed to fetch book")
            }

            store.downloadedBooks[book.md5] = bookDownload.get()
            call.respondFile(store.downloadedBooks[book.md5]!!)
        }
    }
}