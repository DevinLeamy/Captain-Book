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
        // https://stackoverflow.com/questions/5442658/spaces-in-urls
        val url = baseUrl.replace(" ", "%20")
        return url
    }
}