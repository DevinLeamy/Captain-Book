package server.db.models

import org.jetbrains.exposed.dao.id.IntIdTable

data class Book(val id: Int, val file: Int, val ownerId: Int, val libgenBookId: Int) {

}

object Books : IntIdTable() {
    // TODO: Change file to a file type
    val file = integer("file_placeholder")
    val userId = reference("user_id", Users)
    val libgenBookId = reference("libgen_book_id", LibgenBooks)
}