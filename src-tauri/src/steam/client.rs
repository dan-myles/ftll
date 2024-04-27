use std::sync::Arc;
use steamworks::Client;
use steamworks::SingleClient;
use tokio::sync::Mutex;

use lazy_static::lazy_static;

lazy_static! {
    pub static ref STEAM_CLIENT: Arc<Mutex<Option<Client>>> = Arc::new(Mutex::new(None));
}

// NOTE: Only one thread may have this at a time, so no mutex 😛
pub static mut STEAM_SINGLE: Option<SingleClient> = None;

pub async fn has_client() -> bool {
    let steam_client_ref = STEAM_CLIENT.clone();
    let has_client = steam_client_ref.lock().await.is_some();
    has_client
}

pub async fn get_client() -> Option<Client> {
    let steam_client_ref = STEAM_CLIENT.clone();
    let client = steam_client_ref.lock().await.to_owned();
    client
}

pub async fn set_client(client: Client) {
    let steam_client_ref = STEAM_CLIENT.clone();
    let mut client_ref = steam_client_ref.lock().await;
    *client_ref = Some(client);
}

pub async fn drop_client() {
    let steam_client_ref = STEAM_CLIENT.clone();
    let mut client_ref = steam_client_ref.lock().await;
    *client_ref = None;
}

pub fn get_single() -> &'static SingleClient {
    unsafe {
        match &STEAM_SINGLE {
            Some(single) => single,
            None => panic!("Steam single not initialized"),
        }
    }
}

pub fn set_single(single: SingleClient) {
    unsafe {
        STEAM_SINGLE = Some(single);
    }
}

pub fn drop_single() {
    unsafe {
        STEAM_SINGLE = None;
    }
}
