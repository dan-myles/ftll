         // This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

         export const commands = {
async dayzLaunchVanilla(server: Server32) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("dayz_launch_vanilla", { server }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async dayzLaunchModded(server: Server32) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("dayz_launch_modded", { server }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Gets the player list from a DayZ server. User to be actively connected to the server.
 */
async dayzGetPlayerlist(server: Server32) : Promise<Result<Player[], string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("dayz_get_playerlist", { server }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Querys the steam community page of a player to see if they have a game ban.
 */
async dayzGetPlayerBanStatus(steamId: string) : Promise<Result<boolean, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("dayz_get_player_ban_status", { steamId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Clears the mod download queue.
 */
async mdqClear() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("mdq_clear") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Adds a mod to the download queue.
 */
async mdqAddMod(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("mdq_add_mod", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Removes a mod from the download queue.
 */
async mdqRemoveMod(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("mdq_remove_mod", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Returns the progress of an active mod download. Will error if there is no active download.
 */
async mdqGetActiveDownloadProgress() : Promise<Result<[string, string], string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("mdq_get_active_download_progress") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Returns the workshopId of an active mod download. Will error if there is no active download.
 */
async mdqGetActiveDownloadId() : Promise<Result<string, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("mdq_get_active_download_id") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Starts the mod download queue daemon. This daemon will check if there are any mods in the queue
 * then download them. This daemon will run continuously until the app is closed. Handles,
 * unmounting of the steam api, and checking if the mod is already installed.
 * Emits a "mdq_active_download_info" event while a mod is downloading.
 */
async mdqStartDaemon() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("mdq_start_daemon") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Unsubscribes from a mod from the Steamworks API.
 */
async steamRemoveMod(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_remove_mod", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Unsubscribes and requests deletion of a mod from the Steamworks API.
 */
async steamRemoveModForcefully(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_remove_mod_forcefully", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Tries to reset local mod cache and redownload the mod from the Steamworks API.
 */
async steamFixMod(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_fix_mod", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Removes the mod's local files and redownloads the mod from the Steamworks API.
 * WARN: This will forcefully delete all local files associated with the mod.
 */
async steamFixModForcefully(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_fix_mod_forcefully", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Queries the Steamworks API for a list of mods that are missing from the server.
 * Must be given an array of mod ids to check against.
 * Returns an array of mod ids that are missing.
 */
async steamGetMissingModsForServer(requiredMods: string[]) : Promise<Result<string[], string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_get_missing_mods_for_server", { requiredMods }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Queries the Steamworks API for all installed mods and emits the results to the frontend.
 * Emits a "steam_get_installed_mods_result" event for each mod found, with the mod's information.
 */
async steamGetInstalledMods() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_get_installed_mods") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Queries the Steamworks API for a specific mod's information and emits the results to the frontend.
 * Emits a "steam_get_mod_info_result" event with the mod's information.
 * NOTE: Untested, but should work.
 */
async steamGetModInfo(publishedFileId: string) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_get_mod_info", { publishedFileId }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Retrieves the current user's display name from the Steamworks API.
 * Will error if no steam client is found.
 */
async steamGetUserDisplayName() : Promise<Result<string, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_get_user_display_name") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Retrieves the current user's Steam 64 ID from the Steamworks API.
 * Will error if no steam client is found.
 */
async steamGetUserId() : Promise<Result<string, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_get_user_id") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Queries the Steamworks API for the current user's avatar and returns it as a byte array.
 * RGBA format. Will error if no steam client is found.
 */
async steamGetUserAvi() : Promise<Result<number[], string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_get_user_avi") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Starts a daemon that runs Steamworks callbacks every 50ms.
 * We can start this deamon before starting steamworks, as it will
 * continually check if the client is available.
 */
async steamStartDaemon() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_start_daemon") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Initializes the Steamworks API with the DayZ app id.
 * This function must be called before any other Steamworks functions.
 * Can error if the is already mounted, or has an incorrect app id.
 */
async steamMountApi() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_mount_api") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * Destructures the Steamworks API.
 * Does not *need* to be called, but can be useful forcing Steam
 * to think that we have shutdown and the "game" has been closed.
 * Can error if the is already mounted, or the user does not own the game.
 * WARN: This function is inherently unsafe! Please use with caution.
 */
async steamUnmountApi() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("steam_unmount_api") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * This function is called to get server information.
 * We query the server and return the server information.
 * `@param: server` - The server to query.
 * TODO : Add error handling to unwraps, what if we cant get a new client?
 */
async getServerInfo(server: Server32) : Promise<Result<Server32, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("get_server_info", { server }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * This function is the only function that is exposed to the Tauri frontend.
 * Takes care of checking for cache, and refreshing that cache. Or if it
 * doesn't exist, we download a new server_map, and query each server in the map.
 * This function will only ever be called once, every application launch.
 * During runtime, the frontend will cache the server list via IndexedDB.
 */
async getServerList() : Promise<Result<Server32[], string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("get_server_list") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * This function is called to destroy the server info semaphore.
 * We do this to clear the waiting list of permits, or to change the limit.
 * NOTE: Eventually we will want to let users pick how many servers to query at once.
 */
async updateServerInfoSemaphore(maxUpdates: number) : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("update_server_info_semaphore", { maxUpdates }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * This function is called to destroy the server info semaphore.
 * We do this to clear the waiting list of permits, or to change the limit.
 * NOTE: Eventually we will want to let users pick how many servers to query at once.
 */
async destroyServerInfoSemaphore() : Promise<Result<null, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("destroy_server_info_semaphore") };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
/**
 * This function is used to fetch data from a URI.
 * We do this here to avoid CORS issues.
 */
async fetch(uri: string) : Promise<Result<string, string>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("fetch", { uri }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async checkForUpdates() : Promise<string> {
return await TAURI_INVOKE("check_for_updates");
}
}



/** user-defined types **/

/**
 * 32 Bit Mod Data Structure (JS can't handle i64)
 */
export type Mod32 = { workshop_id: string; name: string }
export type Player = { steam_id: string; name: string; nick_name: string; avatar: number[]; is_banned: boolean }
/**
 * 32 Bit Server Data Structure (JS can't handle i64)
 */
export type Server32 = { addr: string; game_port: number; steam_id: string; name: string; app_id: string; game_dir: string; version: string; product: string; region: number; players: number; max_players: number; bots: number; map: string; secure: boolean; dedicated: boolean; os: string; game_type: string; mod_list?: Mod32[] | null; ping?: number | null }

/** tauri-specta globals **/

         import { invoke as TAURI_INVOKE } from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
  listen: (
    cb: TAURI_API_EVENT.EventCallback<T>
  ) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
  once: (
    cb: TAURI_API_EVENT.EventCallback<T>
  ) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
  emit: T extends null
    ? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
    : (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
  | { status: "ok"; data: T }
  | { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
  mappings: Record<keyof T, string>
) {
  return new Proxy(
    {} as unknown as {
      [K in keyof T]: __EventObj__<T[K]> & {
        (handle: __WebviewWindow__): __EventObj__<T[K]>;
      };
    },
    {
      get: (_, event) => {
        const name = mappings[event as keyof T];

        return new Proxy((() => {}) as any, {
          apply: (_, __, [window]: [__WebviewWindow__]) => ({
            listen: (arg: any) => window.listen(name, arg),
            once: (arg: any) => window.once(name, arg),
            emit: (arg: any) => window.emit(name, arg),
          }),
          get: (_, command: keyof __EventObj__<any>) => {
            switch (command) {
              case "listen":
                return (arg: any) => TAURI_API_EVENT.listen(name, arg);
              case "once":
                return (arg: any) => TAURI_API_EVENT.once(name, arg);
              case "emit":
                return (arg: any) => TAURI_API_EVENT.emit(name, arg);
            }
          },
        });
      },
    }
  );
}

     