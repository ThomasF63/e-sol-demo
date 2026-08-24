// scripts/generate-images.js
// Generates the e-Sol image pack via Gemini 2.5 Flash Image.
//
// Usage:
//   node scripts/generate-images.js sample              → 3 style samples (hero/section/texture)
//   node scripts/generate-images.js pack                → 15 images of the full pack
//   node scripts/generate-images.js restyle-communities → re-generate the 12 community images
//                                                          with the harmonized STYLE prompt
//   node scripts/generate-images.js all                 → samples + pack + community restyle
//
// Outputs PNG to src/img/pack/{samples,heroes,sections,textures}/ and src/img/communities/

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) process.env[m[1]] = m[2];
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY missing in .env'); process.exit(1); }

// Gemini 2.5 Flash Image - square 1:1 only (used for legacy/communities)
const GEMINI_MODEL = 'gemini-2.5-flash-image';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// Imagen 4 fast - supports aspectRatio (1:1, 16:9, 9:16, 4:3, 3:4) - used for hero/section/texture
const IMAGEN_MODEL = 'imagen-4.0-fast-generate-001';
const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${API_KEY}`;

// Nano Banana Pro = Gemini 3 Pro Image. Identifiant et endpoint relevés dans la
// documentation officielle (ai.google.dev/gemini-api/docs/image-generation et
// /docs/models/gemini-3-pro-image, consultées le 04/08/2026) : l'API Interactions,
// distincte de :generateContent, avec la clé en en-tête et non dans l'URL.
// Rapports d'aspect : 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9.
// Tailles : 1K, 2K, 4K. C'est le modèle le plus cher du lot : à réserver aux
// compositions complexes, une image à la fois.
const NBPRO_MODEL = 'gemini-3-pro-image';
const NBPRO_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

// ============================================================
// UNIFIED STYLE - "vintage naturalist's notebook" aesthetic.
// Inspired by the three reference images the user validated:
// zones-humides (misty wetland with herons), zan (aerial farmland
// patchwork), iprsol (forest cross-section with roots).
// Injected at the end of every prompt to lock visual cohesion.
// ============================================================
const STYLE = [
  // Medium
  'A vintage naturalist field-notebook illustration: very loose watercolor washes over delicate ink linework on visibly textured cream/ivory paper.',
  'The paper shows through everywhere - it is the dominant tone of the image.',
  'Imperfect gestural brushwork, soft hand-drawn line, subtle paper grain, no digital crispness.',

  // Palette discipline - STRICT 4 colors max
  'STRICT palette: pale ivory/cream paper background, dusty ochre or pale terracotta, sage / olive green, warm soft brown for ink and shadows.',
  'No bright reds, no saturated oranges, no glowing highlights, no metallic shines, no cool blues, no greens that look fluorescent, no purples.',
  'Overall feel: hazy, atmospheric, low contrast, low saturation, washed-out - like an old botanical plate left in the sun.',

  // Composition discipline
  'Subject at mid-distance - never close-up. The viewer is gently observing from afar.',
  'Generous empty paper visible on at least 30% of the canvas, especially the sky / upper portion.',
  'Loose, almost unfinished feel - outlines fade, washes bleed past the line, paper texture is part of the image.',

  // Hard prohibitions
  'No human faces, no close-up hands, no fingers in the foreground - keep all people as small distant silhouettes or omit them entirely.',
  'No text, no logos, no watermarks, no labels.',
  'Not photorealistic, not 3D-rendered, not CGI, not glossy digital art, not editorial vector illustration.',
  'Avoid any saturated, vivid, modern-graphic-design look. Aim for "1880s field guide" energy.',
].join(' ');

// ============================================================
// DECKS
// ============================================================
const SAMPLES = [
  {
    id: 'sample-hero-soil',
    category: 'heroes',
    aspectRatio: '16:9',
    // Reference: iprsol - but pushed wider and more atmospheric.
    prompt: 'A wide mid-distance view of a French rural landscape: a gentle hillside in the foreground sliced open to reveal a soil cross-section with tree roots, humus layers and a few pebbles; tall thin trees rising above the cut, fading into a hazy upper sky. The cut is offset to the right, leaving the upper-left area as soft empty cream paper for an overlay headline.'
  },
  {
    id: 'sample-section-citizen',
    category: 'sections',
    aspectRatio: '4:3',
    // Reference: zones-humides - distant silhouettes, no close hands.
    prompt: 'A mid-distance scene in a sunny meadow: two small silhouettes of citizen scientists kneeling far away, taking notes near a low wooden tripod, with a few stems of wild grass in the foreground. The horizon line is loose and watery, the sky is just cream paper. Plenty of empty space at the top.'
  },
  {
    id: 'sample-texture-mycelium',
    category: 'textures',
    aspectRatio: '16:9',
    // Reference: zones-humides - pale, hazy, low-saturation.
    prompt: 'An abstract pale botanical study: thin delicate ink lines suggesting a network of fine roots and mycelium spreading horizontally across cream paper, with a few barely-there dusty ochre and sage watercolor stains bleeding under the lines. No focal subject, very low contrast, almost faded - designed to sit behind paragraphs of text.'
  },
];

const PACK = [
  // Heroes - 16:9 wide banners for top of YesWiki pages
  { id: 'hero-soil-cross-section', category: 'heroes', aspectRatio: '16:9', prompt: 'A wide mid-distance view of a French rural landscape: a gentle hillside in the foreground sliced open to reveal a soil cross-section with tree roots, humus layers and a few pebbles; tall thin trees rising above the cut, fading into a hazy upper sky. The cut is offset to the right, leaving the upper-left area as soft empty cream paper for an overlay headline.' },
  { id: 'hero-french-farmland',    category: 'heroes', aspectRatio: '16:9', prompt: 'A panoramic aerial mid-distance view of French countryside in late autumn: a soft patchwork of fields, hedgerows and a winding river drawn with delicate ink, a small distant village clustered to one side. The horizon dissolves into hazy cream paper. Wide horizontal composition.' },
  { id: 'hero-network-collaboration', category: 'heroes', aspectRatio: '16:9', prompt: 'An abstract painterly metaphor of a collaborative network: thin interlacing roots and stems drawn in ink spreading horizontally across cream paper, with a few small leaves at the junctions. No human figures, no faces, no glowing accents. Wide horizontal composition with generous empty paper space.' },
  // Section themes - 4:3 landscape, versatile inline or divider
  { id: 'theme-education',          category: 'sections', aspectRatio: '4:3', prompt: 'A naturalist field-notebook page showing a soil profile diagram with annotated layers, a small seedling sketched in the margin, faint pencil annotations. Top-down flat composition on textured cream paper, no people.' },
  { id: 'theme-cartography',        category: 'sections', aspectRatio: '4:3', prompt: 'A vintage soil map of mainland France drawn with hand-inked contour lines and soft watercolor wash zones in pale ochre and sage. A small compass rose in one corner. Paper texture dominates; no people, no modern UI elements.' },
  { id: 'theme-research-lab',       category: 'sections', aspectRatio: '4:3', prompt: 'A mid-distance still life of a research desk: a small microscope, three slim test tubes with soil layers, an open notebook with fine pencil sketches of fungal hyphae. Soft window light from the left, no people, generous empty paper around the objects.' },
  { id: 'theme-forum-dialogue',     category: 'sections', aspectRatio: '4:3', prompt: 'Abstract field-notebook study: a cluster of small leaves and root tendrils arranged as if a quiet conversation between organisms, drawn in fine ink with pale wash. No speech bubbles, no people, mostly empty cream paper.' },
  { id: 'theme-charter-governance', category: 'sections', aspectRatio: '4:3', prompt: 'A still life on textured paper: an open vintage book lying flat, a quill pen, a small acorn and a folded letter beside it. Soft sage and ochre wash, no people, ample empty paper.' },
  { id: 'theme-network-partners',   category: 'sections', aspectRatio: '4:3', prompt: 'Hand-drawn interlacing roots forming a soft circular network, with a few small leaves and seeds at the junctions. Pale watercolor wash on cream paper, no people, no text. Centered composition with empty paper around it.' },
  { id: 'theme-events-formation',   category: 'sections', aspectRatio: '4:3', prompt: 'A naturalist flat-lay of a workshop in progress: a few small illustrated cards arranged loosely on cream paper, a clay mug at the corner, a pencil. No hands, no people, no faces; the workshop is suggested by the objects alone.' },
  { id: 'theme-citizen-science',    category: 'sections', aspectRatio: '4:3', prompt: 'A mid-distance scene: two small distant silhouettes kneeling in a meadow taking notes near a wooden tripod, with wild grasses in the foreground and a hazy horizon. No faces, no close-up hands. Loose watercolor on cream paper.' },
  // Textures - 16:9 wide backgrounds for full-bleed use behind text
  { id: 'texture-mycelium',         category: 'textures', aspectRatio: '16:9', prompt: 'An abstract pale botanical study: thin delicate ink lines suggesting a wide horizontal network of fine roots and mycelium spreading across cream paper, with a few barely-there dusty ochre and sage watercolor stains. No focal subject, very low contrast, faded.' },
  { id: 'texture-soil-macro',       category: 'textures', aspectRatio: '16:9', prompt: 'A pale, faded top-down macro suggestion of garden soil: faint dots and specks in dusty ochre and soft brown spread evenly across cream paper, with a few wisps of root hair drawn in fine ink. Low contrast, no focal subject, designed to sit behind text.' },
  { id: 'texture-watercolor-earth', category: 'textures', aspectRatio: '16:9', prompt: 'An abstract horizontal watercolor wash on cream paper: very pale ochre, sage and soft brown bleeding gently into one another. Visible paper texture, no recognizable subject, low contrast, faded edges.' },
  { id: 'texture-pencil-roots',     category: 'textures', aspectRatio: '16:9', prompt: 'A wide horizontal pattern of pencil-sketched root systems spreading lightly across cream paper. Mostly empty paper with a few delicate lines crossing the canvas. Almost monochrome, very low contrast, repeatable feel.' },
];

// Communities - same list & prompts as before, but the unified STYLE is now appended.
const COMMUNITIES = [
  { id: 'fresque-sol',       category: 'communities', prompt: 'A flat-lay of colorful collaborative card game pieces about soil arranged on a wooden table, hands hovering with curiosity' },
  { id: 'iprsol',            category: 'communities', prompt: 'A cross-section of forest soil showing tree roots and mycelium reaching deep, sunlight filtering through pine canopy above' },
  { id: 'promosolseduc',     category: 'communities', prompt: 'A school garden classroom scene: a chalkboard with soil layer diagrams, seedlings in pots, books, and a globe on a wooden desk' },
  { id: 'promosolsterrain',  category: 'communities', prompt: 'A soil auger, field notebook and hand lens resting on freshly cored soil samples, in a sunny rural meadow' },
  { id: 'refersols',         category: 'communities', prompt: 'A vintage topographic soil map of France with contour lines, ink wash colors, magnifying glass on rolling terrain' },
  { id: 'secteur-prive',     category: 'communities', prompt: 'A clean laboratory benchtop with soil sample tubes, microscope, beakers and analytical instruments, soft daylight' },
  { id: 'srp-sols',          category: 'communities', prompt: 'Hands of citizen scientists scooping soil into a sample bag in a meadow, clipboards and field gear beside, painterly' },
  { id: 'zan',               category: 'communities', prompt: 'Aerial view of a French countryside showing the edge between farmland and growing town, patchwork fields and roads' },
  { id: 'sols-et-art',       category: 'communities', prompt: 'A land art installation: spirals and patterns made from different colored soils on the ground, viewed from above' },
  { id: 'afes-comm',         category: 'communities', prompt: 'A vintage radio megaphone and printing press elements over a soft soil-textured background, communication motifs' },
  { id: 'afes-admins',       category: 'communities', prompt: 'A wooden meeting table with open notebooks, a fountain pen, a botanical illustration of a soil profile, warm lamplight' },
  { id: 'zones-humides',     category: 'communities', prompt: 'A misty wetland with reeds, herons in the distance, water reflecting morning light, peaty soil at the edge' },
];

// ============================================================
// VILLAGE - phase 6C : l'image générée
// ============================================================
// La composition n'est pas inventée : elle décrit en langage naturel la
// disposition du SVG de la phase 6B (src/components/illustration-village.html),
// lue de haut en bas et de gauche à droite. Repères du SVG, en viewBox 1200×800 :
//   ligne d'horizon (collines)          y ≈ 300      → 37 % de la hauteur
//   bande de fond : 8 maisons           y ≈ 300-330  → arc léger sur toute la largeur
//   l'atelier (porte ouverte)           x = 400      → 33 % de la largeur
//   l'agora (kiosque rond à colonnes)   x = 600      → centre, y ≈ 474
//   la bibliothèque (grande fenêtre)    x = 792      → 66 % de la largeur
//   la place (ellipse pavée)            centre, y ≈ 500
//   le panneau d'affichage              x = 694, y ≈ 602
//   l'accueil et le registre            x = 474 et 586, y ≈ 640
//   4 maisons au premier plan           angles bas gauche et droit
//   le chemin traversant                tiers inférieur, d'un bord à l'autre
//   les jardins                         x = 812, bas
//   le sol en coupe                     y ≥ 718      → bandeau bas, 10 % de la hauteur
const VILLAGE_COMPOSITION = [
  'A wide view of a small rural village seen from a slight distance, laid out with a very deliberate composition.',
  'The upper third is empty hazy sky above a soft line of low hills at about 37% down the canvas.',
  'Just below the hills, a row of eight small houses spread evenly across the entire width in a gentle arc, each with a pitched roof and a smoking chimney.',
  'In the exact centre of the canvas, a round open pavilion with slender columns and a conical roof stands on a wide circular paved square.',
  'To the left of the square, at about one third of the width, a workshop building with a large open doorway and tools hanging on its wall.',
  'To the right of the square, at about two thirds of the width, a library building with a tall window showing shelves inside.',
  'In the lower right of the square, a notice board mounted on two wooden posts.',
  'At the bottom centre, a small open welcome kiosk with a counter, and beside it a lectern.',
  'Four larger houses stand closer to the viewer, two in the bottom-left corner and two in the bottom-right corner, framing the square.',
  'A pale footpath crosses the whole width in the lower third, entering from the left edge and leaving by the right edge.',
  'A small vegetable garden with young plants sits beside the path on the right.',
  'The bottom tenth of the image is a cross-section of the soil beneath the village: visible horizons, roots hanging down, a few pebbles.',
  'Nothing is written anywhere in the image.',
].join(' ');

// Une brique isolée, pour tester l'assemblage manuel : chaque élément est généré
// seul sur du papier vide, et c'est nous qui composons ensuite. C'est le seul
// moyen connu d'obtenir une disposition exacte, puisque le modèle ne respecte
// pas les consignes de placement.
const tuile = sujet =>
  `${sujet} Isolated single object centred on an otherwise completely empty cream paper background, `
  + 'with generous empty margins on all four sides and nothing else in the frame. '
  + 'No ground line, no horizon, no scenery, no other buildings, no border, no frame, no shadow cast outside the object.';

const VILLAGE = [
  {
    id: 'village-nbpro-3x2',
    category: 'village',
    moteur: 'nbpro',
    aspectRatio: '3:2',
    imageSize: '2K',
    prompt: VILLAGE_COMPOSITION
  },
  {
    // Imagen 4 fast n'accepte que 1:1, 3:4, 4:3, 9:16 et 16:9 : pas de 3:2.
    // On prend 4:3, le plus proche du format du SVG (3:2), et on tient compte
    // de cet écart de cadrage en comparant les deux moteurs.
    id: 'village-imagen-4x3',
    category: 'village',
    moteur: 'imagen',
    aspectRatio: '4:3',
    prompt: VILLAGE_COMPOSITION
  },
  {
    id: 'tuile-maison-fresque',
    category: 'village',
    moteur: 'nbpro',
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: tuile('A small village house with a pitched roof and a smoking chimney, its front wall open like a doll house to reveal, inside, a table where two seated figures play a card game.')
  },
];

// ============================================================
// CORE
// ============================================================

// Gemini 2.5 Flash Image - square only (1024x1024 PNG)
async function generateGemini(promptText) {
  const fullPrompt = `${promptText}\n\nStyle: ${STYLE}`;
  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] }
  };
  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${JSON.stringify(data).slice(0, 400)}`);
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    if (p.inlineData?.data) {
      return { mime: p.inlineData.mimeType || 'image/png', buf: Buffer.from(p.inlineData.data, 'base64') };
    }
  }
  throw new Error('No image in Gemini response: ' + JSON.stringify(data).slice(0, 400));
}

