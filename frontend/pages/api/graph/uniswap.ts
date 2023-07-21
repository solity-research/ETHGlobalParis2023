import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const positionQuery = `
  query HomeData {
    positions {
      owner
      liquidity
      pool {
        volumeToken0
        volumeToken1
        id
        liquidity
        token1 {
          name
          volume
          totalValueLocked
          symbol
        }
        token0 {
          name
          volume
          totalValueLocked
          symbol
        }
      }
    }
    tokenHourDatas {
      priceUSD
      low
      high
      volume
      token {
        name
        symbol
      }
    }
  }
`;

const poolQuery = `
    query HomeData {
        pools {
        liquidity
        token1 {
            name
            symbol
            totalSupply
            volume
        }
        token0 {
            name
            symbol
            totalSupply
            volume
        }
        id
        }
    }
`

const uniswapAnalysis = `
  query MyQuery {
    uniswapDayDatas(first: 30) {
      date
      feesUSD
      tvlUSD
      txCount
      volumeETH
      volumeUSD
      volumeUSDUntracked
      id
    }
    transactions(first: 4) {
      gasPrice
      gasUsed
      swaps {
        token0 {
          totalSupply
          id
          name
        }
        token1 {
          name
          totalSupply
          id
        }
        amountUSD
        transaction {
          blockNumber
          id
        }
        id
      }
      id
    }
    tokenDayDatas {
      feesUSD
      date
      high
      low
      open
      priceUSD
      volumeUSD
      totalValueLockedUSD
      token {
        name
        totalSupply
        totalValueLockedUSD
        volumeUSD
        id
      }
      id
    }
    poolDayDatas {
      date
      feesUSD
      high
      id
      liquidity
      low
      open
      token0Price
      token1Price
      volumeToken0
      volumeToken1
    }
  }
`

const uniswapV3 = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"

const sendGraphqlRequest = async (endpoint: string, query: string): Promise<string> => {
    try {
        const response = await axios.post(endpoint, {
            query: query,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return "";
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await sendGraphqlRequest(uniswapV3, uniswapAnalysis)
    if (response == "") {
        res.status(500).json({ error: 'Something went wrong.' });
    }
    res.json(response);
}
