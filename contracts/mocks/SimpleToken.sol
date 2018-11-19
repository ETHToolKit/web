pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";


contract SimpleToken is MintableToken  {

    string public symbol = "SIMPLE";
    string public name = "Simple token";
    uint8 public decimals = 18;

    //TODO mint tokens for a team/airdrop etc. in deployment script 
    //TODO finalize after crowdsale ends and distribute all tokens 
    constructor() public  {
        mint(msg.sender, 100*10**24);
    }

    
}