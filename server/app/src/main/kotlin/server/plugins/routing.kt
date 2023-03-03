package server.plugins

import io.ktor.server.application.*
import io.ktor.server.routing.*
import server.routes.authenticationRouting
import server.routes.kindleRouting
import server.routes.libgenRouting
import server.routes.libraryRouting

fun Application.configureRouting() {
    routing {
        libgenRouting()
        kindleRouting()
        libraryRouting()
        authenticationRouting()
    }
}