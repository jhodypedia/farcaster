function escapeXml(str = "") {
  return str.replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;"
  }[c]));
}

/**
 * Generates a high-quality SVG raccoon NFT artwork
 * based on multiple randomized traits.
 */
function buildSVG({ username, fid, bio, color, fur, eyes, accessory, mood, background, rarity, patternSeed }) {
  const title = `${username} • FID ${fid}`;
  const desc = escapeXml(bio || "");
  const bgText = escapeXml(background);
  const moodText = escapeXml(mood);

  // Background gradient by color + pattern seed
  const grad1 = color;
  const grad2 = "#" + patternSeed.slice(0, 6);

  // Accessory shapes
  const accessoriesSVG = {
    sunglasses: `<rect x="380" y="420" width="180" height="40" rx="8" fill="#000"/><rect x="640" y="420" width="180" height="40" rx="8" fill="#000"/><rect x="560" y="430" width="80" height="8" fill="#111"/>`,
    cap: `<path d="M350,350 Q600,250 850,350 L850,380 L350,380 Z" fill="#111" />`,
    bandana: `<path d="M400,620 Q600,700 800,620 L600,640 Z" fill="#b22222"/>`,
    halo: `<ellipse cx="600" cy="260" rx="160" ry="25" fill="none" stroke="#ffd93d" stroke-width="10"/>`,
    vr: `<rect x="400" y="420" width="400" height="80" rx="20" fill="#111"/><rect x="420" y="440" width="360" height="40" rx="12" fill="#0ff"/>`
  };

  const accLayer = accessoriesSVG[accessory] || "";

  // Eye style variations
  let eyeShape;
  switch (eyes) {
    case "narrow":
      eyeShape = `<ellipse cx="480" cy="520" rx="50" ry="20" fill="#fff"/><ellipse cx="720" cy="520" rx="50" ry="20" fill="#fff"/>`;
      break;
    case "wide":
      eyeShape = `<circle cx="480" cy="520" r="60" fill="#fff"/><circle cx="720" cy="520" r="60" fill="#fff"/>`;
      break;
    case "cyber":
      eyeShape = `<circle cx="480" cy="520" r="50" fill="#0ff"/><circle cx="720" cy="520" r="50" fill="#0ff"/><circle cx="480" cy="520" r="16" fill="#000"/><circle cx="720" cy="520" r="16" fill="#000"/>`;
      break;
    case "glowing":
      eyeShape = `<circle cx="480" cy="520" r="55" fill="#fff"><animate attributeName="fill" values="#fff;#ff6;#fff" dur="2s" repeatCount="indefinite"/></circle>
                  <circle cx="720" cy="520" r="55" fill="#fff"><animate attributeName="fill" values="#fff;#ff6;#fff" dur="2s" repeatCount="indefinite"/></circle>`;
      break;
    default:
      eyeShape = `<circle cx="480" cy="520" r="50" fill="#fff"/><circle cx="720" cy="520" r="50" fill="#fff"/>`;
  }

  // Fur pattern overlay
  const patternDefs = `
  <pattern id="fur" patternUnits="userSpaceOnUse" width="80" height="80">
    ${fur === "striped" ? `<rect width="40" height="80" fill="rgba(255,255,255,0.08)"/>` : ""}
    ${fur === "spotted" ? `<circle cx="40" cy="40" r="20" fill="rgba(255,255,255,0.08)"/>` : ""}
    ${fur === "banded" ? `<rect y="0" width="80" height="20" fill="rgba(255,255,255,0.08)"/><rect y="40" width="80" height="20" fill="rgba(255,255,255,0.08)"/>` : ""}
    ${fur === "gradient" ? `<linearGradient id="grad"><stop offset="0%" stop-color="#fff" stop-opacity="0.05"/><stop offset="100%" stop-color="#000" stop-opacity="0.1"/></linearGradient>` : ""}
  </pattern>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${grad1}"/>
      <stop offset="100%" stop-color="${grad2}"/>
    </linearGradient>
    ${patternDefs}
  </defs>

  <!-- Background -->
  <rect width="1200" height="1200" fill="url(#bg)"/>

  <!-- Glow Aura -->
  <circle cx="600" cy="600" r="460" fill="rgba(255,255,255,0.05)"/>
  <circle cx="600" cy="600" r="440" fill="rgba(0,0,0,0.15)"/>

  <!-- Raccoon Head -->
  <g>
    <ellipse cx="600" cy="600" rx="400" ry="350" fill="#111" stroke="#000" stroke-width="6"/>
    <ellipse cx="600" cy="600" rx="400" ry="350" fill="url(#fur)" opacity="0.3"/>
    
    <!-- Ears -->
    <path d="M240,350 Q400,180 480,280 L420,400 Z" fill="#111" />
    <path d="M960,350 Q800,180 720,280 L780,400 Z" fill="#111" />

    <!-- Eye area -->
    <path d="M260,520 C360,430 840,430 940,520 C840,580 360,580 260,520 Z" fill="rgba(255,255,255,0.08)"/>
    ${eyeShape}

    <!-- Nose -->
    <ellipse cx="600" cy="620" rx="40" ry="25" fill="#000"/>

    <!-- Mouth -->
    <path d="M560,650 Q600,680 640,650" stroke="#000" stroke-width="6" fill="none"/>

    <!-- Accessories -->
    ${accLayer}
  </g>

  <!-- Info footer -->
  <text x="600" y="1060" text-anchor="middle" font-size="34" fill="#fff" font-family="Arial" opacity="0.9">${escapeXml(title)}</text>
  <text x="600" y="1100" text-anchor="middle" font-size="24" fill="#ccc" font-family="Arial" opacity="0.7">${desc}</text>
  <text x="600" y="1140" text-anchor="middle" font-size="20" fill="#ffd93d">${escapeXml(rarity)} • ${bgText} • ${moodText}</text>
</svg>`.trim();
}

module.exports = { buildSVG };
