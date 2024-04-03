use a2s::A2SClient;
use std::time::SystemTime;

mod client;

#[tauri::command]
pub async fn was_steam_initialized() -> bool {
    client::has_client()
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
pub async fn get_user_avi_rgba() -> Vec<u8> {
    let avi = client::get_client().friends().medium_avatar();
    match avi {
        Some(avi) => avi,
        None => vec![0, 0, 0, 0],
    }
}

pub fn init_steamworks() {
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
        }
        Err(e) => {
            println!("Error initializing Steamworks: {}", e);
        }
    }
}
