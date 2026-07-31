# Jeu de prompts — sessions de production de contenu

Issu de la réunion Thomas / Lucile du 29 juillet 2026 (cf. compte-rendu).
Chaque session est autonome : ouvrir une nouvelle session Claude Code, coller le **bloc de
contexte** puis le prompt de la session voulue.

**Ordre conseillé** — `1` (rôles) débloque `2` et `3`. `4` (forum) est indépendante et peut
démarrer tout de suite. `5` vient après `4`. `6` est indépendante mais se déroule en 5 phases
(`6A` → `6E`), à lancer une par une avec validation entre chaque. `7` clôture.
Pour du résultat vite : **1 puis 4**.

---

## Bloc de contexte — à coller en tête de CHAQUE session

```
Projet : e-sol-demo (C:\Users\thoma\OneDrive\09_CODE\e-sol-demo).
Prototype haute-fidélité du site e-sol.fr — réseau collaboratif sur les sols porté par l'AFES.
Le site de production tourne sous YesWiki. Cette démo est la maquette de référence : ce qu'on
y construit est ensuite porté sur le wiki réel.

ATTENTION PUBLICATION : ce repo est ThomasF63/e-sol-demo et .github/workflows/deploy.yml
publie dist/ sur GitHub Pages à chaque push sur master. Tout ce qui est poussé devient public.
Ne commite pas sans me le demander, ne pousse jamais sur master sans validation explicite.

Conventions du repo, à respecter strictement :
- src/pages/*.html    → pages, compilées par build.js vers dist/ ({{> head }}, {{> header }}, {{> footer }})
- src/components/     → composants + illustrations SVG faites main (illustration-maison.html, etc.)
- src/components/diagram-*.md → sources Mermaid versionnées, exportées en PNG/SVG pour le wiki
- src/data/*.json     → fixtures calquées sur les futurs formulaires Bazar
- src/img/            → images (communities/, hero/, pack/)
- docs/*-yeswiki.md   → brouillons de portage YesWiki, relus par Lucile avant publication
- Design system : variables CSS dans src/components/head.html (--primary #9c3f00,
  --secondary #586330, --bg-base #faf8f5, polices Outfit + Inter). Ne pas inventer de couleurs.
- Vocabulaire maison : la maison / les pièces (communautés) / les outils partagés (communs) /
  les fondations (charte) / le toit (AFES + COPIL). Voir docs/maison-esol-yeswiki.md.

REPO FRÈRE — ../afes-yeswiki-collab contient la doctrine d'intégration YesWiki. Lis
../afes-yeswiki-collab/docs/yeswiki-regles-techniques.md et ../afes-yeswiki-collab/CLAUDE.md
avant toute recommandation technique. L'ordre de préférence y est explicite :
prototype autonome → surcharge de template Bazar → action custom → JS custom → thème →
extension → modification du cœur (à ne justifier qu'en dernier recours).

CONTRAINTE MAJEURE : tout ce qui est destiné à e-sol.fr doit être réalisable en YesWiki NATIF
(pages wiki, formulaires et templates Bazar, ACL et groupes natifs, images téléversées).
Si une idée nécessite du développement, ne la retire pas : signale-la dans une section
« nécessite Laurent » à la fin, avec le besoin exprimé — pas la solution technique.

Langue : français, ton sobre et concret, écriture inclusive légère (point médian, comme
l'existant). Rien d'inventé : ce qui n'est pas confirmé par la charte, le site en ligne ou
l'existant du repo est marqué « proposition — à valider ».
```

---

## Session 1 — Référentiel rôles & droits ⚠️ à faire en premier

> Il n'existe aujourd'hui **aucune trace** des droits réellement configurés sur e-sol.fr.
> Cette session fait donc d'abord un travail d'enquête, puis une proposition argumentée.

