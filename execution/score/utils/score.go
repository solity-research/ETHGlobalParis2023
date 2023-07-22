package ethGlobalParisUtils

import (
	"ETHGlobalParis2023/execution/score/oracle"
	"ETHGlobalParis2023/execution/score/structs"
	"errors"
	"log"
)

func CalculateAAVEScore(input []structs.AAVEAccountBalance) (score float64, err error) {

	currentScore := float64(0)
	totalErrs := 0

	for _, asset := range input {
		debtScore, err := calculateAAVEAssetDebtRatioScore(asset)

		if err != nil {
			totalErrs += 1
			continue
		}

		currentScore += debtScore

		log.Println(currentScore)
	}

	// Calculate the score

	// Sanity check
	if len(input)-totalErrs <= 0 {
		// Error handling TODO
		err = errors.New("score cannot be calculated right now")
		return
	}

	score = currentScore / (100 * float64(len(input)-totalErrs))
	return
}

func calculateAAVEAssetDebtRatioScore(input structs.AAVEAccountBalance) (score float64, err error) {
	// Sanity Check
	if input.PositiveBalance <= 0 && input.NegativeBalance > 0 {
		input.PositiveBalance = 1
	} else if input.PositiveBalance <= 0 {
		err = errors.New("the account has no positive balance for the given asset")
		return
	}

	price, getErr := oracle.Get1InchPrice(input.BaseToken)

	ratio := float64(-1)

	if getErr != nil {
		ratio = input.NegativeBalance / input.PositiveBalance
	} else {
		priceFloat64, _ := price.Float64()
		ratio = (input.NegativeBalance * priceFloat64) / (input.PositiveBalance * priceFloat64)
	}

	score = (1 - ratio) * 100

	return
}
