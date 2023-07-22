import { Contract, providers, Wallet } from "ethers"
import type { NextApiRequest, NextApiResponse } from "next"
import CreditScore from "../../../contract_abi/CreditScore.json"
import { Network, Alchemy } from 'alchemy-sdk';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY
    const ethereumNetwork = process.env.DEFAULT_NETWORK
    const alchemyApiKey = process.env.ALCHEMY_API_KEY
    const contractAddress = process.env.CREDITSCORE_CONTRACT_ADDRESS
    
    console.log("ethereumPrivateKey", ethereumPrivateKey, ethereumNetwork, alchemyApiKey, contractAddress)

    const provider = new providers.AlchemyProvider("maticmum", alchemyApiKey)
    
    const signer = new Wallet(ethereumPrivateKey, provider)
    const contract = new Contract(contractAddress, CreditScore.abi, signer)

    const { creditScore, merkleTreeRoot,nullifierHash,proof } = req.body

    try {

        
        const transaction = await contract.sendCreditScore(creditScore, merkleTreeRoot,nullifierHash,proof);

        await transaction.wait()

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
}