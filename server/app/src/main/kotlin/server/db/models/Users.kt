package server.db.models

import org.jetbrains.exposed.dao.id.IntIdTable

data class User(val id: Int) {}

object UsersTable: IntIdTable() {
}
