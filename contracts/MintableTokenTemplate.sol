pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";


contract MintableTokenTemplate is MintableToken  {

    string public symbol ;
    string public name ;

    //TODO mint tokens for a team/airdrop etc. in deployment script 
    //TODO finalize after crowdsale ends and distribute all tokens


    function setZeroOwner(address _owner) public{
        require(owner==address(0));
        owner = _owner;
    }

    function init(uint8 _decimals,string _name,
      string _symbol, bool _fixedSupply,
      uint256 _amount, address _newOwner) public onlyOwner{
      require(totalSupply()==0);
      require(_amount>0);
      name = _name;
      symbol=_symbol;
      mint(_newOwner,_amount);
      transferOwnership(_newOwner);
      if(_fixedSupply){
        finishMinting();
      }
    }
    
}
