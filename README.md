# Nouvelle

### Tech

-   `React`: client
-   `Firebase`: client + server authentication
-   `Postgres`: database
-   `AWS S3`: image + file store
-   `Ktor`: async http server + http client
-   `Skrape{it}`: web scraping
-   `docker-compose`: deploying postgres

### Issues

-   [ ] Send to Kindle does not _always_ work _(this seems to be out of my control)_.
-   [ ] Responses are not locally stored, so they disappear when you change pages.
-   [ ] Responses are returned all at once, meaning for some requests it can take a long time.
-   [ ] There is no _date added_ associated with books.
-   [ ] The user is not logged out once their authorization token as expired. Instead, requests just silently fail.
-   [ ] There is no _order_ to the books that are returned by a query. For instance, they aren't sorted by how close they
        matched the title.
-   [ ] It's not hosted!
-   [ ] Users cannot set their _"send-to-kindle"_ email, which is a must!
