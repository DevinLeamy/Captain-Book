package server.libgen

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.engine.cio.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.util.*

data class Mirror(
    val hostUrl: String = "http://libgen.is/",
    val searchUrl: String = "https://libgen.is/search.php",
    val syncUrl: String = "http://libgen.is/json.php",
    /// Url with "{cover-url}" in place of a cover url.
    val coverUrlPattern: String = "http://libgen.is/covers/{cover-url}"
)

@Serializable
data class LibgenBook(
    val id: String,
    val title: String,
    val author: String,
    val filesize: String,
    val year: String,
    val language: String,
    val pages: String,
    val publisher: String,
    val edition: String,
    val extension: String,
    val md5: String,
    var coverurl: String,
)

class QueryBuilder(private var baseUrl: String) {
    private var isFirstParameter: Boolean = true
    fun with(key: String, value: String): QueryBuilder {
        baseUrl += if (isFirstParameter) {
            isFirstParameter = false
            "?"
        } else {
            "&"
        }
        baseUrl += "$key=$value"

        return this
    }

    fun build(): String {
        return baseUrl
    }
}
class LibgenAPI {
    private val HASH_REGEX =  Regex("[A-Z0-9]{32}")
    private val JSON_QUERY = "id,title,author,filesize,extension,md5,year,language,pages,publisher,edition,coverurl"

    private val client = HttpClient(CIO)
    private val mirror = Mirror()

    // Temp
    suspend fun requestBooksWithTitle(title: String): List<LibgenBook> {
        val query = QueryBuilder(mirror.searchUrl)
            .with("req", title)
            .with("lg_topic", "libgen")
            .with("res", "25")
            .with("open", "0")
            .with("view", "simple")
            .with("phrase", "1")
            .with("column", "title")
            .build()
        val response: HttpResponse = client.request(query) {
            method = HttpMethod.Get
        }
        val contents = response.bodyAsText()
        val hashes = HASH_REGEX.findAll(contents).map { it.value }.toSet().toList()

        val books: List<LibgenBook> = hashes
            .map { hash -> parseBookHash(hash) }
            .filter { it.isPresent }
            .flatMap { it.get() }
            .toList()

        return books
    }

    private suspend fun parseBookHash(hash: String): Optional<List<LibgenBook>> {
        val query = QueryBuilder(mirror.syncUrl)
            .with("ids", hash)
            .with("fields", JSON_QUERY)
            .build()
        val response = client.request(query) {
            method = HttpMethod.Get
        }
//        if (response.status != HttpStatusCode.Accepted) {
//            return Optional.empty()
//        }

        val jsonContent = response.bodyAsText()
        val books = Json.decodeFromString<List<LibgenBook>>(jsonContent)
        books.forEach { book ->
            book.coverurl = mirror.coverUrlPattern.replace("{cover-url}", book.coverurl)
        }

        return Optional.of(books)
    }
}