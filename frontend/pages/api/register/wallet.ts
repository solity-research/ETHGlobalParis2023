import { Contract, providers, Wallet } from "ethers"
import type { NextApiRequest, NextApiResponse } from "next"
import ProofStore from "../../../contract_abi/ProofStore.json"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (typeof process.env.FEEDBACK_CONTRACT_ADDRESS !== "string") {
        throw new Error("Please, define FEEDBACK_CONTRACT_ADDRESS in your .env file")
    }

    if (typeof process.env.DEFAULT_NETWORK !== "string") {
        throw new Error("Please, define DEFAULT_NETWORK in your .env file")
    }

    if (typeof process.env.INFURA_API_KEY !== "string") {
        throw new Error("Please, define INFURA_API_KEY in your .env file")
    }

    if (typeof process.env.ETHEREUM_PRIVATE_KEY !== "string") {
        throw new Error("Please, define ETHEREUM_PRIVATE_KEY in your .env file")
    }

    const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY
    const ethereumNetwork = process.env.DEFAULT_NETWORK
    const infuraApiKey = process.env.INFURA_API_KEY
    const contractAddress = process.env.PROOF_STORE

    const provider = new providers.InfuraProvider(ethereumNetwork, infuraApiKey)

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
