package server.routes

import io.ktor.server.routing.*

fun Route.authenticationRouting() {
    route("/auth") {
        post("/login") {

        }
    }
}

