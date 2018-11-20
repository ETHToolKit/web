pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract IChangeOwner is Ownable{
    function setZeroOwner(address _owner) public;
}

contract TokenFactory is Ownable {

    event TokenCreated(address _token);
    event Code(bytes codeToDeploy);

    
    mapping (bytes32=>address) private tokensTemplates;
    mapping (bytes32=>address) public tokensBySymbol;

    

    function addTemplate(string templateName ,address _tokenTemplate) public onlyOwner{
      require(tokensTemplates[keccak256(templateName)]==address(0));
      tokensTemplates[keccak256(templateName)]=_tokenTemplate;
    }

    function create(address _addrOfCode) returns (address){
        address retval;
        assembly{
            mstore(0x0, or (0x5880730000000000000000000000000000000000000000803b80938091923cF3 ,mul(_addrOfCode,0x1000000000000000000)))
            retval := create(0,0, 32)
        }
        return retval;
    }

    function copyContract(address _src) private returns(address){
        return create(_src);
    }

    function createToken(string _type) external{
       require(tokensTemplates[keccak256(_type)]!=address(0),'template missing');
       IChangeOwner token = IChangeOwner(copyContract(tokensTemplates[keccak256(_type)]));
       emit TokenCreated(address(token));
       token.setZeroOwner(msg.sender);

    }
}
