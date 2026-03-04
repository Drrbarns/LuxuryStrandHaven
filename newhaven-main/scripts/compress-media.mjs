#!/usr/bin/env node
/**
 * Compress images in public/ without losing quality.
 * - PNG: lossless recompression (compressionLevel 9)
 * - JPEG: high quality (92) to preserve visual quality
 * Run: node scripts/compress-media.mjs
 */

import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

async function compressImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return;

  const rel = filePath.replace(publicDir + '/', '');
  try {
    const buffer = await sharp(filePath);
    const meta = await buffer.metadata();
    const format = meta.format;

    const isPng = format === 'png';
    const isJpeg = format === 'jpeg';

    const outPath = filePath;
    if (isPng) {
      await sharp(filePath)
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outPath + '.tmp');
    } else if (isJpeg) {
      const tmpPath = outPath + '.tmp';
      await sharp(filePath)
        .jpeg({ quality: 92 })
        .toFile(tmpPath);
      const { stat, unlink: unlinkFile } = await import('fs/promises');
      const [origStat, newStat] = await Promise.all([stat(outPath), stat(tmpPath)]);
      if (newStat.size >= origStat.size) {
        await unlinkFile(tmpPath);
        return;
      }
    } else {
      // .gif / .webp: skip or keep as-is to avoid changing refs
      return;
    }

    const { rename, unlink } = await import('fs/promises');
    await unlink(outPath);
    await rename(outPath + '.tmp', outPath);
    console.log('Compressed:', rel);
  } catch (err) {
    console.error('Error compressing', rel, err.message);
  }
}

async function main() {
  const files = await readdir(publicDir);
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    await compressImage(join(publicDir, f));
  }
}

main();