```
[BLOC DE CONTEXTE]

Objectif : produire le référentiel des rôles et droits d'e-Sol — la source de vérité dont
découleront les diagrammes, les tutoriels et les pages d'explication.

Il n'existe pas de documentation des droits actuellement configurés. Tu dois donc enquêter
avant de proposer. PHASE 1 — ENQUÊTE, dans cet ordre :

a) Dans ce repo : README.md, src/pages/charte.html, src/pages/participer.html,
   src/pages/inscription.html, src/pages/membre.html, src/data/members-sample.json,
   docs/maison-esol-yeswiki.md, src/components/diagram-gouvernance.md.
b) Dans les dossiers frères de C:\Users\thoma\OneDrive\09_CODE\ :
   - afes-yeswiki-collab/ en entier (docs/, backlog/, prompts/, CLAUDE.md) — c'est là que
     sont les notes de travail sur l'intégration YesWiki
   - afes-esol-design/ (archive de design, à ouvrir seulement si utile)
c) Sur le site en ligne, en LECTURE SEULE : https://e-sol.fr — observe la structure réelle
   des pages, ce qui est visible sans compte, les mentions de rôles ou de statuts, la page
   Charte, les pages de communautés. Ne te connecte pas, ne modifie rien, ne soumets aucun
   formulaire.
d) Documentation YesWiki officielle : ce que le moteur gère nativement en matière de comptes,
   de groupes, de listes de contrôle d'accès (ACL) par page, et de droits sur les fiches Bazar.
   Cite tes sources.

Restitue-moi une synthèse courte de ce que tu as trouvé AVANT de rédiger le référentiel, en
séparant nettement : ce qui est établi / ce qui est déduit / ce qui reste inconnu.

PHASE 2 — produis docs/roles-et-droits.md avec :

1. LES 5 NIVEAUX PLATEFORME — pour chacun : définition en une phrase, ce qu'on peut faire,
   comment on y accède, qui l'attribue.
   - visiteur non inscrit
   - membre inscrit
   - membre d'une communauté
   - animateur·rice de communauté
   - administrateur·rice de la plateforme

2. LA GRANULARITÉ INTRA-COMMUNAUTÉ — au sein d'une communauté : membre simple / membre d'un
   cercle restreint (espaces ou droits spécifiques) / animateur·rice. Présente-la comme un
   modèle PARAMÉTRABLE : chaque communauté décide d'activer ou non le cercle restreint.
   C'est un outil de décision pour les animateur·rices, pas une règle imposée.

3. LA MATRICE DROITS × NIVEAUX en tableau markdown, avec ✅ / 🟡 (sous condition) / ❌ et les
   conditions détaillées sous le tableau. Couvre au minimum : consulter les pages publiques,
   consulter l'annuaire, voir une fiche membre complète, accéder au forum, poster sur le forum,
   rejoindre une communauté, valider une adhésion, créer/éditer une fiche action, déposer un
   commun, éditer la page de la communauté, créer une sous-page, modérer, écrire à un groupe,
   gérer les statuts reconnus, créer une communauté.

4. COLONNE « FAISABLE EN YESWIKI NATIF ? » — applique la grille de
   ../afes-yeswiki-collab/docs/yeswiki-regles-techniques.md. Pour chaque droit, dis à quel
   niveau de la pile il se règle (ACL native ? droits de formulaire Bazar ? template ?
   développement ?). C'est la partie la plus utile de tout le document : sois précis.

5. STATUTS RECONNUS — la liste actuelle, plus les deux ajouts demandés en réunion :
   « porteur de projet SRP Sol » et « référent Soléar » (intitulés exacts à confirmer, marque-le).

6. POINTS À TRANCHER — deux listes séparées : « à valider avec Lucile » (contenu, vocabulaire,
   politique d'accès) et « à vérifier avec Laurent » (faisabilité technique).

Ne complète pas les trous par des suppositions plausibles : marque-les comme questions ouvertes.
```

---

## Session 2 — Diagramme + infographie des rôles

