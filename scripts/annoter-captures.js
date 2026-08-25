/**
 * Annotation reproductible des captures : incruste un voile « projecteur »,
 * des cadres, des pastilles numérotées, des flèches et des étiquettes sur les
 * captures BRUTES de captures/brut/ et écrit les PNG FINAUX sous leurs noms
 * canoniques.
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
 * Une entrée réservée, sans zone, règle le rendu de l'image :
 *   { "type": "reglages", "projecteur": false }        voile désactivé
 *   { "type": "reglages", "opacite": 0.24 }            voile plus léger
 *
 * VOILE PROJECTEUR (depuis le 25/08/2026)
 * Tout ce qui n'est pas encadré est assombri d'un voile translucide : l'œil
 * va droit aux zones utiles, sans que le reste cesse d'être lisible (opacité
 * légère, bords adoucis). Les trous du voile épousent exactement les cadres,
 * si bien que le halo clair du cadre brille au bord de l'ombre. Les
 * étiquettes, les flèches et les pastilles sont tracées PAR-DESSUS le voile :
 * elles restent pleinement lisibles où qu'elles soient posées.
 *
 * Rendu : page hôte temporaire HORS dépôt (patron de capture-village.js) qui
 * affiche le PNG brut à taille naturelle sous un <svg> superposé au pixel près.
 * Styles repris des jetons de la maquette : terra #9c3f00 sur halo blanc
 * #fdfbf9 (lisible sur interface claire comme sombre), chiffres et étiquettes
 * en Outfit (chargée avant capture, sinon textes rognés). L'image étant à
 * l'échelle 2, toutes les épaisseurs le sont aussi (trait 6 = 3 px à l'écran).
 *
 * Contrôles :
 * - zone nommée absente du sidecar        → erreur explicite, fichier non produit ;
 * - spec sans capture brute correspondante → avertissement (spec orpheline) ;
 * - capture brute sans spec                → avertissement ;
 * - PNG final de plus de 400 Ko            → recompression Pillow (256 couleurs),
 *                                            puis avertissement s'il reste lourd.
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
const { execFileSync } = require('child_process');
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
const POIDS_CIBLE_KO = 400;

// Mêmes polices que les pages de la démo.
const CDN_FONTS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';

function dimensionsPng(buffer) {
  return { l: buffer.readUInt32BE(16), h: buffer.readUInt32BE(20) };
}

const enFileUrl = p => 'file:///' + p.replace(/\\/g, '/');

// Recompression Pillow : le voile ajoute des teintes intermédiaires et fait
// gonfler le PNG. Deux crans, dans cet ordre :
//   1. quantification à 256 couleurs (suffit pour toutes les vues d'écran) ;
//   2. pour les captures démesurées SEULEMENT (pleine page de plus de 8 Mpx,
//      en pratique le formulaire d'inscription et sa carte Leaflet), demi-
//      résolution : l'image retombe alors exactement à la taille déclarée
//      dans les pages, sans perte visible à l'écran.
// Silencieuse si Python ou Pillow manquent : l'image reste produite, seulement
// plus lourde.
const SEUIL_DEMI_PX = 8000000;
const PY_ALLEGE = [
  'import os, sys',
  'from PIL import Image',
  'src, cible, seuil = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])',
  "img = Image.open(src).convert('RGB')",
  'img.quantize(colors=256).save(src, optimize=True)',
  'if os.path.getsize(src) > cible and img.width * img.height > seuil:',
  '    demi = img.resize((img.width // 2, img.height // 2), Image.LANCZOS)',
  '    demi.quantize(colors=256).save(src, optimize=True)',
].join('\n');

function alleger(fichier) {
  const args = ['-c', PY_ALLEGE, fichier, String(POIDS_CIBLE_KO * 1024), String(SEUIL_DEMI_PX)];
  for (const py of ['python', 'py', 'python3']) {
    try {
      execFileSync(py, args, { stdio: 'ignore' });
      return true;
    } catch (e) { /* interpréteur suivant */ }
  }
  return false;
}

