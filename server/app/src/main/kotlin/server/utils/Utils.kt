package server.utils

import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import java.util.*

suspend fun <T, R> sendAsyncRequests(requests: List<T>, map: suspend (T) -> R): List<R> = coroutineScope {
    val deferred = requests.map { async { map(it) } }.toList()
    return@coroutineScope deferred.map { it.await() }.toList()
}
