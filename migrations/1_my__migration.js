//const Bottles = artifacts.require("Bottles");
const Storages = artifacts.require("Storages");

module.exports = async function (deployer) {
  // deploy one ERC20Token contract
  /*console.log('try to deploy the NFT token contract Bottles');
  await deployer.deploy(Bottles ,"TWINE","T.W.E");
  const bottles = await Bottles.deployed();
  console.log('\n > Bottles deployment succes -->' , Bottles.address);*/

  //deploy the Storages contract
  console.log('try to deploy the Storages contract');
  await deployer.deploy(Storages , "0xb64C8A64B5Bbc900c5067BE270AB47a9f279D65D");
  const storages = await Storages.deployed();
  console.log('\n > Bottles deployment succes -->' , Storages.address);

  /*const addresses = {
    storages: storages.address,
    bottles: bottles.address,
  };*/

  //console.log(`export const ADDRESSES = ${JSON.stringify(addresses).replace(/"/gmi, '\'')};`);

};