```
[BLOC DE CONTEXTE]

Prérequis : docs/roles-et-droits.md doit exister (session 1). Lis-le, c'est la source de vérité.
Si des points y sont marqués « à valider », conserve la même mention dans les visuels.

Objectif : deux visuels des rôles et droits, en deux formats complémentaires.

A) src/components/diagram-roles-droits.md — calque exactement la structure de
   src/components/diagram-gouvernance.md (bloc Mermaid, « Lecture du schéma », variante
   simplifiée, section export PNG/SVG, section « à mettre à jour quand… »). Deux diagrammes :
   - Vue GÉNÉRALE : les 5 niveaux plateforme, en droits CUMULATIFS — chaque niveau hérite du
     précédent, et ça doit se voir visuellement (escalier ou cercles concentriques).
   - Vue COMMUNAUTÉ : membre / cercle restreint / animateur·rice, avec ce qui est partagé et
     ce qui est réservé. Cette vue est un support de décision pour les animateur·rices : ils
     doivent pouvoir dire « nous, on active / on n'active pas le cercle restreint ».
   Réutilise la palette et les classDef de diagram-gouvernance.md pour l'unité visuelle.

B) src/components/illustration-roles.html — infographie SVG faite main, dans le style de
   illustration-maison.html et illustration-communities.html : viewBox, role="img" +
   aria-label descriptif, couleurs du design system, texte en <text>, zéro dépendance externe.
   Elle doit rester lisible en PNG exporté et en noir et blanc — ne code pas l'information
   uniquement par la couleur.

C) Intègre l'illustration dans une page de démo et VÉRIFIE LE RENDU RÉEL : node build.js, puis
   lance la prévisualisation et prends une capture. Ne conclus pas sans l'avoir vu rendu.

Rappel : sur e-sol.fr ces visuels seront des IMAGES téléversées (YesWiki ne rend pas Mermaid).
Le .md reste la source éditable.
```

---

## Session 3 — Page « Qu'est-ce qu'une communauté ? »

```
[BLOC DE CONTEXTE]

Prérequis : docs/roles-et-droits.md (session 1).

Objectif : la page qui explique ce qu'est une communauté e-Sol et comment elle fonctionne.
Elle n'existe pas aujourd'hui — on saute directement à la liste des 12 communautés.

Lis : src/pages/communautes.html, src/pages/communaute-detail.html, src/data/communities.json,
docs/maison-esol-yeswiki.md.

Produis :
1. src/pages/qu-est-ce-qu-une-communaute.html — page de démo, design system existant :
   - Ce qu'est une communauté (et ce qu'elle n'est pas)
   - Ce qu'on y fait concrètement : 3-4 exemples tirés des VRAIES communautés de
     src/data/communities.json, pas des exemples inventés
   - Qui fait quoi dedans : membres, cercle restreint si activé, animateur·rice
     (renvoie au visuel de la session 2)
   - Le cycle de vie : naissance → animation → production de communs → sommeil ou essaimage
   - Comment rejoindre une communauté, pas à pas
   - Comment proposer d'en créer une : critères, à qui s'adresser
   - FAQ courte : puis-je être dans plusieurs ? que se passe-t-il si je suis inactif ?
     qui décide de la ligne éditoriale ?
2. Les liens depuis communautes.html et depuis la page d'accueil.
3. docs/qu-est-ce-qu-une-communaute-yeswiki.md — brouillon de portage, même format que
   docs/premiers-pas-yeswiki.md (titre proposé, corps en markdown YesWiki dans un bloc de code,
   liens [[PageWiki libellé]], {{button}}, notes de portage, points à valider avec Lucile).

Vérifie le rendu (build + preview + capture) avant de conclure.
```

---

## Session 4 — Série de tutoriels forum (Discourse)

> Le plus gros morceau. Accès admin disponible sur le forum de production.

