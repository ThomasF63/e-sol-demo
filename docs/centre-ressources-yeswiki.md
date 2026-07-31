# Portage YesWiki : le centre de ressources

Produit de la session 5 (plan du 29/07/2026). Transforme la page `?Tutoriels` (ou en crée une
nouvelle, `?CentreRessources`) en centre de ressources alimenté par un formulaire Bazar,
c'est-à-dire alimentable par **Lucile sans intervention technique**. C'est l'objet principal
de cette note : montrer que la V1 tient entièrement en YesWiki natif.

Démo de référence : `src/pages/tutoriels.html` + `src/data/ressources.json` (et la page
série `src/pages/tutoriels-forum.html`). Le JSON de la démo préfigure champ pour champ le
formulaire Bazar décrit ici : la correspondance est donnée plus bas.

Sources consultées le 31/07/2026 :
- Action bazarliste : https://yeswiki.net/archive/?ActionBazarliste
- Facettes (module de filtres) : https://yeswiki.net/archive/?BazarFacette
- Conventions templates Bazar : `../afes-yeswiki-collab/yeswiki/integration-notes/bazar-template-conventions.md`

---

## 1. Le principe

Un **formulaire Bazar « Ressource »** décrit chaque tutoriel ou guide : titre, résumé,
public, outil, niveau, durée, statut, lien vers la page qui contient le contenu.
Une **page wiki** affiche toutes les fiches avec `{{bazarliste}}`, qui fournit nativement :

