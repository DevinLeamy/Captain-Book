package server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.kindle.KindleAPI
import java.io.File

val kindle = KindleAPI()

fun Route.kindleRouting() {
    route("/kindle") {
        get("send/{md5?}/{email?}") {
            val md5 = call.parameters["md5"] ?: return@get call.respondText(
                "Missing md5",
                status = HttpStatusCode.BadRequest
            )
            val email = call.parameters["email"] ?: return@get call.respondText(
                "Missing email",
                status = HttpStatusCode.BadRequest
            )

            // TODO: Should create helper to download and store the book, using the libgen API.
//            store.downloadedBooks[md5] = libgen.downloadBookByMd5(md5, "book").get()
            val book = File("/Users/Devin/Desktop/temp/libgen-test/book.epub")
            val status = kindle.sendToKindle(email, book) // store.downloadedBooks[md5]!!)
            println("Send to kindle status: $status")
        }
    }
}