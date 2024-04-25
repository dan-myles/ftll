use tauri::Manager;
use window_vibrancy::apply_acrylic;

mod query;
mod steam;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // We do anything here that needs to be done before the app starts
    // and only once per launch. This includes initializing the appdata
    // directory and getting rid of IDB databases that are no longer needed.
    // We could also intialize steamworks here, but its better to have the
    // front end do it so we can show a user friendly error message if it fails.
    // If init_appdata() fails, its a major problem
    let e = query::init_appdata();
    match e {
        Ok(_) => {}
        Err(e) => {
            panic!("Error initializing appdata: {}", e);
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            steam::download_mod,
            steam::get_mod_download_progress,
            steam::run_callbacks,
            steam::init_steamworks,
            steam::get_installed_mods,
            steam::get_user_avi_rgba,
            steam::get_user_display_name,
            steam::get_user_steam_id,
            query::get_server_info,
            query::get_server_list,
            query::update_server_info_semaphore,
            query::destroy_server_info_semaphore,
            query::fetch,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "windows")]
            apply_acrylic(&window, Some((18, 18, 18, 85)))
                .expect("Unsupported platform! 'apply_acrylic' is only supported on Windows");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
