pragma solidity ^0.4.24;
import "./Withdrawable.sol";

contract ContractFactory is Withdrawable {

    event ContractCreated(address newContract);
    event TemplateAdded(string templateName, address templateAddress);

    mapping (bytes32=>address) public templates;

    function addTemplate(string templateName, address _contractTemplate) public onlyOwner{
        require(templates[keccak256(abi.encodePacked(templateName))] == address(0), "Template exists");
        templates[keccak256(abi.encodePacked(templateName))] = _contractTemplate;

        emit TemplateAdded(templateName, _contractTemplate);
    }

    function getTemplate(string templateName) public view returns(address) {
        return  templates[keccak256(abi.encodePacked(templateName))];
    } 

    function create(address _srcCode) private returns (address){
        address retval;

        assembly {
            mstore(0x0, or (0x5880730000000000000000000000000000000000000000803b80938091923cF3 ,mul(_srcCode,0x1000000000000000000)))
            retval := create(0,0, 32)
        }

        return retval;
    }

    function createContract(string _type, bytes params) external payable {
        require(templates[keccak256(abi.encodePacked(_type))]!=address(0),"Template is missing");
        address newContract = create(templates[keccak256(_type)]);

        emit ContractCreated(address(newContract));
        newContract.call(params);
    }

}
