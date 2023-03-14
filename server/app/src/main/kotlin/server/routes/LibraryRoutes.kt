package server.routes

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import server.auth.FIREBASE_AUTH
import server.auth.UserPrincipal
import server.db.S3
import server.db.models.*
import server.libgen.LibgenBook
import server.utils.BlanketException
import server.utils.DatabaseException
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

                    val bookKeyId = books.getBookFileKey(book.id) ?: throw BlanketException("Failed to download book")
                    val bookFile = S3.getFile(bookKeyId) ?: throw BlanketException("Failed to download book")
                    val status = kindle.sendToKindle(kindleEmail, bookFile)
                    if (status.isFailure) {
                        throw BlanketException("Failed to send book")
                    }

                    books.updateSentToKindle(book, sentToKindle = true)
                    call.respondText("Sent book to kindle")
                }
                post("/add") {
                    val libgenBook = call.receive<LibgenBook>()
                    // TODO: All authenticated routes should have direct access to UserPrinciple,
                    //       not the nullable UserPrinciple?
                    val principal = call.principal<UserPrincipal>()!!

                    val bookFile = libgen.download(libgenBook).getOrNull() ?: throw BlanketException("Failed to download book")
                    val s3BookKey = S3.putBook(bookFile)
                    // Download the image and store it in an S3 bucket.
                    val imageFile = downloadImageByUrl(libgenBook.coverurl)
                    val s3ImageKey = S3.putImage(imageFile)

                    val user = users.userWithEmail(principal.user.email) ?: throw DatabaseException("Failed to find user")

                    books.addBook(user.id, libgenBook, s3ImageKey, s3BookKey, sentToKindle = false)
                        .getOrNull() ?: throw DatabaseException("Failed to add book to database")

                    call.respondText("Added book to the library")
                }
                get("/") {
                    val principle = call.principal<UserPrincipal>()!!
                    val user = principle.user

                    call.respond(user.books)
                }
                get("/{bookId}/toggleSentToKindle") {
                    val bookId = call.parameters["bookId"] ?: throw BadRequestException("No parameter bookId")
                    val book = books.bookWithId(bookId.toInt()) ?: throw BlanketException("Invalid book id")
                    books.updateSentToKindle(book, !book.sentToKindle)
                    call.respondText("Updated kindle status")
                }
                get("/{bookId}/toggleCompleted") {
                    val bookId = call.parameters["bookId"] ?: throw BadRequestException("No parameter bookId")
                    val book = books.bookWithId(bookId.toInt()) ?: throw BlanketException("Invalid book id")
                    books.updateCompleted(book, !book.completed)
                    call.respondText("Updated kindle status")
                }
            }
        }
    }
}