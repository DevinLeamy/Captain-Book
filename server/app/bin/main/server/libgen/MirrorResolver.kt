package server.libgen



private val searchUrls: List<String> = listOf(
    "https://libgen.is/search.php",
    "https://libgen.rs/search.php",
    "https://libgen.st/search.php",
)

private val jsonUrls: List<String> = listOf(
    "http://libgen.is/json.php",
    "http://libgen.rs/json.php",
    "http://libgen.st/json.php",
    "http://libgen.rs/json.php",
    "http://libgen.ls/json.php",
)

private val bookCoverUrls: List<String> = listOf(
    "http://libgen.is/covers/{cover-url}",
    "http://libgen.rs/covers/{cover-url}",
    "http://libgen.st/covers/{cover-url}",
    "http://libgen.rs/covers/{cover-url}",
    "http://libgen.lc/covers/{cover-url}"
)