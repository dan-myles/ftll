mod query;
mod steam;

use tauri::Manager;
use window_vibrancy::apply_acrylic;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    steam::init_steamworks();
    query::init_appdata();

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            steam::was_steam_initialized,
            steam::get_user_display_name,
            steam::get_user_steam_id,
            steam::get_user_avi_rgba,
            query::get_server_info,
            query::get_server_list,
            query::destroy_server_info_semaphore,
            query::fetch,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "windows")]
            apply_acrylic(&window, Some((18, 18, 18, 85)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
