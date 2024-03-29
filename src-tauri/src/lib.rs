use tauri_plugin_fs::FsExt;

mod query;
mod steam;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    steam::init_steamworks();
    query::init_appdata();

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            steam::was_steam_initialized,
            query::get_server_info,
            query::get_server_list,
        ])
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
