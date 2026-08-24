/**
 * Annotation reproductible des captures : incruste cadres, pastilles
 * numérotées, flèches et étiquettes sur les captures BRUTES de captures/brut/
 * et écrit les PNG FINAUX sous leurs noms canoniques.
 *
 * Deux jeux de captures partagent ce script (argument optionnel, forum par
 * défaut : les usages existants ne changent pas) :
 *   node scripts/annoter-captures.js                # forum (capture-tutos-forum.js)
 *   node scripts/annoter-captures.js esol-public    # site e-sol.fr (capture-esol-public.js)
 * Chaque jeu associe sa spécification scripts/annotations/<jeu>.json, son
 * dossier de sortie src/img/tutos/…, et le préfixe de ses fichiers bruts
 * (pour ne signaler « brute sans spec » que dans son propre périmètre).
 *
 * La spécification est versionnée dans scripts/annotations/ :
 * par fichier final, une liste d'annotations
 *   { "type": "cadre" | "pastille" | "fleche" | "etiquette",
 *     "zone": "<nomDeZone>"            zone du sidecar <nom>.zones.json,
 *             ou { x, y, w, h }        rectangle en repli (pixels du PNG),
 *     "n": 1,                          numéro (pastilles) = numéro de l'étape
 *                                      illustrée dans la fiche,
 *     "texte": "...",                  contenu (étiquettes),
 *     "decalage": { "dx": 0, "dy": 0 } ajustement optionnel }
 *
 * Rendu : page hôte temporaire HORS dépôt (patron de capture-village.js) qui
 * affiche le PNG brut à taille naturelle sous un <svg> superposé au pixel près.
 * Styles repris des jetons de la maquette : terra #9c3f00 sur halo blanc
 * #fdfbf9 (lisible sur interface claire comme sombre), chiffres et étiquettes
 * en Outfit (chargée avant capture, sinon textes rognés). L'image étant à
 * l'échelle 2, toutes les épaisseurs le sont aussi (trait 4 = 2 px à l'écran).
 *
 * Contrôles :
 * - zone nommée absente du sidecar        → erreur explicite, fichier non produit ;
 * - spec sans capture brute correspondante → avertissement (spec orpheline) ;
 * - capture brute sans spec                → avertissement ;
 * - PNG final de plus de 400 Ko            → avertissement.
 *
 * Usage :
 *   node scripts/capture-tutos-forum.js    # d'abord les brutes + sidecars
 *   node scripts/annoter-captures.js
 * ou, pour les pages publiques du site :
 *   node scripts/capture-esol-public.js
 *   node scripts/annoter-captures.js esol-public
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = path.join(__dirname, '..');
const BRUT_DIR = path.join(ROOT, 'captures', 'brut');

// Jeux de captures connus. Sans argument : forum, comme avant.
const JEUX = {
  'tutos-forum': {
    spec: path.join(__dirname, 'annotations', 'tutos-forum.json'),
    sortie: path.join(ROOT, 'src', 'img', 'tutos', 'forum'),
    prefixe: 'forum-',
  },
  'esol-public': {
    spec: path.join(__dirname, 'annotations', 'esol-public.json'),
    sortie: path.join(ROOT, 'src', 'img', 'tutos', 'plateforme'),
    prefixe: 'esol-',
  },
};
const NOM_JEU = process.argv[2] || 'tutos-forum';
const JEU = JEUX[NOM_JEU];
if (!JEU) {
  console.error('ABANDON : jeu inconnu « ' + NOM_JEU + ' ». Jeux connus : ' +
    Object.keys(JEUX).join(', ') + '.');
  process.exit(1);
}
const OUT_DIR = JEU.sortie;
const SPEC_FICHIER = JEU.spec;

// Mêmes polices que les pages de la démo.
const CDN_FONTS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';

function dimensionsPng(buffer) {
  return { l: buffer.readUInt32BE(16), h: buffer.readUInt32BE(20) };
}

const enFileUrl = p => 'file:///' + p.replace(/\\/g, '/');

// Page hôte : l'image à taille naturelle, le SVG d'annotations par-dessus.
// Les annotations sont construites DANS la page (mesure du texte des
// étiquettes avec la police réellement chargée).
function pageHote(imgUrl, dims, annotations) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Annotation de capture</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${CDN_FONTS}" rel="stylesheet">
<style>
  body { margin: 0; background: #ffffff; }
  #cadre { position: relative; width: ${dims.l}px; height: ${dims.h}px; }
  #cadre img { display: block; width: ${dims.l}px; height: ${dims.h}px; }
  #cadre svg { position: absolute; inset: 0; }
</style>
</head>
<body>
<div id="cadre">
  <img src="${imgUrl}" width="${dims.l}" height="${dims.h}" alt="">
  <svg id="calque" width="${dims.l}" height="${dims.h}" viewBox="0 0 ${dims.l} ${dims.h}" xmlns="http://www.w3.org/2000/svg"></svg>
</div>
<script>
  const ANNOTATIONS = ${JSON.stringify(annotations)};
  const L = ${dims.l}, H = ${dims.h};
  const TERRA = '#9c3f00', HALO = '#fdfbf9', ENCRE = '#1a1512';
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('calque');

  function el(nom, attrs) {
    const e = document.createElementNS(NS, nom);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    svg.appendChild(e);
    return e;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Cadre : rectangle arrondi autour de la zone, halo blanc sous le trait
  // terra, borné aux marges de l'image.
  function cadre(z, dx, dy) {
    const pad = 10;
    const x = clamp(z.x - pad + dx, 4, L - 8), y = clamp(z.y - pad + dy, 4, H - 8);
    const w = Math.min(z.w + 2 * pad, L - 4 - x), h = Math.min(z.h + 2 * pad, H - 4 - y);
    el('rect', { x, y, width: w, height: h, rx: 8, fill: 'none', stroke: HALO, 'stroke-width': 10 });
    el('rect', { x, y, width: w, height: h, rx: 8, fill: 'none', stroke: TERRA, 'stroke-width': 4 });
  }

  // Pastille : cercle terra numéroté, posé par défaut sur le coin haut-gauche
  // de la zone (sur l'angle du cadre).
  function pastille(z, n, dx, dy) {
    const r = 30;
    const cx = clamp(z.x + dx, r + 6, L - r - 6), cy = clamp(z.y + dy, r + 6, H - r - 6);
    el('circle', { cx, cy, r: r + 4, fill: HALO });
    el('circle', { cx, cy, r, fill: TERRA });
    const t = el('text', {
      x: cx, y: cy, fill: '#ffffff', 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': 'Outfit, sans-serif', 'font-weight': '700', 'font-size': '34px',
    });
    t.textContent = String(n);
  }

  // Point d'arrivée d'une flèche : sur le bord (élargi) de la boîte visée,
  // le long de la droite queue vers centre.
  function bordVise(queue, z, pad) {
    const cx = z.x + z.w / 2, cy = z.y + z.h / 2;
    const dx = cx - queue.x, dy = cy - queue.y;
    const x1 = z.x - pad, y1 = z.y - pad, x2 = z.x + z.w + pad, y2 = z.y + z.h + pad;
    let meilleur = null;
    const candidats = [];
    if (dx !== 0) candidats.push((x1 - queue.x) / dx, (x2 - queue.x) / dx);
    if (dy !== 0) candidats.push((y1 - queue.y) / dy, (y2 - queue.y) / dy);
    for (const s of candidats) {
      if (s <= 0 || s > 1) continue;
      const px = queue.x + dx * s, py = queue.y + dy * s;
      if (px >= x1 - 1 && px <= x2 + 1 && py >= y1 - 1 && py <= y2 + 1) {
        if (meilleur === null || s < meilleur) meilleur = s;
      }
    }
    const s = meilleur === null ? 1 : meilleur;
    return { x: queue.x + dx * s, y: queue.y + dy * s };
  }

  // Flèche : queue au centre de la zone + décalage, pointe triangulaire au
  // bord de la zone ; trait terra sur halo blanc.
  function fleche(z, dx, dy) {
    const queue = { x: z.x + z.w / 2 + (dx || -180), y: z.y + z.h / 2 + (dy || 140) };
    const pointe = bordVise(queue, z, 14);
    const angle = Math.atan2(pointe.y - queue.y, pointe.x - queue.x);
    const longPointe = 30, largPointe = 22;
    const base = { x: pointe.x - longPointe * Math.cos(angle), y: pointe.y - longPointe * Math.sin(angle) };
    const g1 = { x: base.x - (largPointe / 2) * Math.sin(angle), y: base.y + (largPointe / 2) * Math.cos(angle) };
    const g2 = { x: base.x + (largPointe / 2) * Math.sin(angle), y: base.y - (largPointe / 2) * Math.cos(angle) };
    const pts = pointe.x + ',' + pointe.y + ' ' + g1.x + ',' + g1.y + ' ' + g2.x + ',' + g2.y;
    el('line', { x1: queue.x, y1: queue.y, x2: base.x, y2: base.y, stroke: HALO, 'stroke-width': 12, 'stroke-linecap': 'round' });
    el('polygon', { points: pts, fill: TERRA, stroke: HALO, 'stroke-width': 5, 'stroke-linejoin': 'round' });
    el('line', { x1: queue.x, y1: queue.y, x2: base.x, y2: base.y, stroke: TERRA, 'stroke-width': 5, 'stroke-linecap': 'round' });
    const p2 = document.createElementNS(NS, 'polygon');
    p2.setAttribute('points', pts);
    p2.setAttribute('fill', TERRA);
    svg.appendChild(p2);
  }

  // Étiquette : plaque claire bordée de terra, posée par défaut sous la zone.
  function etiquette(z, texte, dx, dy) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '600 28px Outfit, sans-serif';
    const lTexte = ctx.measureText(texte).width;
    const w = Math.ceil(lTexte) + 44, h = 58;
    const x = clamp(z.x + dx, 6, L - w - 6), y = clamp(z.y + z.h + 18 + dy, 6, H - h - 6);
    el('rect', { x, y, width: w, height: h, rx: 10, fill: HALO, stroke: TERRA, 'stroke-width': 3 });
    const t = el('text', {
      x: x + w / 2, y: y + h / 2, fill: ENCRE, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': 'Outfit, sans-serif', 'font-weight': '600', 'font-size': '28px',
    });
    t.textContent = texte;
  }

  Promise.all([
    document.fonts.load('600 28px Outfit'),
    document.fonts.load('700 34px Outfit'),
    document.fonts.ready,
  ]).then(() => {
    for (const a of ANNOTATIONS) {
      const z = a.rect;
      const dx = (a.decalage && a.decalage.dx) || 0;
      const dy = (a.decalage && a.decalage.dy) || 0;
      if (a.type === 'cadre') cadre(z, dx, dy);
      else if (a.type === 'pastille') pastille(z, a.n, dx, dy);
      else if (a.type === 'fleche') fleche(z, dx, dy);
      else if (a.type === 'etiquette') etiquette(z, a.texte, dx, dy);
    }
    window.__pret = true;
  });
</script>
</body>
</html>`;
}

(async () => {
  if (!fs.existsSync(SPEC_FICHIER)) {
    console.error('ABANDON : spécification introuvable (' + SPEC_FICHIER + ').');
    process.exit(1);
  }
  if (!fs.existsSync(BRUT_DIR)) {
    console.error('ABANDON : ' + BRUT_DIR + ' introuvable. Lancer d\'abord :');
    console.error('  node scripts/capture-tutos-forum.js');
    process.exit(1);
  }
  if (!fs.existsSync(CHROME)) {
    console.error('ABANDON : Chrome introuvable (' + CHROME + '). Surcharger avec CHROME_PATH.');
    process.exit(1);
  }

  const spec = JSON.parse(fs.readFileSync(SPEC_FICHIER, 'utf8'));

  // Brutes sans spec : signalées, pour ne pas oublier une vue. Seules les
  // brutes du jeu courant (préfixe) sont considérées : les deux jeux
  // partagent captures/brut/.
  for (const f of fs.readdirSync(BRUT_DIR).filter(f => f.endsWith('.png') && f.startsWith(JEU.prefixe))) {
    if (!spec[f]) console.log('AVERTISSEMENT : capture brute sans spec d\'annotation : ' + f);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: path.join(os.tmpdir(), 'esol-capture-profile'),
    args: ['--lang=fr-FR', '--disable-gpu', '--no-first-run'],
  });
  const page = await browser.newPage();

  let ok = 0, erreurs = 0;
  for (const [fichier, annotations] of Object.entries(spec)) {
    const brut = path.join(BRUT_DIR, fichier);
    const sidecar = path.join(BRUT_DIR, fichier.replace(/\.png$/, '.zones.json'));
    if (!fs.existsSync(brut) || !fs.existsSync(sidecar)) {
      console.log('AVERTISSEMENT : spec orpheline (brut ou sidecar manquant) : ' + fichier);
      continue;
    }

    // Résolution des zones : nom du sidecar, ou rectangle littéral en repli.
    const zones = JSON.parse(fs.readFileSync(sidecar, 'utf8')).zones || {};
    let resolues;
    try {
      resolues = annotations.map(a => {
        if (typeof a.zone === 'string') {
          if (!zones[a.zone]) {
            throw new Error('zone « ' + a.zone + ' » absente de ' + path.basename(sidecar) +
              ' (zones connues : ' + Object.keys(zones).join(', ') + ')');
          }
          return { ...a, rect: zones[a.zone] };
        }
        if (a.zone && ['x', 'y', 'w', 'h'].every(k => typeof a.zone[k] === 'number')) {
          return { ...a, rect: a.zone };
        }
        throw new Error('zone illisible pour une annotation « ' + a.type + ' »');
      });
    } catch (e) {
      console.log('ERREUR ' + fichier + ' : ' + e.message);
      erreurs++;
      continue;
    }

    try {
      const buffer = fs.readFileSync(brut);
      const dims = dimensionsPng(buffer);
      const hote = path.join(os.tmpdir(), 'esol-annotation-' + fichier.replace(/\.png$/, '') + '.html');
      fs.writeFileSync(hote, pageHote(enFileUrl(brut), dims, resolues));

      await page.setViewport({ width: dims.l + 40, height: dims.h + 40, deviceScaleFactor: 1 });
      await page.goto(enFileUrl(hote), { waitUntil: 'load', timeout: 45000 });
      await page.waitForFunction(() => window.__pret === true, { timeout: 30000 });
      await new Promise(r => setTimeout(r, 400));

      const cible = await page.$('#cadre');
      const sortie = await cible.screenshot();
      fs.writeFileSync(path.join(OUT_DIR, fichier), sortie);
      const ko = Math.round(sortie.length / 1024);
      console.log('OK   ' + fichier + ' : ' + dims.l + ' x ' + dims.h + ' px, ' + ko + ' Ko, ' +
        resolues.length + ' annotations');
      if (ko > 400) console.log('     ATTENTION : plus de 400 Ko, à alléger avant téléversement.');
      ok++;
    } catch (e) {
      console.log('ERREUR ' + fichier + ' : ' + e.message.split('\n')[0]);
      erreurs++;
    }
  }

  await browser.close();
  console.log(ok + '/' + Object.keys(spec).length + ' PNG finaux dans ' + OUT_DIR);
  console.log('Vérifier chaque image : annotations en place, et aucun nom réel lisible.');
  if (erreurs) process.exit(1);
})();
