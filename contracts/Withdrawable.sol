pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

interface ERC20 {
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
    function allowance(address _owner, address _spender) public view returns (uint256);
    function approve(address _spender, uint256 _value) public returns (bool);
    function transfer(address _to, uint256 _value) public returns (bool);
}

contract Withdrawable is Ownable {

    function withdrawTokens(ERC20 _erc20, address _receiver, uint _amount) public onlyOwner {
        require(_receiver != address(0x0), "receiver address is 0x0");
        _erc20.transfer(_receiver, _amount);
    }

    function withdrawETH(address _receiver, uint _amount) public onlyOwner {
        _receiver.transfer(_amount);
    }

}