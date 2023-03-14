package server.utils

import kotlinx.serialization.Serializable

class BlanketException(override val message: String) : Throwable()
class DatabaseException(override val message: String) : Throwable()

/**
 * General JSON response type for requests that failed.
 */
@Serializable
data class ExceptionResponse(val message: String, val statusCode: Int)