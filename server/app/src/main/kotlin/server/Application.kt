package server

import com.google.firebase.auth.FirebaseToken
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.coroutines.runBlocking
import server.auth.UserPrincipal
import server.auth.firebase
import server.db.DatabaseFactory
import server.db.S3
import server.db.models.users
import server.firebase.FirebaseAdmin
import server.firebase.plugins.*
import server.libgen.LibgenBook
import server.utils.downloadImageByUrl
import java.io.File

class App

// Temporary storage (before setting up a database)
class Store(
    val bookMetadata: MutableMap<String, LibgenBook> = mutableMapOf(),
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

