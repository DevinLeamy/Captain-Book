package server.plugins

import io.ktor.server.application.*
import io.ktor.server.routing.*
import server.routes.kindleRouting
import server.routes.libgenRouting

fun Application.configureRouting() {
    routing {
        libgenRouting()
        kindleRouting()
    }
}