# Portage YesWiki : la maison e-Sol

Brouillon de la page **?MaisonESol** à créer sur [e-sol.fr](https://e-sol.fr), en complément de la `?PagePrincipale`. Texte court, compatible YesWiki, conçu pour être collé tel quel et adapté ensuite avec Lucile.

---

## Page wiki : `?MaisonESol`

### Titre proposé
**La maison e-Sol — comprendre le réseau en cinq minutes**

### Corps de la page (Markdown / YesWiki)

```markdown
{{attach file="maison-esol.png" desc="Illustration de la maison e-Sol" class="center"}}

**e-Sol, c'est une grande maison.**
Chaque communauté thématique a sa pièce. Tout le monde y partage les mêmes outils communs. La maison est animée par l'AFES, mais personne n'en est propriétaire — ce sont les habitant·e·s qui la font vivre.

---

### 🏠 Les six espaces de la maison

**Le toit — l'AFES**
L'Association Française pour l'Étude du Sol anime et héberge le réseau. Elle ne contrôle pas les communautés, elle leur fait de la place. Le **COPIL e-Sol** (AFES, GIS Sol, RMT Sols et Territoires, RNEST, avec ADEME et OFB) oriente l'ensemble.

**La porte d'entrée — l'accueil**
On entre par la [[Charte charte]], on prend sa clef avec l'[[FormulaireInscription inscription]], on se présente dans l'[[Annuaire annuaire]], on discute dans le [[https://forum.e-sol.fr/ forum]].

**Les pièces — les communautés thématiques**
À l'étage, chaque [[ListeCommunautes communauté]] est une pièce avec son ambiance et son·sa référent·e : Fresque du Sol, Sols Forestiers, ZAN, Pédologie de Terrain, Sols et Art, etc. On peut entrer dans plusieurs pièces, et on peut en proposer de nouvelles.

**Les outils partagés — les communs**
Au rez-de-chaussée se trouvent les **communs** : la **cuisine** où l'on produit ensemble, la **bibliothèque** (guides, données, cartes), l'**atelier** (outils logiciels, méthodes), la **salle commune** (formations, événements). Tout le monde y a accès et peut contribuer. Voir les [[Idees-de-communs idées en cours]].

**Les fondations — la charte**
Sans fondations, pas de maison. La [[Charte charte e-Sol]] pose les principes : transparence, biens communs, évolutivité, robustesse, et garantit les licences ouvertes (CC BY-SA).

**Le jardin — les actions**
Autour de la maison, le jardin : ateliers grand public, événements, projets pilotes. C'est là que poussent les graines des prochains communs.

---

### 🚪 Par quelle porte entrer ?

- **Je viens d'arriver →** [[FormulaireInscription je m'inscris]]
- **Je cherche une pièce →** [[ListeCommunautes je rejoins une communauté]]
- **Je veux contribuer à un commun →** [[Idees-de-communs je propose ou je rejoins]]
- **Je veux ouvrir une nouvelle pièce →** [[Contact j'écris au COPIL]]

---

### 📊 Qui décide quoi ?

{{attach file="gouvernance-esol.png" desc="Schéma de gouvernance" class="center"}}

Le cycle est vertueux : les **retombées** de la valorisation des communs financent l'**animation** de la maison.

---

*Cette page est une introduction au fonctionnement d'e-Sol. Pour aller plus loin : lisez la [[Charte charte]] complète, parcourez les [[Tutoriels tutoriels]], ou venez discuter sur le [[https://forum.e-sol.fr/ forum]].*

{{button link="PagePrincipale" text="Retour à l'accueil" class="btn-primary"}}
```

### Notes de portage

- **Images à téléverser** sur YesWiki en amont :
  - `maison-esol.png` : export PNG de l'illustration SVG (largeur recommandée : 1200 px, format à 72 dpi pour web).
  - `gouvernance-esol.png` : export PNG du diagramme Mermaid (utiliser [mermaid.live](https://mermaid.live) avec la version simplifiée 3-niveaux pour la lisibilité wiki, ou la version complète selon le rendu).
- **Liens internes YesWiki** : la syntaxe `[[NomPage texte]]` fonctionne pour les pages wiki existantes. Vérifier les noms exacts avant publication.
- **Ajout au menu** : demander aux admins de placer un lien vers `?MaisonESol` dans le menu principal (sous "Le Réseau" ou directement dans "Accueil") et en bandeau d'entrée sur `?PagePrincipale`.
- **Wikifier les variantes** : si YesWiki accepte les SVG en upload, privilégier le SVG (zoomable) ; sinon PNG haute résolution.

---

## Livret PDF A5 — « Bienvenue dans la maison e-Sol »

Brief de mise en page pour un livret 8 pages au format **A5 portrait** (148 × 210 mm), distribuable en événement, AG AFES, et envoyé en pièce jointe au mail de bienvenue post-inscription.

### Structure (8 pages)

| Page | Contenu |
|------|---------|
| **1 — Couverture** | Titre « Bienvenue dans la maison e-Sol » · sous-titre « Comment fonctionne notre réseau » · variante riche IA de la maison (vue 3/4 ou perspective douce) · logo e-Sol + AFES en pied. |
| **2 — Édito** | Mot d'accueil (10-12 lignes) signé du président·e de l'AFES ou du COPIL. Pose la métaphore : « Imaginez une grande maison… ». |
| **3 — Coupe de la maison** | Reprise de l'illustration SVG en pleine page, avec légendes simplifiées. Garder les 6 espaces visibles. |
| **4-5 — Visite guidée** | Double page : 6 encarts (un par espace). Toit · Porte · Pièces · Outils · Fondations · Jardin. Format : titre + 4-5 lignes + petit pictogramme. Reprend strictement le texte de `maison-esol.html`. |
| **6 — Qui décide quoi** | Schéma de gouvernance en pleine page (version simplifiée 3 niveaux) + légende courte sur le cycle vertueux des retombées. |
| **7 — Vos premiers pas** | Checklist visuelle 5 étapes (préfigure la phase 2) : inscription → fiche perso → 1-2 communautés → forum → repérer un commun. |
| **8 — Quatrième de couverture** | Coordonnées · liens (e-sol.fr, forum, contact) · logos COPIL (AFES, GIS Sol, RMT Sols et Territoires, RNEST, ADEME, OFB) · QR code vers la page `?MaisonESol`. |

### Style éditorial

- **Police** : Outfit (titres) + Inter (corps) — mêmes que la démo.
- **Palette** : terre (#9c3f00), olive (#586330), crème (#faf8f5), accents.
- **Tons** : chaleureux, inclusif, factuel. Pas de jargon non expliqué. Tutoiement à éviter (réseau institutionnel).
- **Photos / illustrations** : variantes IA possibles si générées avec un **prompt cohérent** (échelle humaine, ambiance terre/sol, lumière naturelle, palette tons chauds). Brief de prompt à formaliser avant lancement.

### Exports techniques

- **Format final** : PDF/X-1a (impression) + PDF web compressé (< 4 Mo).
- **Bleeds** : 3 mm.
- **Résolution images** : 300 dpi pour la version impression, 150 dpi pour la version web.
- **Maquette** : InDesign ou Affinity Publisher (Lucile décide selon ses outils).

### Variantes à prévoir

- **Version « digitale »** A4 paysage 4 pages pour le mail de bienvenue (lecture écran).
- **Version « réseaux sociaux »** : carrousel 6 visuels (un par espace) carré 1080×1080 pour LinkedIn / Twitter / mailings AFES.

---

## Brief prompt IA (variantes riches)

À utiliser dans Firefly / Midjourney / autre pour générer la **variante illustrée riche** de la maison destinée à la couverture du livret et aux supports de communication.

```
Prompt cœur :
A warm and inviting cross-section illustration of a traditional French country house representing a collaborative network. The house has:
- A welcoming red-brown tile roof labeled discreetly "AFES"
- Upper floor showing 3-4 visible rooms with small groups of diverse people (researchers, citizens, students) collaborating around topics related to soil science
- Ground floor showing a shared kitchen with a steaming pot, a bookshelf with colorful books, a workshop with tools, and a round table with people
- Visible stone foundations with the word "CHARTE" engraved
- A central open wooden door with the word "BIENVENUE" arched above
- A small garden in front with seedlings, flowers, and a winding path
- One person walking on the path toward the door
- Soft natural lighting, warm earthy palette (terracotta, olive green, cream, warm browns)
- Editorial illustration style, flat-ish with soft textures, hand-drawn feel
- No text inside the rooms, just the labels mentioned above
- 16:9 ratio for the print version

Negative prompt : photorealistic, cluttered, modern skyscraper, dark, cold colors, text inside rooms.
```

À itérer avec Lucile selon les premiers résultats.

---

## Checklist de publication phase 1

- [ ] Validation du narratif et de la métaphore avec Lucile (relecture `maison-esol.html` + ce brouillon)
- [ ] Export PNG haute-résolution de l'illustration SVG (1200 px et 2400 px)
- [ ] Export PNG du diagramme Mermaid (versions simple + complète) via mermaid.live
- [ ] Génération de la variante IA de la maison (couverture livret)
- [ ] Création de la page `?MaisonESol` sur e-sol.fr + téléversement des PNG
- [ ] Ajout d'un lien depuis `?PagePrincipale` et le menu principal
- [ ] Maquette InDesign / Affinity du livret PDF A5
- [ ] Génération PDF impression + PDF web
- [ ] Test de compréhension avec 2-3 membres hors AFES (idéalement un nouvel arrivant) — voir critère de sortie dans le plan
- [ ] Décision : passer à la phase 2 (Premiers pas) ou itérer sur la phase 1
