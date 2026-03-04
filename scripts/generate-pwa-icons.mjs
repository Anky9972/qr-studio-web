/**
 * generate-pwa-icons.mjs
 * Generates all required PWA icon sizes from src/app/icon.png using sharp.
 * Run with: node scripts/generate-pwa-icons.mjs
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcIcon = join(root, 'src', 'app', 'icon.png');
const destDir = join(root, 'public', 'images');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: public/images/`);
}

if (!existsSync(srcIcon)) {
  console.error(`Source icon not found at: ${srcIcon}`);
  console.error('Place a high-resolution PNG at src/app/icon.png and re-run.');
  process.exit(1);
}

console.log(`Generating PWA icons from ${srcIcon}...\n`);

for (const size of sizes) {
  const outPath = join(destDir, `icon-${size}x${size}.png`);
  await sharp(srcIcon)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(outPath);
  console.log(`  ✓ icon-${size}x${size}.png`);
}

console.log(`\nDone! ${sizes.length} icons written to public/images/`);
