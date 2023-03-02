package server.routes

import server.libgen.LibgenBook

data class AddBookRequest(
    val userEmail: String,
    val libgenBook: LibgenBook,
)