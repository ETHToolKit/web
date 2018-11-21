var FreeDropper = artifacts.require("./FreeDropper.sol");
var MintableTokenTemplate = artifacts.require("./MintableTokenTemplate.sol");
var ContractFactory = artifacts.require("./ContractFactory.sol");

module.exports = function (deployer, network, accounts) {


    if(network == "local")
        return;

    var globals = {};

    var createContract =  (template) => {
        return new Promise((resolve, reject) => {
            deployer.deploy(template)
                .then((instance) => {
                    resolve(instance);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    }

    var registerTemplate = (templateName, templateInstance) => {
        return new Promise((resolve, reject) => {
           console.log('Register template', templateName, templateInstance.address);
           globals.factory.addTemplate(templateName, templateInstance.address)
           .then(() => {
                console.log(`Template ${templateName} registerd`);
                resolve();
           })
           .catch((ex) => {
                reject(ex);
           })
        });
    }

    var scriptToRun = new Promise((resolve, reject) => {
        createContract(FreeDropper)
        .then(() => { return createContract(ContractFactory); })
        .then((factoryInstance) => {globals.factory = factoryInstance; return createContract(MintableTokenTemplate); })
        .then((mintableTokenInstance) => {global.mintableTemplate = mintableTokenInstance;return registerTemplate("MintableToken", global.mintableTemplate)})
        .then( () => { console.log('Finished');resolve(true);})
        .catch((error) => {console.log(`Finished with fail ${error}`);reject('Deployment failed');});
    });

    
    deployer.then( () =>{ return scriptToRun; });
    
};
