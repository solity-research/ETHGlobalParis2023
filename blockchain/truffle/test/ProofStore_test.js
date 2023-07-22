var ProofStore = artifacts.require("ProofStore");

contract("ProofStore", (accounts) => {

  it("should be able to post a string", async () => {
    const proofStoreInstance = await ProofStore.deployed();
    result = await proofStoreInstance.sendProof("Testing!", {from: accounts[0]})
    assert.equal(result.logs[0].args.data, "Testing!", "event does not have the specified input");
  });
});