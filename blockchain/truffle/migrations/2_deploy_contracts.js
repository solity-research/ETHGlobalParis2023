var ProofStore = artifacts.require("ProofStore");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(ProofStore);
};