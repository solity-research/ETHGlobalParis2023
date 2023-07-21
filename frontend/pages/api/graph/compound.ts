import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const marketQuery = `
    query {
        markets {
            borrowRate
            cash
            collateralFactor
            exchangeRate
            interestRateModelAddress
            name
            reserves
            supplyRate
            symbol
            id
            totalBorrows
            totalSupply
            underlyingAddress
            underlyingName
            underlyingPrice
            underlyingSymbol
            reserveFactor
            underlyingPriceUSD
        }
    }
    
`

const compound = "https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2"

const sendGraphqlRequest = async(endpoint:string,query:string):Promise<string> =>{
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
    const response = await sendGraphqlRequest(compound,marketQuery)
    if(response == ""){
      res.status(500).json({ error: 'Something went wrong.' });
    }
    res.json(response);
}
