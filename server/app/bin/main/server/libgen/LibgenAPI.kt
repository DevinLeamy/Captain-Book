package server.libgen

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.engine.cio.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.util.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File
import java.util.*

data class Mirror(
    val hostUrl: String = "http://libgen.is/",
    val searchUrl: String = "https://libgen.is/search.php",
    val syncUrl: String = "http://libgen.is/json.php",
    /// Url with "{cover-url}" in place of a cover url.
    val coverUrlPattern: String = "http://libgen.is/covers/{cover-url}",
//    val downloadPattern: String = "http://library.lol/main/{md5}"
    val downloadPattern: String = "https://libgen.rocks/ads.php?md5={md5}"
)

@Serializable
data class BookFile(
    // Extension (epub, MOBI, pdf, etc..)
    val extension: String,
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
    private val REGEX_LOL_DOWNLOAD = Regex("http://62\\.182\\.86\\.140/main/[0-9]+/\\w{32}/.+?(gz|pdf|rar|djvu|epub|chm)")

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

    /**
     * Fetch the book with the given md5.
     */
    @OptIn(InternalAPI::class)
    suspend fun downloadBookByMd5(md5: String, fileName: String): Optional<File> {
        val bookFile = File(fileName)

        val downloadPageUrl = mirror.downloadPattern.replace("{md5}", md5)
        val response = client.request(downloadPageUrl) {
            method = HttpMethod.Get
        }
        val downloadPageContent = response.bodyAsText()
        println(downloadPageContent)
        val downloadUrl = REGEX_LOL_DOWNLOAD.find(downloadPageContent)?.value ?: return Optional.empty()
        val bookResponse = client.request(downloadUrl) {
            method = HttpMethod.Get
        }

        // Write the contents into the book file.
        bookResponse.content.copyAndClose(bookFile.writeChannel())

        return Optional.of(bookFile)
    }

    private suspend fun parseBookHash(hash: String): Optional<List<LibgenBook>> {
        val query = QueryBuilder(mirror.syncUrl)
            .with("ids", hash)
            .with("fields", JSON_QUERY)
            .build()
        val response = client.request(query) {
            method = HttpMethod.Get
        }

        if (!response.status.isSuccess()) {
            return Optional.empty()
        }

        val jsonContent = response.bodyAsText()
        val books = Json.decodeFromString<List<LibgenBook>>(jsonContent)
        books.forEach { book ->
            book.coverurl = mirror.coverUrlPattern.replace("{cover-url}", book.coverurl)
        }

        return Optional.of(books)
    }
}