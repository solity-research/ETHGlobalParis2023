package handlers

import (
	ethGlobalParisUtils "ETHGlobalParis2023/execution/score/utils"
	serverResponse "ETHGlobalParis2023/execution/server/response"
	"fmt"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-gonic/gin"
)

func ScoreHandler(ethereumClient *ethclient.Client, polygonClient *ethclient.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the address
		targetAddress := c.Param("address")

		temp := ethGlobalParisUtils.CalculateAAVEStatus(targetAddress, ethereumClient, polygonClient)

		if len(temp) <= 0 {
			serverResponse.HandleFail(c, "account not applicable")
			return
		}

		score, err := ethGlobalParisUtils.CalculateAAVEScore(temp)

		if err != nil {
			serverResponse.HandleFail(c, "account not applicable")
			return
		}

		serverResponse.HandleSuccess(c, fmt.Sprint(score))

	}
}
