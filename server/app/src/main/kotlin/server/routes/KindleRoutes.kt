package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import server.kindle.KindleAPI
import server.libgen.LibgenBook
import server.store

val kindle = KindleAPI()

@Serializable
data class SendToKindleRequest(
    val kindleEmail: String,
    val book: LibgenBook
)

fun Route.kindleRouting() {
    route("/kindle") {
        post("/send") {
            val request: SendToKindleRequest
            try {
                request = call.receive()
            } catch (e: Throwable) {
                return@post call.respondText(
                    "Could not parse send to kindle request",
                    status = HttpStatusCode.BadRequest
                )
            }
            val kindleEmail = request.kindleEmail
            val book = request.book
            if (!store.downloadedBooks.containsKey(book.md5)) {
                store.downloadedBooks[book.md5] = libgen.download(book).get()
            }
            val bookFile = store.downloadedBooks[book.md5]!!
            val status = kindle.sendToKindle(kindleEmail, bookFile)

            if (status.isSuccess) {
                call.respondText("Sent book to kindle")
            } else {
                call.respondText(
                    "Failed to send book",
                    status = HttpStatusCode.InternalServerError
                )
            }
        }
    }
}