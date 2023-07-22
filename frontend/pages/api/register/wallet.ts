import { Contract, providers, Wallet } from "ethers"
import type { NextApiRequest, NextApiResponse } from "next"
import ProofStore from "../../../contract_abi/ProofStore.json"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY
    const ethereumNetwork = process.env.DEFAULT_NETWORK
    const alchemyApiKey = process.env.ALCHEMY_API_KEY
    const contractAddress = process.env.CREDITSCORE_CONTRACT_ADDRESS

    console.log("ethereumPrivateKey", ethereumPrivateKey, ethereumNetwork, alchemyApiKey, contractAddress)

    const provider = new providers.AlchemyProvider("maticmum", alchemyApiKey)
    
    const signer = new Wallet(ethereumPrivateKey, provider)
    const contract = new Contract(contractAddress, ProofStore.abi, signer)

    const { userNullifier,wallet } = req.body

    try {
        const transaction = await contract.registerUser(userNullifier,wallet)

        await transaction.wait()

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }

}
