// Génère les composants Mermaid de la page rôles et droits depuis leur source
// versionnée src/components/diagram-roles-droits.md. Appelé par build.js avant
// le chargement des composants (même patron que generate-village.js) : la
// dérive entre le .md (source des exports PNG) et les pages HTML devient
// structurellement impossible.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'src', 'components', 'diagram-roles-droits.md');
const SORTIES = [
  {
    motif: /^##\s+Vue communauté/,
    fichier: 'diagram-vue-communaute.html',
  },
  {
    motif: /^##\s+Vue générale/,
    fichier: 'diagram-emboitement.html',
  },
];

function extraireBlocMermaid(fichier, motifTitre) {
  const lignes = fs.readFileSync(fichier, 'utf8').split(/\r?\n/);
  const debutSection = lignes.findIndex(l => motifTitre.test(l));
  if (debutSection === -1) {
    throw new Error('section introuvable dans ' + path.basename(fichier) + ' (motif ' + motifTitre + ')');
  }
  const ouverture = lignes.findIndex((l, i) => i > debutSection && l.trim() === '```mermaid');
  if (ouverture === -1) throw new Error('bloc mermaid introuvable sous la section visée de ' + path.basename(fichier));
  const fermeture = lignes.findIndex((l, i) => i > ouverture && l.trim() === '```');
  if (fermeture === -1) throw new Error('bloc mermaid jamais refermé dans ' + path.basename(fichier));
  return lignes.slice(ouverture + 1, fermeture).join('\n');
}

// Même encodage que les pages : le source Mermaid vit échappé dans le HTML,
// mermaid décode les entités à la lecture.
const echapperHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const { motif, fichier } of SORTIES) {
  const source = extraireBlocMermaid(SOURCE, motif);
  const contenu = '<!-- FICHIER GÉNÉRÉ par scripts/generate-diagrams.js depuis diagram-roles-droits.md - ne pas éditer à la main -->\n'
    + '<div class="mermaid">\n'
    + echapperHtml(source) + '\n'
    + '</div>\n';
  fs.writeFileSync(path.join(ROOT, 'src', 'components', fichier), contenu, 'utf8');
  console.log('  ✓ ' + fichier + ' généré depuis diagram-roles-droits.md');
}
