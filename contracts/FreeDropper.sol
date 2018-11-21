pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Withdrawable.sol";

contract FreeDropper is Withdrawable {

    event DistributionCompleted(address indexed from, address indexed token, uint totalAmount);
    
    using SafeMath for uint;

    function drop(ERC20 _token, address[] _beneficiary, uint[] _amount, uint _totalAmount) external payable {
        require(_beneficiary.length == _amount.length, "beneficiary and amount length do not match");

        require(_token.allowance(msg.sender, address(this)) >= _totalAmount, "not enough allowance");
        uint distributedTokens;
        
        for(uint i = 0;i < _beneficiary.length;i++){
            
            require(_beneficiary[i] != address(0), "beneficiary address is 0x0");
            require(_token.transferFrom(msg.sender,_beneficiary[i],_amount[i]), "Transfer from failed");
            distributedTokens += _amount[i];
        }

        emit DistributionCompleted(msg.sender, address(_token), _totalAmount);
            
    }


}