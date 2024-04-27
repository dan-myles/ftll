use anyhow::Result;
use std::collections::VecDeque;
use std::sync::Arc;
use std::time::Duration;
use tauri::{AppHandle, Manager};
use tokio::sync::{Mutex, RwLock};
use tokio::{task, time};

mod client;

lazy_static::lazy_static! {
    static ref IS_STEAMWORKS_INITIALIZED: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
    static ref IS_CALLBACK_DAEMON_RUNNING: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
    static ref IS_MOD_DAEMON_RUNNING: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
    static ref MOD_DOWNLOAD_QUEUE: Arc<RwLock<VecDeque<u64>>> = Arc::new(RwLock::new(VecDeque::new()));
    static ref MOD_DOWNLOAD_QUEUE_ACTIVE_DOWNLOAD_ID: Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
}

#[tauri::command]
pub async fn mdq_clear() -> Result<(), String> {
    let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
    let mut mod_queue = mod_queue_ref.write().await;
    (*mod_queue).clear();
    Ok(())
}

#[tauri::command]
pub async fn mdq_mod_add(published_file_id: u64) -> Result<(), String> {
    let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
    let mut mod_queue = mod_queue_ref.write().await;

    // Check if the mod is already in the queue
    if (*mod_queue).contains(&published_file_id) {
        return Err("Mod already in download queue!".to_string());
    }

    // Now check if the mod is already installed
    let client = client::get_client();
    let ugc = client.ugc();
    let is_installed = ugc.item_install_info(steamworks::PublishedFileId(published_file_id));

    match is_installed {
        Some(_) => return Err("Mod already installed!".to_string()),
        None => {
            (*mod_queue).push_back(published_file_id);
            Ok(())
        }
    }
}

#[tauri::command]
pub async fn mdq_mod_remove(published_file_id: u64) -> Result<(), String> {
    let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
    let mut mod_queue = mod_queue_ref.write().await;

    if (*mod_queue).contains(&published_file_id) {
        (*mod_queue).retain(|&x| x != published_file_id);
        Ok(())
    } else {
        Err("Mod not found in download queue!".to_string())
    }
}

#[tauri::command]
pub async fn mdq_active_download_progress() -> Result<[u64; 2], String> {
    let current_mod_ref = MOD_DOWNLOAD_QUEUE_ACTIVE_DOWNLOAD_ID.clone();
    let current_mod = current_mod_ref.lock().await;

    match *current_mod {
        0 => Ok([0, 0]),
        _ => {
            let client = client::get_client();
            let ugc = client.ugc();
            let download_progress = ugc
                .item_download_info(steamworks::PublishedFileId(*current_mod))
                .ok_or("There was an error getting your download progress!".to_string())?;

            Ok([download_progress.0, download_progress.1])
        }
    }
}

#[tauri::command]
pub async fn mdq_active_download_id() -> Result<u64, String> {
    let current_mod_ref = MOD_DOWNLOAD_QUEUE_ACTIVE_DOWNLOAD_ID.clone();
    let current_mod = current_mod_ref.lock().await;

    match *current_mod {
        0 => Err("No active download!".to_string()),
        _ => Ok(*current_mod),
    }
}

#[tauri::command]
pub async fn mdq_start_daemon() -> Result<(), String> {
    // Check if Steamworks is initialized
    let steamworks_initialized = IS_STEAMWORKS_INITIALIZED
        .lock()
        .map_err(|e| e.to_string())?;
    if !*steamworks_initialized {
        return Err("Steamworks not initialized".to_string());
    }

    let callback_running = IS_CALLBACK_DAEMON_RUNNING
        .lock()
        .map_err(|e| e.to_string())?;
    if !*callback_running {
        return Err("Steamworks callbacks not running".to_string());
    }

    // Check if the mod daemon is already running
    let mut mod_daemon_running = IS_MOD_DAEMON_RUNNING.lock().map_err(|e| e.to_string())?;
    if *mod_daemon_running {
        return Ok(());
    }

    *mod_daemon_running = true;

    // Normally we wouldn't use so many drop()s, but we should not carry
    // the lock across the await boundary, bad news bears! 🐻
    // One task to check if any the current mod is done downloading
    task::spawn(async {
        loop {
            time::sleep(Duration::from_millis(150)).await;
            let current_mod_ref = MOD_DOWNLOAD_QUEUE_ACTIVE_DOWNLOAD_ID.clone();
            let mut current_mod = current_mod_ref.lock().await;

            if *current_mod == 0 {
                println!("THERE IS NO MOD DOAWNLOADING");
                drop(current_mod);
                continue;
            }

            println!("CHECKING COMPLETION OF MOD DOWNLOAD");

            let client = client::get_client();
            let ugc = client.ugc();
            let is_done = ugc.item_install_info(steamworks::PublishedFileId(*current_mod));

            match is_done {
                Some(_) => {
                    println!("MOD DOWNLOAD COMPLETE");
                    *current_mod = 0;
                    drop(current_mod);
                    drop(client);
                    continue;
                }
                None => {
                    println!("MOD DOWNLOAD IN PROGRESS");
                    drop(current_mod);
                    drop(client);
                    continue;
                }
            }
        }
    });

    // Another task to process the mod download queue
    task::spawn(async {
        loop {
            time::sleep(Duration::from_millis(100)).await;

            // Pop the front of the queue then drop it
            let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
            let mut mod_queue = mod_queue_ref.write().await;
            let front = (*mod_queue).pop_front();
            drop(mod_queue);

            if front.is_none() {
                println!("No mods to download, sleeping...");
                continue;
            } else {
                println!("❎❎❎ FOUND MOD TO DOWNLOAD ❎❎❎");
            }

            // Set the current mod downloading
            let id = front.unwrap();
            let current_mod_ref = MOD_DOWNLOAD_QUEUE_ACTIVE_DOWNLOAD_ID.clone();
            let mut current_mod = current_mod_ref.lock().await;

            match *current_mod {
                // 0 means we don't have a mod downloading
                0 => {
                    *current_mod = id;
                    drop(current_mod);
                }
                // If we do have a mod downloading, push it back to the front of the queue
                // And check again after some time
                _ => {
                    let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
                    let mut mod_queue = mod_queue_ref.write().await;
                    (*mod_queue).push_front(id);
                    drop(current_mod);
                    drop(mod_queue);
                    continue;
                }
            }

            // At this point we have checked if the mod is already downloading
            // If it is, we've set it as the current mod and we can now download it
            // We also have another task running to check if the current mod is done downloading
            let client = client::get_client();
            let ugc = client.ugc();
            ugc.subscribe_item(steamworks::PublishedFileId(id), |_i| {});
            drop(client);
        }
    });

    Ok(())
}

