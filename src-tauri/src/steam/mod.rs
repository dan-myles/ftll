use anyhow::Result;
use lazy_static::lazy_static;
use std::collections::VecDeque;
use std::sync::Arc;
use std::time::Duration;
use tauri::{AppHandle, Manager};
use tokio::sync::RwLock;
use tokio::{task, time};

mod client;

// NOTE: We are using mainly RwLocks here because we dont need to be able to
// write to most of them, all of the time, We need to be able to read from them most of the time.
lazy_static! {
    static ref IS_CALLBACK_DAEMON_RUNNING: Arc<RwLock<bool>> = Arc::new(RwLock::new(false));
    static ref IS_MOD_DAEMON_RUNNING: Arc<RwLock<bool>> = Arc::new(RwLock::new(false));
    static ref MOD_DOWNLOAD_QUEUE: Arc<RwLock<VecDeque<u64>>> =
        Arc::new(RwLock::new(VecDeque::new()));
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

    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("No steam client found!".to_string());
    }
    let client = client.unwrap();

    // Now check if the mod is already installed
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
    // Grab the mod queue and drop it like its hot!
    // Don't carry those locks across awaits 😎
    let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
    let mod_queue = mod_queue_ref.read().await;
    let front = (*mod_queue).front();
    let front = front.cloned();
    drop(mod_queue);

    if front.is_none() {
        return Err("No active download!".to_string());
    }

    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("Now steam client found!".to_string());
    }
    let client = client.unwrap();

    // Get the download progress
    let ugc = client.ugc();
    let download_progress = ugc
        .item_download_info(steamworks::PublishedFileId(front.unwrap()))
        .ok_or("There was an error getting your download progress!".to_string())?;

    // Return "front" download progress
    Ok([download_progress.0, download_progress.1])
}

#[tauri::command]
pub async fn mdq_active_download_id() -> Result<u64, String> {
    let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
    let mod_queue = mod_queue_ref.read().await;
    let front = (*mod_queue).front();

    match front {
        Some(id) => Ok(*id),
        None => Err("No active download!".to_string()),
    }
}

/**
* function: mdq_start_daemon
* ---
* Starts the mod download queue daemon. This daemon will check if there are any mods in the queue
*/
#[tauri::command]
pub async fn mdq_start_daemon() -> Result<(), String> {
    // Check if the mod daemon is already running
    let is_mod_daemon_running_ref = IS_MOD_DAEMON_RUNNING.clone();
    let mut is_mod_daemon_running = is_mod_daemon_running_ref.write().await;
    if *is_mod_daemon_running {
        return Ok(());
    }

    *is_mod_daemon_running = true;

    // Mod Daemon 👹
    // This task will run continuously and check if there are any mods in the download queue
    // to download. If there are, it will download them and remove them from the queue.
    // If there are no mods in the queue, it will sleep for a bit and check again.
    task::spawn(async {
        loop {
            // How fast do we want to check the queue?
            time::sleep(Duration::from_millis(150)).await;
            println!("mdq_daemon: Checking the mod queue!");

            // Now lets grab the front of that queue!
            // P.S. Sometimes the queue is empty!
            let mod_queue_ref = MOD_DOWNLOAD_QUEUE.clone();
            let mut mod_queue = mod_queue_ref.write().await;
            let front = mod_queue.pop_front();
            if front.is_none() {
                println!("mdq_daemon: No mods in the queue!");
                continue;
            }
            let front = front.unwrap();
            println!("mdq_daemon: Checking mod: {}", front);

            // Sometimes we can unmount steam while the daemon is running, so we
            // need to check if steamworks is still initialized! 🤭
            let client = client::get_client().await;
            if client.is_none() {
                println!("mdq_daemon: Steamworks not initialized, trying again!");
                continue;
            }
            let client = client.unwrap();

            println!("mdq_daemon: Got the client!");

            // Lets check if the mod is installed?
            let ugc = client.ugc();
            let is_installed = ugc.item_install_info(steamworks::PublishedFileId(front));
            if is_installed.is_some() {
                println!(
                    "mdq_daemon: Mod was installed already: {}",
                    is_installed.unwrap().folder
                );
                continue;
            }

            // Its not installed, either we are downloading it or we need to download it!
            let download_info = ugc.item_download_info(steamworks::PublishedFileId(front));
            if download_info.is_some() {
                println!("mdq_daemon: Mod is downloading already!");
                mod_queue.push_front(front); // Add it back and check again later
                continue;
            }

            // At this point we know the mod is not installed and not downloading...
            // Lets cook that shit up 🍳 P.S. don't care about the callback
            ugc.subscribe_item(steamworks::PublishedFileId(front), |_i| {});
            println!("mdq_daemon: ✅ Downlading mod: {}", front);
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
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("No steam client found!".to_string());
    }
    let client = client.unwrap();

    // Get the installed mods
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
* ---
* NOTE: UNTESTED
*/
#[tauri::command]
pub async fn steam_get_mod_info(
    app_handle: AppHandle,
    published_file_id: u64,
) -> Result<(), String> {
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("No steam client found!".to_string());
    }
    let client = client.unwrap();

    // Get the mod info
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
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("No steam client found!".to_string());
    }
    let client = client.unwrap();

    // Unsubscribe and delete the mod
    let ugc = client.ugc();
    ugc.unsubscribe_item(
        steamworks::PublishedFileId(published_file_id),
        |i| match i {
            Ok(_) => println!("Mod unsubscribed successfully"),
            Err(e) => println!("Error unsubscribing mod: {}", e),
        },
    );
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
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("No steam client found!".to_string());
    }
    let client = client.unwrap();

    // Unsubscribe the mod
    let ugc = client.ugc();
    ugc.unsubscribe_item(steamworks::PublishedFileId(published_file_id), |_i| {});
    Ok(())
}

