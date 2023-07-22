// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProofStore {

  address private owner;
  address private ownerForRegistiration = 0xfe9f407cb3223433EE11031a79E0EDd40371C52b;

  mapping(string=>address) usersWallet;

  event ProofReceived(string data);
  
  modifier onlyAdmin{
    require(ownerForRegistiration == msg.sender);
    _;
  }

  constructor() {
     owner = msg.sender;
  }

  function registerUser(string memory userNullifier,address userWallet) external payable{
      usersWallet[userNullifier] = userWallet;
  }

  function isUserRegistered(string memory userNullifier) external view returns(bool){
      return usersWallet[userNullifier] != address(0);
  }

  function isUserWalletCorrect(string memory userNullifier,address userWallet) external view returns(bool){
      require(usersWallet[userNullifier] != address(0));
      return usersWallet[userNullifier] == userWallet;
  }

  function sendProof(string memory data) public {
        emit ProofReceived(data);
  }

}
