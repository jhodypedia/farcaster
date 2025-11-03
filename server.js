const express = require("express");
const dotenv = require("dotenv");
const { randomTraits } = require("./lib/traits");
const { buildSVG } = require("./lib/svg");
const { uploadToPinata } = require("./lib/pinata");
const { mintToUser } = require("./lib/mint");

dotenv.config();
const app = express();
app.use(express.json({ limit: "3mb" }));

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Farcaster Raccoons API" });
});

app.get("/preview", async (req, res) => {
  const { fid = "0", username = "user", bio = "" } = req.query;
  const traits = randomTraits(fid);
  const svg = buildSVG({ username, fid, bio, ...traits });
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

app.post("/mint", async (req, res) => {
  try {
    const { address, fid, username, bio } = req.body;
    if (!address) return res.status(400).json({ error: "address required" });

    const traits = randomTraits(fid || 0);
    const svg = buildSVG({ username, fid, bio, ...traits });

    const attributes = [
      { trait_type: "Color", value: traits.color },
      { trait_type: "Accessory", value: traits.accessory },
      { trait_type: "Mood", value: traits.mood },
      { trait_type: "FID", value: String(fid || 0) }
    ];

    const tokenURI = await uploadToPinata(`Raccoon-${fid}`, svg, attributes);
    const result = await mintToUser({ address, tokenURI });

    res.json({
      ok: true,
      txHash: result.hash,
      tokenId: result.tokenId,
      contract: process.env.CONTRACT_ADDRESS
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
