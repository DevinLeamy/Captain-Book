package server.auth

import com.google.firebase.auth.*
import io.ktor.http.auth.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import server.db.models.User

/**
 * Contains the information of the authenticated user.
 */
data class UserPrincipal(val token: String, val user: User?): Principal

const val FIREBASE_AUTH = "firebase"
const val FirebaseJWTAuthKey: String = "FirebaseAuth"

/**
 * FirebaseAuthProvider configuration.
 */
class FirebaseConfig(name: String?): AuthenticationProvider.Config(name) {
    fun fetchAuthHeaderOrNull(call: ApplicationCall): HttpAuthHeader? {
        return try {
            call.request.parseAuthorizationHeader()
        } catch (e: IllegalArgumentException) {
            println("[FIREBASE AUTH] Failed to parse token.")
            null
        }
    }

    var firebaseVerifier: AuthenticationFunction<FirebaseToken> = {
        throw NotImplementedError("Firebase verifier not implemented")
    }
    fun validate(validate: suspend ApplicationCall.(FirebaseToken) -> UserPrincipal?) {
        firebaseVerifier = validate
    }
}

/**
 * Firebase authentication provider.
 */
class FirebaseAuthProvider(config: FirebaseConfig): AuthenticationProvider(config) {
    val fetchAuthHeaderOrNull = config::fetchAuthHeaderOrNull
    private val validate: AuthenticationFunction<FirebaseToken> = config.firebaseVerifier

    private suspend fun handleUnauthenticated(context: AuthenticationContext) {
        context.challenge(FirebaseJWTAuthKey, AuthenticationFailedCause.InvalidCredentials) { challengeFunc, call ->
            challengeFunc.complete()
            call.respond(UnauthorizedResponse(HttpAuthHeader.bearerAuthChallenge(scheme = "Bearer", realm = FIREBASE_AUTH)))
        }
    }
    override suspend fun onAuthenticate(context: AuthenticationContext) {
        val token = fetchAuthHeaderOrNull(context.call)
        println("TOKEN: $token")

        if (token == null) {
            handleUnauthenticated(context)
            return
        }

        val principal = handleAuthenticationRequest(context.call, token, validate) ?: return
        /**
         * Set the authentication principal for the conext.
         */
        context.principal(principal)
    }

    private suspend fun handleAuthenticationRequest(
        call: ApplicationCall,
        authHeader: HttpAuthHeader,
        validator: AuthenticationFunction<FirebaseToken>
    ): Principal? {
        if (authHeader.authScheme != "Bearer" || authHeader !is HttpAuthHeader.Single) {
            return null
        }
        val token = withContext(Dispatchers.IO) {
            FirebaseAuth.getInstance().verifyIdToken(authHeader.blob)
        } ?: return null

        return validator(call, token)
    }
}

/**
 * Extension function to provide the FirebaseAuthProvider.
 */
fun AuthenticationConfig.firebase(name: String? = FIREBASE_AUTH, configure: FirebaseConfig.() -> Unit) {
    val provider = FirebaseAuthProvider(FirebaseConfig(name).apply(configure))
    register(provider)
}