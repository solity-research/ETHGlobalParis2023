pragma solidity 0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract CreditScore {
    ISemaphore public semaphore;

    uint256 public groupId;
    uint256 private externalNul = 22252025330403739761823611755537792214391358329992882809179600052859407695872;
    
    constructor(address semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;

        semaphore.createGroup(groupId, 16, address(this));
    }

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    function sendCreditScore(
        uint256 creditScore,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, creditScore, nullifierHash, externalNul, proof);
    }
}