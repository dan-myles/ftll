use lazy_static::lazy_static;
use std::sync::Arc;
use steamworks::Client;
use steamworks::SingleClient;
use tokio::sync::Mutex;

lazy_static! {
    pub static ref STEAM_CLIENT: Arc<Mutex<Option<Client>>> = Arc::new(Mutex::new(None));
}

// NOTE: Only one thread may have this at a time, so no mutex 😛
pub static mut STEAM_SINGLE: Option<SingleClient> = None;

pub async fn get_client() -> Option<Client> {
    let steam_client_ref = STEAM_CLIENT.clone();
    let client = steam_client_ref.lock().await.to_owned();
    client
}

pub fn get_single() -> &'static SingleClient {
    unsafe {
        match &STEAM_SINGLE {
            Some(single) => single,
            None => panic!("Steam single not initialized"),
        }
    }
}
