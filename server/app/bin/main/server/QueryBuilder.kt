package server

class QueryBuilder(private var baseUrl: String) {
    private var isFirstParameter: Boolean = true
    fun with(key: String, value: String): QueryBuilder {
        baseUrl += if (isFirstParameter) {
            isFirstParameter = false
            "?"
        } else {
            "&"
        }
        baseUrl += "$key=$value"

        return this
    }

    fun build(): String {
        return baseUrl
    }
}