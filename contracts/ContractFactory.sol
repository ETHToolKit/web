pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract ContractFactory is Ownable {

    event ContractCreated(address newContract);
    event TemplateAdded(string templateName, address templateAddress);

    mapping (bytes32=>address) public templates;

    function addTemplate(string templateName, address _contractTemplate) public onlyOwner{
        require(templates[keccak256(templateName)] == address(0), "Template exists");
        templates[keccak256(templateName)] = _contractTemplate;

        emit TemplateAdded(templateName, _contractTemplate);
    }

    function getTemplate(string templateName) public view returns(address) {
        return  templates[keccak256(templateName)];
    } 

    function create(address _srcCode) public returns (address){
        address retval;

        assembly {
            mstore(0x0, or (0x5880730000000000000000000000000000000000000000803b80938091923cF3 ,mul(_srcCode,0x1000000000000000000)))
            retval := create(0,0, 32)
        }

        return retval;
    }

    function createContract(string _type, bytes params) external {
        require(templates[keccak256(_type)]!=address(0),"Template is missing");
        address newContract = create(templates[keccak256(_type)]);

        emit ContractCreated(address(newContract));
        newContract.call(params);
    }
}
