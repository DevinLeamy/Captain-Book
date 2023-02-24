package server.libgen

import kotlinx.serialization.Serializable

@Serializable
data class LibgenBook(
    val id: String,
    val title: String,
    val author: String,
    val filesize: String,
    val year: String,
    val language: String,
    val pages: String,
    val publisher: String,
    val edition: String,
    val extension: String,
    val md5: String,
    var coverurl: String,
)