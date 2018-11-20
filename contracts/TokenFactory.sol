pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenFactory is Ownable {

    event TokenCreated(address _token, address _owner);

    
    mapping (bytes32=>address) private tokensTemplates;
    mapping (bytes32=>address) public tokensBySymbol;

    function addTemplate(string templateName ,address _tokenTemplate) public onlyOwner{
      require(tokensTemplates[keccak256(templateName)]==address(0));
      tokensTemplates[keccak256(templateName)]=_tokenTemplate;
    }

    function at(address _addr) private view returns (bytes o_code) {
        assembly {
            // retrieve the size of the code, this needs assembly
            let size := extcodesize(_addr)
            // allocate output byte array - this could also be done without assembly
            // by using o_code = new bytes(size)
            o_code := mload(0x40)
            // new "memory end" including padding
            mstore(0x40, add(o_code, and(add(add(size, 0x20), 0x1f), not(0x1f))))
            // store length in memory
            mstore(o_code, size)
            // actually retrieve the code, this needs assembly
            extcodecopy(_addr, add(o_code, 0x20), 0, size)
        }
    }

    function create(bytes code) returns (address addr){
        assembly {
            addr := create(0,add(code,0x20), mload(code))
        }
        require(addr!=address(0));
    }

    function copyContract(address _src) private returns(address){
       return create(at(_src));
    }

    function createToken(string _type,address _newOwner) external{
       require(tokensTemplates[keccak256(_type)]!=address(0),'template missing');
       Ownable token = Ownable(copyContract(tokensTemplates[keccak256(_type)]));
       token.transferOwnership(msg.sender);
       emit TokenCreated(address(token),msg.sender);

    }
}
