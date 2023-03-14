package server.plugins

import io.ktor.server.application.*
import server.firebase.FirebaseAdmin

fun Application.configureFirebase() {
    // Initialize Firebase Admin SDK.
    FirebaseAdmin.init()
}