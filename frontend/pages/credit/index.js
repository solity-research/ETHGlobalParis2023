import { useCallback, useEffect, useState } from "react";
import { Identity } from "@semaphore-protocol/identity"

const CreditScore = () =>{
    const [_identity, setIdentity] = useState()

    const createIdentity = useCallback(async () => {
        const identity = new Identity()
        setIdentity(identity)

    }, [])

    const joinGroup = async() => {
        response = await fetch("api/sem/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identityCommitment: _identity.commitment.toString()
            })
        })
    }
    
    useEffect(()=>{
        const getCreditScore = () =>{
            //TODO get credit score
        }
    },[])

    return(
        <div>
            Ananajsajidpjaspijdipasjipjdiasj
        </div>
    )
}

export default CreditScore;