```
[BLOC DE CONTEXTE]

Objectif : la série de tutoriels sur le forum Discourse (forum.e-sol.fr). Aujourd'hui on n'a
que « s'inscrire au forum » — il manque tout le reste.

ACCÈS FORUM — j'ai un compte administrateur sur forum.e-sol.fr. Utilise le navigateur connecté
à mon Chrome (outils claude-in-chrome, qui ont mes sessions ouvertes) et non le navigateur
intégré, qui n'est pas authentifié.

GARDE-FOU ABSOLU : ce forum est en PRODUCTION avec de vrais utilisateurs et je suis admin,
donc tu peux tout casser. Navigation en LECTURE SEULE uniquement. Tu ne publies pas, ne réponds
pas, n'envoies pas de message, ne modifies aucun réglage, ne modères rien, ne supprimes rien.
Si une vérification exige d'écrire quelque part, arrête-toi et demande-moi.

Lis d'abord src/pages/tutoriels.html pour le format de carte existant, et
docs/premiers-pas-yeswiki.md (étape 3) pour ce qui est déjà écrit sur le forum.

Explore ensuite le forum réel pour relever les VRAIS libellés de boutons, noms de menus et
chemins de navigation, ainsi que la structure de catégories réellement en place. Note au
passage les écarts entre l'organisation actuelle et ce que les tutos devraient décrire.

Produis une série de fiches, une par geste, chacune courte et autonome :
  A. Rejoindre le forum et se connecter
  B. Comprendre l'organisation : catégorie, sujet, réponse, étiquette
  C. Suivre une catégorie qui m'intéresse et régler mes notifications
  D. Poster un nouveau sujet — où le poster, comment le titrer
  E. Répondre à un sujet, citer, mentionner quelqu'un
  F. Envoyer un message direct
  G. Régler mes notifications et mon résumé par e-mail
  H. Spécial animateur·rice : animer sa catégorie, épingler, modérer, accueillir un nouveau,
     relancer un fil qui s'endort

Format de chaque fiche : objectif en une phrase · durée estimée · prérequis · étapes numérotées
(une action par étape, à l'impératif) · captures · « et après ? » vers la fiche suivante.

CAPTURES D'ÉCRAN : prends-les toi-même depuis le navigateur, enregistre-les dans
src/img/tutos/forum/ avec des noms explicites (ex. forum-b-categories.png). Évite les captures
montrant des données personnelles de membres ou des fils privés — si un écran en contient,
cadre autrement ou signale-le-moi plutôt que de le publier.

Sortie en DEUX formats :
1. docs/tutoriels-forum-yeswiki.md — le paquet complet prêt à porter sur le wiki, une section
   par fiche, syntaxe YesWiki, format identique à docs/premiers-pas-yeswiki.md.
2. Les fiches intégrées à la démo (si la session 5 n'est pas encore faite, ajoute simplement
   les cartes dans src/pages/tutoriels.html).

Écris pour quelqu'un qui n'a jamais utilisé de forum. Pas de jargon non expliqué.
Termine par la liste de ce que tu n'as pas pu vérifier et pourquoi.
```

---

## Session 5 — Refonte du centre de ressources

```
[BLOC DE CONTEXTE]

Objectif : transformer src/pages/tutoriels.html (aujourd'hui une page de cartes + FAQ) en un
vrai centre de ressources capable d'absorber les tutoriels forum, les guides d'usage de la
plateforme et les fiches de rôles.

Lis : src/pages/tutoriels.html, src/pages/premiers-pas.html, src/pages/glossaire.html,
docs/tutoriels-forum-yeswiki.md s'il existe.

Attendu :
1. Une architecture de contenu explicite AVANT de coder — propose-la moi et attends ma
   validation. Pistes à arbitrer : classement par PUBLIC (nouveau membre / membre actif /
   animateur·rice) vs par OUTIL (plateforme / forum / communs) vs par PARCOURS. Dis-moi ce que
   tu recommandes et pourquoi, en une demi-page maximum.
2. Une fois validé : la page refondue, avec filtres (public, outil, niveau, durée), recherche
   simple, et une entrée « je débute » mise en avant.
3. La cohérence des parcours : premiers-pas → tutoriels → glossaire doivent se renvoyer les uns
   aux autres sans cul-de-sac.
4. Une note de portage précise : quelles briques YesWiki natives reproduisent ça — un formulaire
   Bazar « Tutoriel » avec facettes ? une page avec {{bazarliste}} ? Applique la grille de
   ../afes-yeswiki-collab/docs/yeswiki-regles-techniques.md. C'est ce point qui déterminera si
   Lucile peut alimenter le centre sans moi : traite-le sérieusement, pas en une ligne.

Vérifie le rendu (build + preview + capture) et teste les filtres avant de conclure.
```

---

## Session 6 — La métaphore du village

