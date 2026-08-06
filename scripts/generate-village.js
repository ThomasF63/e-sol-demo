/**
 * generate-village.js
 * -------------------
 * Génère les maisons du village e-Sol à partir de src/data/communities.json.
 *
 * Deux sorties, toutes deux des FICHIERS GÉNÉRÉS (ne pas les éditer à la main) :
 *   - src/components/village-maisons.html  → le groupe SVG des maisons, inséré dans
 *                                            illustration-village.html
 *   - src/components/village-liste.html    → la liste texte des communautés, repli
 *                                            accessible et base du portage YesWiki
 *
 * Appelé automatiquement par build.js avant la compilation des pages.
 * Ajouter une communauté dans le JSON suffit : elle apparaît dans le village au
 * prochain build, correctement placée, colorée, cliquable et annoncée aux lecteurs
 * d'écran. Aucune retouche du dessin n'est nécessaire.
 *
 * Le dessin propre à chaque communauté (la scène visible dans la baie) vit dans
 * illustration-village.html sous la forme d'un <symbol id="vg-{id}">. Si une
 * communauté n'en a pas, on retombe sur le symbole de sa catégorie (vgc-{slug}),
 * puis sur un symbole neutre. Le village ne casse jamais.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'src', 'data', 'communities.json');
const SCAFFOLD = path.join(ROOT, 'src', 'components', 'illustration-village.html');
const OUT_SVG = path.join(ROOT, 'src', 'components', 'village-maisons.html');
const OUT_LIST = path.join(ROOT, 'src', 'components', 'village-liste.html');

/* ------------------------------------------------------------------ *
 * Géométrie du village
 * ------------------------------------------------------------------ */

// Les maisons se répartissent en deux bandes.
//
// Un anneau régulier autour de la place a été essayé d'abord : il empile les
// maisons sur les côtés, où l'arc se referme, et trois noms sur douze
// devenaient illisibles. D'où ces deux bandes, qui gardent le village lisible
// et laissent compter les maisons d'un coup d'œil.
//
// Bande du fond : huit maisons en arc léger derrière la place.
// Premier plan : quatre maisons dans les angles bas, plus grandes parce que
// plus proches. Ce sont les quatre communautés les plus nombreuses : la
// profondeur porte alors l'écart d'effectifs (12 à 124 membres) sans en faire
// un classement affiché.
const BANDE_FOND = { x0: 92, x1: 1108, y: 302, arc: 18, decalage: 24, echelle: 0.78 };
const PREMIER_PLAN = [
  { x: 118, y: 600 }, { x: 268, y: 562 },
  { x: 920, y: 562 }, { x: 1070, y: 600 }
];
const ECHELLE_PREMIER_PLAN = 0.98;

// Maison de référence, avant mise à l'échelle.
const H = { w: 108, body: 76, roof: 34, bay: { w: 84, h: 52 } };

// Le nombre de membres n'ajoute qu'une variation discrète par-dessus l'échelle
// de la bande. Appliquer le rapport réel (12 à 124) transformerait le village
// en classement, ce qu'on ne veut pas.
const MEMBRES = { min: 0.94, max: 1.07 };

// Forme de toit par catégorie : c'est le premier signal de variété, et il porte
// une information (deux communautés de la même catégorie ont le même toit).
const ROOFS = {
  'Formation': 'deux-pentes',
  'Recherche': 'croupe',
  'Éducation': 'lucarne',
  'Professionnel': 'monopente',
  'Politique': 'terrasse',
  'Culture': 'arrondi',
  'Institutionnel': 'mansarde'
};

/* ------------------------------------------------------------------ *
 * Utilitaires
 * ------------------------------------------------------------------ */

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const round = n => Math.round(n * 100) / 100;

