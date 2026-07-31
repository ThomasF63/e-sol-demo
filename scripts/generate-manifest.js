// scripts/generate-manifest.js
// Scans dist/img/ recursively and writes dist/img/manifest.json describing all images
// grouped by category. Consumed by src/pages/gallery.html.

const fs = require('fs');
const path = require('path');

const distImg = path.join(__dirname, '..', 'dist', 'img');

function walk(dir, base = '') {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, rel));
    } else if (/\.(png|jpe?g|webp|gif|svg)$/i.test(entry.name)) {
      const stat = fs.statSync(full);
      out.push({
        path: rel.replace(/\\/g, '/'),
        size: stat.size,
        mtime: stat.mtimeMs,
      });
    }
  }
  return out;
}

function categoryOf(relPath) {
  // dist/img/{communities,hero,pack/<bucket>}/<id>.png
  const parts = relPath.split('/');
  if (parts[0] === 'pack') return parts[1] || 'pack';   // samples, heroes, sections, textures
  return parts[0];                                      // communities, hero
}

function idOf(relPath) {
  return path.posix.basename(relPath).replace(/\.[^.]+$/, '');
}

function main() {
  const files = walk(distImg);
  const items = files.map(f => ({
    id: idOf(f.path),
    category: categoryOf(f.path),
    url: `img/${f.path}`,
    sizeKB: Math.round(f.size / 1024),
    mtime: f.mtime,
  }));

  // Group by category
  const byCategory = {};
  for (const it of items) {
    (byCategory[it.category] ||= []).push(it);
  }
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => a.id.localeCompare(b.id));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: items.length,
    categories: Object.keys(byCategory).sort(),
    byCategory,
  };

  const outPath = path.join(distImg, 'manifest.json');
  fs.mkdirSync(distImg, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`  ✓ manifest.json written (${items.length} images across ${manifest.categories.length} categories)`);
}

main();
