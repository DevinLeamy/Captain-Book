package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.libgen.LibgenAPI

val libgen = LibgenAPI()

fun Route.libgenRouting() {
    route("/libgen") {
        /**
         * Fetch the metadata of all books results from the search query.
         */
        get("{title?}") {
            val title = call.parameters["title"] ?: return@get call.respondText(
                "Missing book title",
                status = HttpStatusCode.BadRequest
            )

            println("Querying for books with title: $title")

            val books = libgen.requestBooksWithTitle(title)
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

            println("Fetching book with md5: $md5")

            val bookDownload = libgen.downloadBookByMd5(md5, "book")
            call.respondFile(bookDownload.get())
        }
    }
}