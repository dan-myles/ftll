use a2s::A2SClient;
use anyhow::Result;
use directories::BaseDirs;
use futures::stream::{self, StreamExt};
use lazy_static::lazy_static;
use reqwest;
use serde_derive::Deserialize;
use serde_derive::Serialize;
use std::collections::HashMap;
use std::fs;
use std::sync::Arc;
use std::time::Duration;
use std::time::Instant;
use std::time::SystemTime;
use tauri::dev;
use tokio::sync::Mutex;
use tokio::sync::RwLock;
use tokio::sync::Semaphore;

lazy_static! {
    /// We store the server_map here, this is a HashMap<String, Server>
    /// where the key is the server's QUERY IP ADDRESS.
    static ref SERVER_MAP: Arc<Mutex<HashMap<String, Server>>> =
        Arc::new(Mutex::new(HashMap::new()));

    /// We store the max updates here, this is a RwLock<usize>
    /// where the value is the max number of concurrent server queries.
    static ref MAX_UPDATES: Arc<RwLock<usize>> = Arc::new(RwLock::new(10));

    /// A semaphore to limit concurrent server queries from the frontend.
    static ref MAX_UPDATES_SEMAPHORE: Arc<RwLock<Semaphore>> =
        Arc::new(RwLock::new(Semaphore::new(10)));
}

/// This function is the only function that is exposed to the Tauri frontend.
/// Takes care of checking for cache, and refreshing that cache. Or if it
/// doesn't exist, we download a new server_map, and query each server in the map.
/// This function will only ever be called once, every application launch.
/// During runtime, the frontend will cache the server list via IndexedDB.
#[tauri::command]
#[specta::specta]
pub async fn get_server_list() -> Result<Vec<Server32>, String> {
    // Try to grab base directories
    let server_list_path = BaseDirs::new()
        .ok_or("ERROR: Could not find base directories!")?
        .data_dir()
        .join("FTLL")
        .join("server_map.json");

    if !server_list_path.exists() {
        println!("Server list does not exist, fetching server list...");
        init_server_cache().await.map_err(|e| e.to_string())?;
    } else {
        println!("Server list exists, refreshing server list...");
        refresh_server_cache().await.map_err(|e| e.to_string())?;
    }

    let server_map_locked = SERVER_MAP.clone().lock_owned().await;
    let server_list: Vec<Server> = server_map_locked.values().cloned().collect();
    println!("get_server_list(): Returning server list...");

    // Convert Server to Server32
    let server_list: Vec<Server32> = server_list
        .into_iter()
        .map(|server| server.into())
        .collect();
    return Ok(server_list);
}

/// This function is used to fetch data from a URI.
/// We do this here to avoid CORS issues.
#[tauri::command]
#[specta::specta]
pub async fn fetch(uri: String) -> Result<String, String> {
    let response = reqwest::get(&uri).await;
    match response {
        Ok(response) => {
            let json = response.text().await.unwrap();
            return Ok(json);
        }
        Err(e) => {
            return Err(e.to_string());
        }
    }
}

/// This function is called to destroy the server info semaphore.
/// We do this to clear the waiting list of permits, or to change the limit.
/// NOTE: Eventually we will want to let users pick how many servers to query at once.
#[tauri::command]
#[specta::specta]
pub async fn destroy_server_info_semaphore() -> Result<(), String> {
    let semaphore = MAX_UPDATES_SEMAPHORE.clone();
    let semaphore = semaphore.read().await;
    semaphore.close();
    drop(semaphore);

    let new_semaphore = MAX_UPDATES_SEMAPHORE.clone();
    let mut new_semaphore = new_semaphore.write().await;
    let max_updates = MAX_UPDATES.clone().read().await.clone();
    *new_semaphore = Semaphore::new(max_updates);

    Ok(())
}

/// This function is called to destroy the server info semaphore.
/// We do this to clear the waiting list of permits, or to change the limit.
/// NOTE: Eventually we will want to let users pick how many servers to query at once.
#[tauri::command]
#[specta::specta]
pub async fn update_server_info_semaphore(max_updates: i32) -> Result<(), String> {
    let semaphore = MAX_UPDATES_SEMAPHORE.clone();
    let semaphore = semaphore.read().await;
    semaphore.close();
    drop(semaphore);

    let new_semaphore = MAX_UPDATES_SEMAPHORE.clone();
    let mut new_semaphore = new_semaphore.write().await;
    let mut _m = MAX_UPDATES.clone().write().await.clone();
    _m = max_updates as usize;

    *new_semaphore = Semaphore::new(max_updates.try_into().unwrap());

    Ok(())
}

