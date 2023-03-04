package server.db.models

import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import server.db.DatabaseFactory.dbQuery

data class User(val id: Int, val email: String, val kindleEmail: String?, val books: List<Book>)

object UsersTable: IntIdTable() {
    val email = varchar("email", 200)
    val kindleEmail = varchar("kindle_email", 200).nullable()
}

val users = Users()

class Users {
    /**
     * Convert a ResultRow to a User.
     */
    private fun resultRowToUser(row: ResultRow): User {
        return User(
            id = row[UsersTable.id].value,
            email = row[UsersTable.email],
            kindleEmail = row[UsersTable.kindleEmail],
            books = runBlocking { books.booksWithUserId(row[UsersTable.id].value) }
        )
    }

    /**
     * Create a new user account.
     */
    suspend fun addUser(email: String, kindleEmail: String?): User? {
        dbQuery {
            UsersTable.insert {
                it[UsersTable.email] = email
                it[UsersTable.kindleEmail] = kindleEmail
            }
        }
        // Fetch the newly created user.
        return userWithEmail(email)
    }

    /**
     * Fetch a user by id.
     */
    suspend fun userWithId(id: Int): User? = dbQuery {
        UsersTable
            .select { UsersTable.id eq id }
            .map(::resultRowToUser).singleOrNull()
    }

    /**
     * Fetch user by email.
     */
    suspend fun userWithEmail(email: String): User? = dbQuery {
        UsersTable
            .select { UsersTable.email eq email }
            .map(::resultRowToUser).singleOrNull()
    }

    /**
     * Fetch all users.
     */
    private suspend fun allUsers(): List<User> = dbQuery {
        LibgenBooksTable.selectAll().map(::resultRowToUser)
    }
}
