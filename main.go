package main

import (
	"context"
	"log"
	"net/http"
)

func main() {
	setupAPI()
	log.Println("Starting server on localhost:8080")
	log.Fatal(http.ListenAndServeTLS("localhost:8080", "server.crt", "server.key", nil))
}

func setupAPI() {

	ctx := context.Background()

	manager := NewManager(ctx)

	http.Handle("GET /", http.FileServer(http.Dir("./frontend")))
	http.HandleFunc("GET /ws", manager.serveWS)
	http.HandleFunc("POST /login", manager.loginHandler)
}
