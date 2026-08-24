/**
 * Exports PNG du paquet de portage (docs/00-portage-README.md, § 2.1) : les cinq
 * images du lot A, produites en une commande dans src/img/portage/.
 *
 *   village-esol.png          le cadre .village-frame de village-esol.html,
 *                             rendu à 1200 px, facteur d'échelle 2, soit 2400 px
 *                             de large ; viser moins de 600 Ko (§ 2.3)
 *   premiers-pas-jalons.png   l'illustration de premiers-pas.html, 1440 x 560
 *   roles-cinq-niveaux.png    l'illustration de roles-et-droits.html, 1200 px
 *   gouvernance-esol.png      diagram-gouvernance.md, VARIANTE SIMPLIFIÉE à
 *                             trois niveaux (pas le premier bloc du fichier)
 *   roles-vue-communaute.png  diagram-roles-droits.md, VUE COMMUNAUTÉ
 *
 * Les deux schémas Mermaid sont rendus localement dans une page hôte qui charge
 * la même bibliothèque et la même configuration que les pages de la démo
 * (mermaid@11 via jsdelivr, thème « base », polices Outfit et Inter) : le rendu
 * est celui de la démo, sans passer par mermaid.live, et il se refait à
 * l'identique à chaque évolution des sources.
 *
 * Garde-fous :
 * - refuse de tourner si dist/ n'a pas été construit, ou si les sources sont
 *   plus récentes que dist/ (on capturerait une version périmée) : lancer
 *   node build.js d'abord ;
 * - réseau requis pour les polices Google Fonts et pour mermaid@11 : ce sont
 *   les dépendances externes que les pages de la démo chargent déjà ; le
 *   script vérifie leur accessibilité avant d'ouvrir Chrome ;
 * - profil Chrome temporaire VIERGE, animations et transitions désactivées
 *   avant chaque capture (rendu déterministe) ;
 * - contrôle en sortie : dimensions de chaque PNG, et alerte si
 *   village-esol.png dépasse 600 Ko.
 *
 * Après la capture, vérifier à l'œil que les douze noms de maisons du village
 * restent lisibles à 100 % (§ 2.3 du paquet).
 *
 * Usage (une fois, à la racine du repo) :
 *   npm init -y && npm i puppeteer-core     # node_modules est gitignoré
 *   node build.js
 *   node scripts/capture-village.js
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'src', 'img', 'portage');
const TMP_PROFILE = path.join(os.tmpdir(), 'esol-capture-profile');

// Rendu déterministe : on fige tout ce qui bouge (fumée des cheminées, survols).
const SANS_MOUVEMENT = '* { animation: none !important; transition: none !important; }';

// Dépendances externes des pages de la démo, vérifiées avant d'ouvrir Chrome.
const CDN_MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
const CDN_FONTS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Garde-fous                                                          */
/* ------------------------------------------------------------------ */

function verifierDist() {
  const pages = ['village-esol.html', 'premiers-pas.html', 'roles-et-droits.html'];
  const manquantes = pages.filter(p => !fs.existsSync(path.join(DIST, p)));
  if (manquantes.length) {
    console.error('ABANDON : dist/ n\'est pas construit (' + manquantes.join(', ') + ' introuvable).');
    console.error('Lancer d\'abord : node build.js');
    process.exit(1);
  }

  // Fraîcheur : si une source est plus récente que la page construite, la
  // capture montrerait un état périmé (le piège exact du § 4.6 du paquet).
  const sources = [path.join(ROOT, 'src', 'pages'), path.join(ROOT, 'src', 'components')]
    .flatMap(d => fs.readdirSync(d).filter(f => f.endsWith('.html')).map(f => path.join(d, f)));
  const plusRecenteSource = Math.max(...sources.map(f => fs.statSync(f).mtimeMs));
  const plusVieillePage = Math.min(...pages.map(p => fs.statSync(path.join(DIST, p)).mtimeMs));
  if (plusRecenteSource > plusVieillePage) {
    console.error('ABANDON : des sources de src/ sont plus récentes que dist/.');
    console.error('Relancer node build.js, puis relancer ce script.');
    process.exit(1);
  }
}

function verifierAcces(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'HEAD', timeout: 15000 }, () => resolve());
    req.on('error', err => reject(err));
    req.on('timeout', () => { req.destroy(); reject(new Error('délai dépassé')); });
    req.end();
  });
}

/* ------------------------------------------------------------------ */
/* Schémas Mermaid : extraction depuis les sources versionnées         */
/* ------------------------------------------------------------------ */