- la **barre de recherche** : paramètre `search="true"` ;
- les **filtres à facettes** : paramètre `groups="…"` listant les champs filtrables
  (le module Facette s'active automatiquement dès que `groups` est présent) ;
- l'affichage en **cartes** : `template="card" dynamic="true"` (template moderne),
  ou un template classique (`material-card`, `liste_accordeon`…).

Ajouter une ressource = **créer une fiche via le formulaire**. Aucun code, aucune
modification de la page. C'est le point qui rend le centre autonome pour Lucile.

Position dans la grille de `../afes-yeswiki-collab/docs/yeswiki-regles-techniques.md` :

| Niveau | Contenu | Statut |
|---|---|---|
| 1. Prototype autonome | La démo de cette session | ✅ fait |
| 0. Natif pur (pages + Bazar + ACL) | Formulaire Ressource + page `{{bazarliste}}` | ✅ suffit pour la V1 |
| 2. Surcharge de template Bazar | Cartes au design exact de la démo, clic direct | Optionnel, confort (voir § 6) |
| 3 et plus | Rien de nécessaire | ❌ non requis |

---

## 2. Le formulaire Bazar « Ressource »

Champs proposés, dans l'ordre du formulaire. Les identifiants de listes sont des
propositions ; les noms réels dépendront de la création dans l'interface Bazar.

| Champ | Type Bazar | Obligatoire | Valeurs / remarques |
|---|---|---|---|
| `bf_titre` | Texte | oui | Titre de la ressource |
| `bf_description` | Texte long (court !) | oui | 1 à 2 phrases, c'est le texte de la carte |
| Public | Liste `ListePublicRessource` | oui | `nouveau` = Je débute · `membre` = Membre actif·ve · `animateur` = Animateur·rice · `tous` = Tout le monde |
| Outil | Liste `ListeOutilRessource` | oui | `plateforme` · `forum` · `communs` · `reseau` (= Le réseau) |
| Niveau | Liste `ListeNiveauRessource` | oui | `debutant` · `intermediaire` · `avance` |
| Durée | Liste `ListeDureeRessource` | oui | `courte` = 5 min ou moins · `moyenne` = 6 à 10 min · `longue` = plus de 10 min · `reference` = Référence (à consulter) |
| Type | Liste `ListeTypeRessource` | oui | `tutoriel` (pas-à-pas) · `guide` (comprendre) |
| Statut | Liste `ListeStatutRessource` | oui | `disponible` · `a-venir` |
| `bf_duree_affichee` | Texte court | non | Ex. « 5 min », « 40 min ». Pour l'affichage fin ; la liste Durée sert aux facettes |
| `bf_lien` | Lien wiki ou URL | oui si disponible | La page qui contient le contenu (ex. `TutoForumRejoindre`) |
| `bf_serie` | Texte court | non | Ex. « Série forum · fiche A » |
| Image | Image | non | Vignette facultative (voir § 5, ce qui change par rapport à la démo) |

Pourquoi une **liste fermée pour la durée** (et pas un nombre libre) : les facettes de
Bazar filtrent sur des valeurs de listes. Trois tranches filtrables valent mieux qu'un
champ libre infiltrables. Le champ `bf_duree_affichee` garde la précision pour l'œil.

### Correspondance avec la démo (`src/data/ressources.json`)

| JSON démo | Formulaire Bazar |
|---|---|
| `titre` | `bf_titre` |
| `description` | `bf_description` |
| `public` | Liste Public (mêmes clefs : nouveau / membre / animateur / tous) |
| `outil` | Liste Outil (mêmes clefs) |
| `niveau` | Liste Niveau (mêmes clefs) |
| `duree_min` (nombre) | Liste Durée (tranche) + `bf_duree_affichee` (texte) |
| `type` | Liste Type |
| `statut` | Liste Statut |
| `lien` | `bf_lien` |
| `serie` | `bf_serie` |
| `icone` (Font Awesome) | Pas d'équivalent natif : image facultative ou rien (§ 5) |
| `motscles` | Inutile : la recherche Bazar porte sur les champs de la fiche |
| `en_attendant` | Pas d'équivalent natif : à mettre en fin de `bf_description` si utile |

Les 21 fiches de la démo fournissent le contenu de départ : les recopier dans le
formulaire est le travail d'amorçage (une vingtaine de minutes).

---

## 3. La page `?CentreRessources`

### Titre proposé
**Centre de ressources**

### Corps de la page (Markdown / YesWiki)

```markdown
Tutoriels et guides pour la plateforme, le forum et les communs. Filtrez selon votre
situation, ou cherchez directement.

> **Vous débutez ?** Commencez par [[PremiersPas les premiers pas]] : 5 étapes,
> 40 minutes, pour vous installer tranquillement. Et pour situer qui fait quoi,
> visitez [[MaisonESol la maison e-Sol]].

{{bazarliste id="NN" template="card" dynamic="true" entrydisplay="modal"
   search="true"
   groups="listeListePublicRessource,listeListeOutilRessource,listeListeNiveauRessource,listeListeDureeRessource"
   titles="Public,Outil,Niveau,Durée"
   groupsexpanded="true" filterposition="left" filtercolsize="3"
   champ="bf_titre" ordre="asc" shownumentries="true"}}

Un mot vous échappe ? Le [[Glossaire glossaire]] traduit les termes du réseau.
Une ressource manque ? [[Contact Dites-le nous]] : le centre s'enrichit au fil des besoins.
```

`id="NN"` : numéro du formulaire Ressource, connu à sa création. Les noms exacts des
champs dans `groups` sont à relever dans le formulaire créé (préfixe selon le type de
champ : `listeListe…`, `checkboxListe…`, ou `bf_…` pour les champs standard, cf. la
documentation Facette).

### Variante « sections par situation » (V2, facultative)

La démo affiche quatre sections (Je débute / J'utilise au quotidien / J'anime /
Comprendre e-Sol). En natif, cela se reproduit avec **plusieurs bazarliste filtrées**
par le paramètre `query` :

```markdown
===== Je débute =====
{{bazarliste id="NN" template="card" dynamic="true" query="listeListePublicRessource=nouveau" champ="bf_titre" ordre="asc"}}

===== J'utilise au quotidien =====
{{bazarliste id="NN" template="card" dynamic="true" query="listeListePublicRessource=membre" champ="bf_titre" ordre="asc"}}

===== J'anime =====
{{bazarliste id="NN" template="card" dynamic="true" query="listeListePublicRessource=animateur" champ="bf_titre" ordre="asc"}}

===== Comprendre e-Sol =====
{{bazarliste id="NN" template="card" dynamic="true" query="listeListePublicRessource=tous" champ="bf_titre" ordre="asc"}}
```

**Compromis à connaître** : dans cette variante, recherche et facettes s'appliqueraient
bloc par bloc, pas à la page entière. La V1 (une seule liste à facettes) garde une
recherche globale ; la V2 retrouve la lecture par situation mais perd la recherche
globale. Recommandation : **commencer par la V1**, la plus simple et la plus robuste,
et ne passer à la V2 que si la lecture par situation manque vraiment à l'usage.
Le filtre « Public » de la V1 rend en un clic le même service que les sections.

### Modèle de contenu : où vit le tutoriel ?

Deux modèles possibles, à trancher avec Lucile :

1. **Fiche-catalogue (recommandé)** : le contenu reste dans des **pages wiki**
   (les 8 fiches forum de la session 4 : `?TutoForumRejoindre`, etc.). La fiche Bazar
   ne porte que les métadonnées, le résumé et le **lien** vers la page. Un clic sur la
   carte ouvre la fiche (en modale avec `entrydisplay="modal"`), qui affiche le lien
   vers la page. Un clic de plus que la démo, mais 100 % natif, et les pages restent
   imprimables et partageables par lien direct, comme prévu en session 4.
2. **Tout-en-fiche** : le contenu complet du tutoriel vit dans la fiche Bazar
   (champ texte long). Un seul objet, pas de clic intermédiaire, mais l'édition de
   longues fiches dans un formulaire est pénible, et cela contredirait l'architecture
   8 pages déjà actée pour la série forum. Déconseillé pour les tutoriels ; acceptable
   pour de futures ressources très courtes.

---

## 4. Ajouter une ressource : le geste de Lucile

1. Ouvrir la page du formulaire Ressource (bouton « Ajouter une ressource », à poser
   sur `?CentreRessources` avec `{{button link="BazaR..." }}` vers la saisie).
2. Remplir : titre, résumé en 1 ou 2 phrases, puis les 6 listes (public, outil, niveau,
   durée, type, statut).
3. Coller le lien de la page wiki qui contient le contenu (ou la créer d'abord).
4. Valider. La carte apparaît immédiatement dans le centre, au bon endroit, filtrable.
5. Rien d'autre : ni la page `?CentreRessources`, ni aucun réglage ne sont à toucher.

Si le contenu lui-même est à écrire (une nouvelle page tutoriel), c'est une page wiki
ordinaire : mêmes gestes que pour toute page e-sol.fr.

---

## 5. Ce qui change par rapport à la démo, dit clairement

| Élément de la démo | En natif |
|---|---|
| Recherche + 4 filtres sur une page | ✅ Reproduit (search + facettes) |
| Alimentation sans toucher au code | ✅ Reproduit, c'est même le cœur du gain |
| Bandeau « Je débute » mis en avant | ✅ Reproduit (texte wiki + boutons) |
| Renvois premiers pas ↔ centre ↔ glossaire | ✅ Reproduit (liens wiki ordinaires) |
| Sections par situation + recherche globale sur la même page | 🟡 L'un ou l'autre (V1 vs V2, voir § 3) |
| Clic sur la carte = ouverture directe du contenu | 🟡 En natif, le clic ouvre la fiche (modale), qui contient le lien |
| Vignettes à icône Font Awesome, dégradés par outil | 🟡 Approché : image facultative par fiche, ou pastille de couleur par valeur de liste (à tester dans le thème) ; sinon cartes sobres |
| Cartes « À venir » grisées et non cliquables | 🟡 Le statut s'affiche (champ visible), mais la fiche reste cliquable et non grisée |
| Lien « en attendant » sur les cartes à venir | 🟡 À écrire en fin de résumé si souhaité |
| Masquage du bandeau pendant une recherche | ❌ Perdu, sans conséquence |

Aucun de ces écarts ne bloque la publication : la V1 native rend le service.

---

## 6. Nécessite Laurent

Rien n'est **bloquant** pour publier le centre en V1. Deux besoins de **confort**,
formulés en besoin (pas en solution), à traiter plus tard si l'usage le justifie :

1. **Qu'un clic sur une carte du centre mène directement au contenu** (sans fiche
   intermédiaire), et que les ressources « à venir » soient visuellement distinctes
   et non cliquables. Aujourd'hui le comportement natif ouvre la fiche Bazar.
2. **Que les cartes du centre reprennent l'apparence de la démo** (vignette colorée
   par outil, badge de niveau, mention de série). Le rendu natif est plus sobre.

