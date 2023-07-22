package ethGlobalParisUtils

import (
	"ETHGlobalParis2023/execution/abis/ERC20"
	"ETHGlobalParis2023/execution/score/constants"
	"ETHGlobalParis2023/execution/score/structs"
	"math"
	"math/big"

	"github.com/ethereum/go-ethereum/common"

	"github.com/ethereum/go-ethereum/ethclient"
)

func CalculateAAVEStatus(callerAddress string, eClient *ethclient.Client, pClient *ethclient.Client) (accountBalance []structs.AAVEAccountBalance) {
	// Get the corresponding token addresses
	ethAddresses := constants.GetEthereumAAVEEthereumAddresses()
	polygonAddresses := constants.GetEthereumAAVEPolygonAddresses()

	// Convert the given addresses into the corresponding struct
	caller := common.HexToAddress(callerAddress)

	if caller == common.HexToAddress("") {
		return
	}

	iterateThroughTheAddresses(ethAddresses, &accountBalance, caller, eClient)
	iterateThroughTheAddresses(polygonAddresses, &accountBalance, caller, pClient)

	return
}

func getTokenData(callerAddress common.Address, tokenAddress common.Address, bClient *ethclient.Client) (currentBalance float64, err error) {
	// Step 1: Get the amount owned by the specified account
	erc20Instance, err := ERC20.NewErc20Caller(tokenAddress, bClient)

	if err != nil {
		return
	}

	balance, err := erc20Instance.BalanceOf(nil, callerAddress)

	if err != nil {
		return
	}

	// Step 2: Get the decimal of the token

	decimal, err := erc20Instance.Decimals(nil)

	if err != nil {
		return
	}

	// Step 3: Convert the amount owned to big float

	// Sanity check
	if decimal == 0 {
		return
	}

	amountBigFloat := big.NewFloat(0).SetInt(balance)

	decimalBigFloat := big.NewFloat(math.Pow(10, float64(decimal)))

	result := big.NewFloat(0).Quo(amountBigFloat, decimalBigFloat)

	// Convert to float64
	currentBalance, _ = result.Float64()

	return

}

func iterateThroughTheAddresses(inputs []structs.AAVEAssets, output *[]structs.AAVEAccountBalance, caller common.Address, bClient *ethclient.Client) (err error) {
	// Get the balance of the given address in terms of the specified tokens
	for _, address := range inputs {

		// Do calculation for the base token
		baseTokenBalance, err := getTokenData(caller, common.HexToAddress(address.BaseTokenAddress), bClient)

		if err != nil {
			// TODO error handling
			continue
		}

		// Do calculation for the collateral token
		colleteralBalance, err := getTokenData(caller, common.HexToAddress(address.CollateralTokenAddress), bClient)

		if err != nil {
			// TODO error handling
			continue
		}

		// Do calculation for the debt token
		debtBalance, err := getTokenData(caller, common.HexToAddress(address.DebtTokenAddress), bClient)

		if err != nil {
			// TODO error handling
			continue
		}

		*output = append(*output, structs.AAVEAccountBalance{
			BaseToken:              address.BaseTokenAddress,
			PositiveBalance:        baseTokenBalance + colleteralBalance,
			NegativeBalance:        debtBalance,
			ChainlinkOracleAddress: address.ChainlinkOracleAddress,
			BlockchainClient:       bClient,
		})

	}
	return
}
