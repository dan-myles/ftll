use crate::query::Server;
use crate::steam::client;
use anyhow::Result;
use reqwest;
use std::process::Command;
use tauri::{AppHandle, Manager};
use tokio::task;

#[tauri::command]
pub async fn dayz_launch_vanilla(server: Server, app_handle: AppHandle) -> Result<(), String> {
    // Grab the steam client
    let client = client::get_client().await;
    if client.is_none() {
        return Err("Steam client not initialized".to_string());
    }
    let client = client.unwrap();
    let apps = client.apps();

    // Check if DayZ is installed
    if !apps.is_app_installed(steamworks::AppId(221100)) {
        return Err("DayZ not installed".to_string());
    }
    let path = apps.app_install_dir(steamworks::AppId(221100));

    // Make sure there is not mod list
    if server.mod_list.is_some() {
        return Err(
            "Mods are not supported for vanilla DayZ, try launching with mods!".to_string(),
        );
    }

    // Grab game addr
    let addr = server.addr.split(':').collect::<Vec<&str>>()[0].to_owned()
        + ":"
        + &server.game_port.to_string();

    // Spawn a task to launch DayZ and emit a shutdown event when it closes
    task::spawn(async move {
        let handle = app_handle.clone();

        Command::new(path + "\\DayZ_BE.exe")
            .arg("-connect=".to_owned() + &addr)
            .status()
            .expect("Failed to start DayZ");

        handle
            .emit("dayz_shutdown", ())
            .expect("Failed to emit dayz_shutdown");
    });

    Ok(())
}

#[tauri::command]
pub async fn dayz_launch_modded(server: Server, app_handle: AppHandle) -> Result<(), String> {
    // Grab the steam client
    let client = client::get_client().await;
    if client.is_none() {
        return Err("Steam client not initialized".to_string());
    }
    let client = client.unwrap();
    let apps = client.apps();

    // Check if DayZ is installed
    if !apps.is_app_installed(steamworks::AppId(221100)) {
        return Err("DayZ not installed".to_string());
    }
    let path = apps.app_install_dir(steamworks::AppId(221100));

    // Make sure there IS mod list
    let mod_list = server.mod_list;
    if mod_list.is_none() {
        return Err("You are trying to connect to a server with no mod list!".to_string());
    }
    let mod_list = mod_list.unwrap();

    // Collect mod paths
    let ugc = client.ugc();
    let mut mod_paths: Vec<String> = Vec::new();
    for dayz_mod in mod_list {
        let mod_id = steamworks::PublishedFileId(dayz_mod.workshop_id as u64);
        let path = ugc.item_install_info(mod_id);
        if path.is_none() {
            return Err("Failed to get mod path".to_string());
        }

        mod_paths.push(path.unwrap().folder.as_str().to_owned());
    }

    // Push mod paths to a singular param
    let mut mod_param = String::new();
    mod_param.push_str("-mod=");
    for mod_path in mod_paths {
        mod_param.push_str(&(mod_path + ";"));
    }

    // Grab game addr
    let addr = server.addr.split(':').collect::<Vec<&str>>()[0].to_owned()
        + ":"
        + &server.game_port.to_string();

    // Spawn a task to launch DayZ and emit a shutdown event when it closes
    task::spawn(async move {
        let handle = app_handle.clone();

        Command::new(path + "\\DayZ_BE.exe")
            .arg(mod_param)
            .arg("-connect=".to_owned() + &addr)
            .status()
            .expect("Failed to start DayZ");

        handle
            .emit("dayz_shutdown", ())
            .expect("Failed to emit dayz_shutdown");
    });

    Ok(())
}

#[tauri::command]
pub async fn dayz_get_playerlist(server: Server) -> Result<Vec<Player>, String> {
    // Grab the steam client
    let client = client::get_client().await;
    if client.is_none() {
        return Err("Steam client not initialized".to_string());
    }
    let client = client.unwrap();

    // Grab steam id
    let friends = client.friends();
    let steam_id: u64 = server
        .steam_id
        .parse()
        .map_err(|_| "Invalid steam id, or something went wrong 😖".to_string())?;

    // Get players on the server
    let mut users: Vec<Player> = Vec::new();
    let server_steam_connection =
        friends.get_friends_from_source(steamworks::SteamId::from_raw(steam_id));
    for user in server_steam_connection {
        let name = user.name();
        let nick_name = user.nick_name();
        let avatar = user.medium_avatar();
        let steam_id = user.id().raw();

        let user = Player {
            name,
            steam_id: steam_id.to_string(),
            nick_name: nick_name.unwrap_or("".to_string()),
            avatar: avatar.unwrap_or(Vec::new()),
            is_banned: false,
        };

        users.push(user);
    }

    Ok(users)
}

#[tauri::command]
pub async fn dayz_get_player_ban_status(steam_id: u64) -> Result<bool, String> {
    let is_banned = reqwest::get(format!("https://steamcommunity.com/profiles/{}", steam_id))
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?
        .contains("game ban on record");

    Ok(is_banned)
}

#[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
pub struct Player {
    steam_id: String,
    name: String,
    nick_name: String,
    avatar: Vec<u8>,
    is_banned: bool,
}
