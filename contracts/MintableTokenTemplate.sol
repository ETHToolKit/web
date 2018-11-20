pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";


contract MintableTokenTemplate is MintableToken  {

    string public symbol ;
    string public name ;
    uint8 public decimals=255;

    //TODO mint tokens for a team/airdrop etc. in deployment script 
    //TODO finalize after crowdsale ends and distribute all tokens 
    constructor() public  {
    }

    function init(uint8 _decimals,string _name,
      string _symbol, bool _fixedSupply,
      uint256 _amount, address _newOwner) public onlyOwner{
      require(decimals==255);
      require(_decimals<255);
      name = _name;
      symbol=_symbol;
      mint(_newOwner,_amount);
      transferOwnership(_newOwner);
      if(_fixedSupply){
        finishMinting();
      }
    }
    
}
