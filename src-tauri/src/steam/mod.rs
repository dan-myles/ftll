use a2s::A2SClient;
use std::time::SystemTime;

mod client;

#[tauri::command(async)]
pub fn ping_server(server_ip: String) -> String {
    let a2s_client = A2SClient::new().unwrap();

    let start = SystemTime::now();
    let response = a2s_client.info(server_ip);
    let end = SystemTime::now();
    let duration = end.duration_since(start).unwrap();

    match response {
        Ok(_info) => duration.as_millis().to_string(),
        Err(_e) => "Offline".to_string(),
    }
}

pub fn init_steamworks() {
    if client::has_client() {
        client::drop_client();
        client::drop_single();
    }

    // DayZ App ID
    let result = steamworks::Client::init_app(221100);

    match result {
        Ok(client) => {
            let (client, single) = client;
            client::set_client(client);
            client::set_single(single);
        }
        Err(e) => {
            println!("Error initializing Steamworks: {}", e);
        }
    }
}