// Page hôte : l'image à taille naturelle, le SVG d'annotations par-dessus.
// Les annotations sont construites DANS la page (mesure du texte des
// étiquettes avec la police réellement chargée).
function pageHote(imgUrl, dims, annotations, reglages) {
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
  const REGLAGES = ${JSON.stringify(reglages)};
  const L = ${dims.l}, H = ${dims.h};
  const TERRA = '#9c3f00', HALO = '#fdfbf9', ENCRE = '#1a1512', OMBRE = '#120d0a';
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('calque');

  // Épaisseurs (repère de l'image : échelle 2, donc moitié à l'écran).
  const CADRE_TRAIT = 6;      // trait terra du cadre
  const CADRE_HALO = 16;      // halo clair sous le trait
  const CADRE_RAYON = 14;     // coins arrondis
  const CADRE_MARGE = 10;     // écart entre la zone et le cadre
  const PASTILLE_R = 40;      // rayon du disque terra
  const PASTILLE_ANNEAU = 8;  // anneau clair autour du disque
  const VOILE_OPACITE = typeof REGLAGES.opacite === 'number' ? REGLAGES.opacite : 0.26;
  const VOILE_FLOU = 9;       // adoucissement du bord du projecteur

  function el(nom, attrs, parent) {
    const e = document.createElementNS(NS, nom);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    (parent || svg).appendChild(e);
    return e;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Géométrie du cadre d'une zone : une seule source pour le trait tracé et
  // pour le trou correspondant dans le voile (sinon l'ombre déborderait).
  function geometrieCadre(z, dx, dy) {
    const pad = CADRE_MARGE;
    const x = clamp(z.x - pad + dx, 4, L - 8), y = clamp(z.y - pad + dy, 4, H - 8);
    const w = Math.min(z.w + 2 * pad, L - 4 - x), h = Math.min(z.h + 2 * pad, H - 4 - y);
    return { x, y, w, h };
  }

  // ---- Définitions partagées : ombre portée et masque du projecteur ----
  const defs = el('defs', {});

  const ombre = el('filter', {
    id: 'ombre-portee', x: '-30%', y: '-30%', width: '160%', height: '160%',
  }, defs);
  el('feDropShadow', {
    dx: 0, dy: 5, stdDeviation: 7, 'flood-color': OMBRE, 'flood-opacity': 0.45,
  }, ombre);

  const ombreFine = el('filter', {
    id: 'ombre-fine', x: '-30%', y: '-30%', width: '160%', height: '160%',
  }, defs);
  el('feDropShadow', {
    dx: 0, dy: 3, stdDeviation: 5, 'flood-color': OMBRE, 'flood-opacity': 0.38,
  }, ombreFine);

  // Voile « projecteur » : opaque partout (blanc dans le masque), percé aux
  // cadres (noir), avec un bord légèrement adouci.
  function poserVoile(zones) {
    if (!zones.length) return;
    const masque = el('mask', { id: 'projecteur', maskUnits: 'userSpaceOnUse',
      x: 0, y: 0, width: L, height: H }, defs);
    el('rect', { x: 0, y: 0, width: L, height: H, fill: '#ffffff' }, masque);
    const flou = el('filter', { id: 'flou-projecteur',
      x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
    el('feGaussianBlur', { stdDeviation: VOILE_FLOU }, flou);
    const trous = el('g', { filter: 'url(#flou-projecteur)' }, masque);
    for (const g of zones) {
      el('rect', { x: g.x, y: g.y, width: g.w, height: g.h,
        rx: CADRE_RAYON, fill: '#000000' }, trous);
    }
    el('rect', { x: 0, y: 0, width: L, height: H, fill: OMBRE,
      opacity: VOILE_OPACITE, mask: 'url(#projecteur)' });
  }

  // Cadre : rectangle arrondi autour de la zone, halo clair sous le trait
  // terra, borné aux marges de l'image. Le halo brille au bord du voile.
  function cadre(g) {
    el('rect', { x: g.x, y: g.y, width: g.w, height: g.h, rx: CADRE_RAYON,
      fill: 'none', stroke: HALO, 'stroke-width': CADRE_HALO, opacity: 0.92 });
    el('rect', { x: g.x, y: g.y, width: g.w, height: g.h, rx: CADRE_RAYON,
      fill: 'none', stroke: TERRA, 'stroke-width': CADRE_TRAIT });
  }

  // Pastille : disque terra numéroté, anneau clair et ombre portée, posé par
  // défaut sur le coin haut-gauche de la zone (sur l'angle du cadre).
  function pastille(z, n, dx, dy) {
    const r = PASTILLE_R, marge = r + PASTILLE_ANNEAU + 6;
    const cx = clamp(z.x + dx, marge, L - marge), cy = clamp(z.y + dy, marge, H - marge);
    el('circle', { cx, cy, r: r + PASTILLE_ANNEAU, fill: HALO, filter: 'url(#ombre-portee)' });
    el('circle', { cx, cy, r, fill: TERRA });
    const t = el('text', {
      x: cx, y: cy, fill: '#ffffff', 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': 'Outfit, sans-serif', 'font-weight': '700', 'font-size': '46px',
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
  // bord de la zone ; trait terra sur halo clair, l'ensemble ombré.
  function fleche(z, dx, dy) {
    const queue = { x: z.x + z.w / 2 + (dx || -180), y: z.y + z.h / 2 + (dy || 140) };
    const pointe = bordVise(queue, z, 14);
    const angle = Math.atan2(pointe.y - queue.y, pointe.x - queue.x);
    const longPointe = 46, largPointe = 34;
    const base = { x: pointe.x - longPointe * Math.cos(angle), y: pointe.y - longPointe * Math.sin(angle) };
    const g1 = { x: base.x - (largPointe / 2) * Math.sin(angle), y: base.y + (largPointe / 2) * Math.cos(angle) };
    const g2 = { x: base.x + (largPointe / 2) * Math.sin(angle), y: base.y - (largPointe / 2) * Math.cos(angle) };
    const pts = pointe.x + ',' + pointe.y + ' ' + g1.x + ',' + g1.y + ' ' + g2.x + ',' + g2.y;
    // Doublure claire (trait + pointe), ombrée d'un bloc : la flèche se
    // détache aussi bien sur interface claire que sur interface sombre.
    const socle = el('g', { filter: 'url(#ombre-fine)' });
    el('line', { x1: queue.x, y1: queue.y, x2: base.x, y2: base.y,
      stroke: HALO, 'stroke-width': 18, 'stroke-linecap': 'round' }, socle);
    el('polygon', { points: pts, fill: HALO, stroke: HALO, 'stroke-width': 12,
      'stroke-linejoin': 'round' }, socle);
    el('line', { x1: queue.x, y1: queue.y, x2: base.x, y2: base.y,
      stroke: TERRA, 'stroke-width': 8, 'stroke-linecap': 'round' });
    el('polygon', { points: pts, fill: TERRA });
  }

  // Étiquette : plaque claire bordée de terra, ombrée, posée par défaut sous
  // la zone. Un liseré terra à gauche la rattache à la charte.
  function etiquette(z, texte, dx, dy) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '600 30px Outfit, sans-serif';
    const lTexte = ctx.measureText(texte).width;
    const w = Math.ceil(lTexte) + 56, h = 64;
    const x = clamp(z.x + dx, 6, L - w - 6), y = clamp(z.y + z.h + 18 + dy, 6, H - h - 6);
    el('rect', { x, y, width: w, height: h, rx: 12, fill: HALO, stroke: TERRA,
      'stroke-width': 4, filter: 'url(#ombre-portee)' });
    el('rect', { x: x + 4, y: y + 12, width: 7, height: h - 24, rx: 3.5, fill: TERRA });
    const t = el('text', {
      x: x + 8 + w / 2, y: y + h / 2, fill: ENCRE, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': 'Outfit, sans-serif', 'font-weight': '600', 'font-size': '30px',
    });
    t.textContent = texte;
  }

  Promise.all([
    document.fonts.load('600 30px Outfit'),
    document.fonts.load('700 46px Outfit'),
    document.fonts.ready,
  ]).then(() => {
    // 1. Géométrie des cadres, puis voile : il doit passer SOUS tout le reste.
    const cadres = ANNOTATIONS
      .filter(a => a.type === 'cadre')
      .map(a => geometrieCadre(a.rect, (a.decalage && a.decalage.dx) || 0,
        (a.decalage && a.decalage.dy) || 0));
    if (REGLAGES.projecteur !== false) poserVoile(cadres);

    // 2. Annotations, dans l'ordre de la spécification.
    let iCadre = 0;
    for (const a of ANNOTATIONS) {
      const z = a.rect;
      const dx = (a.decalage && a.decalage.dx) || 0;
      const dy = (a.decalage && a.decalage.dy) || 0;
      if (a.type === 'cadre') cadre(cadres[iCadre++]);
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
  for (const [fichier, entrees] of Object.entries(spec)) {
    const brut = path.join(BRUT_DIR, fichier);
    const sidecar = path.join(BRUT_DIR, fichier.replace(/\.png$/, '.zones.json'));
    if (!fs.existsSync(brut) || !fs.existsSync(sidecar)) {
      console.log('AVERTISSEMENT : spec orpheline (brut ou sidecar manquant) : ' + fichier);
      continue;
    }

    // Entrées « reglages » : réglages de rendu, hors annotations (pas de zone).
    const reglages = {};
    const annotations = entrees.filter(a => {
      if (a.type !== 'reglages') return true;
      Object.assign(reglages, a);
      return false;
    });

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
      fs.writeFileSync(hote, pageHote(enFileUrl(brut), dims, resolues, reglages));

      await page.setViewport({ width: dims.l + 40, height: dims.h + 40, deviceScaleFactor: 1 });
      await page.goto(enFileUrl(hote), { waitUntil: 'load', timeout: 45000 });
      await page.waitForFunction(() => window.__pret === true, { timeout: 30000 });
      await new Promise(r => setTimeout(r, 400));

      const cible = await page.$('#cadre');
      const sortie = await cible.screenshot();
      const final = path.join(OUT_DIR, fichier);
      fs.writeFileSync(final, sortie);

      // Le voile ajoute des teintes intermédiaires : on repasse par Pillow
      // dès que l'image dépasse la cible de poids.
      let ko = Math.round(fs.statSync(final).size / 1024);
      let taille = dims.l + ' x ' + dims.h + ' px';
      let note = '';
      if (ko > POIDS_CIBLE_KO) {
        const avant = ko;
        if (alleger(final)) {
          ko = Math.round(fs.statSync(final).size / 1024);
          const apres = dimensionsPng(fs.readFileSync(final));
          if (apres.l !== dims.l) taille = apres.l + ' x ' + apres.h + ' px (demi-résolution)';
          note = ' (allégé depuis ' + avant + ' Ko)';
        } else {
          note = ' (allègement impossible : Python ou Pillow absent)';
        }
      }
      console.log('OK   ' + fichier + ' : ' + taille + ', ' + ko + ' Ko' + note +
        ', ' + resolues.length + ' annotations');
      if (ko > POIDS_CIBLE_KO) {
        console.log('     ATTENTION : plus de ' + POIDS_CIBLE_KO + ' Ko, à alléger avant téléversement.');
      }
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
