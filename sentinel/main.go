package main

import (
	"sync"

	"ftl-api/log"
	"ftl-api/sentinel"
	"ftl-api/server"
)

func main() {
	// Initialize the logger
	log.Init()

	// Start the sentinel and server
	wg := sync.WaitGroup{}
	wg.Add(2)
	go sentinel.Start()
	go server.Start()

	// Hang forever
	wg.Wait()
}
