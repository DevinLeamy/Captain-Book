package server.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import server.db.models.BookFilesTable
import server.db.models.BooksTable
import server.db.models.LibgenBooksTable
import server.db.models.UsersTable

object DatabaseFactory {
    // TODO: Add these values to app config - they obviously shouldn't be plain text.
    private const val DB_PORT = 5432
    private const val DB_NAME = "nouvelle-db"
    private const val DB_USER = "admin"
    private const val DB_PASSWORD = "password"
    private const val DB_URL = "jdbc:postgresql://localhost:$DB_PORT/$DB_NAME"
    fun init() {
        val database = Database.connect(createDataSource())
        transaction(database) {
            /**
             * Create tables if they don't exist.
             */
            SchemaUtils.create(UsersTable)
            SchemaUtils.create(LibgenBooksTable)
            SchemaUtils.create(BooksTable)
            SchemaUtils.create(BookFilesTable)
        }
    }

    private fun createDataSource(): HikariDataSource {
        val config = HikariConfig().apply {
            driverClassName = "org.postgresql.Driver"
            jdbcUrl = DB_URL
            username = DB_USER
            password = DB_PASSWORD
            // After "executing" a statement the transaction is automatically commited.
            // https://www.baeldung.com/java-jdbc-auto-commit
            isAutoCommit = true
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        }
        config.validate()
        return HikariDataSource(config)
    }

    /**
     * Execute a query in a new coroutine.
     */
    suspend fun <T> dbQuery(block: suspend () -> T): T {
        return newSuspendedTransaction(Dispatchers.IO) { block() }
    }
}