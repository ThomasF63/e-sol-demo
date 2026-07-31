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

// Gemini 2.5 Flash Image — square 1:1 only (used for legacy/communities)
const GEMINI_MODEL = 'gemini-2.5-flash-image';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// Imagen 4 fast — supports aspectRatio (1:1, 16:9, 9:16, 4:3, 3:4) — used for hero/section/texture
const IMAGEN_MODEL = 'imagen-4.0-fast-generate-001';
const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${API_KEY}`;

// ============================================================
// UNIFIED STYLE — "vintage naturalist's notebook" aesthetic.
// Inspired by the three reference images the user validated:
// zones-humides (misty wetland with herons), zan (aerial farmland
// patchwork), iprsol (forest cross-section with roots).
// Injected at the end of every prompt to lock visual cohesion.
// ============================================================
const STYLE = [
  // Medium
  'A vintage naturalist field-notebook illustration: very loose watercolor washes over delicate ink linework on visibly textured cream/ivory paper.',
  'The paper shows through everywhere — it is the dominant tone of the image.',
  'Imperfect gestural brushwork, soft hand-drawn line, subtle paper grain, no digital crispness.',

  // Palette discipline — STRICT 4 colors max
  'STRICT palette: pale ivory/cream paper background, dusty ochre or pale terracotta, sage / olive green, warm soft brown for ink and shadows.',
  'No bright reds, no saturated oranges, no glowing highlights, no metallic shines, no cool blues, no greens that look fluorescent, no purples.',
  'Overall feel: hazy, atmospheric, low contrast, low saturation, washed-out — like an old botanical plate left in the sun.',

  // Composition discipline
  'Subject at mid-distance — never close-up. The viewer is gently observing from afar.',
  'Generous empty paper visible on at least 30% of the canvas, especially the sky / upper portion.',
  'Loose, almost unfinished feel — outlines fade, washes bleed past the line, paper texture is part of the image.',

  // Hard prohibitions
  'No human faces, no close-up hands, no fingers in the foreground — keep all people as small distant silhouettes or omit them entirely.',
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
    // Reference: iprsol — but pushed wider and more atmospheric.
    prompt: 'A wide mid-distance view of a French rural landscape: a gentle hillside in the foreground sliced open to reveal a soil cross-section with tree roots, humus layers and a few pebbles; tall thin trees rising above the cut, fading into a hazy upper sky. The cut is offset to the right, leaving the upper-left area as soft empty cream paper for an overlay headline.'
  },
  {
    id: 'sample-section-citizen',
    category: 'sections',
    aspectRatio: '4:3',
    // Reference: zones-humides — distant silhouettes, no close hands.
    prompt: 'A mid-distance scene in a sunny meadow: two small silhouettes of citizen scientists kneeling far away, taking notes near a low wooden tripod, with a few stems of wild grass in the foreground. The horizon line is loose and watery, the sky is just cream paper. Plenty of empty space at the top.'
  },
  {
    id: 'sample-texture-mycelium',
    category: 'textures',
    aspectRatio: '16:9',
    // Reference: zones-humides — pale, hazy, low-saturation.
    prompt: 'An abstract pale botanical study: thin delicate ink lines suggesting a network of fine roots and mycelium spreading horizontally across cream paper, with a few barely-there dusty ochre and sage watercolor stains bleeding under the lines. No focal subject, very low contrast, almost faded — designed to sit behind paragraphs of text.'
  },
];

const PACK = [
  // Heroes — 16:9 wide banners for top of YesWiki pages
  { id: 'hero-soil-cross-section', category: 'heroes', aspectRatio: '16:9', prompt: 'A wide mid-distance view of a French rural landscape: a gentle hillside in the foreground sliced open to reveal a soil cross-section with tree roots, humus layers and a few pebbles; tall thin trees rising above the cut, fading into a hazy upper sky. The cut is offset to the right, leaving the upper-left area as soft empty cream paper for an overlay headline.' },
  { id: 'hero-french-farmland',    category: 'heroes', aspectRatio: '16:9', prompt: 'A panoramic aerial mid-distance view of French countryside in late autumn: a soft patchwork of fields, hedgerows and a winding river drawn with delicate ink, a small distant village clustered to one side. The horizon dissolves into hazy cream paper. Wide horizontal composition.' },
  { id: 'hero-network-collaboration', category: 'heroes', aspectRatio: '16:9', prompt: 'An abstract painterly metaphor of a collaborative network: thin interlacing roots and stems drawn in ink spreading horizontally across cream paper, with a few small leaves at the junctions. No human figures, no faces, no glowing accents. Wide horizontal composition with generous empty paper space.' },
  // Section themes — 4:3 landscape, versatile inline or divider
  { id: 'theme-education',          category: 'sections', aspectRatio: '4:3', prompt: 'A naturalist field-notebook page showing a soil profile diagram with annotated layers, a small seedling sketched in the margin, faint pencil annotations. Top-down flat composition on textured cream paper, no people.' },
  { id: 'theme-cartography',        category: 'sections', aspectRatio: '4:3', prompt: 'A vintage soil map of mainland France drawn with hand-inked contour lines and soft watercolor wash zones in pale ochre and sage. A small compass rose in one corner. Paper texture dominates; no people, no modern UI elements.' },
  { id: 'theme-research-lab',       category: 'sections', aspectRatio: '4:3', prompt: 'A mid-distance still life of a research desk: a small microscope, three slim test tubes with soil layers, an open notebook with fine pencil sketches of fungal hyphae. Soft window light from the left, no people, generous empty paper around the objects.' },
  { id: 'theme-forum-dialogue',     category: 'sections', aspectRatio: '4:3', prompt: 'Abstract field-notebook study: a cluster of small leaves and root tendrils arranged as if a quiet conversation between organisms, drawn in fine ink with pale wash. No speech bubbles, no people, mostly empty cream paper.' },
  { id: 'theme-charter-governance', category: 'sections', aspectRatio: '4:3', prompt: 'A still life on textured paper: an open vintage book lying flat, a quill pen, a small acorn and a folded letter beside it. Soft sage and ochre wash, no people, ample empty paper.' },
  { id: 'theme-network-partners',   category: 'sections', aspectRatio: '4:3', prompt: 'Hand-drawn interlacing roots forming a soft circular network, with a few small leaves and seeds at the junctions. Pale watercolor wash on cream paper, no people, no text. Centered composition with empty paper around it.' },
  { id: 'theme-events-formation',   category: 'sections', aspectRatio: '4:3', prompt: 'A naturalist flat-lay of a workshop in progress: a few small illustrated cards arranged loosely on cream paper, a clay mug at the corner, a pencil. No hands, no people, no faces; the workshop is suggested by the objects alone.' },
  { id: 'theme-citizen-science',    category: 'sections', aspectRatio: '4:3', prompt: 'A mid-distance scene: two small distant silhouettes kneeling in a meadow taking notes near a wooden tripod, with wild grasses in the foreground and a hazy horizon. No faces, no close-up hands. Loose watercolor on cream paper.' },
  // Textures — 16:9 wide backgrounds for full-bleed use behind text
  { id: 'texture-mycelium',         category: 'textures', aspectRatio: '16:9', prompt: 'An abstract pale botanical study: thin delicate ink lines suggesting a wide horizontal network of fine roots and mycelium spreading across cream paper, with a few barely-there dusty ochre and sage watercolor stains. No focal subject, very low contrast, faded.' },
  { id: 'texture-soil-macro',       category: 'textures', aspectRatio: '16:9', prompt: 'A pale, faded top-down macro suggestion of garden soil: faint dots and specks in dusty ochre and soft brown spread evenly across cream paper, with a few wisps of root hair drawn in fine ink. Low contrast, no focal subject, designed to sit behind text.' },
  { id: 'texture-watercolor-earth', category: 'textures', aspectRatio: '16:9', prompt: 'An abstract horizontal watercolor wash on cream paper: very pale ochre, sage and soft brown bleeding gently into one another. Visible paper texture, no recognizable subject, low contrast, faded edges.' },
  { id: 'texture-pencil-roots',     category: 'textures', aspectRatio: '16:9', prompt: 'A wide horizontal pattern of pencil-sketched root systems spreading lightly across cream paper. Mostly empty paper with a few delicate lines crossing the canvas. Almost monochrome, very low contrast, repeatable feel.' },
];

// Communities — same list & prompts as before, but the unified STYLE is now appended.
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
// CORE
// ============================================================

// Gemini 2.5 Flash Image — square only (1024x1024 PNG)
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

// Imagen 4 fast — supports aspectRatio (1:1, 16:9, 9:16, 4:3, 3:4)
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

// Route by aspect ratio: 1:1 → Gemini (legacy, communities), else Imagen
async function generateImage(item) {
  const ar = item.aspectRatio || '1:1';
  if (ar === '1:1') return generateGemini(item.prompt);
  return generateImagen(item.prompt, ar);
}

function outDirFor(item) {
  if (item.category === 'communities') return path.join(__dirname, '..', 'src', 'img', 'communities');
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
  if (!mode || !['sample', 'pack', 'restyle-communities', 'all'].includes(mode)) {
    console.error('Usage: node scripts/generate-images.js <sample|pack|restyle-communities|all>');
    process.exit(1);
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
