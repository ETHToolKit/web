const path = require('path');
const scriptName = path.basename(__filename);
const logger = require('../utils/logger')(scriptName);
const SimpleToken = artifacts.require("SimpleToken.sol");
const FreeDropper = artifacts.require("FreeDropper.sol");
import { ether } from 'openzeppelin-solidity/test/helpers/ether';

import EVMRevert from 'openzeppelin-solidity/test/helpers/EVMRevert';
const BigNumber = web3.BigNumber;

const TOTAL_SUPPLY = web3.toWei(100000000, 'ether');
const ROUNDING = new BigNumber(1000000);

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

var sample = [
    {
        accounts: [
            "0xFBB0767F60b091dBf846aB044662c04c428D239a",
            "0xD31a851395addE25A3b634A10251732330DFb4c5",
            "0x21C7Df60Ff8553a04dEF50F25F6EdeB284F601d2",
            "0xA07223D5A8501e1C50E694060C445eF05608Cb43",
            "0x1889C19e960556e0EbBAE7B8a8b47Ca378B91ac4",
        ],
        balances: [
            "112200000000000004000000",
            "112200000000000000000100",
            "112200000000000000000005",
            "112200000000000000200007",
            "19500000000000000000001",
        ]
    }
];


contract('TokenDropper', function (accounts) {
    var data = {};

    beforeEach(async function () {
        data.token = await SimpleToken.new();
        data.dropper = await FreeDropper.new();

        await data.token.mint(accounts[1], TOTAL_SUPPLY);
        await data.token.finishMinting();

    });

    it("Should  distribute user tokens", async function () {

        for (var i = 0; i < sample.length; i++) {
            var sum = sumTokens(sample[i].balances);

            logger.debug(`Sum to drop : ${web3.fromWei(sum, 'ether').toFormat(2)} SIMPLE`);

            await data.token.approve(data.dropper.address, sum, { from: accounts[1] });
            await data.dropper.drop(data.token.address, sample[i].accounts, sample[i].balances, sum, { from: accounts[1] });
        }

        var balance = await data.token.balanceOf(sample[0].accounts[4]);
        balance.should.be.bignumber.equal(sample[0].balances[4]);

    });

    it("Should transfer user tokens to _beneficiary", async function () {

        var totalSum = new BigNumber(0);

        for (var i = 0; i < sample.length; i++) {
            var sum = sumTokens(sample[i].balances);

            totalSum = totalSum.plus(sum);

            await data.token.approve(data.dropper.address, sum, { from: accounts[1] });
            await data.dropper.drop(data.token.address, sample[i].accounts, sample[i].balances, sum, { from: accounts[1] });
        }

        logger.debug(`TotalSum to drop : ${web3.fromWei(totalSum, 'ether').toFormat(2)} SIMPLE`);

        var balance = await data.token.balanceOf(accounts[1]);
        logger.debug(`Current balance : ${web3.fromWei(balance, 'ether').toFormat(2)} SIMPLE`);
        balance.should.be.bignumber.equal(new BigNumber(TOTAL_SUPPLY).minus(totalSum));

    });

    it("Should allow withdraw ETH by authorized address", async function () {

        var totalSum = new BigNumber(0);

        var donation = new BigNumber("100000000000000000000000");

        sample[0].accounts.push(data.dropper.address);
        sample[0].balances.push(donation.toString());

        for (var i = 0; i < sample.length; i++) {
            var sum = sumTokens(sample[i].balances);

            totalSum = totalSum.plus(sum);

            await data.token.approve(data.dropper.address, sum, { from: accounts[1] });
            await data.dropper.drop(data.token.address, sample[i].accounts, sample[i].balances, sum, { from: accounts[1] });
        }

        var balanceBefore = await data.token.balanceOf(accounts[0]);

        await data.dropper.withdrawTokens(data.token.address, accounts[0], donation.toString())
        var balanceAfter = await data.token.balanceOf(accounts[0]);

        balanceAfter.should.be.bignumber.equal(donation.plus(balanceBefore));

    });

    it("Should not allow withdraw tokens by unauthorized address", async function () {

        var totalSum = new BigNumber(0);

        var donation = new BigNumber("100000000000000000000000");

        sample[0].accounts.push(data.dropper.address);
        sample[0].balances.push(donation.toString());

        for (var i = 0; i < sample.length; i++) {
            var sum = sumTokens(sample[i].balances);

            totalSum = totalSum.plus(sum);

            await data.token.approve(data.dropper.address, sum, { from: accounts[1] });
            await data.dropper.drop(data.token.address, sample[i].accounts, sample[i].balances, sum, { from: accounts[1] });
        }

        await data.dropper.withdrawTokens(data.token.address, accounts[0], donation.toString(), { from: accounts[1] }).should.be.rejectedWith(EVMRevert);


    });

    it("Should  allow withdraw ETH by authorized address", async function () {

        var totalSum = new BigNumber(0);

        var donation = ether(0.01);

        for (var i = 0; i < sample.length; i++) {
            var sum = sumTokens(sample[i].balances);

            totalSum = totalSum.plus(sum);

            await data.token.approve(data.dropper.address, sum, { from: accounts[1] });
            await data.dropper.drop(data.token.address, sample[i].accounts, sample[i].balances, sum, { from: accounts[1], value: donation});
        }

        const balanceBefore = await  web3.eth.getBalance(accounts[1]);
        await data.dropper.withdrawETH(accounts[1], donation.toString());
        const balanceAfter = await  web3.eth.getBalance(accounts[1]);

        balanceAfter.should.be.bignumber.equal(donation.plus(balanceBefore));

    });

    it("Should not allow withdraw ETH by unauthorized address", async function () {

        var totalSum = new BigNumber(0);

        var donation = ether(0.01);

        for (var i = 0; i < sample.length; i++) {
            var sum = sumTokens(sample[i].balances);

            totalSum = totalSum.plus(sum);

            await data.token.approve(data.dropper.address, sum, { from: accounts[1] });
            await data.dropper.drop(data.token.address, sample[i].accounts, sample[i].balances, sum, { from: accounts[1], value: donation});
        }

        await data.dropper.withdrawETH(accounts[1], donation.toString(), { from: accounts[1]}).should.be.rejectedWith(EVMRevert);

    });

});



var sumTokens = function (balances) {
    var sum = new BigNumber(0);

    for (var i = 0; i < balances.length; i++)
        sum = sum.plus(new BigNumber(balances[i]));

    return sum;
}