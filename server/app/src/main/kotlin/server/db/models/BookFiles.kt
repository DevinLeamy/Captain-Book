package server.db.models

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import server.db.DatabaseFactory.dbQuery
import java.io.File

data class BookFile(val id: Int, val file: File, val bookId: Int)

object BookFilesTable: IntIdTable() {
    val title = varchar("title", 200)
    val extension = varchar("extension", 20)
    val fileBytes = binary("file_bytes")
    val bookId = reference("book_id", BooksTable)
}

val bookFiles = BookFiles()

class BookFiles {
    /**
     * Create a book file.
     */
    suspend fun addBookFile(file: File, bookId: Int): BookFile? {
        dbQuery {
            BookFilesTable.insert {
                it[title] = file.name.split(".")[0]
                it[extension] = file.extension
                it[fileBytes] = file.readBytes()
                it[BookFilesTable.bookId] = bookId
            }
        }

        return bookFileWithBookId(bookId)
    }

    /**
     * Convert a result row to a book file.
     */
    private fun resultRowToBookFile(row: ResultRow): BookFile {
        val extension = row[BookFilesTable.extension]
        val title = row[BookFilesTable.title]
        val fileBytes = row[BookFilesTable.fileBytes]
        val file = File.createTempFile(title, ".$extension")
        file.appendBytes(fileBytes)

        return BookFile(
            id = row[BookFilesTable.id].value,
            file,
            bookId = row[BookFilesTable.bookId].value
        )
    }

    /**
     * Fetch a book by book id.
     */
    suspend fun bookFileWithBookId(bookId: Int): BookFile? = dbQuery {
        BookFilesTable
            .select { BookFilesTable.bookId eq bookId }
            .map(::resultRowToBookFile)
            .singleOrNull()
    }
}