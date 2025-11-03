const { ethers } = require("ethers");
require("dotenv").config();

const ABI = [
  "function mintTo(address to, string tokenURI) external returns (uint256)",
  "function mintWithUSDC(address to, string tokenURI) external returns (uint256)"
];

async function mintToUser({ address, tokenURI }) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
  const wallet = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);
  const tx = await contract.mintTo(address, tokenURI);
  const rc = await tx.wait();
  const ev = rc.events.find(e => e.event === "Transfer");
  return { hash: tx.hash, tokenId: ev?.args?.tokenId?.toString() };
}

module.exports = { mintToUser };
