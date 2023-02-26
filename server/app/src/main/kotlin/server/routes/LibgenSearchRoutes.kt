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

            println("Querying for books with title: ${search.query.text}")

            val books = libgen.search(search)

            println("Found ${books.size} books matching search")
            call.respond(books)
        }

        /**
         * Fetch the book with the given md5 hash.
         */
        get("/download/{md5?}") {
            val md5 = call.parameters["md5"] ?: return@get call.respondText(
                "Missing book md5",
                status = HttpStatusCode.BadRequest
            )

            // Return book that has already been downloaded.
            if (store.downloadedBooks.containsKey(md5)) {
                call.respondFile(store.downloadedBooks[md5]!!)
                return@get
            }

            println("Fetching book with md5: $md5")

            val bookDownload = libgen.downloadBookByMd5(md5)
            if (bookDownload.isEmpty) {
                call.respondText(
                    "Failed to fetch book",
                    status = HttpStatusCode.InternalServerError
                )
            } else {
                store.downloadedBooks[md5] = bookDownload.get()
                call.respondFile(store.downloadedBooks[md5]!!)
            }
        }
    }
}