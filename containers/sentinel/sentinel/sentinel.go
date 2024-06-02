package sentinel

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"ftl-api/dzq"
	"ftl-api/log"
	"github.com/joho/godotenv"
)

var (
	Servers                  ServerList
	ServersMutex             sync.RWMutex
	STEAM_API_KEY            string
	STEAM_API_URL            string
	DAYZ_APP_ID              string
	AMOUNT_OF_WORKERS        int // Concurrent Goroutines
	AMOUNT_OF_SERVERS        int // Max servers to fetch from Steam API
	MAX_SERVER_INFO_ATTEMPTS int // Max attempts to get server info (Mods)
	RETRY_DELAY_SECONDS      int // Delay between attempts
	SCAN_INTERVAL_MINUTES    int // Interval between scans
)

type SteamAPIResponse struct {
	Response struct {
		Servers []Server `json:"servers"`
	} `json:"response"`
}

type ServerList struct {
	ServerMap map[string]Server `json:"servers"`
}

type Server struct {
	Ip         string    `json:"addr"`
	GamePort   int       `json:"gameport"`
	SteamId    string    `json:"steamid"`
	Name       string    `json:"name"`
	AppId      int       `json:"appid"`
	GameDir    string    `json:"gamedir"`
	Version    string    `json:"version"`
	Product    string    `json:"product"`
	Region     int       `json:"region"`
	Players    int       `json:"players"`
	MaxPlayers int       `json:"max_players"`
	Bots       int       `json:"bots"`
	Map        string    `json:"map"`
	Secure     bool      `json:"secure"`
	Dedicated  bool      `json:"dedicated"`
	Os         string    `json:"os"`
	GameType   string    `json:"gametype"`
	ModList    []dzq.Mod `json:"mod_list"`
}

// Start the sentinel
func Start() {
	log.Logger.Info("Initializing sentinel...")

	// Load all environment variables
	err := godotenv.Load()
	if err != nil {
		log.Logger.Fatal("Error loading .env file", err)
		return
	}

	STEAM_API_KEY = os.Getenv("STEAM_API_KEY")
	STEAM_API_URL = os.Getenv("STEAM_API_URL")
	DAYZ_APP_ID = os.Getenv("DAYZ_APP_ID")
	AMOUNT_OF_WORKERS, err = strconv.Atoi(os.Getenv("AMOUNT_OF_WORKERS"))
	AMOUNT_OF_SERVERS, err = strconv.Atoi(os.Getenv("AMOUNT_OF_SERVERS"))
	MAX_SERVER_INFO_ATTEMPTS, err = strconv.Atoi(os.Getenv("MAX_SERVER_INFO_ATTEMPTS"))
	RETRY_DELAY_SECONDS, err = strconv.Atoi(os.Getenv("RETRY_DELAY_SECONDS"))
	SCAN_INTERVAL_MINUTES, err = strconv.Atoi(os.Getenv("SCAN_INTERVAL_MINUTES"))
	if err != nil {
		log.Logger.Fatal("Error parsing environment variables", err)
		return
	}

	if _, b := os.LookupEnv("STEAM_API_KEY"); !b {
		log.Logger.Fatal("STEAM_API_KEY is not set!")
		return
	}

	if _, b := os.LookupEnv("STEAM_API_URL"); !b {
		log.Logger.Fatal("STEAM_API_URL is not set!")
		return
	}

	if _, b := os.LookupEnv("DAYZ_APP_ID"); !b {
		log.Logger.Fatal("DAYZ_APP_ID is not set!")
		return
	}

	if _, b := os.LookupEnv("AMOUNT_OF_WORKERS"); !b {
		log.Logger.Fatal("AMOUNT_OF_WORKERS is not set!")
		return
	}

	if _, b := os.LookupEnv("AMOUNT_OF_SERVERS"); !b {
		log.Logger.Fatal("AMOUNT_OF_SERVERS is not set!")
		return
	}

	if _, b := os.LookupEnv("MAX_SERVER_INFO_ATTEMPTS"); !b {
		log.Logger.Fatal("MAX_SERVER_INFO_ATTEMPTS is not set!")
		return
	}

	if _, b := os.LookupEnv("RETRY_DELAY_SECONDS"); !b {
		log.Logger.Fatal("RETRY_DELAY_SECONDS is not set!")
		return
	}

	if _, b := os.LookupEnv("SCAN_INTERVAL_MINUTES"); !b {
		log.Logger.Fatal("SCAN_INTERVAL_MINUTES is not set!")
		return
	}

	// Make the map
	Servers = ServerList{ServerMap: make(map[string]Server)}
	ServersMutex = sync.RWMutex{}

	// Update server list from remote every 2 minutes
	log.Logger.Info("Starting sentinel...")
	wg := sync.WaitGroup{}
	for {
		wg.Add(1)
		go updateServerListFromRemote(&wg)
		wg.Wait()

		log.Logger.Info("Sleeping for 10 minutes...")
		time.Sleep(time.Duration(SCAN_INTERVAL_MINUTES) * time.Minute)
	}
}

