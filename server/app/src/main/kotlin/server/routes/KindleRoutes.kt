package server.routes

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import server.auth.FIREBASE_AUTH
import server.auth.UserPrincipal
import server.db.models.users
import server.kindle.KindleAPI
import server.libgen.LibgenBook
import server.store
import server.utils.BlanketException
import server.utils.DatabaseException

val kindle = KindleAPI()

@Serializable
data class SendToKindleRequest(
    val kindleEmail: String,
    val book: LibgenBook
)

@Serializable
data class KindleEmailResponse(
    val kindleEmail: String?
)

@Serializable
data class KindleEmailRequest(
    val newKindleEmail: String
)

fun Route.kindleRouting() {
    route("/kindle") {
        post("/send") {
            val request = call.receive<SendToKindleRequest>()

            val kindleEmail = request.kindleEmail
            val book = request.book
            if (!store.downloadedBooks.containsKey(book.md5)) {
                store.downloadedBooks[book.md5] = libgen.download(book).get()
            }
            val bookFile = store.downloadedBooks[book.md5]!!
            val status = kindle.sendToKindle(kindleEmail, bookFile)
            if (status.isFailure) {
                throw BlanketException("Failed to send book")
            }

            call.respondText("Sent book to kindle")
        }
        authenticate(FIREBASE_AUTH) {
            /**
             * Fetches the user's Kindle email.
             */
            get("/email") {
                val principal = call.principal<UserPrincipal>()!!
                val user = users.userWithEmail(principal.user.email) ?: throw DatabaseException("Failed to find user")

                call.respond(KindleEmailResponse(user.kindleEmail))
            }
            /**
             * Updates the user's Kindle email.
             */
            post("/email") {
                val principal = call.principal<UserPrincipal>()!!
                val user = users.userWithEmail(principal.user.email) ?: throw DatabaseException("Failed to find user")
                val request = call.receive<KindleEmailRequest>()
                user.kindleEmail = request.newKindleEmail
                users.updateUser(user)
                call.respond("Updated kindle email")
            }
        }
    }
}