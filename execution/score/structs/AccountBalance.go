package structs

import "github.com/ethereum/go-ethereum/ethclient"

type AAVEAccountBalance struct {
	BaseToken              string
	ChainlinkOracleAddress string
	BlockchainClient       *ethclient.Client
	PositiveBalance        float64
	NegativeBalance        float64
}

type AAVEAssets struct {
	BaseTokenAddress       string
	CollateralTokenAddress string
	DebtTokenAddress       string
	ChainlinkOracleAddress string
}