#[tauri::command]
pub async fn steam_get_user_display_name() -> String {
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return "No steam client found!".to_string();
    }
    let client = client.unwrap();

    // Grab that name!
    client.friends().name()
}

#[tauri::command]
pub async fn steam_get_user_id() -> String {
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return "No steam client found!".to_string();
    }
    let client = client.unwrap();

    // Grab that ID!
    client.user().steam_id().raw().to_string()
}

/**
* function: steam_get_user_avi
* --------------------------
* Queries the Steamworks API for the current user's avatar and returns it as a byte array.
* RGBA format.
*/
#[tauri::command]
pub async fn steam_get_user_avi() -> Result<Vec<u8>, String> {
    // Check that steam client!
    let client = client::get_client().await;
    if client.is_none() {
        return Err("No steam client found!".to_string());
    }
    let client = client.unwrap();

    // Get the avatar!
    let avi = client.friends().medium_avatar();
    match avi {
        Some(avi) => Ok(avi),
        None => Err("No avatar found 😥".to_string()),
    }
}

/**
* function: steam_start_daemon
* ---
* Starts a daemon that runs Steamworks callbacks every 50ms.
* We can start this deamon before starting steamworks, as it will
* continually check if the client is available.
*/
#[tauri::command]
pub async fn steam_start_daemon() -> Result<(), String> {
    // Check if we are already running the callback daemon!
    let is_callback_daemon_running_ref = IS_CALLBACK_DAEMON_RUNNING.clone();
    let mut is_callback_daemon_running = is_callback_daemon_running_ref.write().await;
    if *is_callback_daemon_running {
        return Ok(());
    }

    task::spawn(async {
        loop {
            // Time to sleep before trying again
            time::sleep(Duration::from_millis(50)).await;

            // If we currently don't have a client, retry!
            if !client::has_client().await {
                continue;
            }

            // Get the client every time?
            // This is because the client might be dropped and recreated
            let single = client::get_single();
            single.run_callbacks();
        }
    });

    *is_callback_daemon_running = true;
    Ok(())
}

/**
* function: steam_init_api
* ---
* Initializes the Steamworks API. This function must be called before any other Steamworks functions.
*/
#[tauri::command]
pub async fn steam_mount_api() -> Result<(), String> {
    // Get the base reference to the client
    let client_ref = client::STEAM_CLIENT.clone();
    let mut client_ref = client_ref.lock_owned().await;

    // Client is already initialized
    if client_ref.is_some() {
        return Ok(());
    }

    // Mount API with DayZ app id
    let result = steamworks::Client::init_app(221100);

    match result {
        Ok(client) => {
            let (client, single) = client;

            // Manually set the client and single
            *client_ref = Some(client);
            unsafe {
                client::STEAM_SINGLE = Some(single);
            }
            Ok(())
        }
        Err(e) => {
            println!("Error initializing Steamworks: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn steam_unmount_api() -> Result<(), String> {
    // Get the base reference to the client
    let client_ref = client::STEAM_CLIENT.clone();
    let mut client_ref = client_ref.lock_owned().await;

    // We don't have a client to unmount
    if client_ref.is_none() {
        return Ok(());
    }

    // Manually set the client and single
    *client_ref = None;
    unsafe {
        client::STEAM_SINGLE = None;
    }
    Ok(())
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