// Coupe un nom long en lignes, sans casser les mots : les noms officiels des
// communautés vont jusqu'à 64 caractères et ne tiennent pas sur une plaque.
function couper(texte, maxi) {
  const mots = String(texte).split(' ');
  const lignes = [];
  let courante = '';
  for (const mot of mots) {
    if (!courante) { courante = mot; continue; }
    if ((courante + ' ' + mot).length <= maxi) courante += ' ' + mot;
    else { lignes.push(courante); courante = mot; }
  }
  if (courante) lignes.push(courante);
  return lignes.slice(0, 3);
}

// Bruit déterministe : même identifiant, même décalage, à tous les builds.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const noise = (seed, salt) => (hash(seed + '|' + salt) % 1000) / 1000 - 0.5;

function darken(hex, amount) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map(v => Math.max(0, Math.round(v * (1 - amount))));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}

const slug = s => String(s).toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Quels <symbol> existent réellement dans le décor dessiné à la main ?
// C'est ce relevé qui permet les replis sans une ligne de JavaScript côté page :
// scène dédiée, sinon emblème de catégorie, sinon maison neutre.
const symboles = (() => {
  if (!fs.existsSync(SCAFFOLD)) return new Set();
  const src = fs.readFileSync(SCAFFOLD, 'utf8');
  const ids = new Set();
  const re = /<symbol[^>]*\sid="([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) ids.add(m[1]);
  return ids;
})();

function vignette(c) {
  const dedie = `vg-${c.id}`;
  const categorie = `vgc-${slug(c.category)}`;
  if (symboles.has(dedie)) return dedie;
  if (symboles.has(categorie)) return categorie;
  return 'vg-neutre';
}

/* ------------------------------------------------------------------ *
 * Toits
 * ------------------------------------------------------------------ */

function roofPath(kind, w, roof) {
  const o = w / 2 + 7;            // débord de toiture
  const r = roof;
  switch (kind) {
    case 'croupe':
      return `M${-o},0 L${-o * 0.42},${-r} L${o * 0.42},${-r} L${o},0 Z`;
    case 'monopente':
      return `M${-o},0 L${o},${-r} L${o},0 Z`;
    case 'terrasse':
      return `M${-o},0 L${-o},${-r * 0.5} L${o},${-r * 0.5} L${o},0 Z`;
    case 'arrondi':
      return `M${-o},0 Q0,${-r * 1.5} ${o},0 Z`;
    case 'mansarde':
      return `M${-o},0 L${-o * 0.74},${-r * 0.58} L${-o * 0.34},${-r} L${o * 0.34},${-r} L${o * 0.74},${-r * 0.58} L${o},0 Z`;
    case 'lucarne':
    case 'deux-pentes':
    default:
      return `M${-o},0 L0,${-r} L${o},0 Z`;
  }
}

/* ------------------------------------------------------------------ *
 * Une maison
 * ------------------------------------------------------------------ */