/**
* function: get_installed_mods
* --------------------------
* Queries the Steamworks API for all installed mods and emits the results to the frontend.
* Emits a "found_installed_mod" event for each mod found, with the mod's information.
*/
#[tauri::command]
pub async fn steam_get_installed_mods(app_handle: AppHandle) -> Result<(), String> {
    let client = client::get_client();
    let ugc = client.ugc();

    let subscribed_items = ugc.subscribed_items();
    for item in subscribed_items {
        let extended_info = ugc.query_item(item).map_err(|e| e.to_string())?;

        let handle = app_handle.clone();
        extended_info.fetch(move |i| {
            let query_result = i.unwrap().get(0).unwrap();

            let result = ModInfo {
                published_file_id: query_result.published_file_id.0,
                title: query_result.title,
                description: query_result.description,
                owner_steam_id: query_result.owner.raw(),
                time_created: query_result.time_created,
                time_updated: query_result.time_updated,
                time_added_to_user_list: query_result.time_added_to_user_list,
                banned: query_result.banned,
                accepted_for_use: query_result.accepted_for_use,
                tags: query_result.tags.clone(),
                tags_truncated: query_result.tags_truncated,
                file_size: query_result.file_size,
                url: query_result.url.clone(),
                num_upvotes: query_result.num_upvotes,
                num_downvotes: query_result.num_downvotes,
                score: query_result.score,
                num_children: query_result.num_children,
            };

            handle
                .emit("steam_get_installed_mods_result", result)
                .expect("Failed to emit query result");
        });
    }

    Ok(())
}

/**
* function: get_mod_info
* ---
* Queries the Steamworks API for a specific mod's information and emits the results to the frontend.
* Emits a "found_mod_info" event with the mod's information.
*/
#[tauri::command]
pub async fn steam_get_mod_info(
    app_handle: AppHandle,
    published_file_id: u64,
) -> Result<(), String> {
    let client = client::get_client();
    let ugc = client.ugc();

    let extended_info = ugc
        .query_item(steamworks::PublishedFileId(published_file_id))
        .map_err(|e| e.to_string())?;

    extended_info.fetch(move |i| {
        let query_result = i.unwrap().get(0).unwrap();

        let result = ModInfo {
            published_file_id: query_result.published_file_id.0,
            title: query_result.title,
            description: query_result.description,
            owner_steam_id: query_result.owner.raw(),
            time_created: query_result.time_created,
            time_updated: query_result.time_updated,
            time_added_to_user_list: query_result.time_added_to_user_list,
            banned: query_result.banned,
            accepted_for_use: query_result.accepted_for_use,
            tags: query_result.tags.clone(),
            tags_truncated: query_result.tags_truncated,
            file_size: query_result.file_size,
            url: query_result.url.clone(),
            num_upvotes: query_result.num_upvotes,
            num_downvotes: query_result.num_downvotes,
            score: query_result.score,
            num_children: query_result.num_children,
        };

        app_handle
            .emit("steam_get_mod_info_result", result)
            .expect("Failed to emit query result");
    });

    Ok(())
}

#[tauri::command]
pub async fn steam_remove_mod_forcefully(published_file_id: u64) -> Result<(), String> {
    let client = client::get_client();
    let ugc = client.ugc();

    ugc.unsubscribe_item(steamworks::PublishedFileId(published_file_id), |_i| {});
    ugc.delete_item(
        steamworks::PublishedFileId(published_file_id),
        |i| match i {
            Ok(_) => println!("Mod deleted successfully"),
            Err(e) => println!("Error deleting mod: {}", e),
        },
    );
    Ok(())
}