/// This function is called to get server information.
/// We query the server and return the server information.
/// `@param: server` - The server to query.
/// TODO : Add error handling to unwraps, what if we cant get a new client?
#[tauri::command]
#[specta::specta]
pub async fn get_server_info(server: Server32) -> Result<Server32, String> {
    let server: Server = server.into();
    let semaphore = MAX_UPDATES_SEMAPHORE.clone();
    let semaphore = semaphore.read().await;
    let permit = semaphore.acquire().await;

    if permit.is_err() {
        println!("⚠️ Failed to acquire permit for: {}", server.name);
        return Ok(server.into());
    }

    // Don't spawn servers! So lets sleep for a second.
    tokio::time::sleep(Duration::from_millis(1000)).await;

    let a2s_client = A2SClient::new().await.map_err(|e| e.to_string())?;

    let start = SystemTime::now();
    let response = a2s_client.info(server.addr.clone()).await;
    let end = SystemTime::now();
    let duration = end.duration_since(start).map_err(|e| e.to_string())?;

    match response {
        Ok(info) => {
            println!("Server query was successful: {}", server.name);
            return Ok(Server {
                addr: server.addr,
                name: server.name,
                game_port: server.game_port,
                players: info.players as i64,
                max_players: info.max_players as i64,
                ping: Some(duration.as_millis() as i64),
                steam_id: server.steam_id,
                app_id: server.app_id,
                game_dir: server.game_dir,
                version: server.version,
                product: server.product,
                region: server.region,
                bots: server.bots,
                map: server.map,
                secure: server.secure,
                dedicated: server.dedicated,
                os: server.os,
                game_type: server.game_type,
                mod_list: server.mod_list,
            }
            .into());
        }
        Err(e) => {
            println!("Error getting server info: {}", e);
            return Ok(Server {
                addr: server.addr,
                name: server.name,
                game_port: server.game_port,
                players: 0,
                max_players: server.max_players,
                ping: Some(99999),
                steam_id: server.steam_id,
                app_id: server.app_id,
                game_dir: server.game_dir,
                version: server.version,
                product: server.product,
                region: server.region,
                bots: server.bots,
                map: server.map,
                secure: server.secure,
                dedicated: server.dedicated,
                os: server.os,
                game_type: server.game_type,
                mod_list: server.mod_list,
            }
            .into());
        }
    }
}

/// This function is called to refresh the server cache.
/// We skip all servers with marked as Some in the ping field, this means
pub async fn refresh_server_cache() -> Result<()> {
    let server_map_path = BaseDirs::new()
        .unwrap()
        .data_dir()
        .join("FTLL")
        .join("server_map.json");

    // Grab local server_map
    let server_map_json_local = fs::read_to_string(server_map_path.clone())?;
    let mut server_map_local: HashMap<String, Server> =
        serde_json::from_str(&server_map_json_local)?;

    // Grab remote server_map
    fetch_master_server_map().await?;
    let server_map_remote = SERVER_MAP.clone().lock_owned().await.clone();

    // Merge remote map into local map, overwriting any existing keys
    // This should give us updated steam ids, for the servers we have
    // if playerlists are not working, outdated steam ids is probably why!
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
    let a2s_client = Arc::new(A2SClient::new().await?);
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
    let server_map_json = serde_json::to_string(&*server_map_locked)?;
    drop(server_map_locked);
    println!("refresh_server_cache(): Finished querying!");

    // Delete and write server_map to cache
    fs::remove_file(server_map_path.clone())?;
    fs::write(server_map_path, server_map_json)?;
    Ok(())
}

/// This function is called on the first launch of the application.
/// Here we are fetching the server_map and querying each server in the map.
/// We do this to update ping and other server information.
/// This function will trigger anytime the FTLL local cache is deleted.
/// TODO: Add error handling to unwraps
pub async fn init_server_cache() -> Result<()> {
    fetch_master_server_map().await?;

    // Create A2SClient, Semaphore, and Stream
    // Semaphore is to prevent port exhaustion
    let a2s_client = Arc::new(A2SClient::new().await?);
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
    let server_map_json = serde_json::to_string(&*server_map_locked)?;
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
        fs::remove_file(server_map_path.clone())?;
    }

    // Write server_map to server_map.json
    fs::write(server_map_path, server_map_json)?;
    Ok(())
}

