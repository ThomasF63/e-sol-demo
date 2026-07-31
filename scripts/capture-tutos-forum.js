/**
 * Captures d'écran automatisées du forum e-Sol (Discourse) pour les tutoriels forum
 * (session 4). Produit les 7 vues PUBLIQUES listées dans docs/tutoriels-forum-yeswiki.md,
 * dans src/img/tutos/forum/. Les vues qui demandent un compte (fiches C à H) se font à
 * la main, en session guidée.
 *
 * Garde-fous :
 * - profil Chrome temporaire VIERGE : aucune session, aucun cookie, lecture seule
 *   par construction (impossible de publier ou modifier quoi que ce soit) ;
 * - avatars et noms d'utilisateur floutés en CSS avant chaque capture
 *   (règle du projet : jamais de vrais membres dans les livrables) ;
 * - user agent standard : Discourse sert sa vue « robot » sans interface aux
 *   navigateurs headless, on demande la vraie interface.
 *
 * PRÉALABLE : le certificat TLS de forum.e-sol.fr doit être VALIDE. Le script
 * refuse de tourner si le certificat est encore expiré (pas de contournement :
 * tant que le certificat est invalide, les captures ne représenteraient pas ce
 * que voient les membres, et le forum est de toute façon à réparer d'abord).
 *
 * Usage (une fois, à la racine du repo) :
 *   npm init -y && npm i puppeteer-core     # node_modules est gitignoré
 *   node scripts/capture-tutos-forum.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT_DIR = path.join(__dirname, '..', 'src', 'img', 'tutos', 'forum');
const TMP_PROFILE = path.join(require('os').tmpdir(), 'esol-capture-profile');
const FORUM = 'https://forum.e-sol.fr';

const BLUR_CSS = `
  img.avatar, .names, .names *, .username, .full-name, .user-card,
  .topic-map, .posters, .post-activity, aside.quote .title,
  .latest-topic-list-item .topic-poster
  { filter: blur(7px) !important; }
  * { animation: none !important; transition: none !important; }
`;

const TARGETS = [
  { file: 'forum-a-accueil.png',     url: FORUM + '/',                              sel: '#main-outlet .list-container, #main-outlet .category-list' },
  { file: 'forum-a-connexion.png',   url: FORUM + '/login',                         sel: '#login-account-name, .login-fullpage, #login-form, .login-page' },
  { file: 'forum-a-inscription.png', url: FORUM + '/signup',                        sel: '#new-account-email, .signup-fullpage, .create-account, .signup-page' },
  { file: 'forum-b-categories.png',  url: FORUM + '/categories',                    sel: '.category-list' },
  { file: 'forum-b-sujet.png',       url: FORUM + '/t/bienvenue-sur-forum-e-sol/5', sel: '.topic-post' },
  { file: 'forum-b-recherche.png',   url: FORUM + '/search?expanded=true',          sel: '.full-page-search, .search-advanced, .search-container' },
  { file: 'forum-c-categorie.png',   url: FORUM + '/c/sols-forestiers-iprsol/7',    sel: '.topic-list, .category-heading' },
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

(async () => {
  try {
    await checkCertificate();
  } catch (err) {
    console.error('ABANDON : ' + FORUM + ' inaccessible en connexion vérifiée (' + err.message + ').');
    console.error('Le certificat est probablement encore expiré. Le réparer, puis relancer.');
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
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  let ok = 0;
  for (const t of TARGETS) {
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForSelector(t.sel, { timeout: 20000 });
      await sleep(1500); // polices + rendu de l'application Discourse
      await page.addStyleTag({ content: BLUR_CSS });
      await sleep(300);
      await page.screenshot({ path: path.join(OUT_DIR, t.file) });
      console.log('OK   ' + t.file);
      ok++;
    } catch (e) {
      console.log('ECHEC ' + t.file + ' : ' + e.message.split('\n')[0]);
    }
  }

  await browser.close();
  console.log(ok + '/' + TARGETS.length + ' captures dans ' + OUT_DIR);
  console.log('Vérifier chaque image avant téléversement : cadrage, et aucun nom réel lisible.');
})();
