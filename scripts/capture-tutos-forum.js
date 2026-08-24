/**
 * Captures d'écran automatisées du forum e-Sol (Discourse) pour les tutoriels forum.
 * Produit les vues PUBLIQUES listées dans docs/tutoriels-forum-yeswiki.md, en BRUT
 * (non annoté) dans captures/brut/ (dossier hors git), avec pour chaque vue un
 * sidecar <nom>.zones.json : les rectangles des éléments d'interface à annoter,
 * en pixels du PNG (deviceScaleFactor 2 pris en compte).
 *
 * L'annotation (cadres, pastilles, flèches, étiquettes) se fait ensuite avec
 * scripts/annoter-captures.js, qui lit ces sidecars et la spécification
 * scripts/annotations/tutos-forum.json, et écrit les PNG finaux dans
 * src/img/tutos/forum/.
 *
 * Garde-fous :
 * - profil Chrome temporaire VIERGE : aucune session, aucun cookie, lecture seule
 *   par construction (impossible de publier ou modifier quoi que ce soit) ;
 * - avatars et noms d'utilisateur floutés en CSS avant chaque capture
 *   (règle du projet : jamais de vrais membres dans les livrables) ; les zones
 *   sont relevées APRÈS l'injection du floutage ;
 * - user agent standard : Discourse sert sa vue « robot » sans interface aux
 *   navigateurs headless, on demande la vraie interface ;
 * - le certificat TLS de forum.e-sol.fr doit être VALIDE (renouvelé le
 *   16/08/2026 après l'expiration du 19/07/2026) : le script refuse de tourner
 *   sur une connexion non vérifiée.
 *
 * Vues abandonnées (relevé du 18/08/2026) : forum-a-connexion.png et
 * forum-a-inscription.png. Les routes /login et /signup du forum redirigent
 * désormais vers la connexion unifiée d'e-sol.fr (DiscourseConnect) : ces
 * écrans n'existent plus côté forum, et la capture du site e-sol.fr n'entre
 * pas dans le périmètre de ce script (pages publiques du forum uniquement).
 * La fiche A devra être ajustée en conséquence (relecture avec Lucile).
 *
 * Usage (une fois, à la racine du repo) :
 *   npm i puppeteer-core                    # node_modules est gitignoré
 *   node scripts/capture-tutos-forum.js
 *   node scripts/annoter-captures.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT_DIR = path.join(__dirname, '..', 'captures', 'brut');
const TMP_PROFILE = path.join(require('os').tmpdir(), 'esol-capture-profile');
const FORUM = 'https://forum.e-sol.fr';
const ECHELLE = 2; // deviceScaleFactor : les PNG font 2560 x 1600 pour 1280 x 800 CSS

const BLUR_CSS = `
  img.avatar, .names, .names *, .username, .full-name, .user-card,
  .topic-map, .posters, .post-activity, aside.quote .title,
  .latest-topic-list-item .topic-poster
  { filter: blur(7px) !important; }
  * { animation: none !important; transition: none !important; }
`;

// Pour chaque vue : l'URL, le sélecteur attendu (preuve que l'application est
// rendue), et la table des zones à relever pour l'annotation. Chaque zone est
// une liste de sélecteurs séparés par des virgules : le premier qui matche
// gagne (les classes Discourse varient d'une version à l'autre).
const TARGETS = [
  {
    file: 'forum-a-accueil.png',
    url: FORUM + '/',
    sel: '#main-outlet .list-container, #main-outlet .category-list',
    zones: {
      'se-connecter': '.d-header .login-button, .login-button',
      'logo': '#site-logo',
      'recherche-banniere': '.welcome-banner .search-menu, .search-menu-container',
    },
  },
  {
    file: 'forum-b-categories.png',
    url: FORUM + '/categories',
    sel: '.category-list',
    zones: {
      'onglet-categories': '.nav-pills a.active',
      'liste-categories': '.category-list',
      'sols-forestiers-lateral': '.sidebar-section-link[href*="sols-forestiers"], a[href*="sols-forestiers"]',
    },
  },
  {
    file: 'forum-b-sujet.png',
    url: FORUM + '/t/bienvenue-sur-forum-e-sol/5',
    sel: '.topic-post',
    zones: {
      'titre-sujet': '.fancy-title',
      'categorie-sujet': '#topic-title .badge-category__wrapper, .topic-category',
      'premier-message': '.topic-post',
      'logo': '#site-logo',
    },
  },
  {
    file: 'forum-b-recherche.png',
    url: FORUM + '/search?expanded=true',
    sel: '.full-page-search, .search-advanced, .search-container',
    zones: {
      'barre-recherche': '.search-bar',
      'champ-recherche': 'input.full-page-search, .search-query',
      'bouton-recherche': '.search-cta',
    },
  },
  {
    file: 'forum-c-categorie.png',
    url: FORUM + '/c/sols-forestiers-iprsol/7',
    sel: '.topic-list, .category-heading',
    zones: {
      'chip-categorie': '.badge-category__wrapper',
      'chip-sous-categories': '.subcategory-drop, .category-breadcrumb li:nth-child(2)',
      'sous-categorie-biodiversite': 'a[href*="biodiversite"]',
    },
  },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function checkCertificate() {
  return new Promise((resolve, reject) => {
    const req = https.request(FORUM + '/', { method: 'HEAD', timeout: 15000 }, res => resolve());
    req.on('error', err => reject(err));
    req.on('timeout', () => { req.destroy(); reject(new Error('délai dépassé')); });
    req.end();
  });
}

// Relève les rectangles des zones dans la page, en pixels du PNG. Une zone
// entièrement hors du cadre capturé est omise (avertissement) ; une zone qui
// dépasse est rognée aux bords du cadre.
async function releverZones(page, zones, viewport) {
  const brut = await page.evaluate((zones) => {
    const res = {};
    for (const [nom, sels] of Object.entries(zones)) {
      let el = null, retenu = null;
      for (const s of sels.split(',').map(x => x.trim())) {
        try { el = document.querySelector(s); } catch { el = null; }
        if (el) { retenu = s; break; }
      }
      if (!el) { res[nom] = null; continue; }
      const r = el.getBoundingClientRect();
      res[nom] = { x: r.x, y: r.y, w: r.width, h: r.height, selecteur: retenu };
    }
    return res;
  }, zones);

  const sortie = {};
  for (const [nom, z] of Object.entries(brut)) {
    if (!z) { console.log('     zone absente : ' + nom); continue; }
    if (z.x >= viewport.width || z.y >= viewport.height || z.x + z.w <= 0 || z.y + z.h <= 0) {
      console.log('     zone hors cadre : ' + nom + ' (y=' + Math.round(z.y) + ')');
      continue;
    }
    const x1 = Math.max(0, z.x), y1 = Math.max(0, z.y);
    const x2 = Math.min(viewport.width, z.x + z.w), y2 = Math.min(viewport.height, z.y + z.h);
    sortie[nom] = {
      x: Math.round(x1 * ECHELLE),
      y: Math.round(y1 * ECHELLE),
      w: Math.round((x2 - x1) * ECHELLE),
      h: Math.round((y2 - y1) * ECHELLE),
      selecteur: z.selecteur,
    };
  }
  return sortie;
}

(async () => {
  try {
    await checkCertificate();
  } catch (err) {
    console.error('ABANDON : ' + FORUM + ' inaccessible en connexion vérifiée (' + err.message + ').');
    console.error('Certificat expiré ou forum en panne. Réparer, puis relancer.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: TMP_PROFILE,
    args: ['--lang=fr-FR', '--disable-gpu', '--no-first-run'],
  });

  const page = await browser.newPage();
  // Sans cela, Discourse détecte « HeadlessChrome » et sert sa vue robot sans interface.
  const ua = (await browser.userAgent()).replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(ua);
  const viewport = { width: 1280, height: 800 };
  await page.setViewport({ ...viewport, deviceScaleFactor: ECHELLE });

  let ok = 0;
  for (const t of TARGETS) {
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForSelector(t.sel, { timeout: 20000 });
      await sleep(1500); // polices + rendu de l'application Discourse
      await page.addStyleTag({ content: BLUR_CSS });
      await sleep(300);
      const zones = await releverZones(page, t.zones || {}, viewport);
      await page.screenshot({ path: path.join(OUT_DIR, t.file) });
      fs.writeFileSync(
        path.join(OUT_DIR, t.file.replace(/\.png$/, '.zones.json')),
        JSON.stringify({
          source: t.url,
          capture: t.file,
          relevee: new Date().toISOString().slice(0, 10),
          viewport: viewport,
          deviceScaleFactor: ECHELLE,
          zones: zones,
        }, null, 2)
      );
      console.log('OK   ' + t.file + ' (' + Object.keys(zones).length + ' zones)');
      ok++;
    } catch (e) {
      console.log('ECHEC ' + t.file + ' : ' + e.message.split('\n')[0]);
    }
  }

  await browser.close();
  console.log(ok + '/' + TARGETS.length + ' captures brutes dans ' + OUT_DIR);
  console.log('Vérifier chaque image : cadrage, et aucun nom réel lisible.');
  console.log('Puis annoter : node scripts/annoter-captures.js');
})();
