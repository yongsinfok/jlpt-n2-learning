/**
 * Generate PWA icons + iOS splash screens for the JLPT N2 app.
 *
 * Renders an inline SVG via Playwright at exact pixel dimensions so we get
 * crisp, deterministic output without depending on sharp / imagemagick.
 *
 * Usage:  node scripts/gen-pwa-assets.mjs
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'public', 'icons');
const SPLASH_DIR = path.join(ROOT, 'public', 'splash');

await mkdir(ICONS_DIR, { recursive: true });
await mkdir(SPLASH_DIR, { recursive: true });

/** Mincho-serif "N2" mark on washi background with bengara accent stroke. */
function iconHTML(size, { maskable = false } = {}) {
  // Maskable icons must reserve a 20% safe area; scale content down to ~70%.
  const contentScale = maskable ? 0.70 : 0.86;
  const fontSize = Math.round(size * 0.55 * contentScale);
  const accentY = size * (0.5 + 0.20 * contentScale);
  const accentW = size * 0.36 * contentScale;
  const accentH = Math.max(2, Math.round(size * 0.012 * contentScale));
  const accentX = (size - accentW) / 2;
  const textY = size * (0.5 + 0.10 * contentScale);

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500&display=swap');
  html,body { margin:0; padding:0; width:${size}px; height:${size}px; background:#FAFAF5; }
  svg { display:block; }
  text { font-family: 'Noto Serif JP', 'Yu Mincho', serif; font-weight:500; }
</style></head>
<body>
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#FAFAF5"/>
    ${maskable ? '' : `<rect x="0" y="0" width="${size}" height="${size}" fill="none"/>`}
    <text x="${size/2}" y="${textY}" font-size="${fontSize}" fill="#1A1A1A"
          text-anchor="middle" dominant-baseline="middle"
          letter-spacing="-${fontSize * 0.04}px">N2</text>
    <rect x="${accentX}" y="${accentY}" width="${accentW}" height="${accentH}" fill="#C04A1A"/>
  </svg>
</body></html>`;
}

/** Centered splash: app mark + name + subtitle on washi background. */
function splashHTML(width, height) {
  const minDim = Math.min(width, height);
  const markSize = Math.round(minDim * 0.22);
  const fontSize = Math.round(markSize * 0.55);
  const titleSize = Math.round(minDim * 0.045);
  const subSize = Math.round(minDim * 0.022);
  const accentW = Math.round(markSize * 0.42);

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500&family=Inter:wght@500&display=swap');
  html,body {
    margin:0; padding:0;
    width:${width}px; height:${height}px;
    background:#FAFAF5;
    display:flex; align-items:center; justify-content:center;
    font-family: 'Inter', sans-serif;
  }
  body::before {
    content:'';
    position:absolute; inset:0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.05'/></svg>");
    pointer-events:none;
  }
  .stack {
    position:relative;
    text-align:center;
    z-index:1;
  }
  .mark {
    width:${markSize}px; height:${markSize}px;
    margin: 0 auto ${minDim * 0.04}px;
    position:relative;
    display:flex; align-items:center; justify-content:center;
    font-family:'Noto Serif JP','Yu Mincho',serif;
    font-weight:500;
    color:#1A1A1A;
    font-size:${fontSize}px;
    letter-spacing:-0.04em;
  }
  .mark::after {
    content:'';
    position:absolute;
    bottom: ${markSize * 0.16}px;
    left:50%;
    transform: translateX(-50%);
    width:${accentW}px;
    height:${Math.max(2, markSize * 0.014)}px;
    background:#C04A1A;
  }
  .title {
    font-family:'Noto Serif JP','Yu Mincho',serif;
    font-size:${titleSize}px;
    font-weight:500;
    color:#1A1A1A;
    letter-spacing:-0.02em;
    margin-bottom:${minDim * 0.012}px;
  }
  .sub {
    font-family:'Inter',sans-serif;
    font-size:${subSize}px;
    color:#8C8A82;
    letter-spacing:0.18em;
    text-transform:uppercase;
  }
</style></head>
<body>
  <div class="stack">
    <div class="mark">N2</div>
    <div class="title">JLPT N2 学習</div>
    <div class="sub">Nihongo · 日本語学習</div>
  </div>
</body></html>`;
}

const ICONS = [
  { name: 'icon-32.png',                size: 32 },
  { name: 'icon-192.png',               size: 192 },
  { name: 'icon-512.png',               size: 512 },
  { name: 'icon-maskable-192.png',      size: 192, maskable: true },
  { name: 'icon-maskable-512.png',      size: 512, maskable: true },
  { name: 'apple-touch-icon.png',       size: 180 },
  { name: 'apple-touch-icon-167.png',   size: 167 },
  { name: 'apple-touch-icon-152.png',   size: 152 },
  { name: 'favicon.ico',                size: 32 }, // PNG with .ico extension; browsers accept it.
];

// iPhone splash sizes — physical pixels (points × DPR)
const SPLASHES = [
  { name: 'iphone-15-pro-max.png', w: 1290, h: 2796 },
  { name: 'iphone-15-pro.png',     w: 1179, h: 2556 },
  { name: 'iphone-14-plus.png',    w: 1284, h: 2778 },
  { name: 'iphone-14.png',         w: 1170, h: 2532 },
  { name: 'iphone-se.png',         w:  750, h: 1334 },
];

console.log('▸ Launching headless Chromium...');
const browser = await chromium.launch();

console.log('▸ Generating icons...');
for (const icon of ICONS) {
  const ctx = await browser.newContext({
    viewport: { width: icon.size, height: icon.size },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(iconHTML(icon.size, { maskable: icon.maskable }));
  // Wait for webfont so glyphs aren't system-substituted
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(ICONS_DIR, icon.name),
    type: 'png',
    omitBackground: false,
  });
  await ctx.close();
  console.log(`  ✓ ${icon.name}  (${icon.size}×${icon.size})`);
}

console.log('▸ Generating iOS splash screens...');
for (const splash of SPLASHES) {
  const ctx = await browser.newContext({
    viewport: { width: splash.w, height: splash.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(splashHTML(splash.w, splash.h));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(SPLASH_DIR, splash.name),
    type: 'png',
    fullPage: false,
    omitBackground: false,
  });
  await ctx.close();
  console.log(`  ✓ ${splash.name}  (${splash.w}×${splash.h})`);
}

await browser.close();
console.log('✓ Done.');
