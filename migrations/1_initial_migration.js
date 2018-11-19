var Migrations = artifacts.require("./Migrations.sol");
var FreeDropper = artifacts.require("./FreeDropper.sol");
var SimpleToken = artifacts.require("./SimpleToken.sol");

module.exports = function(deployer) {
  //deployer.deploy(Migrations);
  deployer.deploy(FreeDropper);
  //deployer.deploy(SimpleToken);
};