Pour mémoire (déjà tracké dans `docs/tutoriels-forum-yeswiki.md`) : la réparation du
certificat de forum.e-sol.fr conditionne la publication de la série forum, donc une
partie du contenu que le centre référence.

---

## 7. Points à valider avec Lucile

1. **Le nom de la page** : réutiliser `?Tutoriels` (continuité des liens existants)
   ou créer `?CentreRessources` (plus juste) avec redirection depuis l'ancienne page.
2. **Les libellés des situations** : « Je débute / Membre actif·ve / Animateur·rice /
   Tout le monde » ; et le mot « ressource » lui-même (vs « tutoriels et guides »).
3. **Les valeurs des listes** (public, outil, niveau, durée) : libellés exacts,
   écriture inclusive, ordre d'affichage.
4. **V1 ou V2** (une liste à facettes vs sections par situation) après essai en réel.
5. **Le modèle de contenu** (fiche-catalogue vs tout-en-fiche, § 3).
6. **Qui amorce** : recopie des 21 fiches de la démo dans le formulaire (proposition :
   Thomas amorce, Lucile relit les résumés).

---

## 8. Checklist de portage

- [ ] Créer les 6 listes Bazar (public, outil, niveau, durée, type, statut)
- [ ] Créer le formulaire Ressource (champs du § 2), noter son numéro `NN`
- [ ] Relever les noms exacts des champs listes (pour `groups` et `query`)
- [ ] Créer `?CentreRessources` avec le corps du § 3 (V1)
- [ ] Poser le bouton « Ajouter une ressource » (visible selon droits d'écriture à décider)
- [ ] Amorcer : recopier les fiches de `src/data/ressources.json` (statut « à venir » compris)
- [ ] Vérifier recherche et facettes sur 3 cas : « forum », public = Je débute, durée = courte
- [ ] Mettre à jour les liens entrants : `?PremiersPas`, `?Glossaire`, menu du site
- [ ] Quand la série forum est publiée (session 4) : vérifier les liens `bf_lien` des 8 fiches
