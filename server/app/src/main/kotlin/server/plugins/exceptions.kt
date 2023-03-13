package server.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

fun Application.configureExceptions() {
    install(StatusPages) {
        exception<Throwable> { call, throwable ->
            when (throwable) {
                else -> {
                    println("Server error.")
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        // TODO: Replace with a de-facto exception type, so all exceptions
                        //       are of the same typee.
                        "Request failed: Interval server error"
                    )
                }
            }
        }
    }
}