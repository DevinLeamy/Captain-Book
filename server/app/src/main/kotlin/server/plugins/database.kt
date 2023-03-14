package server.plugins

import io.ktor.server.application.*
import server.db.DatabaseFactory

fun Application.configureDatabase() {
    // Initialize database including creating tables, as required.
    DatabaseFactory.init()
}