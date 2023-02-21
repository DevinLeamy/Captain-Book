package server

import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import server.plugins.configureRouting
import server.plugins.configureSerialization

class App {
    val greeting: String
        get() {
            return "Hello World!"
        }
}

fun main(args: Array<String>) {
    return io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    install(CORS) {
        // Very permissive CORS.
        anyHost()
    }
    configureRouting()
    configureSerialization()
}

