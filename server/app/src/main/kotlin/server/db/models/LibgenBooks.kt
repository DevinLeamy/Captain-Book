package server.db.models

import org.jetbrains.exposed.dao.id.IntIdTable

object LibgenBooks: IntIdTable() {
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
    var category = varchar("category", 100)
}