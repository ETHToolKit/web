pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";


contract MintableTokenTemplate is MintableToken  {

    string public symbol ;
    string public name ;
    uint8 public decimals;

    //TODO mint tokens for a team/airdrop etc. in deployment script 
    //TODO finalize after crowdsale ends and distribute all tokens

    function initOwner(address _owner) public{
        require(owner == address(0), "Token has been initialized");
        owner = _owner;
    }

    function init(
        uint8 _decimals,
        string _name,
        string _symbol, 
        address _newOwner,
        bool _finishMinting,
        uint256 _initSupply) 
        public 
        {

        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        initOwner(msg.sender);

        mint(msg.sender, _initSupply);

        if(_finishMinting) 
            finishMinting();

        transferOwnership(_newOwner);
    }
    
}
