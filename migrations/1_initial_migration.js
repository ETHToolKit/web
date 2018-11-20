var Migrations = artifacts.require("./Migrations.sol");
var FreeDropper = artifacts.require("./FreeDropper.sol");
var MintableTokenTemplate = artifacts.require("./MintableTokenTemplate.sol");
var TokenFactory = artifacts.require("./TokenFactory.sol");

module.exports = function (deployer, network, accounts) {
  deployer.then(function () {
    return new Promise((res, rej) => {
      console.log('display this shit');
      deployer.deploy(Migrations).then(() => {
        deployer.deploy(FreeDropper).then(() => {
          deployer.deploy(MintableTokenTemplate).then(() => {
            deployer.deploy(TokenFactory).then(() => {
              FreeDropper.deployed().then(() => {
                MintableTokenTemplate.deployed().then((template) => {
                  TokenFactory.deployed().then(function (factory) {
                    console.log('register template - once in deployment ', factory.address);
                    factory.addTemplate("MintableToken", template.address).then(() => {
                      console.log('create from template - once for every token');
                      factory.createToken("MintableToken", { gas: 5000000, from: accounts[2] }).then(({ logs }) => {
                        console.log('token created, time to initialize from owner account');

                        MintableTokenTemplate.at(logs[0].args._token).then((instance) => {
                          instance.init(8, "Super Token", "ST", true, "1000000000000", accounts[3], { gas: 5000000, from: accounts[2] }).then(() => {
                            res(true);
                          });
                        });
                      });
                    }).catch(() => {
                      console.log('error');
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
