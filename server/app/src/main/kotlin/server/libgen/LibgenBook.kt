package server.libgen

import kotlinx.serialization.Serializable
import java.util.*

@Serializable
data class LibgenBook(
    // NOTE: This Id is different from the one used to index books in the database.
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
    // Note: This field is not part of the official libgen book model. It specifies
    //       which database the books is from ("fiction" or "non-fiction")
    val category: BookCategory = BookCategory.NON_FICTION
)

/**
 * Incomplete libgen book record. Used for convenience when web
 * scraping.
 */
data class LibgenIncompleteBook(
    var id: Optional<String> = Optional.empty(),
    var title: Optional<String> = Optional.empty(),
    var author: Optional<String> = Optional.empty(),
    var filesize: Optional<String> = Optional.empty(),
    var year: Optional<String> = Optional.empty(),
    var language: Optional<String> = Optional.empty(),
    var pages: Optional<String> = Optional.empty(),
    var publisher: Optional<String> = Optional.empty(),
    var edition: Optional<String> = Optional.empty(),
    var extension: Optional<String> = Optional.empty(),
    var md5: Optional<String> = Optional.empty(),
    var coverurl: Optional<String> = Optional.empty(),
    var category: BookCategory = BookCategory.NON_FICTION
)