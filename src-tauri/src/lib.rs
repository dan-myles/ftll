mod query;
mod steam;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    steam::init_steamworks();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            steam::ping_server,
            query::get_server_list,
        ])
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
