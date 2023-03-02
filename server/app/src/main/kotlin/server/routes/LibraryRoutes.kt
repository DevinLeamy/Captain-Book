package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.db.models.books
import server.db.models.libgenBooks
import server.db.models.users
import kotlin.jvm.optionals.getOrNull


fun Route.libraryRouting() {
    route("/library") {
        post("/books/add") {
            val request: AddBookRequest
            try {
                request = call.receive()
            } catch (error: Throwable) {
                return@post call.respondText(
                    "Failed to parse request parameters.",
                    status = HttpStatusCode.BadRequest
                )
            }

            /**
             * TODO: Find a better way to do this kind of error handling.
             */

            val bookFile = libgen.download(request.libgenBook).getOrNull() ?: return@post call.respondText(
                "Failed to download book.",
                status = HttpStatusCode.InternalServerError
            )
            val user = users.userWithEmail(request.userEmail) ?: return@post call.respondText(
                "Failed to find user.",
                status = HttpStatusCode.InternalServerError
            )
            val libgenBookId = libgenBooks.addBook(request.libgenBook).getOrNull() ?: return@post call.respondText(
                "Failed to add book to database.",
                status = HttpStatusCode.InternalServerError
            )
            // Placeholder file.
            books.addBook(file = 1, user.id, libgenBookId, sentToKindle = false).getOrNull() ?: return@post call.respondText(
                "Failed to add book to database.",
                status = HttpStatusCode.InternalServerError
            )
        }
    }
}