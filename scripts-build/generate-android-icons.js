/* Generate Android mipmap icons from SVG.
 * Run: node scripts-build/generate-android-icons.js
 * Creates icons in android/app/src/main/res/mipmap-* directories.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Full-bleed launcher icon (square, with rounded corners drawn)
const launcherSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="100%" stop-color="#ff6b3d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="256" cy="220" r="130" fill="rgba(255,255,255,0.12)"/>
  <polygon points="208,150 208,290 340,220" fill="white"/>
  <text x="256" y="420" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="76" fill="white" letter-spacing="6">MX PRO</text>
</svg>`;

// Round launcher icon
const roundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="100%" stop-color="#ff6b3d"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#bg)"/>
  <circle cx="256" cy="220" r="125" fill="rgba(255,255,255,0.12)"/>
  <polygon points="210,155 210,285 335,220" fill="white"/>
  <text x="256" y="410" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="68" fill="white" letter-spacing="5">MX PRO</text>
</svg>`;

// Adaptive icon foreground (must have ~25% padding on all sides since system applies mask)
// Final visible area is 66dp out of 108dp total, so foreground content fits inside ~432px out of 648px
const adaptiveForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="220" r="100" fill="rgba(255,255,255,0.15)"/>
  <polygon points="220,165 220,275 322,220" fill="white"/>
  <text x="256" y="370" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="48" fill="white" letter-spacing="4">MX PRO</text>
</svg>`;

// Solid background for adaptive icon (just the gradient)
const adaptiveBackgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="100%" stop-color="#ff6b3d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
</svg>`;

const ANDROID_RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// Density buckets: mdpi=48, hdpi=72, xhdpi=96, xxhdpi=144, xxxhdpi=192
// Adaptive icon foreground/background sizes are larger:
// mdpi=108, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432
const densities = [
  { name: 'mdpi',    launcher: 48,  adaptive: 108 },
  { name: 'hdpi',    launcher: 72,  adaptive: 162 },
  { name: 'xhdpi',   launcher: 96,  adaptive: 216 },
  { name: 'xxhdpi',  launcher: 144, adaptive: 324 },
  { name: 'xxxhdpi', launcher: 192, adaptive: 432 },
];

(async () => {
  for (const d of densities) {
    const dir = path.join(ANDROID_RES, `mipmap-${d.name}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Square launcher
    await sharp(Buffer.from(launcherSvg))
      .resize(d.launcher, d.launcher)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // Round launcher
    await sharp(Buffer.from(roundSvg))
      .resize(d.launcher, d.launcher)
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // Adaptive foreground (only generated for higher densities; Capacitor uses webp)
    await sharp(Buffer.from(adaptiveForegroundSvg))
      .resize(d.adaptive, d.adaptive)
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`  Wrote mipmap-${d.name}: launcher=${d.launcher}px, adaptive=${d.adaptive}px`);
  }

  // Adaptive background (single density - drawable folder usually)
  const drawableDir = path.join(ANDROID_RES, 'drawable');
  if (!fs.existsSync(drawableDir)) fs.mkdirSync(drawableDir, { recursive: true });
  await sharp(Buffer.from(adaptiveBackgroundSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(drawableDir, 'ic_launcher_background.png'));
  console.log('  Wrote drawable/ic_launcher_background.png');

  // Also overwrite the Capacitor splash screen with our brand
  const splashSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
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
      <rect width="1024" height="1024" fill="url(#bg)"/>
      <rect x="312" y="312" width="400" height="400" rx="90" fill="url(#logo)"/>
      <polygon points="430,400 430,624 620,512" fill="white"/>
      <text x="512" y="850" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="56" fill="white" letter-spacing="6">MX PLAYER PRO</text>
    </svg>
  `;
  for (const d of densities) {
    const dir = path.join(ANDROID_RES, `drawable-${d.name}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const size = d.launcher === 48 ? 320 : d.launcher === 72 ? 480 : d.launcher === 96 ? 720 : d.launcher === 144 ? 960 : 1280;
    await sharp(Buffer.from(splashSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'splash.png'));
  }
  console.log('  Wrote splash.png in drawable-*');

  // Default drawable
  await sharp(Buffer.from(splashSvg)).resize(960, 960).png().toFile(path.join(ANDROID_RES, 'drawable', 'splash.png'));

  // Update strings.xml app name and theme colors
  const stringsPath = path.join(ANDROID_RES, 'values', 'strings.xml');
  const colorsPath = path.join(ANDROID_RES, 'values', 'colors.xml');
  if (fs.existsSync(stringsPath)) {
    let s = fs.readFileSync(stringsPath, 'utf8');
    s = s.replace(/<string name="app_name">[^<]*<\/string>/, '<string name="app_name">MX Player Pro</string>');
    s = s.replace(/<string name="title_activity_main">[^<]*<\/string>/, '<string name="title_activity_main">MX Player Pro</string>');
    fs.writeFileSync(stringsPath, s);
    console.log('  Updated app name in strings.xml');
  }
  if (fs.existsSync(colorsPath)) {
    let c = fs.readFileSync(colorsPath, 'utf8');
    c = c.replace(/<color name="colorPrimary">#[A-Fa-f0-9]+<\/color>/, '<color name="colorPrimary">#ff3366</color>');
    c = c.replace(/<color name="colorPrimaryDark">#[A-Fa-f0-9]+<\/color>/, '<color name="colorPrimaryDark">#cc2a55</color>');
    c = c.replace(/<color name="colorAccent">#[A-Fa-f0-9]+<\/color>/, '<color name="colorAccent">#ff6b3d</color>');
    fs.writeFileSync(colorsPath, c);
    console.log('  Updated brand colors in colors.xml');
  }

  console.log('\nDone! All Android icons + splash + branding updated.');
})();
