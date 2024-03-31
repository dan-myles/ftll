use a2s::A2SClient;
use std::time::SystemTime;

mod client;

#[tauri::command]
pub async fn was_steam_initialized() -> bool {
    client::has_client()
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
