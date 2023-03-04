package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.auth.FIREBASE_AUTH
import server.auth.UserPrincipal
import server.db.models.bookFiles
import server.db.models.books
import server.db.models.libgenBooks
import server.db.models.users
import kotlin.jvm.optionals.getOrNull


fun Route.libraryRouting() {
    authenticate(FIREBASE_AUTH) {
        route("/library") {
            post("/books/add") {
                val request: AddBookRequest
                // TODO: All authenticated routes should have direct access to UserPrinciple,
                //       not the nullable UserPrinciple?
                val principal = call.principal<UserPrincipal>()!!
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
                val user = users.userWithEmail(principal.user.email) ?: return@post call.respondText(
                    "Failed to find user.",
                    status = HttpStatusCode.InternalServerError
                )
                val libgenBookId = libgenBooks.addBook(request.libgenBook).getOrNull() ?: return@post call.respondText(
                    "Failed to add book to database.",
                    status = HttpStatusCode.InternalServerError
                )

                val bookId = books.addBook(user.id, libgenBookId, sentToKindle = false).getOrNull()
                    ?: return@post call.respondText(
                        "Failed to add book to database.",
                        status = HttpStatusCode.InternalServerError
                    )

                // TODO: How to handle errors, in this case?
                bookFiles.addBookFile(bookFile, bookId) ?: return@post call.respondText(
                    "Failed to store book file in the database",
                    status = HttpStatusCode.InternalServerError
                )

                call.respondText("Added book to the library")
            }
            get("/books") {
                val principle = call.principal<UserPrincipal>()!!
                val user = principle.user

                call.respond(BooksRequest(user.books))
            }
        }
    }
}