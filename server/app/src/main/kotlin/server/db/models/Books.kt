package server.db.models

import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.CurrentDate
import org.jetbrains.exposed.sql.javatime.date
import server.db.DatabaseFactory.dbQuery
import server.db.S3
import server.libgen.BookCategory
import server.libgen.LibgenBook
import java.time.LocalDate

@Serializable
data class Book(
    val id: Int,
    val title: String,
    val author: String,
    val filesize: String,
    val year: String,
    val language: String,
    val pages: String,
    val publisher: String,
    val edition: String,
    val extension: String,
    var coverurl: String,
    val bookFileUrl: String,
    @Serializable(with = server.utils.LocalDateSerializer::class)
    val dateAdded: LocalDate,
    val category: BookCategory = BookCategory.NON_FICTION,
    var sentToKindle: Boolean = false,
    var completed: Boolean = false,
)

object BooksTable : IntIdTable() {
    val sentToKindle = bool("send_to_kindle")
    val completed = bool("completed")
    val title = varchar("title", 2000)
    val author = varchar("author", 1000)
    val coverImageKey = varchar("cover_image_key", 200)
    val bookFileKey = varchar("book_file_key", 200)
    val userId = reference("user_id", UsersTable)
    val filesize = varchar("filesize", 100)
    val year = varchar("year", 14)
    val language = varchar("language", 150)
    val pages = varchar("pages", 100)
    val publisher = varchar("publisher", 400)
    val edition = varchar("edition", 60)
    val extension = varchar("extension", 50)
    var category = varchar("category", 100)
    var dateAdded = date("date_added").defaultExpression(CurrentDate)
}

val books = Books()

class Books {
    /**
     * Create a book.
     */
    suspend fun addBook(userId: Int, libgenBook: LibgenBook, coverImageKey: String, bookFileKey: String, sentToKindle: Boolean): Result<Int> = dbQuery {
        val insertBookStatement = BooksTable.insert {
            it[BooksTable.userId] = userId
            it[BooksTable.coverImageKey] = coverImageKey
            it[BooksTable.bookFileKey] = bookFileKey
            it[BooksTable.sentToKindle] = sentToKindle
            it[title] = libgenBook.title
            it[author] = libgenBook.author
            it[filesize] = libgenBook.filesize
            it[year] = libgenBook.year
            it[language] = libgenBook.language
            it[pages] = libgenBook.pages
            it[publisher] = libgenBook.publisher
            it[edition] = libgenBook.edition
            it[extension] = libgenBook.extension
            it[category] = libgenBook.category.toString()
            it[completed] = false
        }
        insertBookStatement.resultedValues?.let {
            return@dbQuery Result.success(it[0][BooksTable.id].value)
        }
        return@dbQuery Result.failure(Exception("Failed to insert book"))
    }
    /**
     * Fetch a book by id.
     */
    suspend fun bookWithId(id: Int): Book? = dbQuery {
        BooksTable
            .select { BooksTable.id eq id }
            .map { resultRowToBook(it) }.singleOrNull()
    }

    /**
     * Fetch books by user id.
     */
    suspend fun booksWithUserId(userId: Int): List<Book> = dbQuery {
        BooksTable
            .select { BooksTable.userId eq userId }
            .map { resultRowToBook(it) }.toList()
    }

    /**
     * Convert a ResultRow to a Book.
     */
    private suspend fun resultRowToBook(row: ResultRow): Book {
        return Book(
            id = row[BooksTable.id].value,
            title = row[BooksTable.title],
            author = row[BooksTable.author],
            filesize = row[BooksTable.filesize],
            year = row[BooksTable.year],
            language = row[BooksTable.language],
            pages = row[BooksTable.pages],
            publisher = row[BooksTable.publisher],
            edition = row[BooksTable.edition],
            extension = row[BooksTable.extension],
            // Fetch a pre-signed (secure) urls, from S3.
            coverurl = S3.generatePresignedUrl(row[BooksTable.coverImageKey]),
            bookFileUrl = S3.generatePresignedUrl(row[BooksTable.bookFileKey]),
            category = if (row[BooksTable.category] == BookCategory.NON_FICTION.toString()) BookCategory.NON_FICTION
                       else BookCategory.FICTION,
            sentToKindle = row[BooksTable.sentToKindle],
            completed = row[BooksTable.completed],
            dateAdded = row[BooksTable.dateAdded]
        )
    }

    /**
     * Fetch the S3 book file key, for a given book.
     *
     * There is an explicit function for this because "resultRowToBook"
     * converts these keys into a presigned url, so they aren't accessible.
     */
    suspend fun getBookFileKey(bookId: Int): String? = dbQuery {
        BooksTable
            .select { BooksTable.id eq bookId }
            .map { resultRow -> resultRow[BooksTable.bookFileKey] }
            .firstOrNull()
    }

    /**
     * Update a given book.
     *
     * Note: Does not update all fields.
     */
    suspend fun updateBook(book: Book) = dbQuery {
        BooksTable.update ({ BooksTable.id eq book.id  }) {
            // TODO: Copy the book information into the table row.
            it[title] = book.title
            it[author] = book.author
            it[completed] = book.completed
            it[sentToKindle] = book.sentToKindle
        }
    }

    /**
     * Update sent to kindle status.
     */
    suspend fun updateSentToKindle(book: Book, sentToKindle: Boolean): Int {
        book.sentToKindle = sentToKindle
        return updateBook(book)
    }

    /**
     * Update book read status.
     */
    suspend fun updateCompleted(book: Book, completed: Boolean): Int {
        book.completed = completed
        return updateBook(book)
    }

    /**
     * Fetch all books.
     */
    private suspend fun allBooks(): List<Book> = dbQuery {
        BooksTable.selectAll().map {
            runBlocking { resultRowToBook(it) }
        }
    }
}