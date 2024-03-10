use steamworks;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let (_client, _single) = steamworks::Client::init_app(221100).unwrap();

    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
