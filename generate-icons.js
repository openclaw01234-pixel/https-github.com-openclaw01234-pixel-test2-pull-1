/* Generate PWA icons from SVG (run once): node generate-icons.js */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="100%" stop-color="#ff6b3d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d9ff"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="160" fill="rgba(255,255,255,0.1)"/>
  <polygon points="210,170 210,342 360,256" fill="white"/>
  <text x="256" y="450" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="58" fill="white" letter-spacing="4">MX PRO</text>
</svg>`;

const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#1a0a25"/>
      <stop offset="100%" stop-color="#0a0a0f"/>
    </radialGradient>
    <linearGradient id="logo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="100%" stop-color="#ff6b3d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect x="156" y="156" width="200" height="200" rx="45" fill="url(#logo)"/>
  <polygon points="220,210 220,302 310,256" fill="white"/>
  <text x="256" y="420" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="32" fill="white" letter-spacing="3">MX PLAYER PRO</text>
</svg>`;

(async () => {
  const sizes = [
    { name: 'icon-192.png', size: 192, svg: iconSvg },
    { name: 'icon-512.png', size: 512, svg: iconSvg },
    { name: 'icon-maskable-192.png', size: 192, svg: iconSvg },
    { name: 'icon-maskable-512.png', size: 512, svg: iconSvg },
    { name: 'splash.png', size: 512, svg: splashSvg },
    { name: 'favicon-32.png', size: 32, svg: iconSvg },
    { name: 'apple-touch-icon.png', size: 180, svg: iconSvg },
  ];

  for (const { name, size, svg } of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join('icons', name));
    console.log('  Generated:', name, `(${size}x${size})`);
  }

  // SVG version too
  fs.writeFileSync(path.join('icons', 'icon.svg'), iconSvg);
  console.log('  Generated: icon.svg');
  console.log('Done!');
})();
