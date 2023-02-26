package server.libgen

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.utils.io.*
import io.ktor.utils.io.core.*
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import server.QueryBuilder
import server.store
import java.io.File
import java.util.*
import kotlin.jvm.optionals.getOrNull

data class Mirror(
    val hostUrl: String = "http://libgen.is/",
    val nonFictionSearch: String = "https://libgen.is/search.php",
    val fictionSearch: String = "https://libgen.is/fiction/",
    val syncUrl: String = "http://libgen.is/json.php",
    /// Url with "{cover-url}" in place of a cover url.
    val coverUrlPattern: String = "http://libgen.is/covers/{cover-url}",
    val downloadPattern: String = "http://library.lol/main/{md5}"
)

private val downloadPatterns: Map<BookCategory, List<String>> = mapOf(
    // Fiction database.
    BookCategory.FICTION to listOf(
        "http://library.lol/fiction/{md5}",
    ),
    // Non-fiction database.
    BookCategory.NON_FICTION to listOf(
        "http://library.lol/main/{md5}",
        "https://libgen.me/book/{md5}",
        "http://libgen.lc/get.php?md5={md5}",
        "https://libgen.rocks/ads.php?md5={md5}",
    )
)

class LibgenAPI {
    private val HASH_REGEX =  Regex("[A-Z0-9]{32}")
    private val JSON_QUERY = "id,title,author,filesize,extension,md5,year,language,pages,publisher,edition,coverurl"
    private val REGEX_HREF = Regex("href=\"http.+\"")
    private val client = HttpClient(CIO) { install(HttpTimeout) }
    private val webScraper = LibgenWebScraper()
    private val mirror = Mirror()

    /**
     * Basically, libgen has a json API for it's non-fiction books but it doesn't have one, or at least no one that's easily
     * accessible, for it's non-fiction books.
     */
    private fun buildQueryUrl(search: LibgenSearch): Optional<String> {
        return when (search.query.category) {
            BookCategory.NON_FICTION -> {
                Optional.of(
                    QueryBuilder(mirror.nonFictionSearch)
                        .with("req", search.query.text)
                        .with("lg_topic", "libgen")
                        .with("res", "25")
                        .with("open", "0")
                        .with("view", "simple")
                        .with("phrase", "1")
                        .with("column", search.query.type.toString())
                        .build()
                )
            }
            BookCategory.FICTION -> {
                Optional.of(
                    QueryBuilder(mirror.fictionSearch)
                        .with("q", search.query.text)
                        .with("language", "English")
                        .with("criteria", search.query.type.toString())
                        .build()
                )
            }
            else -> Optional.empty()
        }
    }

    suspend fun search(search: LibgenSearch): List<LibgenBook> {
        val queryUrl = buildQueryUrl(search).getOrNull() ?: return listOf()
        return if (search.query.category == BookCategory.FICTION) {
            // Use the web scraper.
            webScraper
                .scrapeSearchResults(queryUrl)
                .filter { search.filter.passes(it) }
                .toList()
        } else {
            // Use the JSON api.
            val response: HttpResponse = client.request(queryUrl) {
                method = HttpMethod.Get
            }
            val contents = response.bodyAsText()
            val hashes = HASH_REGEX.findAll(contents).map { it.value }.toSet().toList()

            hashes
                .map { hash -> parseBookHash(hash) }
                .filter { it.isPresent }
                .flatMap { it.get() }
                .filter { search.filter.passes(it)}
                .toList()
        }
    }

    /**
     * Fetch the book with the given md5.
     */
    suspend fun download(book: LibgenBook): Optional<File> {
        val downloadUrl = fetchDownloadUrl(book).getOrNull() ?: return Optional.empty()
        val tempFile = downloadFile(downloadUrl).getOrNull() ?: return Optional.empty()
        val bookFile = File.createTempFile(book.title, ".${book.extension.lowercase()}")
        tempFile.renameTo(bookFile)

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

    private suspend fun fetchDownloadUrl(book: LibgenBook): Optional<String> {
        for (downloadPattern in downloadPatterns[book.category]!!) {
            val downloadPageUrl = downloadPattern.replace("{md5}", book.md5)
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

    private suspend fun downloadFile(fileUrl: String): Optional<File> {
        val file = File.createTempFile("file", ".tmp")
        var failed = false
        client.prepareGet(fileUrl) {
            timeout {
                requestTimeoutMillis = 120000
            }
        }.execute { response ->
            if (!response.status.isSuccess()) {
                failed = true
                return@execute
            }
            val channel: ByteReadChannel = response.body()
            while (!channel.isClosedForRead) {
                val packet = channel.readRemaining(limit = DEFAULT_BUFFER_SIZE.toLong())
                while (!packet.isEmpty) {
                    file.appendBytes(packet.readBytes())
                }

                println("Read ${file.length() / 1000}Kb of ${response.contentLength()!! / 1000}Kb")
            }
        }
        if (failed) {
            return Optional.empty()
        }
        return Optional.of(file)
    }
}