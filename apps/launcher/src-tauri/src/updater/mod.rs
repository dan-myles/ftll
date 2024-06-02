use tauri::async_runtime;
use tauri::AppHandle;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
use tauri_plugin_updater::UpdaterExt;

#[tauri::command]
#[specta::specta]
pub async fn check_for_updates(app: AppHandle) -> String {
    let update = match app.updater().unwrap().check().await {
        Ok(Some(update)) => update,
        Ok(None) => return "You're on the latest version!".to_string(),
        Err(e) => {
            dbg!("Failed to check for updates: {:?}", e);
            return "Failed to check for updates".to_string();
        }
    };
    let cur_ver = &update.current_version;
    let new_ver = &update.version;

    let mut msg = String::new();
    msg.extend([
        &format!("FTLL {new_ver} is now available!\n(Current Version: {cur_ver})\n\n"),
        "Would you like to install it now?\n\n",
        "Release notes can be found at https://ftl-launcher.com/",
    ]);

    app.dialog()
        .message(msg)
        .title("A new version of FTLL is available!")
        .ok_button_label("Yes")
        .cancel_button_label("No")
        .show(move |response| {
            if !response {
                return;
            }

            async_runtime::spawn(async move {
                if let Err(e) = update.download_and_install(|_, _| {}, || {}).await {
                    println!("Error installing new update: {:?}", e);
                    app.dialog().message(
                        "Failed to install new update. The new update can be downloaded from ftl-launcher.com"
                    ).kind(MessageDialogKind::Error).show(|_| {});
                }
            });
        });

    return "There is an update available!".to_string();
}
