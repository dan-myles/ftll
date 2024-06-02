package server

import (
	"net/http"
	"strings"
	"unsafe"

	"ftl-api/log"
	"ftl-api/sentinel"
	"github.com/google/go-github/v62/github"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

/* Function: Start
* --------------------
* Here we start the HTTP Server, Rate limited at 1 request per second
* Not sure if that is enough but we can always increase it later
**/
func Start() {
	e := echo.New()
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogURI:    true,
		LogStatus: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			log.Logger.Info(
				"Echo Request",
				" | URI: ", v.URI,
				" | Status: ", v.Status,
				" | Method: ", c.Request().Method,
				" | IP: ", c.Request().RemoteAddr,
				" | Time: ", v.StartTime,
				" | User-Agent: ", c.Request().UserAgent(),
			)
			return nil
		},
	}))
	e.Use(middleware.CORS())
	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(1)))
	e.GET("/v1/dayz/servers", dayzServers)
	e.GET("/v1/releases/stable/manifest", getStableManifest)
	e.GET("/v1/releases/nightly/manifest", getNightlyManifest)
	log.Logger.Fatal(e.Start(":8080"))
}

/*
* Function: getMasterServerMap
* --------------------
* This function is responsible for returning the list of servers to the client
* We are returning the list of servers as an array of server objects.
**/
func dayzServers(c echo.Context) error {
	c.Response().Header().Set("Access-Control-Allow-Origin", "*")
	c.Response().Header().Set("Content-Type", "application/json")

	// We are using unsafe to just change tags
	// The structs are identical so this is safe
	sentinel.ServersMutex.RLock()
	alias := (*FTLAPIServerList)(unsafe.Pointer(&sentinel.Servers))
	defer sentinel.ServersMutex.RUnlock()

	return c.JSON(http.StatusOK, alias)
}

func getStableManifest(c echo.Context) error {
	client := github.NewClient(nil)

	// Grab the latest release from the github repo
	release, _, err := client.Repositories.GetLatestRelease(c.Request().Context(), "avvo-na", "ftl-launcher")
	if err != nil {
		log.Logger.Error("Error getting latest release", "error", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// search for latest.json in the assets
	var downloadURL string
	for _, asset := range release.Assets {
		if *asset.Name == "latest.json" {
			// return the json
			downloadURL = *asset.BrowserDownloadURL
		}
	}

	// grab the json
	httpResp, err := http.Get(downloadURL)
	if err != nil {
		log.Logger.Error("Error getting latest.json", "error", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// return the json
	return c.Stream(http.StatusOK, "application/json", httpResp.Body)
}

func getNightlyManifest(c echo.Context) error {
	client := github.NewClient(nil)

	// grab all tags
	tags, _, err := client.Repositories.ListTags(c.Request().Context(), "avvo-na", "ftl-launcher", nil)
	if err != nil {
		log.Logger.Error("Error getting tags", "error", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// find the first "nightly" tag
	// tags are sorted by date, so the first one should be the latest
	var nightlyTag *github.RepositoryTag
	for _, tag := range tags {
		if tag.Name != nil && strings.Contains(*tag.Name, "nightly") {
			nightlyTag = tag
			break
		}
	}

	// grab the latest.json from the nightly tag
	httpResp, err := http.Get("https://github.com/avvo-na/ftl-launcher/releases/download/" +
		*nightlyTag.Name +
		"/latest.json")
	if err != nil {
		log.Logger.Error("Error getting latest.json", "error", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// return the json
	return c.Stream(http.StatusOK, "application/json", httpResp.Body)
}
