use a2s::A2SClient;
use directories::BaseDirs;
use futures::stream::{self, StreamExt};
use lazy_static::lazy_static;
use reqwest;
use serde_derive::Deserialize;
use serde_derive::Serialize;
use std::collections::HashMap;
use std::fs;
use std::sync::Arc;
use std::time::Instant;
use tauri::dev;
use tokio::sync::Mutex;
use tokio::sync::Semaphore;

/*
* Global static SERVER_MAP
* Used to store the server list in memory.
* IIRC we cannot have statics that must be initalized at runtime.
*/
lazy_static! {
    static ref SERVER_MAP: Arc<Mutex<HashMap<String, Server>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

/**
* function: get_server_list
* --------------------------
* This function is the only function that is exposed to the Tauri frontend.
* Takes care of checking for cache, and refreshing that cache. Or if it
* doesn't exist, we download a new server_map, and query each server in the map.
* This function will only ever be called once, every application launch.
* During runtime, the frontend will cache the server list via IndexedDB.
* --------------------------
* TODO: Handle errors here in this top level function.
* We can either return them as a Result (not sure if tauri supports this)
* or we can emit an event to the frontend indicating some cache error.
*/
#[tauri::command]
pub async fn get_server_list() -> Vec<Server> {
    let server_list_path = BaseDirs::new()
        .unwrap()
        .data_dir()
        .join("FTLL")
        .join("server_map.json");

    if !server_list_path.exists() {
        println!("Server list does not exist, fetching server list...");
        init_server_cache().await;
    } else {
        println!("Server list exists, refreshing server list...");
        refresh_server_cache().await;
    }

    let server_map_locked = SERVER_MAP.clone().lock_owned().await;
    let server_list: Vec<Server> = server_map_locked.values().cloned().collect();
    println!("get_server_list(): Returning server list...");
    return server_list;
}

/**
* Function: refresh_server_cache()
* --------------------------
* This function is called to refresh the server cache.
* We skip all servers with marked as Some in the ping field, this means
**/
pub async fn refresh_server_cache() {
    let server_map_path = BaseDirs::new()
        .unwrap()
        .data_dir()
        .join("FTLL")
        .join("server_map.json");

    // Grab local server_map
    let server_map_json_local = fs::read_to_string(server_map_path.clone()).unwrap();
    let mut server_map_local: HashMap<String, Server> =
        serde_json::from_str(&server_map_json_local).unwrap();

    // Grab remote server_map
    fetch_master_server_map().await.unwrap();
    let server_map_remote = SERVER_MAP.clone().lock_owned().await.clone();

    // Merge remote map into local map, overwriting any existing keys
    for (key, value) in server_map_remote.iter() {
        if !server_map_local.contains_key(key) {
            server_map_local.insert(key.clone(), value.clone());
        } else {
            let new_server = server_map_local.get_mut(key).unwrap();
            new_server.addr = value.addr.clone();
            new_server.game_port = value.game_port.clone();
            new_server.steam_id = value.steam_id.clone();
            new_server.name = value.name.clone();
            new_server.app_id = value.app_id.clone();
            new_server.game_dir = value.game_dir.clone();
            new_server.version = value.version.clone();
            new_server.players = value.players.clone();
            new_server.max_players = value.max_players.clone();
            new_server.bots = value.bots.clone();
            new_server.map = value.map.clone();
            new_server.secure = value.secure.clone();
            new_server.os = value.os.clone();
            new_server.game_type = value.game_type.clone();
            new_server.mod_list = value.mod_list.clone();
        }
    }

    // Update the global SERVER_MAP with the new local map
    // Then create a stream from the SERVER_MAP
    let mut server_map = SERVER_MAP.clone().lock_owned().await;
    *server_map = server_map_local;
    let servers_stream = stream::iter(server_map.clone());
    drop(server_map);

    // Now we just loop over SERVER_MAP and query each server
    // That has missing or outdated information, ping, players, etc.
    let a2s_client = Arc::new(A2SClient::new().await.unwrap());
    let semaphore = Arc::new(Semaphore::new(1000));

    servers_stream
        .for_each_concurrent(20000, |server| {
            let a2s_client_cloned = a2s_client.clone();
            let semaphore_cloned = semaphore.clone();

            async move {
                if server.1.ping.is_some() {
                    println!("Skipping server: {}", server.1.name);
                    return;
                }

                println!("Querying server: {}", server.1.name);
                let _permit = semaphore_cloned.acquire().await.unwrap();

                let start = Instant::now();
                let response = a2s_client_cloned.info(server.1.addr).await;
                let duration = start.elapsed();

                let mut server_map = SERVER_MAP.clone().lock_owned().await;
                if let Some(server) = server_map.get_mut(&server.0) {
                    match response {
                        Ok(info) => {
                            println!("Updating server: {}", server.name);
                            // NOTE: @see https://github.com/danlikestocode/ftl-launcher/issues/1
                            // server.players = info.players as i64;
                            // server.max_players = info.max_players as i64;
                            server.map = info.map;
                            server.ping = Some(duration.as_millis() as i64);

                            // For some reason the author of Rust A2S
                            // decided to rename gametype to keywords ?????
                            if let Some(keywords) = info.extended_server_info.keywords {
                                server.game_type = keywords;
                            }
                        }
                        Err(e) => {
                            println!("Error querying server: {}", server.name);
                            println!("Error: {}", e);
                            server.players = 0;
                            server.ping = Some(99999);
                        }
                    }
                }
            }
        })
        .await;

    // Collect JSON
    let server_map_locked = SERVER_MAP.clone().lock_owned().await;
    let server_map_json = serde_json::to_string(&*server_map_locked).unwrap();
    drop(server_map_locked);
    println!("refresh_server_cache(): Finished querying!");

    // Find appdata/FTLL/server_list.json
    let server_map_path = BaseDirs::new()
        .unwrap()
        .data_dir()
        .join("FTLL")
        .join("server_map.json");

    // Delete and write server_map to cache
    fs::remove_file(server_map_path.clone()).unwrap();
    fs::write(server_map_path, server_map_json).unwrap();
}

/**
* Function: first_app_launch
* --------------------------
* This function is called on the first launch of the application.
* Here we are fetching the server_map and querying each server in the map.
* We do this to update ping and other server information.
* This function will trigger anytime the FTLL local cache is deleted.
* --------------------------
* TODO: Add error handling to unwraps
*/
pub async fn init_server_cache() {
    fetch_master_server_map().await.unwrap();

    // Create A2SClient, Semaphore, and Stream
    // Semaphore is to prevent port exhaustion
    let a2s_client = Arc::new(A2SClient::new().await.unwrap());
    let semaphore = Arc::new(Semaphore::new(1000));

    let servers_to_query = SERVER_MAP.clone().lock_owned().await.clone();
    let servers_stream = stream::iter(servers_to_query);

    servers_stream
        .for_each_concurrent(20000, |server| {
            let a2s_client_cloned = a2s_client.clone();
            let semaphore_cloned = semaphore.clone();

            async move {
                let _permit = semaphore_cloned.acquire().await.unwrap();

                let start = Instant::now();
                let response = a2s_client_cloned.info(server.1.addr).await;
                let duration = start.elapsed();

                let mut server_map = SERVER_MAP.clone().lock_owned().await;
                if let Some(server) = server_map.get_mut(&server.0) {
                    match response {
                        Ok(info) => {
                            println!("Updating server: {}", server.name);
                            // NOTE: @see https://github.com/danlikestocode/ftl-launcher/issues/1
                            // server.players = info.players as i64;
                            // server.max_players = info.max_players as i64;
                            server.ping = Some(duration.as_millis() as i64);
                            server.map = info.map;

                            if let Some(keywords) = info.extended_server_info.keywords {
                                server.game_type = keywords;
                            }
                        }
                        Err(_) => {
                            println!("Error querying server: {}", server.name);
                            server.players = 0;
                            server.ping = Some(99999);
                        }
                    }
                }
            }
        })
        .await;

    // Collect JSON
    let server_map_locked = SERVER_MAP.clone().lock_owned().await;
    let server_map_json = serde_json::to_string(&*server_map_locked).unwrap();
    drop(server_map_locked);
    println!("init_server_cache(): Finished querying!");

    // Find appdata/FTLL/server_list.json
    let server_map_path = BaseDirs::new()
        .unwrap()
        .data_dir()
        .join("FTLL")
        .join("server_map.json");

    // Delete server_map.json if it exists
    // This is mainly for debugging, as the json will not exist on first launch.
    if server_map_path.exists() {
        fs::remove_file(server_map_path.clone()).unwrap();
    }

    // Write server_map to server_map.json
    fs::write(server_map_path, server_map_json).unwrap();
}

/**
* Function: fetch_master_server_map
* --------------------------
* This function is called to fetch the server_map from the FTL API.
* The server_map is a HashMap<String, Server> where the key is the server's steamid.
* Set to a static atomic reference, thread safe.
*/
async fn fetch_master_server_map() -> Result<(), reqwest::Error> {
    // Check if we are in dev mode
    let is_dev = dev();

    // Set dev and prod URIs
    // This may be better in a config file
    let dev_uri = "http://localhost:8080";
    let prod_uri = "https://api.ftl-launcher.com";
    let endpoint = "/api/v1/GetMasterServerMap";

    match is_dev {
        true => {
            let data = reqwest::get(dev_uri.to_owned() + endpoint)
                .await?
                .json::<FTLAPIResponse>()
                .await?;

            let mut server_map = SERVER_MAP.clone().lock_owned().await;
            *server_map = data.server_map;
            Ok(())
        }
        false => {
            let data = reqwest::get(prod_uri.to_owned() + endpoint)
                .await?
                .json::<FTLAPIResponse>()
                .await?;

            let mut server_map = SERVER_MAP.clone().lock_owned().await;
            *server_map = data.server_map;
            Ok(())
        }
    }
}

/**
* Function: init_appdata
* --------------------------
* This function is called on the first launch of the application.
* Here we are creating the FTLL folder in the appdata directory.
* This is where we will store the server_map.json and other application data.
* --------------------------
* TODO: Add error handling to unwraps
*/
pub fn init_appdata() {
    let base_dirs = BaseDirs::new().unwrap();
    let appdata_dir = base_dirs.data_dir();

    // Check if FTLL folder exists
    let ftll_dir = appdata_dir.join("FTLL");
    if !ftll_dir.exists() {
        fs::create_dir(ftll_dir).unwrap();
    }

    // Now we need to bust indexeddb cache to pull it from our local cache
    let cache_dir = base_dirs.data_local_dir().join("com.ftl-launcher.app");
    if !cache_dir.exists() {
        return;
    }

    let idb = cache_dir.join("EBWebView/Default/IndexedDB");
    if !idb.exists() {
        return;
    }

    // Delete cache since we are launching application
    fs::remove_dir_all(idb).unwrap();
}

/**
* Data Structure Definitions for FTLAPIResponse
*/
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FTLAPIResponse {
    pub server_map: HashMap<String, Server>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Server {
    pub addr: String,
    pub game_port: i64,
    pub steam_id: String,
    pub name: String,
    pub app_id: i64,
    pub game_dir: String,
    pub version: String,
    pub product: String,
    pub region: i64,
    pub players: i64,
    pub max_players: i64,
    pub bots: i64,
    pub map: String,
    pub secure: bool,
    pub dedicated: bool,
    pub os: String,
    pub game_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mod_list: Option<Vec<ModList>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ping: Option<i64>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModList {
    pub workshop_id: i64,
    pub name: String,
}
