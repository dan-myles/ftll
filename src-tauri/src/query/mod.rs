use crate::steam;

use reqwest;
use std::fs;
use serde_derive::Deserialize;
use serde_derive::Serialize;
use a2s::A2SClient;
use std::time::SystemTime;
use tauri_plugin_fs::FsExt;

extern crate directories;
use directories::BaseDirs;

// TODO: Add error handling to unwrap
#[tauri::command]
pub async fn get_server_list(app: tauri::AppHandle) {
}

async fn fetch_server_list() -> Result<ServerList, reqwest::Error> {
    let res = reqwest::get("http://localhost:8080/api/v1/GetServerList").await?;
    let server_list = res.json::<ServerList>().await?;
    Ok(server_list)
}

// TODO: Fix unwraps
use tokio::sync::Mutex;
use std::sync::Arc;
use std::time::{Instant, Duration};
use futures::future::join_all;

#[tauri::command]
pub async fn first_app_launch() {

    // Assuming fetch_server_list and A2SClient::new() are async and return results.
    let server_list = fetch_server_list().await.unwrap();
    let a2s_client = Arc::new(A2SClient::new().await.unwrap());

    let server_list_arc = Arc::new(tokio::sync::Mutex::new(server_list));

    // Clone server_list for iteration to avoid locking issues.
    let servers_to_query = server_list_arc.lock().await.clone();

    let tasks: Vec<_> = servers_to_query.into_iter().map(|server| {
        let a2s_client_cloned = a2s_client.clone();
        let server_list_arc_cloned = server_list_arc.clone();

        tokio::spawn(async move {
            let start = Instant::now();
            let response = a2s_client_cloned.info(server.addr).await;
            let duration = start.elapsed();
            // Process response, update server_list_arc_cloned accordingly.

            // Since you're using steamid for matching, you might update the server data like so:
            // Note: Actual implementation may vary based on your structs and needs.
            let mut servers = server_list_arc_cloned.lock().await;
            if let Some(mut server) = servers.iter_mut().find(|s| s.steamid == server.steamid) {
                match response {
                    Ok(info) => {
                        println!("Updating server: {}", server.name);
                        server.players = info.players as i64;
                        server.max_players = info.max_players as i64;
                        server.ping = duration.as_millis() as i64;
                        println!("Ping: {}", server.ping);
                    }
                    Err(e) => {
                        println!("Error querying server: {}", e);
                        server.players = 0;
                        server.ping = 6969;
                    }
                }
                // Update other fields as necessary.
            }
        })
    }).collect();

    // Await the completion of all tasks.
    // And collect the json
    let _ = join_all(tasks).await;
    let server_list_locked = server_list_arc.lock().await;
    let server_list_json = serde_json::to_string(&*server_list_locked).unwrap();

    println!("Finished querying!");
    // Find appdata/FTLL/server_list.json
    let base_dirs = BaseDirs::new().unwrap();
    let appdata_dir = base_dirs.data_dir();
    let ftll_dir = appdata_dir.join("FTLL");
    let server_list_path = ftll_dir.join("server_list.json");

    //write server_list to server_list.json
    fs::write(server_list_path, server_list_json).unwrap();
}

// TODO: Add error handling to unwrap
pub fn init_appdata() {
    let base_dirs = BaseDirs::new().unwrap();
    let appdata_dir = base_dirs.data_dir();

    // Check if FTLL folder exists
    let ftll_dir = appdata_dir.join("FTLL");
    if !ftll_dir.exists() {
        fs::create_dir(ftll_dir).unwrap();
    }
}

// JSON deserialization from API
pub type ServerList = Vec<Server>;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Server {
    pub addr: String,
    pub gameport: i64,
    pub steamid: String,
    pub name: String,
    pub appid: i64,
    pub gamedir: String,
    pub version: String,
    pub product: String,
    pub region: i64,
    pub players: i64,
    #[serde(rename = "max_players")]
    pub max_players: i64,
    pub bots: i64,
    pub map: String,
    pub secure: bool,
    pub dedicated: bool,
    pub os: String,
    pub gametype: String,
    #[serde(rename = "ModList")]
    pub mod_list: Vec<ModList>,
    #[serde(rename = "Time")]
    pub time: i64,
    #[serde(rename = "Modded")]
    pub modded: bool,
    #[serde(rename = "Ping")]
    pub ping: i64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModList {
    #[serde(rename = "WorkshopId")]
    pub workshop_id: i64,
    #[serde(rename = "Name")]
    pub name: String,
}
