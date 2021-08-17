var Migrations = artifacts.require("./Migrations.sol");
//third comment
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
