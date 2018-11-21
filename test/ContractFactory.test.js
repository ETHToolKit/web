const path = require('path');
const scriptName = path.basename(__filename);
const logger = require('../utils/logger')(scriptName);
const ContractFactory = artifacts.require("ContractFactory.sol");
const MintableTokenTemplate = artifacts.require("MintableTokenTemplate.sol");

import { ether } from 'openzeppelin-solidity/test/helpers/ether';
import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert';
const BigNumber = web3.BigNumber;


const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('ContractFactory', function (accounts) {
    var data = {};

    beforeEach(async function () {
        data.factory = await ContractFactory.new();
        data.template = await MintableTokenTemplate.new();
        await data.factory.addTemplate("MintableToken", data.template.address);

    });

    it("Should add template", async function () {

        var {logs} = await data.factory.addTemplate("TestTemplate", data.template.address);
        var templateAddres =  await data.factory.getTemplate("TestTemplate");

        templateAddres.should.be.equals(logs[0].args.templateAddress);

    });

    it("Should not allow to add template by other than contract owner", async function () {

        await data.factory.addTemplate("TestTemplate", data.template.address, {from:accounts[1]}).should.be.rejectedWith(EVMRevert);

    });

    it("Should create template instance", async function () {

        var initData = data.template.init.request(18, "Demo", "DMO", accounts[1],true, 1000000).params[0].data;
        
        var {logs} = await data.factory.createContract("MintableToken", initData);
 
        var newContractAddress = logs[1].args.newContract;
        var contractInstance = MintableTokenTemplate.at(newContractAddress);
        var owner = await contractInstance.owner();

        owner.should.be.equals(accounts[1]);
    });

});
