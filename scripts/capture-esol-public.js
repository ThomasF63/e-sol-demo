/**
 * Captures d'écran automatisées des pages PUBLIQUES du site e-sol.fr (YesWiki)
 * pour les tutoriels de la maquette (premiers-pas notamment). Produit les vues
 * en BRUT (non annoté) dans captures/brut/ (dossier hors git), avec pour chaque
 * vue un sidecar <nom>.zones.json : les rectangles des éléments d'interface à
 * annoter, en pixels du PNG (deviceScaleFactor 2 pris en compte).
 *
 * L'annotation (cadres, pastilles, flèches, étiquettes) se fait ensuite avec
 * scripts/annoter-captures.js, qui lit ces sidecars et la spécification
 * scripts/annotations/esol-public.json, et écrit les PNG finaux dans
 * src/img/tutos/plateforme/ :
 *   node scripts/capture-esol-public.js
 *   node scripts/annoter-captures.js esol-public
 *
 * Garde-fous (patron de capture-tutos-forum.js) :
 * - LECTURE SEULE STRICTE : profil Chrome temporaire vierge, aucune session,
 *   aucun cookie, navigation GET et captures uniquement. Aucun clic, aucun
 *   champ rempli, aucun formulaire soumis. La seule intervention dans la page
 *   est côté client (CSS de floutage, ouverture visuelle d'un accordéon
 *   Bootstrap par ajout de la classe « in ») : le serveur ne voit que des GET ;
 * - règle du projet : jamais de vrais membres dans les livrables. Les éléments
 *   porteurs de noms réels (fiches bazar de l'annuaire, attributs
 *   data-bf_nom/prenom) sont floutés en CSS AVANT chaque capture, et chaque
 *   PNG doit être inspecté visuellement malgré tout avant intégration ;
 * - user agent dé-headlessifié, comme pour le forum ;
 * - le certificat TLS d'e-sol.fr doit être VALIDE : le script refuse de
 *   tourner sur une connexion non vérifiée.
 *
 * Pages écartées d'office (relevé du 19/08/2026) : ?ListeDesActions et
 * ?Trombinoscope-des-inscrits, dont tout le contenu utile est constitué de
 * fiches nominatives (référent·e·s, photos) : une fois floutées il ne resterait
 * rien à montrer. ?EspaceActions, elle, est une simple page d'orientation sans
 * aucune fiche : capturable sans floutage. ?Annuaire est capturée avec la
 * liste des fiches entièrement floutée (conteneur + entrées + attributs).
 *
 * Constat utile (19/08/2026) : le vrai formulaire d'inscription COMPORTE une
 * case charte, non obligatoire, libellée « J'ai lu la charte e-Sol et je
 * comprends qu'en m'inscrivant sur la plateforme, je m'engage à la
 * respecter. » (bf_charte_esol), distincte de la case RGPD obligatoire
 * (bf_rgpd), et suivie d'un champ conditionnel « Date de la signature de la
 * charte ».
 *
 * Syntaxe des zones (étend légèrement celle du script forum) :
 * - liste de sélecteurs séparés par des virgules, le premier qui matche gagne ;
 * - suffixe « @N » : N-ième correspondance (querySelectorAll) ;
 * - préfixe « texte:TAG:fragment » : premier élément TAG dont le texte contient
 *   le fragment (utile pour les pages YesWiki, pauvres en classes).
 *
 * Usage (une fois, à la racine du repo) :
 *   node scripts/capture-esol-public.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT_DIR = path.join(__dirname, '..', 'captures', 'brut');
const TMP_PROFILE = path.join(require('os').tmpdir(), 'esol-capture-profile');
const SITE = 'https://e-sol.fr';
const ECHELLE = 2; // deviceScaleFactor : les PNG font 2x la taille CSS

// Floutage de sécurité appliqué à TOUTES les pages : tout élément susceptible
// de porter un nom ou une photo de membre réel (fiches bazar, avatars).
const BLUR_CSS_BASE = `
  a.bazar-entry, .bazar-entry, [data-bf_nom], [data-bf_prenom], img.avatar
  { filter: blur(9px) !important; }
  * { animation: none !important; transition: none !important; }
`;

// Floutage renforcé pour l'annuaire : la liste alphabétique entière (306
// fiches nominatives) est floutée en bloc, en plus des entrées une à une.
const BLUR_CSS_ANNUAIRE = `
  .annuaire-fiches-container, .bazar-list .list
  { filter: blur(10px) !important; }
`;

// Pour chaque vue : l'URL, le sélecteur attendu (preuve que la page est
// rendue), la hauteur de fenêtre CSS (les pages YesWiki sont longues ; 800 ne
// suffit presque jamais), fullPage éventuel, préparation côté client
// éventuelle, floutage supplémentaire éventuel, et la table des zones.
const TARGETS = [
  {
    file: 'esol-accueil.png',
    url: SITE + '/?PagePrincipale',
    sel: '.page',
    hauteur: 2100, // du bandeau jusqu'à la gare d'aiguillage complète
    zones: {
      'bouton-inscription': ".page a[href*='FormulaireInscription']",
      'bloc-forum': '.page .background-image@0',
      'titre-besoins': 'texte:h2:Quels sont vos besoins',
      'gare-rangee-1': '.page .row-fluid@0',
      'gare-rangee-2': '.page .row-fluid@1',
      'gare-rangee-3': '.page .row-fluid@2',
      'gare-rangee-4': '.page .row-fluid@3',
      'se-connecter': "a[href='#LoginModal']",
    },
  },
  {
    file: 'esol-inscription.png',
    url: SITE + '/?FormulaireInscription',
    sel: '#formulaire',
    fullPage: true, // formulaire long : tout, du titre à la case charte
    attente: 3500,  // carte Leaflet du champ adresse
    zones: {
      'titre': '.page h1',
      'avertissement': '.page .alert.panel-warning',
      'civilite': ".control-group:has(#bf_civilite), #bf_civilite",
      'prenom': ".control-group:has(#bf_prenom), #bf_prenom",
      'nom': ".control-group:has(#bf_nom), #bf_nom",
      'email': ".control-group:has(#bf_mail), #bf_mail",
      'mot-de-passe': ".control-group:has(input[name='mot_de_passe_wikini']), input[name='mot_de_passe_wikini']",
      'photo': '.control-group.input-image@0, .file-url-tabs',
      'structure': ".control-group:has(#bf_structure), #bf_structure",
      'specialites': ".control-group:has(.group-checkbox-bf_specialite), .group-checkbox-bf_specialite",
      'communautes': ".control-group:has(.group-checkbox-bf_communautes), .group-checkbox-bf_communautes",
      'partage': ".control-group:has(#bf_partageContainer), #bf_partageContainer",
      'besoins': ".control-group:has(#bf_besoins_ressourcesContainer), .control-group:has([data-name='bf_besoins_ressources']), [data-name='bf_besoins_ressources']",
      'rgpd': ".control-group:has(.group-checkbox-bf_rgpd), .group-checkbox-bf_rgpd",
      'case-charte': ".control-group:has(.group-checkbox-bf_charte_esol), .group-checkbox-bf_charte_esol",
      'valider': ".form-actions button[type='submit']",
    },
  },
  {
    file: 'esol-charte.png',
    url: SITE + '/?Charte',
    sel: '.page .panel',
    hauteur: 1700, // titre, vidéo, version, préambule ouvert, premières sections
    attente: 3000, // miniature YouTube (carte-titre à logos, sans visage : vérifié)
    zones: {
      'titre-page': '.page h1',
      'bandeau-titre': '.page section.background-image@0',
      'video': ".page iframe[src*='youtube']",
      'version': '.page .label-info',
      'preambule': '.page .panel@0',
      'section-adhesion': '.page .panel@1',
      'section-gouvernance': '.page .panel@2',
    },
  },
  {
    file: 'esol-communautes.png',
    url: SITE + '/?ListeCommunautes',
    sel: '.page .panel-group',
    hauteur: 1600, // les 13 panneaux + le premier ouvert + « Rejoindre »
    // Ouverture VISUELLE du premier accordéon (Animateurs Fresque du Sol),
    // côté client uniquement : classes Bootstrap, aucun clic, aucun POST.
    preparation: () => {
      const corps = document.querySelector('.page .panel-group .panel-collapse');
      if (corps) corps.classList.add('in');
      const bouton = document.querySelector('.page .panel-group .panel-heading');
      if (bouton) {
        bouton.classList.remove('collapsed');
        bouton.setAttribute('aria-expanded', 'true');
      }
    },
    zones: {
      'titre-page': '.page h1',
      'accordeon': '.page .panel-group',
      'premier-panneau': '.page .panel-group .panel@0',
      'premier-bouton': '.page .panel-group .panel-heading@0',
      'premier-corps': '.page .panel-group .panel-collapse@0',
      'rejoindre': 'texte:h3:Rejoindre une communauté',
    },
  },
  {
    file: 'esol-espace-actions.png',
    url: SITE + '/?EspaceActions',
    sel: '.page',
    hauteur: 900, // page courte : intro + les deux blocs d'orientation
    zones: {
      'titre-page': '.page h1',
      'bloc-liste': '.page .background-image@0',
      'bouton-liste': ".page a[href*='ListeDesActions']",
      'bloc-proposer': '.page .background-image@1',
      'bouton-deposer': ".page a[href*='SaisirFicheAction']",
    },
  },
  {
    file: 'esol-annuaire.png',
    url: SITE + '/?Annuaire',
    sel: '.bazar-list',
    hauteur: 1400, // intro, onglets, recherche, filtres, début de liste floutée
    blur: BLUR_CSS_ANNUAIRE,
    zones: {
      'titre-page': '.page h1',
      'onglets': '.page .nav-tabs@0',
      'recherche': '#bazar-search-1',
      'filtres': '.filters-col',
      'nb-resultats': '.results-info',
      'liste-floutee': '.annuaire-fiches-container, .bazar-list',
    },
  },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function checkCertificate() {
  return new Promise((resolve, reject) => {
    const req = https.request(SITE + '/', { method: 'HEAD', timeout: 15000 }, res => resolve());
    req.on('error', err => reject(err));
    req.on('timeout', () => { req.destroy(); reject(new Error('délai dépassé')); });
    req.end();
  });
}

// Relève les rectangles des zones, en pixels du PNG. En vue fenêtre, une zone
// hors cadre est omise et une zone qui dépasse est rognée ; en pleine page,
// les coordonnées sont celles du document (défilement inclus).
async function releverZones(page, zones, viewport, fullPage) {
  const brut = await page.evaluate((zones, fullPage) => {
    function resoudre(spec) {
      for (const s of spec.split(',').map(x => x.trim())) {
        if (s.startsWith('texte:')) {
          const morceaux = s.split(':');
          const tag = morceaux[1];
          const fragment = morceaux.slice(2).join(':');
          const el = Array.from(document.querySelectorAll(tag))
            .find(e => e.textContent.includes(fragment));
          if (el) return { el, retenu: s };
          continue;
        }
        let sel = s, idx = 0;
        const m = s.match(/^(.*)@(\d+)$/);
        if (m) { sel = m[1].trim(); idx = parseInt(m[2], 10); }
        try {
          const liste = document.querySelectorAll(sel);
          if (liste[idx]) return { el: liste[idx], retenu: s };
        } catch (e) { /* sélecteur non supporté : on passe au suivant */ }
      }
      return null;
    }
    const res = {};
    for (const [nom, spec] of Object.entries(zones)) {
      const trouve = resoudre(spec);
      if (!trouve) { res[nom] = null; continue; }
      const r = trouve.el.getBoundingClientRect();
      res[nom] = {
        x: r.x + (fullPage ? window.scrollX : 0),
        y: r.y + (fullPage ? window.scrollY : 0),
        w: r.width, h: r.height,
        selecteur: trouve.retenu,
      };
    }
    if (fullPage) {
      res.__doc = {
        w: document.documentElement.scrollWidth,
        h: document.documentElement.scrollHeight,
      };
    }
    return res;
  }, zones, !!fullPage);

  const cadre = fullPage
    ? { width: brut.__doc.w, height: brut.__doc.h }
    : { width: viewport.width, height: viewport.height };
  delete brut.__doc;

  const sortie = {};
  for (const [nom, z] of Object.entries(brut)) {
    if (!z) { console.log('     zone absente : ' + nom); continue; }
    if (z.x >= cadre.width || z.y >= cadre.height || z.x + z.w <= 0 || z.y + z.h <= 0) {
      console.log('     zone hors cadre : ' + nom + ' (y=' + Math.round(z.y) + ')');
      continue;
    }
    const x1 = Math.max(0, z.x), y1 = Math.max(0, z.y);
    const x2 = Math.min(cadre.width, z.x + z.w), y2 = Math.min(cadre.height, z.y + z.h);
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
    console.error('ABANDON : ' + SITE + ' inaccessible en connexion vérifiée (' + err.message + ').');
    console.error('Certificat invalide ou site en panne. Réparer, puis relancer.');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    userDataDir: TMP_PROFILE,
    protocolTimeout: 180000, // pages longues (formulaire pleine page)
    args: ['--lang=fr-FR', '--disable-gpu', '--no-first-run'],
  });

  const page = await browser.newPage();
  // Certains services servent une page dégradée aux navigateurs headless.
  const ua = (await browser.userAgent()).replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(ua);

  let ok = 0;
  for (const t of TARGETS) {
    try {
      const viewport = { width: 1280, height: t.hauteur || 800 };
      await page.setViewport({ ...viewport, deviceScaleFactor: ECHELLE });
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForSelector(t.sel, { timeout: 20000 });

      // Chargement complet : polices, puis images (y compris paresseuses,
      // forcées par un défilement progressif), avec attente BORNÉE : une image
      // cassée ou jamais chargée ne doit pas bloquer la capture.
      await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        const pas = Math.max(400, window.innerHeight - 100);
        for (let y = 0; y <= h; y += pas) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 250));
        }
        window.scrollTo(0, 0);
        const enAttente = Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(r => { img.onload = img.onerror = r; }));
        await Promise.race([
          Promise.all(enAttente),
          new Promise(r => setTimeout(r, 6000)),
        ]);
      });
      if (t.preparation) await page.evaluate(t.preparation);
      await page.addStyleTag({ content: BLUR_CSS_BASE + (t.blur || '') });
      await sleep(1500 + (t.attente || 0));

      const zones = await releverZones(page, t.zones || {}, viewport, t.fullPage);
      await page.screenshot({ path: path.join(OUT_DIR, t.file), fullPage: !!t.fullPage });
      fs.writeFileSync(
        path.join(OUT_DIR, t.file.replace(/\.png$/, '.zones.json')),
        JSON.stringify({
          source: t.url,
          capture: t.file,
          relevee: new Date().toISOString().slice(0, 10),
          viewport: viewport,
          fullPage: !!t.fullPage,
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
  console.log('Vérifier chaque image : cadrage, et aucun nom réel lisible (annuaire surtout).');
  console.log('Puis annoter : node scripts/annoter-captures.js esol-public');
})();