// Imagen 4 fast - supports aspectRatio (1:1, 16:9, 9:16, 4:3, 3:4)
async function generateImagen(promptText, aspectRatio) {
  const fullPrompt = `${promptText}\n\nStyle: ${STYLE}`;
  const body = {
    instances: [{ prompt: fullPrompt }],
    parameters: { sampleCount: 1, aspectRatio: aspectRatio || '1:1' }
  };
  const res = await fetch(IMAGEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Imagen HTTP ${res.status}: ${JSON.stringify(data).slice(0, 400)}`);
  const pred = data?.predictions?.[0];
  if (pred?.bytesBase64Encoded) {
    return { mime: pred.mimeType || 'image/png', buf: Buffer.from(pred.bytesBase64Encoded, 'base64') };
  }
  throw new Error('No image in Imagen response: ' + JSON.stringify(data).slice(0, 400));
}

// Nano Banana Pro (gemini-3-pro-image) - API Interactions.
// La clé passe en en-tête : elle n'apparaît donc jamais dans une URL, et donc
// jamais dans un message d'erreur ou un log.
async function generateNanoBananaPro(promptText, aspectRatio, imageSize) {
  const fullPrompt = `${promptText}\n\nStyle: ${STYLE}`;
  const body = {
    model: NBPRO_MODEL,
    input: [{ type: 'text', text: fullPrompt }],
    response_format: {
      type: 'image',
      mime_type: 'image/png',
      aspect_ratio: aspectRatio || '1:1',
      image_size: imageSize || '2K'
    }
  };
  const res = await fetch(NBPRO_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`NanoBananaPro HTTP ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);

  // La forme exacte de la réponse a bougé entre versions de l'API : plutôt que
  // de coder un chemin en dur, on cherche la première charge base64 assez
  // grosse pour être une image. Un appel raté est un appel payé pour rien.
  const trouve = (noeud) => {
    if (!noeud || typeof noeud !== 'object') return null;
    if (typeof noeud.data === 'string' && noeud.data.length > 2000) {
      return { mime: noeud.mime_type || noeud.mimeType || 'image/png', buf: Buffer.from(noeud.data, 'base64') };
    }
    for (const v of Array.isArray(noeud) ? noeud : Object.values(noeud)) {
      const r = trouve(v);
      if (r) return r;
    }
    return null;
  };
  const image = trouve(data);
  if (image) return image;
  throw new Error('Aucune image dans la réponse Nano Banana Pro : ' + JSON.stringify(data).slice(0, 500));
}

