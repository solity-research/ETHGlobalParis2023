package constants

import (
	"ETHGlobalParis2023/execution/score/structs"
	"strings"
)

func GetEthereumAAVEEthereumAddresses() (addresses []structs.AAVEAssets) {
	addresses = []structs.AAVEAssets{

		{
			BaseTokenAddress:       strings.ToUpper("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
			CollateralTokenAddress: strings.ToUpper("0x018008bfb33d285247A21d44E50697654f754e63"),
			DebtTokenAddress:       strings.ToUpper("0xcF8d0c70c850859266f5C338b38F9D663181C314"),
			ChainlinkOracleAddress: strings.ToUpper("0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9"),
		},
	}

	return
}

func GetEthereumAAVEPolygonAddresses() (addresses []structs.AAVEAssets) {
	addresses = []structs.AAVEAssets{

		// DAI
		{
			BaseTokenAddress:       strings.ToUpper("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"),
			CollateralTokenAddress: strings.ToUpper("0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE"),
			DebtTokenAddress:       strings.ToUpper("0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC"),
			ChainlinkOracleAddress: strings.ToUpper("0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D"),
		},
		/*
			// DAI
			{
			BaseTokenAddress:       strings.ToUpper("0xF14f9596430931E177469715c591513308244e8F"),
			CollateralTokenAddress: strings.ToUpper("0xFAF6a49b4657D9c8dDa675c41cB9a05a94D3e9e9"),
			DebtTokenAddress:       strings.ToUpper("0xBc4Fbe180979181f84209497320A03c65E1dc64B"),
			},

		*/
	}

	return
}
