// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProofStore {

  address private owner;

  event ProofReceived(string data);

  constructor() {
     owner = msg.sender;
  }

  function sendProof(string memory data) public {
        emit ProofReceived(data);
    }

}
