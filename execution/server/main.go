package main

import (
	"ETHGlobalParis2023/execution/server/router"
	"github.com/joho/godotenv"
	"log"
	"net/http"
)

func main() {
	if err := godotenv.Load("server.env"); err != nil {
		log.Fatalf("Failed to load the env vars: %v", err)
	}

	rtr := router.New()

	log.Print("Server listening on http://localhost:3000/")

	if err := http.ListenAndServe(":3002", rtr); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
}
