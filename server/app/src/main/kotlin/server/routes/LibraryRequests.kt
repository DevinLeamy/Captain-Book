package server.routes

import server.db.models.Book

data class BooksRequest(
    val books: List<Book>
)