// Retourne le bloc ```mermaid qui suit le titre de section demandé. Les deux
// fichiers sources contiennent plusieurs blocs : l'ancrage sur le titre évite
// de prendre le premier venu.
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

// Même encodage que les pages de la démo : le source Mermaid est échappé pour
// vivre dans le HTML, mermaid décode les entités à la lecture.
const echapperHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Page hôte minimale : mêmes polices, même bibliothèque et même configuration
// mermaid.initialize que les pages de la démo (roles-et-droits.html).
function pageHoteMermaid(blocs) {
  const cadres = blocs.map(b =>
    '<div class="cadre"><div class="mermaid" id="' + b.id + '">\n' + echapperHtml(b.source) + '\n</div></div>'
  ).join('\n');
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Rendu des schémas Mermaid pour export</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${CDN_FONTS}" rel="stylesheet">
<style>
  body { background: #ffffff; margin: 0; padding: 32px; }
  .cadre { width: 600px; margin: 0 0 48px; }
  .cadre .mermaid svg { width: 600px !important; max-width: none !important; height: auto !important; background: #ffffff; }
</style>
</head>
<body>
${cadres}
<script src="${CDN_MERMAID}"></script>
<script>
  // startOnLoad: false, puis rendu une fois les polices chargées : mermaid
  // mesure les boîtes avec la police active, et Outfit est plus large que la
  // police de substitution (sinon, textes rognés aux bords des boîtes).
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      primaryColor: '#fdfbf9',
      primaryTextColor: '#1a1512',
      primaryBorderColor: '#9c3f00',
      lineColor: '#9c3f00',
      secondaryColor: '#dbe9a9',
      tertiaryColor: '#f5edf2'
    },
    flowchart: {
      curve: 'basis',
      nodeSpacing: 35,
      rankSpacing: 60,
      padding: 12
    }
  });
  Promise.all([
    document.fonts.load('400 14px Outfit'),
    document.fonts.load('600 14px Outfit'),
    document.fonts.load('700 14px Outfit'),
    document.fonts.ready
  ]).then(() => mermaid.run());
</script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Captures                                                            */
/* ------------------------------------------------------------------ */

function dimensionsPng(buffer) {
  return { l: buffer.readUInt32BE(16), h: buffer.readUInt32BE(20) };
}

function ecrirePng(nom, buffer) {
  const cible = path.join(OUT_DIR, nom);
  fs.writeFileSync(cible, buffer);
  const { l, h } = dimensionsPng(buffer);
  const ko = Math.round(buffer.length / 1024);
  console.log('OK   ' + nom + ' : ' + l + ' x ' + h + ' px, ' + ko + ' Ko');
  return { l, h, ko };
}

async function attendreRendu(page) {
  await page.evaluate(() => document.fonts.ready);
  await sleep(1200); // application des polices dans les textes SVG
}

// Capture un élément d'une page construite, avec des surcharges CSS propres à
// l'export (largeur imposée, cadre neutralisé, fond opaque).
async function capturerElement(page, { url, css, selecteur, viewport }) {
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.addStyleTag({ content: SANS_MOUVEMENT + '\n' + (css || '') });
  await attendreRendu(page);
  const element = await page.$(selecteur);
  if (!element) throw new Error('sélecteur introuvable : ' + selecteur);
  return element.screenshot();
}

