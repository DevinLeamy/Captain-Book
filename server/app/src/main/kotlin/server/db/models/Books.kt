package server.db.models

import org.jetbrains.exposed.dao.id.IntIdTable
import server.libgen.LibgenBook

data class Book(val id: Int, val file: Int, val libgenBook: LibgenBook) {

}

object BooksTable : IntIdTable() {
    // TODO: Change file to a file type
    val file = integer("file_placeholder")
    val sentToKindle = bool("send_to_kindle")
    val userId = reference("user_id", UsersTable)
    val libgenBookId = reference("libgen_book_id", LibgenBooksTable)
}