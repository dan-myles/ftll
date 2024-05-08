use tauri::AppHandle;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
use tauri_plugin_updater::UpdaterExt;
use tokio::task;

#[tauri::command]
pub async fn check_for_updates(app: AppHandle) {
    let update = match app.updater().unwrap().check().await {
        Ok(Some(update)) => update,
        Ok(None) => return,
        Err(e) => {
            println!("Failed to check for updates: {:?}", e);
            return;
        }
    };
    let cur_ver = &update.current_version;
    let new_ver = &update.version;

    let mut msg = String::new();
    msg.extend([
        &format!("FTLL {new_ver} is now available! (Current Version: {cur_ver})\n\n"),
        "Would you like to install it now?\n\n",
        "Release notes can be found at ftl-launcher.com",
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

            task::spawn(async move {
                if let Err(e) = update.download_and_install(|_, _| {}, || {}).await {
                    println!("Error installing new update: {:?}", e);
                    app.dialog().message(
                        "Failed to install new update. The new update can be downloaded from ftl-launcher.com"
                    ).kind(MessageDialogKind::Error).show(|_| {});
                }
            });
        });
}