// Grabs from Steam API
func updateServerListFromRemote(wgMain *sync.WaitGroup) error {
	defer wgMain.Done()
	log.Logger.Info("Updating server list from remote...")
	startTime := time.Now()

	// First grab the master server list from the Steam API
	endpoint := "/IGameServersService/GetServerList/v1"
	filter := "?filter=\\appid\\" + DAYZ_APP_ID
	limit := "&limit=" + fmt.Sprint(AMOUNT_OF_SERVERS)
	key := "&key=" + STEAM_API_KEY
	full_url := STEAM_API_URL + endpoint + filter + limit + key

	// Send request
	resp, err := http.Get(full_url)
	if err != nil && resp.StatusCode != 200 {
		log.Logger.Error("Error sending request to steam api", err)
		return err
	}

	// Unmarshal response
	var steamAPIResponse SteamAPIResponse
	err = json.NewDecoder(resp.Body).Decode(&steamAPIResponse)
	if err != nil {
		log.Logger.Error("Error unmarshalling response", err)
		return err
	}

	// Update the server list
	// @see https://github.com/danlikestocode/ftl-api/issues/1
	for _, server := range steamAPIResponse.Response.Servers {
		if server.MaxPlayers > 127 {
			continue
		}

		if server.Players > 127 {
			continue
		}

		Servers.ServerMap[server.Ip] = server
	}

	// Update the mod list for each server and title
	ch := make(chan Server)
	wg := sync.WaitGroup{}
	for i := 0; i < AMOUNT_OF_WORKERS; i++ {
		log.Logger.Debug("Starting worker: #", i)
		wg.Add(1)
		go getModList(ch, &wg)
	}
	for _, server := range steamAPIResponse.Response.Servers {
		ch <- server
	}
	close(ch)
	wg.Wait()

	// Log the time it took to update the servers
	endTime := time.Now()
	executionTime := endTime.Sub(startTime)
	log.Logger.Infof("✅ Finished updating %d servers in %s", len(Servers.ServerMap), executionTime)
	return nil
}

func getModList(ch chan Server, wg *sync.WaitGroup) {
	for server := range ch {
		// Update the title
		// Surprising how many dayz servers have the same map but differently
		// formatted title name??? like bruh
		// There are even some servers with a different map name in their title
		// than the one that is returned from the server query XDD
		// Best part is there are some servers with their map name spelled wrong
		// like Deer Isle will be "Deerilse" 💀
		ServersMutex.Lock()
		server.Map = strings.ToLower(server.Map)
		server.Map = strings.Replace(server.Map, " ", "", -1)
		Servers.ServerMap[server.Ip] = server
		ServersMutex.Unlock()

		if !strings.Contains(strings.ToLower(server.GameType), "mod") {
			log.Logger.Debug("GameType: ", server.GameType)
			log.Logger.Info("Vanilla server found, skipping ModList update...")
			continue
		}

		// Retry server if its unreachable
		for i := 0; i < MAX_SERVER_INFO_ATTEMPTS; i++ {
			modList, err := dzq.GetMods(server.Ip)
			if err != nil {
				log.Logger.Warn("Error querying server, it may be busy: ", server.Ip, " | ", err)
				time.Sleep(time.Duration(RETRY_DELAY_SECONDS) * time.Second)
				continue
			}

			server.ModList = modList
			break
		}

		ServersMutex.Lock()
		Servers.ServerMap[server.Ip] = server
		ServersMutex.Unlock()
	}

	wg.Done()
}
