use anyhow::Result;

mod client;

lazy_static::lazy_static! {
    static ref IS_STEAMWORKS_INITIALIZED: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
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
