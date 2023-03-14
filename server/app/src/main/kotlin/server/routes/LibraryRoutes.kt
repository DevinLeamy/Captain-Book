package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import server.auth.FIREBASE_AUTH
import server.auth.UserPrincipal
import server.db.S3
import server.db.models.*
import server.libgen.LibgenBook
import server.utils.downloadImageByUrl
import kotlin.jvm.optionals.getOrNull

@Serializable
data class BooksSendPost(
    val book: Book,
    val kindleEmail: String
)


fun Route.libraryRouting() {
    authenticate(FIREBASE_AUTH) {
        route("/library") {
            route("/books") {
                post("/send") {
                    val request = call.receive<BooksSendPost>()
                    val book = request.book
                    val kindleEmail = request.kindleEmail

                    val bookKeyId = books.getBookFileKey(book.id) ?: return@post call.respondText(
                        "Failed to download the book",
                        status = HttpStatusCode.InternalServerError
                    )
                    val bookFile = S3.getFile(bookKeyId) ?: return@post call.respondText(
                        "Failed to download the book",
                        status = HttpStatusCode.InternalServerError
                    )

                    val status = kindle.sendToKindle(kindleEmail, bookFile)

                    if (status.isSuccess) {
                        books.updateSentToKindle(book, sentToKindle = true)
                        call.respondText("Sent book to kindle")
                    } else {
                        call.respondText(
                            "Failed to send book",
                            status = HttpStatusCode.InternalServerError
                        )
                    }
                }
                post("/add") {
                    val libgenBook: LibgenBook
                    // TODO: All authenticated routes should have direct access to UserPrinciple,
                    //       not the nullable UserPrinciple?
                    val principal = call.principal<UserPrincipal>()!!
                    try {
                        libgenBook = call.receive()
                    } catch (error: Throwable) {
                        return@post call.respondText(
                            "Failed to parse request parameters.",
                            status = HttpStatusCode.BadRequest
                        )
                    }

                    /**
                     * TODO: Find a better way to do this kind of error handling.
                     */

                    val bookFile = libgen.download(libgenBook).getOrNull() ?: return@post call.respondText(
                        "Failed to download book.",
                        status = HttpStatusCode.InternalServerError
                    )
                    val s3BookKey = S3.putBook(bookFile)
                    // Download the image and store it in an S3 bucket.
                    val imageFile = downloadImageByUrl(libgenBook.coverurl)
                    val s3ImageKey = S3.putImage(imageFile)

                    val user = users.userWithEmail(principal.user.email) ?: return@post call.respondText(
                        "Failed to find user.",
                        status = HttpStatusCode.InternalServerError
                    )

                    books.addBook(user.id, libgenBook, s3ImageKey, s3BookKey, sentToKindle = false).getOrNull()
                        ?: return@post call.respondText(
                            "Failed to add book to database.",
                            status = HttpStatusCode.InternalServerError
                        )

                    call.respondText("Added book to the library")
                }
                get("/") {
                    val principle = call.principal<UserPrincipal>()!!
                    val user = principle.user

                    call.respond(user.books)
                }
                get("/{bookId}/toggleSentToKindle") {
                    val bookId = call.parameters["bookId"] ?: return@get call.respondText(
                        "Invalid request",
                        status = HttpStatusCode.BadRequest
                    )
                    val book = books.bookWithId(bookId.toInt()) ?: return@get call.respondText(
                        "Invalid book id",
                        status = HttpStatusCode.BadRequest
                    )
                    books.updateSentToKindle(book, !book.sentToKindle)
                    call.respondText("Updated kindle status")
                }
                get("/{bookId}/toggleCompleted") {
                    val bookId = call.parameters["bookId"] ?: return@get call.respondText(
                        "Invalid request",
                        status = HttpStatusCode.BadRequest
                    )
                    val book = books.bookWithId(bookId.toInt()) ?: return@get call.respondText(
                        "Invalid book id",
                        status = HttpStatusCode.BadRequest
                    )
                    books.updateCompleted(book, !book.completed)
                    call.respondText("Updated kindle status")
                }
            }
        }
    }
}