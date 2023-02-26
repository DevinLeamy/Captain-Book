package server

import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.coroutines.runBlocking
import server.libgen.LibgenBook
import server.libgen.LibgenWebScraper
import server.plugins.configureRouting
import server.plugins.configureSerialization
import java.io.File

class App

// Temporary storage (before setting up a database)
class Store(
    val bookMetadata: MutableMap<String, LibgenBook> = mutableMapOf(),
    val downloadedBooks: MutableMap<String, File> = mutableMapOf()
)

val store = Store()

fun main(args: Array<String>) {
    val scraper = LibgenWebScraper()
    runBlocking {
        val books =scraper.scrapeSearchResults("https://libgen.is/fiction/?q=Fellowship+of+the+Ring&criteria=&language=&format=")

        for (book in books) {
            println(book)
        }
    }
//    return io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    install(CORS) {
        // Very permissive CORS.
        anyHost()
    }
    configureRouting()
    configureSerialization()
}

