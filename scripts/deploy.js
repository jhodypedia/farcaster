async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const USDC = process.env.USDC_ADDRESS;
  const Factory = await ethers.getContractFactory("RaccoonNFT");
  const contract = await Factory.deploy(USDC);
  await contract.deployed();
  console.log("RaccoonNFT deployed at:", contract.address);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
