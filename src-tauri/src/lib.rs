use std::time::SystemTime;

use a2s::info::Info;
use a2s::A2SClient;
use steamworks;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let (_client, _single) = steamworks::Client::init_app(221100).unwrap();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ping_server])
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn ping_server(server_ip: String) -> String {
    let a2s_client = a2s::A2SClient::new().unwrap();

    let start = SystemTime::now();
    let response = a2s_client.info(server_ip);
    let end = SystemTime::now();
    let duration = end.duration_since(start).unwrap();

    match response {
        Ok(info) => {
            return duration.as_millis().to_string();
        }
        Err(e) => {
            return "Offline".to_string();
        }
    }
}
