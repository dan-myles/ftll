package server

type FTLAPIServerList struct {
	ServerMap map[string]FTLAPIServer `json:"serverMap"`
}

type FTLAPIServer struct {
	Ip         string      `json:"addr"`
	GamePort   int         `json:"gamePort"`
	SteamId    string      `json:"steamId"`
	Name       string      `json:"name"`
	AppId      int         `json:"appId"`
	GameDir    string      `json:"gameDir"`
	Version    string      `json:"version"`
	Product    string      `json:"product"`
	Region     int         `json:"region"`
	Players    int         `json:"players"`
	MaxPlayers int         `json:"maxPlayers"`
	Bots       int         `json:"bots"`
	Map        string      `json:"map"`
	Secure     bool        `json:"secure"`
	Dedicated  bool        `json:"dedicated"`
	Os         string      `json:"os"`
	GameType   string      `json:"gameType"`
	ModList    []FTLAPIMod `json:"modList"`
}

type FTLAPIMod struct {
	WorkshopId int    `json:"workshopId"`
	Name       string `json:"name"`
}
