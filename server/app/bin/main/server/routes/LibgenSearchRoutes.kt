package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.libgen.LibgenAPI

val libgen = LibgenAPI()

fun Route.libgenRouting() {
    route("/libgen") {
        get("{title?}") {
            val title = call.parameters["title"] ?: return@get call.respondText(
                "Missing book title",
                status = HttpStatusCode.BadRequest
            )

            println("Querying for books with title: $title")

            val books = libgen.requestBooksWithTitle(title)
            call.respond(books)
        }
    }
}