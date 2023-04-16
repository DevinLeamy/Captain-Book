package server.firebase.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import server.utils.BlanketException
import server.utils.DatabaseException
import server.utils.ExceptionResponse

/**
 * ApplicationCall response that responds with ExceptionResponse.
 */
suspend fun ApplicationCall.respond(message: String, statusCode: HttpStatusCode) {
    this.respond(
        statusCode,
        ExceptionResponse(message, statusCode.value)
    )
}

fun Application.configureExceptions() {
    install(StatusPages) {
        exception<Throwable> { call, throwable ->
            when (throwable) {
                is BlanketException -> call.respond(throwable.message, HttpStatusCode.InternalServerError)
                is DatabaseException -> call.respond(throwable.message, HttpStatusCode.InternalServerError)
                is BadRequestException -> {
                    call.respond("Failed to parse request body", HttpStatusCode.BadRequest)
                }
                else -> {
                    call.respond("Unknown error", HttpStatusCode.InternalServerError)
                }
            }
        }
    }
}