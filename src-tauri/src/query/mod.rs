use crate::steam;

use a2s::A2SClient;
use futures::stream::{self, StreamExt};
use lazy_static::lazy_static;
use reqwest;
use serde_derive::Deserialize;
use serde_derive::Serialize;
use std::fs;
use std::sync::Arc;
use std::time::Duration;
use std::time::Instant;
use std::time::SystemTime;
use tokio::sync::{Mutex, Semaphore};

extern crate directories;
use directories::BaseDirs;

// TODO: Add error handling to unwrap
#[tauri::command]
pub async fn get_server_list() -> Vec<Server> {
    // Find appdata/FTLL/server_list.json
    let base_dirs = BaseDirs::new().unwrap();
    let appdata_dir = base_dirs.data_dir();
    let ftll_dir = appdata_dir.join("FTLL");
    let server_list_path = ftll_dir.join("server_list.json");

    // if it doesn't exist, run first_app_launch
    // This is the function to query ALL servers
    if !server_list_path.exists() {
        let res = first_app_launch().await;
        return res;
    }

    // Below is the path we take if we already have a server list cache
    // we just need to add new servers and refresh old ones with new data
    // read server_list.json as Vec<Server>
    let server_list_json_local = fs::read_to_string(server_list_path.clone()).unwrap();
    let mut server_list_local: Vec<Server> = serde_json::from_str(&server_list_json_local).unwrap();

    // grab remote server_list
    let server_list_remote = fetch_server_list().await.unwrap().servers;
    let server_list_local_arc = Arc::new(Mutex::new(server_list_local));
    let a2s_client = Arc::new(A2SClient::new().await.unwrap());

    // Semaphore to limit concurrent tasks
    let semaphore = Arc::new(Semaphore::new(1000));
    let servers_to_query = server_list_remote.clone();
    let servers_stream = stream::iter(servers_to_query);

    // this is very messy lmao but it works
    servers_stream
        .for_each_concurrent(20000, |remote_server| {
            let a2s_client_cloned = a2s_client.clone();
            let server_list_local_arc_cloned = server_list_local_arc.clone();
            let semaphore = semaphore.clone();

            async move {
                let mut local_servers = server_list_local_arc_cloned.lock().await;
                if let Some(local_server) = local_servers
                    .iter_mut()
                    .find(|s| s.steamid == remote_server.steamid)
                {
                    println!("Updating server: {}", remote_server.name);
                    // update local_server with remote_server info
                    local_server.addr = remote_server.addr.clone();
                    local_server.name = remote_server.name.clone();
                    local_server.players = remote_server.players.clone();
                    local_server.max_players = remote_server.max_players.clone();
                    local_server.appid = remote_server.appid.clone();
                    local_server.gamedir = remote_server.gamedir.clone();
                    local_server.version = remote_server.version.clone();
                    local_server.product = remote_server.product.clone();
                    local_server.region = remote_server.region.clone();
                    local_server.bots = remote_server.bots.clone();
                    local_server.map = remote_server.map.clone();
                    local_server.secure = remote_server.secure.clone();
                    local_server.dedicated = remote_server.dedicated.clone();
                    local_server.os = remote_server.os.clone();
                    local_server.gametype = remote_server.gametype.clone();
                    local_server.mod_list = remote_server.mod_list.clone();
                    drop(local_servers);
                } else {
                    // add remote_server to local_server
                    drop(local_servers);
                    let _permit = semaphore.clone().acquire_owned();
                    println!("Adding server: {}", remote_server.name);

                    let mut new_server = Server {
                        addr: remote_server.addr.clone(),
                        name: remote_server.name.clone(),
                        gameport: remote_server.gameport.clone(),
                        players: remote_server.players.clone(),
                        max_players: remote_server.max_players.clone(),
                        ping: Some(99999),
                        steamid: remote_server.steamid.clone(),
                        appid: remote_server.appid.clone(),
                        gamedir: remote_server.gamedir.clone(),
                        version: remote_server.version.clone(),
                        product: remote_server.product.clone(),
                        region: remote_server.region.clone(),
                        bots: remote_server.bots.clone(),
                        map: remote_server.map.clone(),
                        secure: remote_server.secure.clone(),
                        dedicated: remote_server.dedicated.clone(),
                        os: remote_server.os.clone(),
                        gametype: remote_server.gametype.clone(),
                        mod_list: remote_server.mod_list.clone(),
                    };

                    // Get ping
                    let start = Instant::now();
                    let response = a2s_client_cloned.info(remote_server.addr).await;
                    let duration = start.elapsed();

                    match response {
                        Ok(info) => {
                            new_server.players = info.players as i64;
                            new_server.max_players = info.max_players as i64;
                            new_server.ping = Some(duration.as_millis() as i64);
                        }
                        Err(e) => {
                            println!("Error getting server info: {}", e);
                            new_server.players = 0;
                            new_server.ping = Some(99999);
                        }
                    }

                    let mut local_servers = server_list_local_arc_cloned.lock().await;
                    local_servers.push(new_server);
                    drop(local_servers);
                }
            }
        })
        .await;

    // collec the json
    let server_list_local_locked = server_list_local_arc.lock().await;
    let server_list_local_json = serde_json::to_string(&*server_list_local_locked).unwrap();
    println!("Finished querying and updating servers!");

    // delete server_list.json
    if server_list_path.exists() {
        fs::remove_file(server_list_path.clone()).unwrap();
    }

    fs::write(server_list_path, server_list_local_json).unwrap();
    return server_list_local_locked.clone();
}