#[tauri::command]
pub async fn steam_remove_mod(published_file_id: u64) -> Result<(), String> {
    let client = client::get_client();
    let ugc = client.ugc();

    ugc.unsubscribe_item(steamworks::PublishedFileId(published_file_id), |_i| {});
    Ok(())
}

#[tauri::command]
pub async fn steam_get_user_display_name() -> String {
    client::get_client().friends().name()
}

#[tauri::command]
pub async fn steam_get_user_id() -> String {
    client::get_client().user().steam_id().raw().to_string()
}

/**
* function: steam_user_avi
* --------------------------
* Queries the Steamworks API for the current user's avatar and returns it as a byte array.
* RGBA format.
*/
#[tauri::command]
pub async fn steam_get_user_avi() -> Result<Vec<u8>, String> {
    let avi = client::get_client().friends().medium_avatar();
    match avi {
        Some(avi) => Ok(avi),
        None => Err("No avatar found 😥".to_string()),
    }
}

#[tauri::command]
pub async fn steam_start_daemon() -> Result<(), String> {
    let mut callbacks_running = IS_CALLBACK_DAEMON_RUNNING
        .lock()
        .map_err(|e| e.to_string())?;
    let steamworks_initialized = IS_STEAMWORKS_INITIALIZED
        .lock()
        .map_err(|e| e.to_string())?;

    if *callbacks_running {
        return Ok(());
    }

    if !*steamworks_initialized {
        return Err("Steamworks is not initialized!".to_string());
    }

    // At this point, we know that Steamworks is initialized and callbacks are not running
    // We can now spawn a thread to run the Steamworks callbacks, and set the flag to true
    // Normally we would just use a tokio task, but the Steamworks API requires a blocking call
    // from a non-async context to run callbacks, or else it will panic.
    println!("Running Steamworks callbacks...");
    std::thread::spawn(|| {
        let single = client::get_single();
        loop {
            single.run_callbacks();
            std::thread::sleep(std::time::Duration::from_millis(50));
        }
    });

    *callbacks_running = true;
    Ok(())
}

#[tauri::command]
pub async fn steam_init_api() -> Result<(), String> {
    let mut steamworks_initialized = IS_STEAMWORKS_INITIALIZED
        .lock()
        .map_err(|e| e.to_string())?;

    if *steamworks_initialized {
        return Ok(());
    }

    if client::has_client() {
        client::drop_client();
        client::drop_single();
    }

    // DayZ App ID
    let result = steamworks::Client::init_app(221100);

    match result {
        Ok(client) => {
            let (client, single) = client;
            client::set_client(client);
            client::set_single(single);
            *steamworks_initialized = true;
            Ok(())
        }
        Err(e) => {
            println!("Error initializing Steamworks: {}", e);
            *steamworks_initialized = false;
            Err(e.to_string())
        }
    }
}

/**
* function: steam_reinit_api
* ---
* Reinitializes the Steamworks API. Currently causes a lot of threads to panic.
* Probably will also cause the program to crash LOL. Use with caution.
* Sometimes necessary when removing mods, as `unsubscribe` does not run until
* the "game" is not running. Unforunately, init-ing the Steamworks API
* with the DayZ App ID is considered a running game.
* ---
* WARN: CAUSES PANICS 💀
* TODO: Fix panics when reinitializing the Steamworks API. Can do this by
* moving steamworks checks to be done before calling the Steamworks API, and
* moving the IS_STEAMWORKS_INITIALIZED to a tokio RwLock... maybe? 💀
* We just have to make sure that we don't call the Steamworks API at all,
* while its being remounted.
*/
#[tauri::command]
pub async fn steam_reinit_api() -> Result<(), String> {
    // Let other threads know that Steamworks is no longer available
    let mut steamworks_initialized = IS_STEAMWORKS_INITIALIZED
        .lock()
        .map_err(|e| e.to_string())?;
    *steamworks_initialized = false;
    drop(steamworks_initialized);

    client::drop_client();
    client::drop_single();

    // DayZ App ID
    let result = steamworks::Client::init_app(221100);

    match result {
        Ok(client) => {
            let (client, single) = client;
            client::set_client(client);
            client::set_single(single);
            let mut steamworks_initialized = IS_STEAMWORKS_INITIALIZED
                .lock()
                .map_err(|e| e.to_string())?;
            *steamworks_initialized = true;
            Ok(())
        }
        Err(e) => {
            println!("Error reinitializing Steamworks: {}", e);
            Err(e.to_string())
        }
    }
}

#[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
struct ModInfo {
    published_file_id: u64,
    title: String,
    description: String,
    owner_steam_id: u64,
    time_created: u32,
    time_updated: u32,
    time_added_to_user_list: u32,
    banned: bool,
    accepted_for_use: bool,
    tags: Vec<String>,
    tags_truncated: bool,
    file_size: u32,
    url: String,
    num_upvotes: u32,
    num_downvotes: u32,
    score: f32,
    num_children: u32,
}
