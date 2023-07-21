package structs

type AAVEAccountBalance struct {
	BaseToken       string
	PositiveBalance float64
	NegativeBalance float64
}

type AAVEAssets struct {
	BaseTokenAddress       string
	CollateralTokenAddress string
	DebtTokenAddress       string
}
