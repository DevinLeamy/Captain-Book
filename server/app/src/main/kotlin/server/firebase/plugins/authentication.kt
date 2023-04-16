package server.firebase.plugins

import com.google.firebase.auth.FirebaseToken
import io.ktor.server.application.*
import io.ktor.server.auth.*
import server.auth.UserPrincipal
import server.auth.firebase
import server.db.models.users

fun Application.configureAuthentication() {
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
}