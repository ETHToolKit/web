var Migrations = artifacts.require("./Migrations.sol");
var FreeDropper = artifacts.require("./FreeDropper.sol");
var MintableTokenTemplate = artifacts.require("./MintableTokenTemplate.sol");
var TokenFactory = artifacts.require("./TokenFactory.sol");

module.exports = function (deployer, network, accounts) {

  deployer.deploy(Migrations).then(() => {
    deployer.then(function () {
      return new Promise((res, rej) => {

        Promise.all([
          deployer.deploy(FreeDropper),
          deployer.deploy(MintableTokenTemplate),
          deployer.deploy(TokenFactory)]).then(() => {
            Promise.all([
              FreeDropper.deployed(),
              MintableTokenTemplate.deployed(),
              TokenFactory.deployed()
            ]).then(function (dropper, template, factory) {
              console.log('display this shit');
              factory.addTemplate("MintableToken", template.address).then(() => {
                res(true);
              });
            });
          });
      });

    });
  });
};
