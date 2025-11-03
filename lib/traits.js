const crypto = require("crypto");

/**
 * Generates rich randomized traits for each NFT based on FID or random seed.
 * Combines multiple layers: color palette, fur pattern, eye style, accessory, mood, background, rarity tier, etc.
 * Produces thousands of unique combinations.
 */

function randomInt(seed, min, max) {
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  return min + (num % (max - min + 1));
}

function randomChoice(seed, key, arr) {
  const hash = crypto.createHash("sha256").update(seed + key).digest("hex");
  const idx = parseInt(hash.slice(0, 4), 16) % arr.length;
  return arr[idx];
}

function randomTraits(fid) {
  const seed = String(fid || Date.now());

  const baseColors = [
    "#ff6b6b", "#ffd93d", "#6bcfff", "#9dff80", "#e0aaff", "#ffb3c6",
    "#f7a072", "#f4d35e", "#90be6d", "#43aa8b", "#577590", "#7bdff2",
    "#ff70a6", "#ff9770", "#e9ff70", "#a7c957", "#2ec4b6", "#cbf3f0",
    "#bdb2ff", "#ffc6ff", "#caffbf", "#fdffb6", "#9bf6ff", "#a0c4ff"
  ];

  const furPatterns = [
    "solid", "striped", "spotted", "banded", "gradient", "patched", "marbled", "frosted", "shadowed", "mystic"
  ];

  const eyeStyles = [
    "round", "narrow", "sleepy", "wide", "cyber", "glowing", "cute", "mechanical", "matrix", "wild"
  ];

  const accessories = [
    "none", "sunglasses", "hat", "cap", "headband", "earring", "earpods",
    "bandana", "mask", "chain", "hood", "hoodie", "collar", "bowtie",
    "halo", "horns", "antenna", "monocle", "vr headset", "visor"
  ];

  const moods = [
    "happy", "angry", "sleepy", "mischievous", "curious", "focused",
    "dreamy", "chill", "chaotic", "excited", "neutral", "lazy",
    "hungry", "energetic", "sarcastic", "serious"
  ];

  const backgrounds = [
    "neon city", "forest", "cyber grid", "void", "hologram", "galaxy", "data stream",
    "underground lab", "rooftop", "ocean light", "aurora", "lava cave", "digital mist"
  ];

  const rarityTiers = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
  const rarityWeights = [70, 18, 8, 3, 1, 0.3]; // approximate percentage distribution

  // Deterministic trait selection
  const color = randomChoice(seed, "color", baseColors);
  const fur = randomChoice(seed, "fur", furPatterns);
  const eyes = randomChoice(seed, "eyes", eyeStyles);
  const accessory = randomChoice(seed, "acc", accessories);
  const mood = randomChoice(seed, "mood", moods);
  const bg = randomChoice(seed, "bg", backgrounds);

  // Weighted rarity selection
  const rareHash = parseInt(crypto.createHash("sha256").update(seed + "rarity").digest("hex").slice(0, 6), 16) % 1000;
  let rarity = "Common";
  if (rareHash < 3) rarity = "Mythic";
  else if (rareHash < 13) rarity = "Legendary";
  else if (rareHash < 43) rarity = "Epic";
  else if (rareHash < 123) rarity = "Rare";
  else if (rareHash < 303) rarity = "Uncommon";

  // Unique fingerprint for visual differentiation
  const patternSeed = crypto.createHash("md5").update(seed + color + fur + eyes + accessory).digest("hex").slice(0, 8);

  return {
    color,
    fur,
    eyes,
    accessory,
    mood,
    background: bg,
    rarity,
    patternSeed
  };
}

module.exports = { randomTraits };
