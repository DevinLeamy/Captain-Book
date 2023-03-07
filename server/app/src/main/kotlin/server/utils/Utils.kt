package server.utils

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import java.io.File

suspend fun <T, R> sendAsyncRequests(requests: List<T>, map: suspend (T) -> R): List<R> = coroutineScope {
    val deferred = requests.map { async { map(it) } }.toList()
    return@coroutineScope deferred.map { it.await() }.toList()
}

/**
 * Downloads the image with the given url and stores it
 * in the returned file.
 *
 * TODO: Error handling
 */
suspend fun downloadImageByUrl(url: String): File {
    val client = HttpClient()
    val url = Url(url)

    val imageFullName = url.pathSegments.last()
    val name = imageFullName.split('.')[0]
    val extension = imageFullName.split(".")[1]
    val file = File.createTempFile(name, ".$extension")
    val response = client.request(url)
    response.bodyAsChannel().copyAndClose(file.writeChannel())

    return file
}