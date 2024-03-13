use reqwest;
use tokio;
use serde_derive::Deserialize;
use serde_derive::Serialize;

// TODO: Add error handling to unwrap
#[tauri::command]
pub async fn get_server_list() -> ServerList {
    return fetch_server_list().await.unwrap()
}

async fn fetch_server_list() -> Result<ServerList, reqwest::Error> {
    let res = reqwest::get("http://localhost:8080/api/v1/GetServerList").await?;
    let server_list = res.json::<ServerList>().await?;
    Ok(server_list)
}

// JSON deserialization from API
pub type ServerList = Vec<Server>;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Server {
    pub addr: String,
    pub gameport: i64,
    pub steamid: String,
    pub name: String,
    pub appid: i64,
    pub gamedir: String,
    pub version: String,
    pub product: String,
    pub region: i64,
    pub players: i64,
    #[serde(rename = "max_players")]
    pub max_players: i64,
    pub bots: i64,
    pub map: String,
    pub secure: bool,
    pub dedicated: bool,
    pub os: String,
    pub gametype: String,
    #[serde(rename = "ModList")]
    pub mod_list: Vec<ModList>,
    #[serde(rename = "Time")]
    pub time: i64,
    #[serde(rename = "Modded")]
    pub modded: bool,
    #[serde(rename = "Ping")]
    pub ping: i64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModList {
    #[serde(rename = "WorkshopId")]
    pub workshop_id: i64,
    #[serde(rename = "Name")]
    pub name: String,
}