/// This function is called to fetch the server_map from the FTL API.
/// The server_map is a HashMap<String, Server> where the key is the server's steamid.
/// Set to a static atomic reference, thread safe.
async fn fetch_master_server_map() -> Result<()> {
    // Check if we are in dev mode
    let is_dev = dev();
    println!("is_dev: {}", is_dev);

    // Set dev and prod URIs
    // This may be better in a config file
    let dev_uri = "http://localhost:8080";
    let prod_uri = "http://api.ftl-launcher.com";
    let endpoint = "/api/v1/GetMasterServerMap";

    match is_dev {
        true => {
            println!(
                "Fetching server map from dev... {}",
                dev_uri.to_owned() + endpoint
            );

            let data = reqwest::get(dev_uri.to_owned() + endpoint)
                .await?
                .json::<FTLAPIResponse>()
                .await?;

            let mut server_map = SERVER_MAP.clone().lock_owned().await;
            *server_map = data.server_map;
            Ok(())
        }
        false => {
            println!(
                "Fetching server map from prod... {}",
                prod_uri.to_owned() + endpoint
            );

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

/// This function is called on the first launch of the application.
/// Here we are creating the FTLL folder in the appdata directory.
/// This is where we will store the server_map.json and other application data.
/// TODO: Add error handling to unwraps
pub fn init_appdata() -> Result<()> {
    let base_dirs = BaseDirs::new().unwrap();

    // Check if FTLL folder exists
    let ftll_dir = base_dirs.data_dir().join("FTLL");
    if !ftll_dir.exists() {
        fs::create_dir(ftll_dir)?;
    }

    // Now we need to bust indexeddb cache to pull it from our local cache
    let cache_dir = base_dirs.data_local_dir().join("com.ftl-launcher.app");
    if !cache_dir.exists() {
        return Ok(());
    }

    let idb = cache_dir.join("EBWebView/Default/IndexedDB");
    if !idb.exists() {
        return Ok(());
    }

    // Delete cache since we are launching application
    fs::remove_dir_all(idb)?;

    Ok(())
}

/// Data Structure FTLAPIResponse
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FTLAPIResponse {
    pub server_map: HashMap<String, Server>,
}

/// Server Data Structure
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
    pub mod_list: Option<Vec<Mod>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ping: Option<i64>,
}

/// Mod Data Structure
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Mod {
    pub workshop_id: i64,
    pub name: String,
}

/// 32 Bit Server Data Structure (JS can't handle i64)
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Server32 {
    pub addr: String,
    pub game_port: i32,
    pub steam_id: String,
    pub name: String,
    pub app_id: String,
    pub game_dir: String,
    pub version: String,
    pub product: String,
    pub region: i32,
    pub players: i32,
    pub max_players: i32,
    pub bots: i32,
    pub map: String,
    pub secure: bool,
    pub dedicated: bool,
    pub os: String,
    pub game_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mod_list: Option<Vec<Mod32>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ping: Option<i32>,
}

/// 32 Bit Mod Data Structure (JS can't handle i64)
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize, specta::Type)]
pub struct Mod32 {
    pub workshop_id: String,
    pub name: String,
}

impl From<Server32> for Server {
    fn from(server: Server32) -> Self {
        Server {
            addr: server.addr,
            game_port: server.game_port as i64,
            steam_id: server.steam_id,
            name: server.name,
            app_id: server.app_id.parse().unwrap(),
            game_dir: server.game_dir,
            version: server.version,
            product: server.product,
            region: server.region as i64,
            players: server.players as i64,
            max_players: server.max_players as i64,
            bots: server.bots as i64,
            map: server.map,
            secure: server.secure,
            dedicated: server.dedicated,
            os: server.os,
            game_type: server.game_type,
            mod_list: server.mod_list.clone().map(|mods| {
                mods.into_iter()
                    .map(|mod32| Mod {
                        workshop_id: mod32.workshop_id.parse().unwrap(),
                        name: mod32.name,
                    })
                    .collect()
            }),
            ping: server.ping.map(|ping| ping as i64),
        }
    }
}

impl From<Mod32> for Mod {
    fn from(mod32: Mod32) -> Self {
        Mod {
            workshop_id: mod32.workshop_id.parse().unwrap(),
            name: mod32.name,
        }
    }
}

impl Into<Server32> for Server {
    fn into(self) -> Server32 {
        Server32 {
            addr: self.addr,
            game_port: self.game_port as i32,
            steam_id: self.steam_id,
            name: self.name,
            app_id: self.app_id.to_string(),
            game_dir: self.game_dir,
            version: self.version,
            product: self.product,
            region: self.region as i32,
            players: self.players as i32,
            max_players: self.max_players as i32,
            bots: self.bots as i32,
            map: self.map,
            secure: self.secure,
            dedicated: self.dedicated,
            os: self.os,
            game_type: self.game_type,
            mod_list: self.mod_list.clone().map(|mods| {
                mods.into_iter()
                    .map(|mod32| Mod32 {
                        workshop_id: mod32.workshop_id.to_string(),
                        name: mod32.name,
                    })
                    .collect()
            }),
            ping: self.ping.map(|ping| ping as i32),
        }
    }
}

impl Into<Mod32> for Mod {
    fn into(self) -> Mod32 {
        Mod32 {
            workshop_id: self.workshop_id.to_string(),
            name: self.name,
        }
    }
}