> Session en 4 phases. Les phases **6A et 6B sont le livrable** : elles doivent tenir debout
> seules. Les phases **6C et 6D sont une expérimentation** — si l'image générée ne donne rien
> de convaincant, on la jette sans que la session soit perdue. À faire dans l'ordre, en
> validant avec moi entre chaque phase.

### 6A — Le narratif

```
[BLOC DE CONTEXTE]

Objectif : faire évoluer la métaphore fondatrice de LA MAISON vers LE VILLAGE.
Cette phase est du texte uniquement — pas de visuel, pas de code.

État actuel : src/pages/maison-esol.html + src/components/illustration-maison.html +
docs/maison-esol-yeswiki.md présentent e-Sol comme UNE maison dont les pièces sont les
communautés. Lis ces trois fichiers en entier avant de commencer.

Évolution décidée en réunion : e-Sol est un VILLAGE.
- une maison par communauté, chacune avec son caractère et ses espaces réservés
- des espaces communs partagés : le forum = l'agora, les communs = les ateliers et la
  bibliothèque, la charte = les fondations communes
- l'AFES et le COPIL = ce qui fait tenir le village ensemble

Réécris le texte de maison-esol.html en version village. Ce qui marchait dans la métaphore de
la maison doit être conservé, pas jeté : montre-moi explicitement ce que tu gardes, ce que tu
déplaces, ce que tu abandonnes.

Attention à un piège : dans la maison, les communautés étaient des PIÈCES d'un même bâtiment —
l'image portait l'idée d'un toit commun. Dans le village, chaque communauté a sa maison, donc
le « commun » doit être reporté ailleurs (les espaces partagés, les fondations, ce qui relie).
Traite ce point frontalement, c'est le cœur du changement.

Valide le narratif avec moi avant de passer à 6B.
```

### 6B — Le village interactif (livrable principal)

```
[BLOC DE CONTEXTE]

Prérequis : narratif de la phase 6A validé.

Objectif : un village INTERACTIF en HTML/SVG — les maisons des communautés sont cliquables et
mènent vers les pages correspondantes.

Construis src/components/illustration-village.html en SVG fait main, dans la lignée de
illustration-maison.html : viewBox, design system (--primary #9c3f00, --secondary #586330),
zéro dépendance externe, texte en <text>.

Exigences structurantes :
1. PILOTÉ PAR LES DONNÉES — les maisons viennent de src/data/communities.json (12 communautés
   réelles). N'écris pas 12 maisons en dur dans le SVG : génère-les depuis les données, pour
   qu'ajouter une communauté ne demande pas de redessiner.
2. VARIÉTÉ SANS CHAOS — les maisons doivent se distinguer (taille, forme de toit, teinte selon
   la catégorie via les variables --cat-* du design system) sans que le village devienne
   illisible. Le regard doit pouvoir compter les maisons.
3. LES ESPACES PARTAGÉS sont des lieux à part entière et doivent se lire comme tels :
   l'agora (forum), les ateliers et la bibliothèque (communs), les fondations (charte).
4. INTERACTIONS — survol : la maison se soulève légèrement et son nom apparaît. Clic : lien
   vers la page de la communauté. Prévois un état « communauté en sommeil » visuellement
   distinct (volets fermés, teinte plus pâle).
5. ACCESSIBILITÉ, non négociable — chaque maison est atteignable au clavier (tabindex, focus
   visible), porte un <title>/aria-label explicite, et la page contient une VRAIE LISTE TEXTE
   des 12 communautés en dessous. Cette liste n'est pas un pis-aller : c'est aussi le repli
   pour le portage YesWiki et pour l'impression.
6. RESPONSIVE — sur mobile le village doit rester lisible. Si ça n'est pas tenable, bascule
   sur la liste texte plutôt que de livrer un village illisible à 375px.

Puis :
- src/pages/village-esol.html (ou refonte de maison-esol.html — propose, ne tranche pas seul)
- VÉRIFIE LE RENDU RÉEL : node build.js, prévisualisation, capture. Teste au clavier, teste à
  375px, teste avec une communauté marquée en sommeil.

Ne supprime pas illustration-maison.html ni maison-esol.html tant que le village n'est pas validé.
```

