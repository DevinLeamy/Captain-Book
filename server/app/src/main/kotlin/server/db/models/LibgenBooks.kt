package server.db.models

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import server.db.DatabaseFactory.dbQuery
import server.libgen.BookCategory
import server.libgen.LibgenBook
import java.util.*

object LibgenBooksTable: IntIdTable() {
    // TODO: Libgen stores this as: "int(15)"
    val title = varchar("title", 2000)
    val author = varchar("author", 1000)
    // TODO: Libgen stores this as: "bigint(20) unsigned"
    val filesize = varchar("filesize", 100)
    val year = varchar("year", 14)
    val language = varchar("language", 150)
    val pages = varchar("pages", 100)
    val publisher = varchar("publisher", 400)
    val edition = varchar("edition", 60)
    val extension = varchar("extension", 50)
    val md5 = char("md5", 32)
    var coverurl = varchar("coverurl", 200)
    // NOT INCLUDED IN THE LIBGEN BOOK MODEL
    // TODO: Use an enum type of some kind.
    // https://github.com/JetBrains/Exposed/wiki/DataTypes
    var category = varchar("category", 100)
}

val libgenBooks = LibgenBooks()

class LibgenBooks {
    /**
     * Fetch a book by id.
     */
    suspend fun bookWithId(id: Int): LibgenBook? = dbQuery {
        LibgenBooksTable
            .select { LibgenBooksTable.id eq id }
            .map(::resultRowToLibgenBook).singleOrNull()
    }

    /**
     * Store a book in the database. Return the id of
     * the new entry.
     */
    suspend fun addBook(book: LibgenBook): Result<Int> = dbQuery {
        val insertBookStatement = LibgenBooksTable.insert {
            it[title] = book.title
            it[author] = book.author
            it[filesize] = book.filesize
            it[year] = book.year
            it[language] = book.language
            it[pages] = book.pages
            it[publisher] = book.publisher
            it[edition] = book.edition
            it[extension] = book.extension
            it[md5] = book.md5
            it[coverurl] = book.coverurl
            it[category] = book.category.toString()
        }
        insertBookStatement.resultedValues?.let {
            return@dbQuery Result.success(it[0][LibgenBooksTable.id].value)
        }
        return@dbQuery Result.failure(Exception("Failed to insert book"))
    }

    /**
     * Convert a result row to a LibgenBook.
     */
    private fun resultRowToLibgenBook(row: ResultRow) = LibgenBook(
        id = row[LibgenBooksTable.id].toString(),
        title = row[LibgenBooksTable.title],
        author = row[LibgenBooksTable.author],
        filesize = row[LibgenBooksTable.filesize],
        year = row[LibgenBooksTable.year],
        language = row[LibgenBooksTable.language],
        pages = row[LibgenBooksTable.pages],
        publisher = row[LibgenBooksTable.publisher],
        edition = row[LibgenBooksTable.edition],
        extension = row[LibgenBooksTable.extension],
        md5 = row[LibgenBooksTable.md5],
        coverurl = row[LibgenBooksTable.coverurl],
        category = if (row[LibgenBooksTable.category] == BookCategory.NON_FICTION.toString()) BookCategory.NON_FICTION
                   else BookCategory.FICTION
)
    /**
     * Fetch all books.
     */
    suspend fun allBooks(): List<LibgenBook> = dbQuery {
        LibgenBooksTable.selectAll().map(::resultRowToLibgenBook)
    }
}