// Route : moteur explicite s'il est donné, sinon 1:1 → Gemini, autre → Imagen
async function generateImage(item) {
  const ar = item.aspectRatio || '1:1';
  if (item.moteur === 'nbpro') return generateNanoBananaPro(item.prompt, ar, item.imageSize);
  if (item.moteur === 'imagen') return generateImagen(item.prompt, ar);
  if (item.moteur === 'gemini') return generateGemini(item.prompt);
  if (ar === '1:1') return generateGemini(item.prompt);
  return generateImagen(item.prompt, ar);
}

function outDirFor(item) {
  if (item.category === 'communities') return path.join(__dirname, '..', 'src', 'img', 'communities');
  if (item.category === 'village')     return path.join(__dirname, '..', 'src', 'img', 'village');
  if (item.category === 'samples')     return path.join(__dirname, '..', 'src', 'img', 'pack', 'samples');
  return path.join(__dirname, '..', 'src', 'img', 'pack', item.category);
}

async function saveOne(item) {
  const dir = outDirFor(item);
  fs.mkdirSync(dir, { recursive: true });
  try {
    const t0 = Date.now();
    const { mime, buf } = await generateImage(item);
    const ext = mime.includes('jpeg') ? 'jpg' : 'png';
    const out = path.join(dir, `${item.id}.${ext}`);
    fs.writeFileSync(out, buf);
    const ar = item.aspectRatio || '1:1';
    console.log(`  ✓ ${item.category}/${item.id}.${ext}  [${ar}]  (${Math.round(buf.length / 1024)} KB, ${Date.now() - t0} ms)`);
    return { ok: true };
  } catch (e) {
    console.log(`  ✗ ${item.category}/${item.id}: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

async function runBatch(items, label) {
  console.log(`\n→ ${label} (${items.length})`);
  const results = await Promise.all(items.map(saveOne));
  const ok = results.filter(r => r.ok).length;
  console.log(`  ${ok}/${items.length} OK`);
  return { ok, total: items.length };
}

(async () => {
  const mode = process.argv[2];
  if (!mode || !['sample', 'pack', 'restyle-communities', 'all', 'village'].includes(mode)) {
    console.error('Usage: node scripts/generate-images.js <sample|pack|restyle-communities|all|village [id...]>');
    process.exit(1);
  }

  // Le village se lance image par image : chacune est payante, et Nano Banana Pro
  // est le modèle le plus cher. Sans identifiant, on liste au lieu de générer.
  if (mode === 'village') {
    const demandes = process.argv.slice(3);
    if (!demandes.length) {
      console.log('Deck village - préciser un ou plusieurs identifiants :');
      for (const v of VILLAGE) console.log(`  ${v.id}  [${v.moteur} ${v.aspectRatio}${v.imageSize ? ' ' + v.imageSize : ''}]`);
      process.exit(0);
    }
    const items = VILLAGE.filter(v => demandes.includes(v.id));
    const inconnus = demandes.filter(d => !VILLAGE.some(v => v.id === d));
    if (inconnus.length) { console.error('Identifiants inconnus :', inconnus.join(', ')); process.exit(1); }
    await runBatch(items, 'Village (phase 6C)');
    return;
  }

  const summary = [];
  if (mode === 'sample' || mode === 'all') {
    // Re-label samples' category so they land in pack/samples/
    const samples = SAMPLES.map(s => ({ ...s, category: 'samples' }));
    summary.push(['samples', await runBatch(samples, 'Style samples')]);
  }
  if (mode === 'pack' || mode === 'all') {
    summary.push(['pack', await runBatch(PACK, 'Full image pack')]);
  }
  if (mode === 'restyle-communities' || mode === 'all') {
    summary.push(['communities', await runBatch(COMMUNITIES, 'Community restyle')]);
  }

  console.log('\n=== Summary ===');
  for (const [name, r] of summary) console.log(`  ${name}: ${r.ok}/${r.total}`);
})();
