const pinataSDK = require("pinata-sdk");
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET);

async function uploadToPinata(name, svg, attributes) {
  const imageBuffer = Buffer.from(svg, "utf8");
  const imgRes = await pinata.pinFileToIPFS(imageBuffer, {
    pinataMetadata: { name }
  });

  const metadata = {
    name,
    description: "Farcaster Raccoon NFT",
    image: `ipfs://${imgRes.IpfsHash}`,
    attributes
  };
  const metaRes = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: `${name}-meta` }
  });
  return `ipfs://${metaRes.IpfsHash}`;
}

module.exports = { uploadToPinata };
