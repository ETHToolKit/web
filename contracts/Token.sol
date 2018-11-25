pragma solidity ^0.4.24;
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";

contract Token is MintableToken, BurnableToken  {

    string public symbol ;
    string public name ;
    uint8 public decimals;

    constructor(
        string _symbol,
        string _name,
        uint8 _decimals) {
        symbol = _symbol;
        name = _name;
        decimals = _decimals;
    }
    
}
