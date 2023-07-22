package main

import (
	ethGlobalParisUtils "ETHGlobalParis2023/execution/score/utils"
	"fmt"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
)

func main() {
	// Load the env
	if err := godotenv.Load("score.env"); err != nil {
		log.Fatalf("Failed to load the env vars: %v", err)
	}

	ethereumClient, err := ethclient.Dial(os.Getenv("RPC_URL_ETH"))

	if err != nil {
		log.Fatalf("Failed to initialize the blockchain cleint: %v", err)
	}

	polygonClient, err := ethclient.Dial(os.Getenv("RPC_URL_POLYGON"))

	if err != nil {
		log.Fatalf("Failed to initialize the blockchain cleint: %v", err)
	}

	temp := ethGlobalParisUtils.CalculateAAVEStatus(os.Getenv("TARGET_ADDRESS"), ethereumClient, polygonClient)

	if len(temp) <= 0 {
		fmt.Println("STATUS: FAIL")
		return
	}

	score, err := ethGlobalParisUtils.CalculateAAVEScore(temp)

	if err != nil {
		fmt.Println("STATUS: FAIL")
		return
	}

	fmt.Println("STATUS: SUCCESS")
	fmt.Printf("SCORE: %v \n", score)

}
