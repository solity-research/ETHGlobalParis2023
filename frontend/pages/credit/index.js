import { useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity"
import axios from "axios";
import { ethers } from "ethers";
import CreditDecentrale from "../../contract_abi/CreditDecentrale.json"
import { create } from 'ipfs-http-client';
import dynamic from "next/dynamic"
import { Group } from "@semaphore-protocol/group"
import { generateProof } from "@semaphore-protocol/proof"
import { BigNumber, utils } from 'ethers';


const CreditScore = () => {
    const saveScoreText = "Save Score"
    const showScoreText = "Show Score"
    const createIdentityText = "Create Identity"
    const [_identity, setIdentity] = useState()
    const [onChain, setOnChain] = useState(false)
    const [getScoreIsCalled, setGetScoreIsCalled] = useState(false)
    const [_users, setUsers] = useState([])
    const [score,setScore] = useState()
    const [showScore,setShowScore] = useState(false)
    const [buttonText, setButtonText] = useState(createIdentityText)
    const initialTime = 60; // Two minutes in seconds
    const [time, setTime] = useState(0);
    const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
    const [pdfUrl, setPdfUrl] = useState('');
    const [cid, setCid] = useState("");

    const createIdentity = () => {
        const identity = new Identity()
        console.log(identity);
        setIdentity(identity);
        setButtonText(showScoreText);
    }

    const fetchPdfFromIPFS = async (ipfsCid) => {
        setCid("https://ipfs.io/ipfs/" + ipfsCid + "/outputs/")
        setPdfUrl("https://ipfs.io/ipfs/" + ipfsCid + "/outputs/result.pdf")
    }

    const runGetScore = async () => {
        if (typeof window.ethereum !== 'undefined') {
            // Use the provider from Metamask
            const contractAddress = "0x6bE0b3479d264e319749c85FB1470AFf68C9CF6E"
            var urlInfo = {
                url: 'https://api.calibration.node.glif.io/rpc/v0'
            };
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, CreditDecentrale.abi, signer);
            const valueInWei = ethers.utils.parseEther("0.04"); // Sending 1 ether (1.0 ether)
            const tx = await contract.GetScore({
                value: valueInWei // Include the value (in wei) using the overrides parameter
            });
            tx.wait(); // Wait for the transaction to be mined
        } else {
            // Handle the case where Metamask is not installed or not available
            // You can prompt the user to install Metamask or switch to an Ethereum-enabled browser
            console.log('Metamask is not installed or not available');
        }

    }

    const refreshCid = async () => {
        setTime(initialTime)
        const contractAddress = "0x6bE0b3479d264e319749c85FB1470AFf68C9CF6E"
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, CreditDecentrale.abi, signer);
        const tx = await contract.getMyCreditScoreCID();
        if (tx.length > 10) {
            fetchPdfFromIPFS(tx)
        }
    }

    useEffect(() => {
        let timer;
        if (time > 0) {
            timer = setTimeout(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000); // Update the timer every 1 second (1000 milliseconds)
        }

        return () => {
            clearTimeout(timer);
        };
    }, [time]);

    // Convert seconds to minutes:seconds format (e.g., 120 seconds -> "2:00")
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const saveScoreToContract = () => {

    }

    const joinGroup = async () => {
        const response = await fetch("api/sem/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identityCommitment: _identity.commitment.toString()
            })
        })
        console.log(response);
        if (response.status == 200) {
            //addUsers(_identity.commitment.toString())
        }
    }

    const openScoreText = () => {
            const newUsers = _identity.commitment.toString();
            console.log("newwwUsers:", newUsers);
            setUsers([newUsers]);
        }
    }

    useEffect(() => {
        const sendCreditScore = async() => {
            //console.log("GROUP_ID:", process.env.GROUP_ID);
            console.log("userssssss:", _users);
            const group = new Group(516,  16,_users)
            console.log("group:", group);
            console.log("İdentity:", _identity);
            const creditScore = getCreditScore();
                    const signal = creditScore;
                    console.log("signal:", signal);
                    
                    const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
                        _identity,
                        group,
                        516,
                        signal
                    )
                    console.log("proof:","merkleTree","nullifierHash", proof, merkleTreeRoot, nullifierHash);
                    const response = await fetch("api/sem/proof", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            creditScore: signal,
                            merkleTreeRoot: merkleTreeRoot,
                            nullifierHash: nullifierHash,
                            proof: proof 
                        })
                    })
                    console.log("RESPONSEEE",response);
        }
        if(_users.length > 0){
            sendCreditScore();
        }
    }, [_users])

    
    

    
        const getCreditScore = () =>{
            //TODO get credit score
            return 200;
        }      
    
    const openScoreText = () =>{
        setShowScore(true);
        setTime(initialTime)
        setButtonText(saveScoreText);
        runGetScore()
    }

    useEffect(() => {
        const getCreditScore = async () => {
            //TODO get credit score
            const walletAddress = localStorage.getItem("account") ?? "0xd4cb36e89074608e36cd138ea4bbdc8eff1cafaf"
            const response = await axios.get("http://localhost:3002/" + walletAddress)
            setScore(response.data.Score)
        }
        getCreditScore()
        if (_identity != null) {
            joinGroup();
        }
    }, [_identity])

    return (
        <div>
            <div class="flex flex-wrap gap-x-4 mt-10 mx-20  overflow-hidden rounded-lg border sm:gap-y-4 lg:gap-6">
                <div class="flex flex-1 flex-col justify-between py-4 ">
                    {!pdfUrl && _identity != undefined &&
                        <div class="mx-32">
                            <label class="relative inline-flex items-center mb-4 cursor-pointer">
                                <input type="checkbox" onChange={(value) => setOnChain(val => !val)} value={onChain} class="sr-only peer" />
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{onChain ? "On-Chain" : "Off-Chain"}</span>
                            </label>
                            <div class="mt-5">
                                <label for="trapdoor" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Trapdoor</label>
                                <input disabled value={_identity.trapdoor.toString()} name="trapdoor" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>
                            <div class="mt-5">
                                <label for="nullifier" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Nullifier</label>
                                <input disabled value={_identity.nullifier.toString()} name="nullifier" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>
                            <div class="mt-5">
                                <label for="commitment" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Commitment</label>
                                <input disabled value={_identity.commitment.toString()} name="commitment" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>
                        </div>
                    }
                    {!pdfUrl && showScore && !onChain &&
                        <div class="mx-32">
                            <div class="mt-5">
                                <label for="trapdoor" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Your Score</label>
                                <input disabled value={score} name="trapdoor" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>
                        </div>
                    }
                    {!pdfUrl && showScore && onChain &&
                        <div class="mx-32">
                            <div class="mt-5">
                                <button onClick={refreshCid} type="button" className={`text-white w-full bg-gradient-to-r ${time != 0 ? "bg-gray-600" : "from-cyan-400 via-cyan-500 to-cyan-600"} hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}>Time remaining: {formatTime(time)}</button>
                            </div>
                        </div>
                    }
                    {showScore && onChain && (pdfUrl ? (
                        <iframe style={{ "height": "500px", "width": "1400px" }} src={pdfUrl} />
                    ) : (
                        <div>Loading PDF...</div>
                    ))}
                    <div class="mx-32 mt-20">
                        {cid && <a href={cid} className="text-black  mb-10  font-medium  text-sm px-5 py-2.5 text-center mr-2">Go to File</a>}
                        <button onClick={buttonText == showScoreText ? openScoreText : buttonText == saveScoreText ? saveScoreToContract : createIdentity} type="button" className="text-white w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{buttonText}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditScore;