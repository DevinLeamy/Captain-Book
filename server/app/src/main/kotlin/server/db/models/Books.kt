package server.db.models

import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import server.db.DatabaseFactory.dbQuery
import server.db.S3
import server.libgen.BookCategory

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
    val category: BookCategory = BookCategory.NON_FICTION,
    var sendToKindle: Boolean = false,
)

object BooksTable : IntIdTable() {
    val sentToKindle = bool("send_to_kindle")
    val coverImageKey = varchar("cover_image_key", 200)
    val bookFileKey = varchar("book_file_key", 200)
    val userId = reference("user_id", UsersTable)
    val libgenBookId = reference("libgen_book_id", LibgenBooksTable)
}

val books = Books()

class Books {
    /**
     * Create a book.
     */
    suspend fun addBook(userId: Int, libgenBookId: Int, coverImageKey: String, bookFileKey: String, sentToKindle: Boolean): Result<Int> = dbQuery {
        val insertBookStatement = BooksTable.insert {
            it[BooksTable.userId] = userId
            it[BooksTable.coverImageKey] = coverImageKey
            it[BooksTable.bookFileKey] = bookFileKey
            it[BooksTable.libgenBookId] = libgenBookId
            it[BooksTable.sentToKindle] = sentToKindle
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
        val libgenBook = libgenBooks.bookWithId(row[BooksTable.libgenBookId].value)!!
        return Book(
            id = row[BooksTable.id].value,
            title = libgenBook.title,
            author = libgenBook.author,
            filesize = libgenBook.filesize,
            year = libgenBook.year,
            language = libgenBook.language,
            pages = libgenBook.pages,
            publisher = libgenBook.publisher,
            edition = libgenBook.edition,
            extension = libgenBook.extension,
            // Fetch a pre-signed (secure) urls, from S3.
            coverurl = S3.generatePresignedUrl(row[BooksTable.coverImageKey]),
            bookFileUrl = S3.generatePresignedUrl(row[BooksTable.bookFileKey]),
            category = libgenBook.category,
            sendToKindle = row[BooksTable.sentToKindle]
        )
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