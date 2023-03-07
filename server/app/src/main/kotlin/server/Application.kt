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
import server.libgen.LibgenBook
import server.plugins.configureRouting
import server.plugins.configureSerialization
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
    runBlocking {
        val coverurl = "https://libgen.is//fictioncovers/2327000/086cff2fb6592870fe54a8053a1aa08d-g.jpg"
        val imageFile = downloadImageByUrl(coverurl)
        val s3Key = S3.putImage(imageFile)
        println("Key: $s3Key")
        val url = S3.generatePresignedUrl(s3Key)
        println("Url: $url")
    }
    return io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    // Initialize Firebase Admin SDK.
    FirebaseAdmin.init()
    // Initialize database.
    DatabaseFactory.init()
    // Very permissive CORS.
    install(CORS) {
        anyHost()
        allowHeader("Content-Type")
        allowHeader("Authorization")
    }
    install(Authentication) {
        firebase {
            validate {token: FirebaseToken ->
                val user = users.userWithEmail(token.email) ?: users.addUser(token.email, kindleEmail = null)
                if (user == null) {
                    println("[APPLICATION] Failed to create new user.")
                    return@validate null
                }
                UserPrincipal(token.uid, user)
            }
        }
    }

    // Create routes.
    configureRouting()
    configureSerialization()
}

