use anyhow::Result;
use tauri::{AppHandle, Manager};

mod client;

lazy_static::lazy_static! {
    static ref IS_STEAMWORKS_INITIALIZED: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
    static ref IS_CALLBACKS_RUNNING: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
}

#[tauri::command]
pub async fn get_installed_mods(app_handle: AppHandle) -> Result<(), String> {
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
                .emit("found_installed_mod", result)
                .expect("Failed to emit query result");
        });
    }

    Ok(())
}

#[tauri::command]
pub async fn download_mod(published_file_id: u64) -> Result<(), String> {
    let client = client::get_client();
    let ugc = client.ugc();

    let handle = ugc.download_item(steamworks::PublishedFileId(published_file_id), true);
    match handle {
        true => Ok(()),
        false => Err("Failed to download mod".to_string()),
    }
}

#[tauri::command]
pub async fn get_mod_download_progress(published_file_id: u64) -> Result<[u64; 2], String> {
    let client = client::get_client();
    let ugc = client.ugc();

    let info = ugc.item_download_info(steamworks::PublishedFileId(published_file_id));
    match info {
        Some(info) => Ok([info.0, info.1]),
        None => Err("Failed to get download info".to_string()),
    }
}

#[tauri::command]
pub async fn get_user_display_name() -> String {
    client::get_client().friends().name()
}

#[tauri::command]
pub async fn get_user_steam_id() -> String {
    client::get_client().user().steam_id().raw().to_string()
}

#[tauri::command]
pub async fn get_user_avi_rgba() -> Result<Vec<u8>, String> {
    let avi = client::get_client().friends().medium_avatar();
    match avi {
        Some(avi) => Ok(avi),
        None => Err("WARN: No avatar found 😥".to_string()),
    }
}

#[tauri::command]
pub async fn run_callbacks() -> Result<(), String> {
    let mut callbacks_running = IS_CALLBACKS_RUNNING.lock().map_err(|e| e.to_string())?;
    let steamworks_initialized = IS_STEAMWORKS_INITIALIZED
        .lock()
        .map_err(|e| e.to_string())?;

    if *callbacks_running {
        return Ok(());
    }

    if !*steamworks_initialized {
        return Err("Steamworks not initialized".to_string());
    }

    // At this point, we know that Steamworks is initialized and callbacks are not running
    // We can now spawn a thread to run the Steamworks callbacks, and set the flag to true
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
pub async fn init_steamworks() -> Result<(), String> {
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
