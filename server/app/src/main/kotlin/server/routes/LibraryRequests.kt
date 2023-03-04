package server.routes

import server.db.models.Book
import server.libgen.LibgenBook

data class AddBookRequest(
    val libgenBook: LibgenBook,
)

data class BooksRequest(
    val books: List<Book>
)