### 6C — Expérimentation : l'image générée

```
[BLOC DE CONTEXTE]

Prérequis : le village SVG de la phase 6B existe et est validé.
Ceci est une EXPÉRIMENTATION. Si le résultat n'est pas convaincant, on l'abandonne — dis-le
franchement plutôt que de me vendre une image médiocre.

Objectif : tester la génération d'une illustration du village par IA, dans notre identité visuelle.

CHAÎNE EXISTANTE — ne repars pas de zéro. scripts/generate-images.js génère déjà tout le pack
d'images du site. Lis-le en entier. Points clefs :
- la clé est dans .env (GEMINI_API_KEY), chargée automatiquement par le script.
  NE L'AFFICHE JAMAIS dans la sortie et ne la commite jamais.
- la constante STYLE verrouille notre identité : « vintage naturalist field-notebook », lavis
  aquarelle lâche sur papier crème texturé, palette stricte 4 couleurs (ivoire, ocre/terracotta
  pâle, vert sauge/olive, brun chaud), sujet à moyenne distance, 30% de papier vide, pas de
  texte, pas de visages. C'est ce qui fait tenir la cohérence du site : RÉUTILISE-LA telle
  quelle, ne la réécris pas.
- deux modèles sont déjà câblés : gemini-2.5-flash-image (carré) et imagen-4.0-fast (formats).

Travail :
1. Ajoute un deck « village » au script, sur le modèle des decks existants. Le prompt de
   composition doit être DÉRIVÉ DU SVG de la phase 6B : reprends son organisation spatiale
   (où sont les maisons, où est l'agora, où sont les ateliers, la ligne d'horizon) et
   décris-la en langage naturel. On cherche une image qui ressemble à notre plan, pas une
   illustration au hasard.
2. Teste aussi Nano Banana Pro (la génération d'images de Gemini 3 Pro), qui devrait mieux
   tenir une composition complexe que le 2.5 Flash. VÉRIFIE LE NOM EXACT DU MODÈLE ET SON
   ENDPOINT DANS LA DOCUMENTATION GEMINI OFFICIELLE avant de l'utiliser — ne devine pas un
   identifiant de modèle.
3. COÛT : chaque image est payante. Itère sur le texte du prompt avant de lancer quoi que ce
   soit, génère 2 ou 3 variantes maximum par tour, montre-les moi, et attends mon avis avant
   d'en relancer. Ne lance jamais une série de 15 images sans me demander.
4. Sortie dans src/img/village/, avec les prompts utilisés consignés dans le script (comme les
   decks existants) pour qu'une régénération soit reproductible.

Attends-toi à ce que le modèle ne respecte PAS la disposition demandée — c'est la limite connue
de ces outils. Rends-moi compte honnêtement de l'écart entre la composition demandée et obtenue :
c'est cette mesure qui décidera de la phase 6D.
```

### 6D — Expérimentation : faire coïncider l'image et l'interactif

