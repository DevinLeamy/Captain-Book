package server.libgen

import kotlinx.serialization.Serializable
import java.util.*


@Serializable
/**
 * Describes a libgen search. A request is sent with the given
 * query and the results are filtered accordingly.
 */
data class LibgenSearch(
    val query: LibgenQuery,
    val filter: LibgenBookFilter,
)

/**
 * Different categories of books.
 * E.g. fiction, non-fiction, mystery, biography, etc.
 */
enum class BookCategory {
    FICTION,
    NON_FICTION;

    override fun toString(): String {
        return when (this) {
            FICTION -> "fiction"
            NON_FICTION -> "non-fiction"
        }
    }
}


enum class QueryType {
    TITLE,
    AUTHOR;

    override fun toString(): String {
       return when (this) {
          TITLE -> "title"
          AUTHOR -> "author"
       }
    }
}

@Serializable
data class LibgenQuery(
    val type: QueryType,
    val category: BookCategory,
    val text: String
)

/// TODO: Convert there into allow and disallow lists. Some kind of
///       white list and black list.

@Serializable
/// Filter describes the languages and formats that are permitted.
data class LibgenBookFilter(
    private val languages: List<String>,
    private val formats: List<String>
) {
    fun passes(book: LibgenBook): Boolean {
        return languages.contains(book.language.lowercase(Locale.getDefault())) &&
                formats.contains(book.extension.lowercase(Locale.getDefault()))
    }
}


