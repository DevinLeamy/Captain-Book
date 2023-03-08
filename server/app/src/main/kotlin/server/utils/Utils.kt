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

val extensionToMimeType = mapOf(
    "aac" to "audio/aac",
    "abw" to "application/x-abiword",
    "arc" to "application/x-freearc",
    "avif" to "image/avif",
    "avi" to "video/x-msvideo",
    "azw" to "application/vnd.amazon.ebook",
    "bin" to "application/octet-stream",
    "bmp" to "image/bmp",
    "bz" to "application/x-bzip",
    "bz2" to "application/x-bzip2",
    "cda" to "application/x-cdf",
    "csh" to "application/x-csh",
    "css" to "text/css",
    "csv" to "text/csv",
    "doc" to "application/msword",
    "docx" to "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "eot" to "application/vnd.ms-fontobject",
    "epub" to "application/epub+zip",
    "gz" to "application/gzip",
    "gif" to "image/gif",
    "htm" to "text/html",
    "html" to "text/html",
    "ico" to "image/vnd.microsoft.icon",
    "ics" to "text/calendar",
    "jar" to "application/java-archive",
    "jpeg" to "image/jpeg",
    "jpg" to "image/jpeg",
    "js" to "text/javascript",
    "json" to "application/json",
    "jsonld" to "application/ld+json",
    "mid" to "audio/midi, audio/x-midi",
    "midi" to "audio/midi, audio/x-midi",
    "mjs" to "text/javascript",
    "mp3" to "audio/mpeg",
    "mp4" to "video/mp4",
    "mpeg" to "video/mpeg",
    "mpkg" to "application/vnd.apple.installer+xml",
    "odp" to "application/vnd.oasis.opendocument.presentation",
    "ods" to "application/vnd.oasis.opendocument.spreadsheet",
    "odt" to "application/vnd.oasis.opendocument.text",
    "oga" to "audio/ogg",
    "ogv" to "video/ogg",
    "ogx" to "application/ogg",
    "opus" to "audio/opus",
    "otf" to "font/otf",
    "png" to "image/png",
    "pdf" to "application/pdf",
    "php" to "application/x-httpd-php",
    "ppt" to "application/vnd.ms-powerpoint",
    "rar" to "application/vnd.rar",
    "rtf" to "application/rtf",
    "sh" to "application/x-sh",
    "svg" to "image/svg+xml",
    "tar" to "application/x-tar",
    "tif" to "image/tiff",
    "tiff" to "image/tiff",
    "ts" to "video/mp2t",
    "ttf" to "font/ttf",
    "txt" to "text/plain",
    "vsd" to "application/vnd.visio",
    "wav" to "audio/wav",
    "weba" to "audio/webm",
    "webm" to "video/webm",
    "webp" to "image/webp",
    "woff" to "font/woff",
    "woff2" to "font/woff2",
    "xhtml" to "application/xhtml+xml",
    "xls" to "application/vnd.ms-excel",
    "xul" to "application/vnd.mozilla.xul+xml",
    "zip" to "application/zip",
    "7z" to "application/x-7z-compressed",
)