(async () => {
  verifierDist();

  try {
    await verifierAcces(CDN_FONTS);
    await verifierAcces(CDN_MERMAID);
  } catch (err) {
    console.error('ABANDON : dépendances externes inaccessibles (' + err.message + ').');
    console.error('Les polices Outfit/Inter et mermaid@11 sont chargées en ligne, comme dans les pages');
    console.error('de la démo : sans réseau, les exports auraient de mauvaises polices ou pas de schéma.');
    process.exit(1);
  }

  if (!fs.existsSync(CHROME)) {
    console.error('ABANDON : Chrome introuvable (' + CHROME + '). Surcharger avec CHROME_PATH.');
    process.exit(1);
  }

  // Page hôte des deux schémas, écrite hors du repo.
  const blocs = [
    {
      id: 'gouvernance',
      fichier: 'gouvernance-esol.png',
      source: extraireBlocMermaid(path.join(ROOT, 'src', 'components', 'diagram-gouvernance.md'), /^##\s+Variante simplifiée/),
    },
    {
      id: 'vue-communaute',
      fichier: 'roles-vue-communaute.png',
      source: extraireBlocMermaid(path.join(ROOT, 'src', 'components', 'diagram-roles-droits.md'), /^##\s+Vue communauté/),
    },
  ];
  const hote = path.join(os.tmpdir(), 'esol-capture-mermaid.html');
  fs.writeFileSync(hote, pageHoteMermaid(blocs));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const enFileUrl = p => 'file:///' + p.replace(/\\/g, '/');

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: TMP_PROFILE,
    args: ['--lang=fr-FR', '--disable-gpu', '--no-first-run'],
  });

  const page = await browser.newPage();
  let ok = 0;
  const total = 5;

  // 1. Le village : le cadre .village-frame, élargi à 1200 px (sa largeur
  // naturelle est bornée à 1120 px), facteur 2, soit 2400 px.
  try {
    const buffer = await capturerElement(page, {
      url: enFileUrl(path.join(DIST, 'village-esol.html')),
      viewport: { width: 1440, height: 1600, deviceScaleFactor: 2 },
      css: '.village-frame { width: 1200px !important; max-width: none !important; }',
      selecteur: '.village-frame',
    });
    const { ko } = ecrirePng('village-esol.png', buffer);
    if (ko >= 600) console.log('     ATTENTION : plus de 600 Ko, à alléger avant téléversement (§ 2.3).');
    ok++;
  } catch (e) { console.log('ECHEC village-esol.png : ' + e.message.split('\n')[0]); }

  // 2. Les cinq jalons des premiers pas : le SVG seul, 720 x 280 rendu au
  // facteur 2, soit 1440 x 560.
  try {
    const buffer = await capturerElement(page, {
      url: enFileUrl(path.join(DIST, 'premiers-pas.html')),
      viewport: { width: 1024, height: 1200, deviceScaleFactor: 2 },
      css: '.pp-illustration { max-width: 720px !important; padding: 0 !important; }\n' +
           '.pp-illustration svg { background: #ffffff !important; }',
      selecteur: '.pp-illustration svg',
    });
    ecrirePng('premiers-pas-jalons.png', buffer);
    ok++;
  } catch (e) { console.log('ECHEC premiers-pas-jalons.png : ' + e.message.split('\n')[0]); }

  // 3. Le sentier des cinq niveaux : le SVG seul, sorti de son cadre décoratif,
  // 600 px rendus au facteur 2, soit 1200 px de large.
  try {
    const buffer = await capturerElement(page, {
      url: enFileUrl(path.join(DIST, 'roles-et-droits.html')),
      viewport: { width: 1024, height: 1400, deviceScaleFactor: 2 },
      css: '.roles-illustration { max-width: 600px !important; padding: 0 !important; background: none !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; }\n' +
           '.roles-illustration svg { background: #ffffff !important; }',
      selecteur: '.roles-illustration svg',
    });
    ecrirePng('roles-cinq-niveaux.png', buffer);
    ok++;
  } catch (e) { console.log('ECHEC roles-cinq-niveaux.png : ' + e.message.split('\n')[0]); }

  // 4 et 5. Les deux schémas Mermaid, rendus dans la page hôte.
  try {
    await page.setViewport({ width: 720, height: 1400, deviceScaleFactor: 2 });
    await page.goto(enFileUrl(hote), { waitUntil: 'load', timeout: 45000 });
    await page.waitForFunction(
      (n) => document.querySelectorAll('.mermaid svg').length === n,
      { timeout: 30000 },
      blocs.length
    );
    await attendreRendu(page);
    const erreurs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.mermaid')).some(d => /syntax error/i.test(d.textContent))
    );
    if (erreurs) throw new Error('mermaid signale une erreur de syntaxe dans un des blocs');
    for (const b of blocs) {
      try {
        const element = await page.$('#' + b.id + ' svg');
        if (!element) throw new Error('schéma non rendu (#' + b.id + ')');
        ecrirePng(b.fichier, await element.screenshot());
        ok++;
      } catch (e) { console.log('ECHEC ' + b.fichier + ' : ' + e.message.split('\n')[0]); }
    }
  } catch (e) {
    console.log('ECHEC page hôte mermaid : ' + e.message.split('\n')[0]);
  }

  await browser.close();
  console.log(ok + '/' + total + ' exports dans ' + OUT_DIR);
  console.log('Vérifier chaque image avant téléversement ; en particulier la lisibilité');
  console.log('des douze noms de maisons sur village-esol.png (§ 2.3 du paquet).');
})();
