pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

interface ERC20 {
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
    function allowance(address _owner, address _spender) public view returns (uint256);
    function approve(address _spender, uint256 _value) public returns (bool);
    function transfer(address _to, uint256 _value) public returns (bool);
}

contract FreeDropper is Ownable {

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

    function withdrawTokens(ERC20 _erc20, address _receiver, uint _amount) public onlyOwner {
        require(_receiver != address(0x0), "receiver address is 0x0");
        _erc20.transfer(_receiver, _amount);
    }

    function withdrawETH(address _receiver, uint _amount) public onlyOwner {
        _receiver.transfer(_amount);
    }

}