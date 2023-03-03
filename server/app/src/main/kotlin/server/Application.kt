package server

import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseToken
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.coroutines.runBlocking
import server.auth.FIREBASE_AUTH
import server.auth.UserPrincipal
import server.auth.firebase
import server.db.DatabaseFactory
import server.db.models.users
import server.libgen.LibgenBook
import server.libgen.LibgenWebScraper
import server.plugins.configureRouting
import server.plugins.configureSerialization
import sun.security.util.KeyUtil.validate
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
    DatabaseFactory.init()
    install(Authentication) {
        firebase {
            validate {token: FirebaseToken ->
                val user = users.userWithEmail(token.email)
                UserPrincipal(token.uid, user)
            }
        }
    }
    install(CORS) {
        // Very permissive CORS.
        anyHost()
        allowHeader("Content-Type")
    }
    configureRouting()
    configureSerialization()
}

