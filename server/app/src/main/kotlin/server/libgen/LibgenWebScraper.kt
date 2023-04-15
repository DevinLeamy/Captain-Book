package server.libgen

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import it.skrape.core.htmlDocument
import it.skrape.selects.DocElement
import it.skrape.selects.html5.*
import server.utils.sendAsyncRequests
import java.util.*
import kotlin.jvm.optionals.getOrDefault
import kotlin.jvm.optionals.getOrNull

class LibgenWebScraper {
    private val client = HttpClient(CIO) {
        install(HttpTimeout)
    }

    private suspend fun fetchHtml(searchUrl: String): Optional<String> {
        val response = client.get(searchUrl)
        if (!response.status.isSuccess()) {
            return Optional.empty()
        }
        return Optional.of(response.bodyAsText())
    }

    /**
     * Fetch the book data from a general search.
     * E.g: https://libgen.is/fiction/?q=Fellowship+of+the+Ring&criteria=&language=&format=
     */
    suspend fun scrapeSearchResults(searchUrl: String): List<LibgenBook> {
        val html = fetchHtml(searchUrl).getOrNull() ?: return emptyList()
        val rawRowContents: MutableList<List<DocElement>> = mutableListOf()

        try {
            htmlDocument(html) {
                tbody {
                    tr {
                        findAll {
                            for (element in this) {
                                element.td {
                                    findAll {
                                        val elements = this
                                        val author = elements[0]
                                        val titleAndLink = elements[2]
                                        val language = elements[3]
                                        val format = elements[4]

                                        rawRowContents.add(listOf(author, titleAndLink, language, format))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e: Throwable) {
            // No results found.
            return emptyList()
        }

        val bookDownloadLinks = mutableListOf<String>()
        for (row in rawRowContents) {
            val titleAndLink = row[1]
            titleAndLink.a {
                findFirst {
                    val a = this
                    if (a.eachHref.isNotEmpty()) {
                        bookDownloadLinks.add(a.eachHref[0])
                    }
                }
            }
        }

        return if (false) {
            // Async (WILL RESULT IN TEMPORARY IP BAN)
            sendAsyncRequests(bookDownloadLinks) { scapeBookPage("https://libgen.is${it}") }
                .filter { it.isPresent }
                .map { it.get() }
        } else {
           // Sync (safe)
           bookDownloadLinks
               .map { scapeBookPage("https://libgen.is${it}") }
               .filter { it.isPresent }
               .map { it.get() }
        }
    }

    /**
     * Scrape the page displaying the book cover, download link, and all the book
     * information.
     *
     * E.g: https://libgen.is/fiction/8A306AEAA2EA92A03ABC2827924584F5
     */
    private suspend fun scapeBookPage(bookPageUrl: String): Optional<LibgenBook> {
        val html = fetchHtml(bookPageUrl).getOrNull() ?: return Optional.empty()
        val document = htmlDocument(html)
        val book = LibgenIncompleteBook()

        // Find the coverurl.
        document.img {
            withAttribute = "alt" to "cover"
            findFirst {
                if (this.eachSrc.isNotEmpty()) {
                    // TODO: The host should be the same as the host url of "bookPageUrl".
                    book.coverurl = Optional.of("https://libgen.is${this.eachSrc[0]}")
                }
            }
        }

        // Find the md5 hash.
        // Note: This assumes the md5 hash is the first one in the list of hashes.
        document.table {
            withClass = "hashes"
            td {
                findFirst {
                    if (this.ownText.isNotEmpty()) {
                        book.md5 = Optional.of(this.ownText)
                    }
                }
            }
        }

        // All other information.
        var rawBookContents: List<DocElement> = emptyList()
        document.table {
            withClass = "record"
            tbody {
                tr {
                    findAll {
                        rawBookContents = this
                    }
                }
            }
        }

        for (element in rawBookContents) {
            var fieldName = ""
            var fieldValue = ""
            element.td {
                findFirst {
                    fieldName = this.ownText
                }
                findSecond {
                    fieldValue = this.ownText
                }
            }
            when (fieldName) {
                "Title:" -> book.title = Optional.of(fieldValue)
                "Author(s):" -> {
                    try {
                        element.a {
                            withAttribute = "title" to "search by author"
                            findFirst {
                                book.author = Optional.of(this.ownText)
                            }
                        }
                    } catch (e: Throwable) {
                        // No listed author.
                    }

                }
                "Language:" -> book.language = Optional.of(fieldValue)
                "Year:" -> book.year = Optional.of(fieldValue)
                "Publisher:" -> book.publisher = Optional.of(fieldValue)
                "Format:" -> book.extension = Optional.of(fieldValue)
                "File size:" -> book.filesize = Optional.of(fieldValue)
                "ID:" -> book.id = Optional.of(fieldValue)
            }
        }

        // Check for the "required" fields.
        if (
            book.title.isEmpty ||
            book.language.isEmpty ||
            book.md5.isEmpty
        ) {
            return Optional.empty()
        }

        return Optional.of(LibgenBook(
            id = book.id.getOrDefault(""),
            title = book.title.getOrDefault(""),
            author = book.author.getOrDefault(""),
            filesize = book.filesize.getOrDefault(""),
            year = book.year.getOrDefault(""),
            language = book.language.getOrDefault(""),
            pages = book.pages.getOrDefault(""),
            publisher = book.publisher.getOrDefault(""),
            edition = book.edition.getOrDefault(""),
            extension = book.extension.getOrDefault(""),
            md5 = book.md5.getOrDefault(""),
            coverurl = book.coverurl.getOrDefault(""),
            category = BookCategory.FICTION
        ))
    }
}