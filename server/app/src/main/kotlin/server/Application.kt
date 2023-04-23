package server

import io.ktor.server.application.*
import server.firebase.plugins.*
import java.io.File

class App

// Temporary storage (before setting up a database)
class Store(
    val downloadedBooks: MutableMap<String, File> = mutableMapOf()
)

val store = Store()

fun main(args: Array<String>) {
    return io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureFirebase()
    configureDatabase()
    configureCORS()
    configureAuthentication()
    configureRouting()
    configureSerialization()
    configureExceptions()
}

