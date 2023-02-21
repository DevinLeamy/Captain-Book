use std::path::PathBuf;

use anyhow::Result;
use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use axum_macros::debug_handler;
// use futures::executor::block_on;
use http::{header, Method, Request, Response};
use libgen::api::{
    book::Book,
    mirrors::{Mirror, MirrorList, MirrorType},
    search::{Search, SearchOption},
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower::{Service, ServiceBuilder, ServiceExt};
use tower_http::cors::{any, CorsLayer};

#[derive(Debug, Serialize, Deserialize)]
struct BookQuery {
    title: String,
}

pub fn parse_mirrors() -> MirrorList {
    let path = PathBuf::from("./mirror.json");
    let json = std::str::from_utf8(&std::fs::read(path).expect("Couldn't read config file"))
        .unwrap()
        .to_owned();
    MirrorList::parse_mirrors(&json)
}

pub async fn search(
    client: &Client,
    mirrors: &MirrorList,
    query: SearchOption,
    title: String,
) -> Result<Vec<Book>> {
    let search_mirror = mirrors
        .get_working_mirror(MirrorType::Search, &client)
        .await
        .unwrap();

    let search = Search {
        mirror: search_mirror,
        request: title,
        results: 100,
        search_option: query,
    };
    search.search(&client).await
}

struct Server {
    client: Client,
    config: LibgenConfig,
}

impl Server {}

struct LibgenConfig {
    mirrors: MirrorList,
}

#[debug_handler]
async fn post_books(Json(query): Json<BookQuery>) {
    let client = Client::new();
    let mirrors = parse_mirrors();
    println!("Query for {:?}", query);
    let title = query.title;
    let books = tokio::runtime::Runtime::new().unwrap().block_on(search(
        &client,
        &mirrors,
        SearchOption::Title,
        title,
    ));
    let books = books.unwrap();

    println!("Books {:?}", books);
}

async fn get_hello() {
    println!("Hello axium");
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/hello", get(get_hello))
        .route("/books", post(post_books))
        .layer(CorsLayer::very_permissive());

    let address = SocketAddr::from(([127, 0, 0, 1], 8000));

    println!("Listening on localhost:8000");
    axum::Server::bind(&address)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