function house(c, pos) {
  const { x, y, s } = pos;
  const dort = c.statut === 'sommeil';
  const roofKind = ROOFS[c.category] || 'deux-pentes';

  const mur = c.categoryBg || '#f5ede0';
  const toit = c.categoryColor || '#9c3f00';
  const toitOmbre = darken(toit, 0.25);
  const bois = '#b09570';

  const w = H.w, b = H.body, r = H.roof;
  const bay = H.bay;
  const bayX = -bay.w / 2, bayY = -b + 6;

  const vg = vignette(c);

  const hautTotal = (b + r) * s;
  const plaqueY = pos.plaqueY !== undefined ? pos.plaqueY : -hautTotal - 16;
  const lignes = couper(c.name, 30);
  const plaqueW = Math.min(310, Math.max(170,
    Math.max(...lignes.map(l => l.length)) * 6.5 + 30,
    (`${c.category} · ${c.members} membres · ${c.resources} communs`).length * 5.5 + 30));
  const plaqueH = 20 + lignes.length * 15;
  const tirage = -plaqueY - hautTotal;   // du bas de la plaque au faîte du toit

  // Les maisons des bords sortiraient du cadre avec leur plaque : on la décale,
  // et la flèche reste pointée sur la maison.
  const marge = 12;
  let plaqueDX = 0;
  if (x - plaqueW / 2 < marge) plaqueDX = marge - (x - plaqueW / 2);
  else if (x + plaqueW / 2 > 1200 - marge) plaqueDX = (1200 - marge) - (x + plaqueW / 2);

  const aria = `${c.name}. Catégorie ${c.category}, ${c.members} membres${dort ? ', communauté en sommeil' : ''}. Ouvrir la page de la communauté.`;

  return `
  <a class="vl-cible vl-maison${dort ? ' vl-dort' : ''}" href="communaute-detail.html?c=${esc(c.id)}" tabindex="0" role="link" aria-label="${esc(aria)}">
    <title>${esc(c.name)} — ${esc(c.category)}, ${c.members} membres${dort ? ' — en sommeil' : ''}</title>
    <g transform="translate(${round(x)},${round(y)})">
      <ellipse cx="0" cy="3" rx="${round(w * s * 0.58)}" ry="${round(7 * s)}" fill="#1a1512" opacity="${dort ? 0.05 : 0.09}"/>
      <g class="vl-lift">
        <g transform="scale(${round(s)})">
          <!-- corps -->
          <rect x="${-w / 2}" y="${-b}" width="${w}" height="${b}" fill="${mur}" stroke="${bois}" stroke-width="1.6"/>
          <!-- baie : on voit ce qui se passe à l'intérieur -->
          <rect x="${bayX}" y="${bayY}" width="${bay.w}" height="${bay.h}" fill="#fffdf9" stroke="${bois}" stroke-width="1.2"/>
          ${dort ? '' : `<use href="#${vg}" x="${bayX}" y="${bayY}" width="${bay.w}" height="${bay.h}"/>`}
          ${dort ? volets(bayX, bayY, bay, bois, toitOmbre) : ''}
          <!-- seuil et porte -->
          <rect x="${-w / 2}" y="-10" width="${w}" height="10" fill="${darken(mur, 0.12)}" stroke="${bois}" stroke-width="1"/>
          <rect x="-9" y="-22" width="18" height="22" rx="1.5" fill="${toitOmbre}"/>
          <circle cx="4.5" cy="-11" r="1.3" fill="#fdfbf9" opacity="0.85"/>
          <!-- toit -->
          <g transform="translate(0,${-b})">
            <path d="${roofPath(roofKind, w, r)}" fill="${toit}" stroke="${toitOmbre}" stroke-width="1.6" stroke-linejoin="round"/>
            <path d="${roofPath(roofKind, w, r)}" fill="url(#vlToitLumiere)" opacity="0.28"/>
            ${roofKind === 'lucarne' ? `<g><path d="M-11,-8 L0,-20 L11,-8 Z" fill="${toit}" stroke="${toitOmbre}" stroke-width="1.2"/><rect x="-6" y="-9" width="12" height="9" fill="#c5e8f7" opacity="0.75" stroke="${toitOmbre}" stroke-width="0.8"/></g>` : ''}
          </g>
          <!-- cheminée : elle fume tant que la communauté est active -->
          <g transform="translate(${w * 0.28},${-b - r * 0.42})">
            <rect x="-5" y="-16" width="10" height="22" fill="${toitOmbre}"/>
            <rect x="-6.5" y="-18" width="13" height="4" rx="1" fill="${darken(toit, 0.4)}"/>
            ${dort ? '' : `<g class="vl-fumee" fill="#8c7166" opacity="0.32"><circle cx="0" cy="-24" r="3.4"/><circle cx="3.4" cy="-32" r="4.2"/><circle cx="-1" cy="-41" r="3.4"/></g>`}
          </g>
        </g>
        <text class="vl-nom" x="0" y="19" text-anchor="middle">${esc(c.shortName || c.name)}</text>
        ${dort ? '<text class="vl-dort-tag" x="0" y="31" text-anchor="middle">en sommeil</text>' : ''}
        <g class="vl-plaque" transform="translate(${round(plaqueDX)},${round(plaqueY)})">
          ${tirage > 14 ? `<line x1="${round(-plaqueDX)}" y1="8" x2="${round(-plaqueDX)}" y2="${round(tirage)}" stroke="${toit}" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"/>` : ''}
          <rect x="${round(-plaqueW / 2)}" y="${-plaqueH}" width="${round(plaqueW)}" height="${plaqueH + 4}" rx="8" fill="#fdfbf9" stroke="${toit}" stroke-width="1.4"/>
          <path d="M${round(-plaqueDX - 6)},4 L${round(-plaqueDX)},10 L${round(-plaqueDX + 6)},4 Z" fill="#fdfbf9" stroke="${toit}" stroke-width="1.4" stroke-linejoin="round"/>
          <rect x="${round(-plaqueW / 2 + 1)}" y="1" width="${round(plaqueW - 2)}" height="4" fill="#fdfbf9"/>
${lignes.map((l, i) => `          <text class="vl-plaque-titre" x="0" y="${-plaqueH + 14 + i * 14}" text-anchor="middle">${esc(l)}</text>`).join('\n')}
          <text class="vl-plaque-sous" x="0" y="-6" text-anchor="middle">${esc(c.category)} · ${c.members} membres · ${c.resources} communs</text>
        </g>
        <rect class="vl-focus" x="${round(-w * s / 2 - 10)}" y="${round(-hautTotal - 12)}" width="${round(w * s + 20)}" height="${round(hautTotal + 38)}" rx="10"/>
      </g>
    </g>
  </a>`;
}

// Volets fermés : l'état « en sommeil » doit se lire sans lire le texte.
function volets(bx, by, bay, bois, sombre) {
  const half = bay.w / 2;
  return `<g opacity="0.92">
            <rect x="${bx}" y="${by}" width="${half}" height="${bay.h}" fill="${bois}" stroke="${sombre}" stroke-width="1.2" opacity="0.75"/>
            <rect x="${bx + half}" y="${by}" width="${half}" height="${bay.h}" fill="${bois}" stroke="${sombre}" stroke-width="1.2" opacity="0.62"/>
            <g stroke="${sombre}" stroke-width="0.9" opacity="0.5">
              <line x1="${bx + 4}" y1="${by + 12}" x2="${bx + half - 4}" y2="${by + 12}"/>
              <line x1="${bx + 4}" y1="${by + 26}" x2="${bx + half - 4}" y2="${by + 26}"/>
              <line x1="${bx + 4}" y1="${by + 40}" x2="${bx + half - 4}" y2="${by + 40}"/>
              <line x1="${bx + half + 4}" y1="${by + 12}" x2="${bx + bay.w - 4}" y2="${by + 12}"/>
              <line x1="${bx + half + 4}" y1="${by + 26}" x2="${bx + bay.w - 4}" y2="${by + 26}"/>
              <line x1="${bx + half + 4}" y1="${by + 40}" x2="${bx + bay.w - 4}" y2="${by + 40}"/>
            </g>
            <line x1="${bx + half}" y1="${by}" x2="${bx + half}" y2="${by + bay.h}" stroke="${sombre}" stroke-width="1.4"/>
          </g>`;
}

/* ------------------------------------------------------------------ *
 * Placement
 * ------------------------------------------------------------------ */

function layout(communities) {
  const racines = communities.map(c => Math.sqrt(Math.max(1, c.members || 1)));
  const rMin = Math.min(...racines), rMax = Math.max(...racines);
  const facteurMembres = c => {
    const t = (Math.sqrt(Math.max(1, c.members || 1)) - rMin) / (rMax - rMin || 1);
    return MEMBRES.min + t * (MEMBRES.max - MEMBRES.min);
  };

  // Les plus nombreuses passent au premier plan, dans l'ordre du fichier.
  const parTaille = [...communities].sort((a, b) => (b.members || 0) - (a.members || 0));
  const devant = new Set(parTaille.slice(0, PREMIER_PLAN.length).map(c => c.id));

  const avant = communities.filter(c => devant.has(c.id));
  const fond = communities.filter(c => !devant.has(c.id));

  const places = [];

  fond.forEach((c, i) => {
    const t = fond.length === 1 ? 0.5 : i / (fond.length - 1);
    const x = BANDE_FOND.x0 + (BANDE_FOND.x1 - BANDE_FOND.x0) * t + noise(c.id, 'x') * 16;
    const y = BANDE_FOND.y - BANDE_FOND.arc * Math.sin(Math.PI * t)
      + (i % 2 ? BANDE_FOND.decalage : 0) + noise(c.id, 'y') * 8;
    places.push({ c, x, y, bande: 'fond', s: BANDE_FOND.echelle * facteurMembres(c) });
  });

  avant.forEach((c, i) => {
    const p = PREMIER_PLAN[i % PREMIER_PLAN.length];
    places.push({
      c, x: p.x + noise(c.id, 'x') * 10, y: p.y + noise(c.id, 'y') * 8,
      bande: 'avant', s: ECHELLE_PREMIER_PLAN * facteurMembres(c)
    });
  });

  // La plaque de survol se place au-dessus du toit le plus haut de sa bande :
  // ainsi elle ne passe jamais derrière la maison voisine, que l'ordre de
  // peinture placerait sinon par-dessus.
  ['fond', 'avant'].forEach(bande => {
    const groupe = places.filter(p => p.bande === bande);
    if (!groupe.length) return;
    const plafond = Math.min(...groupe.map(p => p.y - (H.body + H.roof) * p.s)) - 18;
    groupe.forEach(p => { p.plaqueY = plafond - p.y; });
  });

  // Ordre de peinture : du fond vers l'avant, sinon les maisons proches
  // passeraient derrière celles du fond.
  return places.sort((a, b) => a.y - b.y);
}

/* ------------------------------------------------------------------ *
 * Liste texte
 * ------------------------------------------------------------------ */

function liste(communities) {
  const tri = [...communities].sort((a, b) =>
    (a.shortName || a.name).localeCompare(b.shortName || b.name, 'fr'));

  const items = tri.map(c => {
    const dort = c.statut === 'sommeil';
    return `      <li class="vl-item${dort ? ' vl-item-dort' : ''}">
        <a class="vl-item-lien" href="communaute-detail.html?c=${esc(c.id)}">
          <span class="vl-item-pastille" style="background: ${esc(c.categoryBg)}; border-color: ${esc(c.categoryColor)};"><i class="fas ${esc(c.icon)}" aria-hidden="true" style="color: ${esc(c.categoryColor)};"></i></span>
          <span class="vl-item-corps">
            <span class="vl-item-titre">${esc(c.name)}${dort ? ' <span class="vl-item-etat">en sommeil</span>' : ''}</span>
            <span class="vl-item-desc">${esc(c.shortDescription)}</span>
            <span class="vl-item-meta">${esc(c.category)} · ${c.members} membres · ${c.resources} communs</span>
          </span>
        </a>
      </li>`;
  }).join('\n');

  return `<!-- FICHIER GÉNÉRÉ par scripts/generate-village.js — ne pas éditer à la main -->
<ul class="vl-liste">
${items}
</ul>`;
}

/* ------------------------------------------------------------------ *
 * Écriture
 * ------------------------------------------------------------------ */

function generate() {
  const communities = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const placed = layout(communities);

  const svg = `<!-- FICHIER GÉNÉRÉ par scripts/generate-village.js — ne pas éditer à la main -->
<g id="village-maisons">${placed.map(p => house(p.c, p)).join('')}
</g>`;

  fs.writeFileSync(OUT_SVG, svg + '\n', 'utf8');
  fs.writeFileSync(OUT_LIST, liste(communities) + '\n', 'utf8');

  const dorment = communities.filter(c => c.statut === 'sommeil').length;
  console.log(`  ✓ village: ${communities.length} maisons générées${dorment ? ` (${dorment} en sommeil)` : ''}`);
}

generate();
