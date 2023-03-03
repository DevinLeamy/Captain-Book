package server.plugins

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import server.auth.FIREBASE_AUTH
import server.auth.UserPrincipal
import server.routes.kindleRouting
import server.routes.libgenRouting
import server.routes.libraryRouting

fun Application.configureRouting() {
    routing {
        libgenRouting()
        kindleRouting()
        libraryRouting()
        // Created test authentication route.
        testAuthentication()
    }
}

fun Route.testAuthentication() {
    authenticate(FIREBASE_AUTH) {
        route("/private") {
            get("/test") {
                val principal = call.principal<UserPrincipal>()
                println("[ROUTING] Authenticated")
                call.respondText("Hello, ${principal?.token}")

            }
        }

    }
}