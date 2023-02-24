package server.libgen

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.util.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import server.QueryBuilder
import java.io.File
import java.util.*
import kotlin.jvm.optionals.getOrNull

data class Mirror(
    val hostUrl: String = "http://libgen.is/",
    val searchUrl: String = "https://libgen.is/search.php",
    val syncUrl: String = "http://libgen.is/json.php",
    /// Url with "{cover-url}" in place of a cover url.
    val coverUrlPattern: String = "http://libgen.is/covers/{cover-url}",
    val downloadPattern: String = "http://library.lol/main/{md5}"
)

private val downloadPatterns: List<String> = listOf(
    "http://library.lol/fiction/{md5}",
    "http://library.lol/main/{md5}",
    "https://libgen.me/book/{md5}",
    "http://libgen.lc/get.php?md5={md5}",
    "https://libgen.rocks/ads.php?md5={md5}",
)



class LibgenAPI {
    private val HASH_REGEX =  Regex("[A-Z0-9]{32}")
    private val JSON_QUERY = "id,title,author,filesize,extension,md5,year,language,pages,publisher,edition,coverurl"
    private val REGEX_LOL_DOWNLOAD = Regex("http://62\\.182\\.86\\.140/main/[0-9]+/\\w{32}/.+?(gz|pdf|rar|djvu|epub|chm)")
    private val REGEX_HREF = Regex("href=\"http.+\"")

    private val client = HttpClient(CIO) {
        install(HttpTimeout)
    }
    private val mirror = Mirror()

    suspend fun search(search: LibgenSearch): List<LibgenBook> {
        val queryUrl = QueryBuilder(mirror.searchUrl)
            .with("req", search.query.text)
            .with("lg_topic", "libgen")
            .with("res", "25")
            .with("open", "0")
            .with("view", "simple")
            .with("phrase", "1")
            .with("column", search.query.type.toString())
            .build()
        val response: HttpResponse = client.request(queryUrl) {
            method = HttpMethod.Get
        }
        val contents = response.bodyAsText()
        val hashes = HASH_REGEX.findAll(contents).map { it.value }.toSet().toList()

        val books: List<LibgenBook> = hashes
            .map { hash -> parseBookHash(hash) }
            .filter { it.isPresent }
            .flatMap { it.get() }
            .filter { search.filter.passes(it)}
            .toList()

        return books
    }

    /**
     * Fetch the book with the given md5.
     */
    @OptIn(InternalAPI::class)
    suspend fun downloadBookByMd5(md5: String, fileName: String): Optional<File> {
        val bookFile = File(fileName)
        val downloadUrl = fetchDownloadUrl(md5).getOrNull() ?: return Optional.empty()
        val response = client.request(downloadUrl) {
            method = HttpMethod.Get
            timeout {
                requestTimeoutMillis = 90000
            }
        }

        if (!response.status.isSuccess()) {
            return Optional.empty()
        }

        // Write the contents into the book file.
        response.content.copyAndClose(bookFile.writeChannel())

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

    private suspend fun fetchDownloadUrl(md5: String): Optional<String> {
        for (downloadPattern in downloadPatterns) {
            val downloadPageUrl = downloadPattern.replace("{md5}", md5)
            val response = client.request(downloadPageUrl) {
                method = HttpMethod.Get
            }

            if (!response.status.isSuccess()) {
                continue
            }
            val downloadPageContent = response.bodyAsText()
            val downloadUrlRaw = REGEX_HREF.find(downloadPageContent)?.value ?: continue
            val downloadUrl = downloadUrlRaw.substring(6, downloadUrlRaw.length - 1)

            println("Download URL: $downloadUrl")
            return Optional.of(downloadUrl)
        }

        return Optional.empty()
    }
}