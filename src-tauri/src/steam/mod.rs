use anyhow::Result;

mod client;

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
    if client::has_client() {
        return Ok(());
    }

    // DayZ App ID
    let result = steamworks::Client::init_app(221100);

    match result {
        Ok(client) => {
            let (client, single) = client;
            client::set_client(client);
            client::set_single(single);
            Ok(())
        }
        Err(e) => {
            println!("Error initializing Steamworks: {}", e);
            Err(e.to_string())
        }
    }
}