```
[BLOC DE CONTEXTE]

Prérequis : phases 6B et 6C faites. À ne tenter que si une image de 6C est jugée exploitable.

Objectif : tester la superposition — l'image générée en fond, les éléments interactifs par-dessus,
positionnés pour tomber sur les bonnes maisons.

Le problème à résoudre : un modèle d'image ne place pas les objets là où on lui demande. Les
coordonnées des zones cliquables doivent donc être MESURÉES sur l'image obtenue, pas décidées
à l'avance. Et elles doivent survivre à une régénération de l'image.

Approche imposée :
1. Les zones cliquables vivent dans src/data/village-hotspots.json — un fichier séparé, en
   coordonnées NORMALISÉES (0-100 en x et y, pas des pixels), une entrée par communauté et
   par espace partagé, chacune liée à un identifiant de src/data/communities.json.
   L'image et le fichier de coordonnées restent ainsi indépendants : régénérer l'image ne
   demande que de recalibrer ce seul fichier.
2. Construis un MODE CALIBRATION, activé par un paramètre d'URL (?calibrate) : il affiche la
   grille normalisée par-dessus l'image, permet de déplacer les zones à la souris, et recopie
   le JSON résultant dans la console. C'est l'outil qui rend la calibration faisable en
   quelques minutes au lieu d'être un enfer. Fais-le simple, il ne sera jamais en production.
3. La superposition doit rester alignée quand la fenêtre change de taille : image et zones
   dans le même conteneur en position relative, zones en pourcentages.

Compare ensuite HONNÊTEMENT les deux versions, et recommande :
  (a) SVG fait main seul — la version 6B
  (b) image générée + zones cliquables — la version 6D
  (c) hybride : image générée réduite au fond d'atmosphère (ciel, collines, texture papier),
      et toute la structure lisible — maisons, noms, interactions — en SVG par-dessus
Donne-moi ton avis argumenté sur laquelle garder, en tenant compte de la maintenance : que se
passe-t-il quand une 13e communauté arrive ? Ne cherche pas à me faire plaisir : si
l'expérimentation ne vaut pas le coup, dis-le.

ACCESSIBILITÉ — quelle que soit la version retenue, la navigation clavier et la liste texte
des communautés de la phase 6B doivent rester fonctionnelles. Une image cliquable sans repli
n'est pas livrable.
```

### 6E — Portage et page d'accueil

```
[BLOC DE CONTEXTE]

Prérequis : une version du village est validée.

1. PORTAGE YESWIKI — le village interactif ne se porte pas tel quel sur e-sol.fr, c'est
   exactement la tension identifiée en réunion. Produis un plan de dégradation à trois niveaux :
   - ce qui passe en YesWiki natif aujourd'hui (image statique + liste de liens sous l'image,
     éventuellement une image cliquable),
   - ce qu'on perdrait par rapport à la démo, dit clairement,
   - ce qu'il faudrait pour avoir l'interactif sur le wiki → section « nécessite Laurent »,
     formulée en besoin, pas en solution technique.
   Applique la grille de ../afes-yeswiki-collab/docs/yeswiki-regles-techniques.md.
2. Mets à jour docs/maison-esol-yeswiki.md (ou crée docs/village-esol-yeswiki.md) au format
   des brouillons de portage existants.
3. IMPACT PAGE D'ACCUEIL — propose les blocs à revoir dans src/pages/index.html pour que
   « qu'est-ce qu'e-Sol » et « comment rejoindre une communauté » soient clairs dès l'arrivée.
   Propose d'abord, code ensuite.
```

---

## Session 7 — Paquet de portage pour Lucile

```
[BLOC DE CONTEXTE]

Objectif : consolider tout ce qui a été produit en UN paquet que Lucile peut relire puis publier
sur e-sol.fr sans moi.

Passe en revue tout docs/*.md et produis docs/00-portage-README.md :
1. L'inventaire : quelle page wiki créer, avec quel nom (?PageWiki), à partir de quel fichier,
   dans quel ordre — les dépendances de liens comptent, ne pas publier une page qui pointe vers
   une page inexistante.
2. Les images à téléverser : nom de fichier, page de destination, source dans le repo, et pour
   les diagrammes Mermaid la procédure d'export.
3. Un contrôle de cohérence : tous les liens [[...]] internes pointent-ils vers une page qui
   existe ou qui est prévue dans le lot ? Liste les liens cassés.
4. Ce qui reste bloqué côté technique — la liste pour Laurent, avec pour chaque point ce qu'on
   veut obtenir et pourquoi, pas la solution technique.
5. Les points de vocabulaire ou de politique restés en suspens, à trancher avec Lucile.

Écris ce fichier pour quelqu'un qui ne connaît pas le repo. Pas de jargon Git.
```

---

## Hors périmètre pour l'instant

Vus en réunion, mais qui nécessitent Laurent ou du développement — à ne pas traiter dans ces
sessions, seulement à documenter en « nécessite Laurent » :
signature obligatoire de la charte à l'inscription · visite guidée interactive · notifications
et e-mails groupés · SSO wiki ↔ forum · flux RSS et newsletter automatisée · messagerie interne.

Les PDF imprimables sont écartés pour l'instant.
