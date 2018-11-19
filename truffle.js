require('dotenv').config();
require('babel-register');
require('babel-polyfill');

require('babel-node-modules')([
  'openzeppelin-solidity'
])

var secrets = require("./.keystore/secrets.json");

var WalletProvider = require("truffle-wallet-provider");
var keystore = require('fs').readFileSync('./.keystore/token.keystore').toString();
var wallet = require('ethereumjs-wallet').fromV3(keystore, secrets.keyStorePass);

module.exports = {
  solc: {
    optimizer: {
      enabled: false,
      runs: 200
    }
  },
  // mocha: {
  //   reporter: 'eth-gas-reporter',
  //   reporterOptions : {
  //     currency: 'USD'
     
  //   }
  // },
  networks: {

      local: {
          host: 'localhost',
          port: 9545,
          network_id: '*', // eslint-disable-line camelcase
          gasPrice: 4500000000,
          gasLimit: 5000000,
      },

      rinkeby: {
        provider: new WalletProvider(wallet, "https://rinkeby.infura.io/" + secrets.infuraApiKey),
        network_id: 4,
        gasPrice: 7500000000,
        gasLimit: 5000000,
      },
  },

};
