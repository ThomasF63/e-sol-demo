const fs = require('fs');
const path = require('path');

const srcPages = path.join(__dirname, 'src', 'pages');
const srcComponents = path.join(__dirname, 'src', 'components');
const distDir = path.join(__dirname, 'dist');

function build() {
  console.log('Building e-Sol Demo…');

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
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  for (const file of fs.readdirSync(srcPages)) {
    if (!file.endsWith('.html')) continue;
    let content = fs.readFileSync(path.join(srcPages, file), 'utf8');

    // Replace component includes: {{> name }}
    content = content.replace(/\{\{>\s*(\w[\w-]*)\s*\}\}/g, (match, name) => {
      if (components[name]) return components[name];
      console.warn(`  ⚠ Component not found: ${name}`);
      return match;
    });

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
