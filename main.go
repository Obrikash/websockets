package main

import (
	"log"
	"net/http"
)

func main() {
	setupAPI()
	log.Println("Starting server on localhost:8080")
	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}

func setupAPI() {
	manager := NewManager()

	http.Handle("/", http.FileServer(http.Dir("./frontend")))
	http.HandleFunc("/ws", manager.serveWS)
}