// Cap the number of concurrent tasks for querying server info
// Right now this is capped at 1, but if we figure out a way to
// rerender the UI in a more efficient way, we can increase this
lazy_static! {
    static ref MAX_UPDATES_SEMAPHORE: Arc<Semaphore> = Arc::new(Semaphore::new(25));
}

#[tauri::command]
pub async fn get_server_info(server: Server) -> Server {
    let semaphore = MAX_UPDATES_SEMAPHORE.clone();
    println!("Waiting for permit");
    let _permit = semaphore.acquire_owned().await;
    println!("Permit acquired");

    // sleep for 1s to prevent spamming ui rerenders
    tokio::time::sleep(Duration::from_millis(1000)).await;

    let a2s_client = A2SClient::new().await.unwrap();

    let start = SystemTime::now();
    let response = a2s_client.info(server.addr.clone()).await;
    let end = SystemTime::now();
    let duration = end.duration_since(start).unwrap();

    match response {
        Ok(info) => {
            return Server {
                addr: server.addr,
                name: server.name,
                gameport: server.gameport,
                players: info.players as i64,
                max_players: info.max_players as i64,
                ping: Some(duration.as_millis() as i64),
                steamid: server.steamid,
                appid: server.appid,
                gamedir: server.gamedir,
                version: server.version,
                product: server.product,
                region: server.region,
                bots: server.bots,
                map: server.map,
                secure: server.secure,
                dedicated: server.dedicated,
                os: server.os,
                gametype: server.gametype,
                mod_list: server.mod_list,
            };
        }
        Err(e) => {
            println!("Error getting server info: {}", e);
            return Server {
                addr: server.addr,
                name: server.name,
                gameport: server.gameport,
                players: 0,
                max_players: server.max_players,
                ping: Some(99999),
                steamid: server.steamid,
                appid: server.appid,
                gamedir: server.gamedir,
                version: server.version,
                product: server.product,
                region: server.region,
                bots: server.bots,
                map: server.map,
                secure: server.secure,
                dedicated: server.dedicated,
                os: server.os,
                gametype: server.gametype,
                mod_list: server.mod_list,
            };
        }
    }
}

// This can error if we hit rate limit, fix that! lol XD
async fn fetch_server_list() -> Result<FTLAPIResponse, reqwest::Error> {
    let res = reqwest::get("http://localhost:8080/api/v1/GetMasterServerList").await?;
    let server_list = res.json::<FTLAPIResponse>().await?;
    Ok(server_list)
}

// TODO: Fix unwraps
// also we can find some sort of hard limit for concurrent tasks
// based on computer and when port exhaustion occurs ?? not sure how tho
pub async fn first_app_launch() -> Vec<Server> {
    // Assuming fetch_server_list and A2SClient::new() are async and return results.
    let server_list = fetch_server_list().await.unwrap().servers;
    let a2s_client = Arc::new(A2SClient::new().await.unwrap());
    let server_list_arc = Arc::new(Mutex::new(server_list));

    // Semaphore to limit concurrent tasks
    // It seems going over 1000ish tasks will cause some servers
    // To have invalid results and we may run into port exhaustion
    let semaphore = Arc::new(Semaphore::new(1000));

    // Clone server_list for iteration to avoid locking issues.
    let servers_to_query = server_list_arc.lock().await.clone();
    let servers_stream = stream::iter(servers_to_query);
    servers_stream
        .for_each_concurrent(20000, |server| {
            let a2s_client_cloned = a2s_client.clone();
            let server_list_arc_cloned = server_list_arc.clone();
            let semaphore_cloned = semaphore.clone();

            async move {
                // Grab a permit from the semaphore until max concurrent tasks
                let _permit = semaphore_cloned.acquire().await.unwrap();

                // Capture time task takes to complete
                let start = Instant::now();
                let response = a2s_client_cloned.info(server.addr).await;
                let duration = start.elapsed();
                // Process response, update server_list_arc_cloned accordingly.

                // Since we're using steamid for matching
                let mut servers = server_list_arc_cloned.lock().await;
                if let Some(server) = servers.iter_mut().find(|s| s.steamid == server.steamid) {
                    match response {
                        Ok(info) => {
                            println!("Updating server: {}", server.name);
                            server.players = info.players as i64;
                            server.max_players = info.max_players as i64;
                            server.ping = Some(duration.as_millis() as i64);
                        }
                        Err(e) => {
                            println!("Error querying server: {}", e);
                            server.players = 0;
                            server.ping = Some(99999);
                        }
                    }
                    // Update other fields as necessary.
                }
            }
        })
        .await;

    // And collect the json
    let server_list_locked = server_list_arc.lock().await;
    let server_list_json = serde_json::to_string(&*server_list_locked).unwrap();
    println!("Finished querying!");

    // Find appdata/FTLL/server_list.json
    let base_dirs = BaseDirs::new().unwrap();
    let appdata_dir = base_dirs.data_dir();
    let ftll_dir = appdata_dir.join("FTLL");
    let server_list_path = ftll_dir.join("server_list.json");

    // delete server_list.json if it exists
    // This is mainly for debugging, as the json will not exist
    // on first launch.
    if server_list_path.exists() {
        fs::remove_file(server_list_path.clone()).unwrap();
    }

    //write server_list to server_list.json
    fs::write(server_list_path, server_list_json).unwrap();

    // return server_list
    server_list_locked.clone()
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

/* Types for FTLAPIResponse */
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FTLAPIResponse {
    pub servers: Vec<Server>,
}

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
    #[serde(rename = "mod_list")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mod_list: Option<Vec<ModList>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ping: Option<i64>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModList {
    #[serde(rename = "workshop_id")]
    pub workshop_id: i64,
    pub name: String,
}
