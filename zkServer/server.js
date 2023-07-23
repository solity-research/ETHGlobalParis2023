import express from 'express';
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import {ethers} from "ethers"

BigInt.prototype.toJSON = function() { return this.toString() }

const CONTRACT_ADDRESS = "0x94b0A45374Cda89f4fc769cA2f16A13daFaBd6C1"
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "identityCommitment",
                "type": "uint256"
            }
        ],
        "name": "joinGroup",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "creditScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "merkleTreeRoot",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nullifierHash",
                "type": "uint256"
            },
            {
                "internalType": "uint256[8]",
                "name": "proof",
                "type": "uint256[8]"
            }
        ],
        "name": "sendCreditScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "semaphoreAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_groupId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "commitments",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCommitments",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "groupId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "semaphore",
        "outputs": [
            {
                "internalType": "contract ISemaphore",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const RPC_URI = "https://rpc.ankr.com/polygon_mumbai"
const GROUP_ID = 3245
const EXTERNAL_NULLIFIER = ethers.encodeBytes32String("123456789")


var provider = new ethers.JsonRpcProvider(RPC_URI)

  const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
      )

const app = express();

app.get('/identity/:seed', (req, res) => {
    const identity = new Identity(req.params.seed)
    res.send(identity);
})

app.get('/getCommitments', async (req, res) => {
    const commitments = await contract.getCommitments();
    res.send(commitments);
})

app.get('/generateProof/:seed/:score', async (req, res) => {
    
    const commitments = await contract.getCommitments();
    var theGroup = new Group(GROUP_ID, 16)
    var identity = new Identity(req.params.seed)
    var signal = ethers.encodeBytes32String(req.params.score)
    
    commitments.forEach(element => {
        theGroup.addMember(element)
    });
    
    theGroup.addMember(identity.commitment)
    
    var fullProof = await generateProof(identity, theGroup, EXTERNAL_NULLIFIER, signal, {
        zkeyFilePath: "./semaphore.zkey",
        wasmFilePath: "./semaphore.wasm"
    })
    
    res.send(fullProof);
})

app.listen(3003, () => {
    console.log('The application is listening on port 3000!');
})