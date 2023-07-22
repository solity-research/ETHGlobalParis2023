package oracle

import (
	"ETHGlobalParis2023/execution/abis/ChainlinkAggregatorV3"
	"ETHGlobalParis2023/execution/score/structs"
	"encoding/json"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"io"
	"math"
	"math/big"
	"net/http"
	"strings"
)

func Get1InchPrice(address string) (price *big.Float, err error) {
	url := "https://api.1inch.dev/price/v1.1/1/" + address
	method := "GET"

	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)

	if err != nil {
		return
	}

	req.Header.Add("Authorization", "Bearer UuqtMchFL0bdzNiBOp4K38blRvRyT9hu")
	req.Header.Add("Cookie", "__cf_bm=vFWEZRVKk4L.jcf_akD_LakeEpOwzCdY5ZKmugbkRZA-1690035860-0-AfVp9lGe8SfEHYterry6cExNIGNYm72LvpBX8zEjm0sXt3wGhrar6Gz3WH8aa70HSlD9CW5a4/8SLO7umixnIQk=")

	res, err := client.Do(req)

	if err != nil {
		return
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		return
	}

	target := map[string]string{}

	err = json.Unmarshal(body, &target)

	if err != nil {
		return
	}

	value, isOK := target[strings.ToLower(address)]

	if !isOK {
		err = errors.New("error while getting the value")
		return
	}

	price, status := big.NewFloat(0).SetString(value)

	if !status {
		err = errors.New("unable to cast the return value to the big.Float")
	}

	return
}

func GetChainlinkPrice(input *structs.AAVEAccountBalance) (price *big.Float, err error) {
	// Initialize the instance
	aggregatorInstance, err := ChainlinkAggregatorV3.NewAggregatorV3InterfaceCaller(common.HexToAddress(input.ChainlinkOracleAddress),
		input.BlockchainClient)

	if err != nil {
		return
	}

	decimals, err := aggregatorInstance.Decimals(nil)

	if err != nil {
		return
	}

	latestRoundData, err := aggregatorInstance.LatestRoundData(nil)

	if err != nil {
		return
	}

	// Sanity check
	if decimals <= 0 {
		err = errors.New("unable to get meaningful data")
		return
	}

	roundPrice := big.NewFloat(0).SetInt(latestRoundData.Answer)

	price = big.NewFloat(0).Quo(roundPrice, big.NewFloat(math.Pow(10, float64(decimals))))

	return
}
