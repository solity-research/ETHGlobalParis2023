package oracle

import (
	"encoding/json"
	"errors"
	"io"
	"log"
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

	log.Println(target)

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
