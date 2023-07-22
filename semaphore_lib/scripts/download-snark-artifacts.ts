import { ethers } from 'ethers';
const SemaphoreGroupsABI = require('../abis/SemaphoreGroupsABI.json')
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { verify } from 'crypto';

const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
// we get this with npx hardhat node and this is setup in hardhat.config.ts
const provider = new ethers.providers.JsonRpcProvider('http://0.0.0.0:8545');
const signer = new ethers.Wallet(privateKey, provider);

// Contract details
const semaphoreGroupsAddress = '0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131';
const semaphoreGroupsContract = new ethers.Contract(semaphoreGroupsAddress, SemaphoreGroupsABI, signer);
const admin = signer.address // this is "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" but should be our frontend controlled wallet

// Function parameters
const groupId = 73; //example value
const merkleTreeDepth = 16; // example value but should be between 16 and 32

// this is done on-chain mumbai
async function createNewGroup() {
    try {
        console.log("Verifier Address:")
        const verifierAddress = await semaphoreGroupsContract.verifier();
        // This is correctly fetched
        console.log(verifierAddress)
        console.log("Creating Group!")
        // WTF?!?!?!?!?!?!?
        const tx = await semaphoreGroupsContract.createGroup(groupId, merkleTreeDepth, admin);
        await tx.wait();

        console.log('Group created successfully!');
    } catch (error) {
        console.error('Error creating group:', error);
    }
}

// this is done in the frontend
function createIDs() {
    const ID_U = new Identity() // Identity of User
    const ID_A = new Identity() // Identity of AAVE representative
    return { ID_U, ID_A }
}

async function addNewCommitments(commitment_U: string, commitment_A: string) {
    try {
        const tx = await semaphoreGroupsContract.addMemebers(groupId, [commitment_U, commitment_A]);
        await tx.wait();
        console.log('Commitments added to group successfully!');
    } catch (error) {
        console.error('Error creating group:', error);
    }

}

// PWD is given manually to address U from address A check @Dogukan's tablet
async function generateNewProof(ID_U: Identity, address_U: string, address_A: string, pwd: string) {
    const externalNullifier = semaphoreGroupsContract.getMerkleTreeRoot(groupId);
    const signal = address_U + address_A + pwd// Address of AAVE concatenated with address of User concatenated with the password given manually from AAVE to the user. We are using that so that AAVE can be sure that we are doing it spcifically for them. 
    var { group, merkleTreeDuration } = await semaphoreGroupsContract.groups(groupId);
    const fullProof = await generateProof(ID_U, group, externalNullifier, signal) // if we need the snark artifcat 
}

async function validateProof(address_U: string, address_A: string, pwd: string, fullProof: string) {
    const merkleTreeRoot = await semaphoreGroupsContract.groups(groupId).merkleTreeRoot
    const signal = address_U + address_A + pwd // Address of AAVE concatenated with address of User concatenated with the password given manually from AAVE to the user. We are using that so that AAVE can be sure that we are doing it spcifically for them. 

    const externalNullifier = semaphoreGroupsContract.getMerkleTreeRoot(groupId);
    //TODO try with what nullifier hash of U and then A idk which exactly it is
    // await semaphoreGroupsContract.proof(groupId, merkleTreeRoot, signal, nulliefierHash, externalNullifier, fullProof)
}

async function main() {
    // offchain
    const { ID_U, ID_A } = createIDs()
    const commitment_U = ID_U.getCommitment().toString(); // Identity of User
    const commitment_A = ID_A.getCommitment().toString(); // Identity of AAVE representative
    // onchain
    await createNewGroup();
    // onchain
    await addNewCommitments(commitment_U, commitment_A);
    // offchain
    // I'm not sure what the identity here represents (if it is only commitment or everything concatinated) it should be that of U however
    await generateNewProof(ID_U, "", "", "")
    // await validateProof(address_U, )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })