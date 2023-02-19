#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use std::path::PathBuf;

use anyhow::Result;
use libgen::api::{
    book::Book,
    mirrors::{Mirror, MirrorList, MirrorType},
    search::{Search, SearchOption},
};
use reqwest::Client;
use rocket::fairing::{self, AdHoc};
use rocket::serde::json::Json;

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
    let results = search.search(&client).await?;
    Ok(results)
}

struct Server {
    client: Client,
    config: LibgenConfig,
}

impl Server {}

struct LibgenConfig {
    mirrors: MirrorList,
}

#[get("/<title>")]
async fn query(title: String) -> Option<Json<Vec<Book>>> {
    let server = Server {
        client: Client::new(),
        config: LibgenConfig {
            mirrors: parse_mirrors(),
        },
    };

    let query = SearchOption::Title;
    let books = search(&server.client, &server.config.mirrors, query, title)
        .await
        .unwrap();

    Some(Json(books))
}

fn stage() -> AdHoc {
    AdHoc::on_ignite("ymael", |rocket| async {
        rocket.mount("/title", routes![query])
    })
}
// https://github.com/SergioBenitez/Rocket/blob/v0.5-rc/examples/databases/src/sqlx.rs
#[launch]
fn rocket() -> _ {
    rocket::build().attach(stage())
}
