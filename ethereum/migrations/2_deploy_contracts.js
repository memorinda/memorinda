
const EventFactory = artifacts.require("./EventFactory.sol");
const Event = artifacts.require("./Event.sol")
module.exports = function(deployer) {
  deployer.deploy(EventFactory);
  deployer.deploy(Event);
};