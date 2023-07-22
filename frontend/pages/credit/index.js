import { useCallback, useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity"

const CreditScore = () => {
    const saveScoreText = "Save Score"
    const showScoreText = "Show Score"
    const createIdentityText = "Create Identity"
    const [_identity, setIdentity] = useState()
    const [score,setScore] = useState()
    const [showScore,setShowScore] = useState(false)
    const [buttonText, setButtonText] = useState(createIdentityText)

    const createIdentity = () => {
        const identity = new Identity()
        console.log(identity);
        setIdentity(identity);
        setButtonText(showScoreText);
    }
    
    const saveScoreToContract = () =>{

    }

    const joinGroup = async () => {
        const response = await fetch("api/sem/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identityCommitment: _identity.commitment.toString()
            })
        })
    }
    
    const openScoreText = () =>{
        setShowScore(true);
        setButtonText(saveScoreText);
    }

    useEffect(() => {
        const getCreditScore = () => {
            //TODO get credit score
        }
        if(_identity != null){
            joinGroup();
        }
    }, [_identity])
    
    return (
        <div>
            <div class="flex flex-wrap gap-x-4 mt-10 mx-20 overflow-hidden rounded-lg border sm:gap-y-4 lg:gap-6">
                <div class="flex flex-1 flex-col justify-between py-4">
                    {_identity != undefined &&
                        <div class="mx-32">
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
                    {showScore  &&
                        <div class="mx-32">
                            <div class="mt-5">
                                <label for="trapdoor" class="mb-2 inline-block text-sm text-gray-800 sm:text-base">Your Score</label>
                                <input disabled value={score} name="trapdoor" class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring" />
                            </div>
                        </div>
                    }
                    <div class="mx-32 mt-20">
                        <button onClick={buttonText == showScoreText ? openScoreText : buttonText == saveScoreText ? saveScoreToContract : createIdentity} type="button" className="text-white w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{buttonText}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditScore;