package router

import (
	"ETHGlobalParis2023/execution/server/handlers"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"time"
)

// New registers the routes and returns the router.
func New() *gin.Engine {
	router := gin.Default()

	ethereumClient, err := ethclient.Dial(os.Getenv("RPC_URL_ETH"))

	if err != nil {
		log.Fatalf("Failed to initialize the blockchain cleint: %v", err)
	}

	polygonClient, err := ethclient.Dial(os.Getenv("RPC_URL_POLYGON"))

	if err != nil {
		log.Fatalf("Failed to initialize the blockchain cleint: %v", err)
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "DELETE", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/:address", handlers.ScoreHandler(ethereumClient, polygonClient))

	return router
}
