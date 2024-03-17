package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/kocierik/ACMEsky/airlineService/db"
	"github.com/kocierik/ACMEsky/airlineService/handlers"
)

func main() {
	DB := db.Init()
	h := handlers.New(DB)

	router := gin.Default()

	router.GET("/getTicket", h.GetTicketByID)
	router.GET("/getFlights", h.GetFlights)
	router.POST("/flights", h.CreateFlight)

	log.Println("API is running!")
	log.Println("EXAMPLE REQUEST: ")
	log.Println("http://localhost:8085/getFlights?departure=AAA&arrival=BBB&departureDate=2023-12-25")
	log.Println("http://localhost:8085/getTicket?id=1")
	router.Run(":8085")
}
