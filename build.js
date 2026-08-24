const fs = require('fs');
const path = require('path');

const srcPages = path.join(__dirname, 'src', 'pages');
const srcComponents = path.join(__dirname, 'src', 'components');
const distDir = path.join(__dirname, 'dist');

function build() {
  console.log('Building e-Sol Demo…');

  // Composants générés depuis les données (le village), avant le chargement
  // des composants : ils en font partie.
  try {
    require('./scripts/generate-village.js');
  } catch (e) {
    console.warn('  ⚠ village generation failed:', e.message);
  }

  // Les diagrammes Mermaid de la page rôles et droits sont générés depuis leur
  // source .md : une seule source de vérité pour l'affichage et les exports.
  try {
    require('./scripts/generate-diagrams.js');
  } catch (e) {
    console.warn('  ⚠ diagram generation failed:', e.message);
  }

  // Load components
  const components = {};
  if (fs.existsSync(srcComponents)) {
    for (const file of fs.readdirSync(srcComponents)) {
      if (file.endsWith('.html')) {
        const name = file.replace('.html', '');
        components[name] = fs.readFileSync(path.join(srcComponents, file), 'utf8');
      }
    }
  }
  console.log(`Loaded ${Object.keys(components).length} components: ${Object.keys(components).join(', ')}`);

  // Process pages
  // On repart d'un dist/ vide : sinon les fichiers supprimés des sources
  // (ex. un .png remplacé par un .webp) y subsistent et faussent le manifeste.
  if (fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  for (const file of fs.readdirSync(srcPages)) {
    if (!file.endsWith('.html')) continue;
    let content = fs.readFileSync(path.join(srcPages, file), 'utf8');

    // Replace component includes: {{> name }}
    // Résolution récursive : un composant peut lui-même en inclure un autre
    // (illustration-village.html inclut village-maisons.html). La profondeur est
    // bornée pour qu'une inclusion circulaire n'aboutisse pas à une boucle infinie.
    const MAX_DEPTH = 5;
    for (let depth = 0; depth < MAX_DEPTH; depth++) {
      let remplace = false;
      content = content.replace(/\{\{>\s*(\w[\w-]*)\s*\}\}/g, (match, name) => {
        if (components[name]) { remplace = true; return components[name]; }
        if (depth === 0) console.warn(`  ⚠ Component not found: ${name}`);
        return match;
      });
      if (!remplace) break;
    }

    fs.writeFileSync(path.join(distDir, file), content);
    console.log(`  ✓ ${file}`);
  }

  // Copy data directory
  const srcData = path.join(__dirname, 'src', 'data');
  const distData = path.join(distDir, 'data');
  if (fs.existsSync(srcData)) {
    copyDir(srcData, distData);
    console.log('  ✓ data/ copied');
  }

  // Copy img directory
  const srcImg = path.join(__dirname, 'src', 'img');
  const distImg = path.join(distDir, 'img');
  if (fs.existsSync(srcImg)) {
    copyDir(srcImg, distImg);
    console.log('  ✓ img/ copied');
  }

  // Regenerate dist/img/manifest.json
  try {
    require('./scripts/generate-manifest.js');
  } catch (e) {
    console.warn('  ⚠ manifest generation failed:', e.message);
  }

  console.log(`\nBuild complete! ${fs.readdirSync(distDir).filter(f => f.endsWith('.html')).length} pages in dist/`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

build();
