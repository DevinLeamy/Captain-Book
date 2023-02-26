package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.kindle.KindleAPI
import server.store

val kindle = KindleAPI()

fun Route.kindleRouting() {
    route("/kindle") {
//        get("send/{md5?}/{email?}") {
//            val md5 = call.parameters["md5"] ?: return@get call.respondText(
//                "Missing md5",
//                status = HttpStatusCode.BadRequest
//            )
//            val email = call.parameters["email"] ?: return@get call.respondText(
//                "Missing email",
//                status = HttpStatusCode.BadRequest
//            )
//
//            // TODO: Should create helper to download and store the book, using the libgen API.
//            if (!store.downloadedBooks.containsKey(md5)) {
//                store.downloadedBooks[md5] = libgen.downloadBookByMd5(md5).get()
//            }
//            val book = store.downloadedBooks[md5]!!
//            val status = kindle.sendToKindle(email, book)
//
//            if (status.isSuccess) {
//                call.respondText("Sent book to kindle")
//            } else {
//                call.respondText(
//                    "Failed to send book",
//                    status = HttpStatusCode.InternalServerError
//                )
//            }
//        }
    }
}