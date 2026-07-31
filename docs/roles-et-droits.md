# Référentiel des rôles et droits d'e-Sol

> **Statut de ce document : proposition de référence, à valider.**
> Il n'existait au 30 juillet 2026 aucune documentation des droits configurés sur e-sol.fr.
> Ce référentiel a donc été construit par enquête (site en ligne en lecture seule, charte,
> formulaires Bazar, documentation officielle YesWiki, repos de travail), puis complété par
> des propositions argumentées. Il est la source de vérité des diagrammes (session 2), de la
> page « Qu'est-ce qu'une communauté ? » (session 3) et des tutoriels à venir.

**Légende utilisée dans tout le document :**

- **[constaté]** : observé sur e-sol.fr (relevé du 30/07/2026, sauf mention "juin 2026").
- **[doc]** : documenté par la documentation officielle YesWiki (URL en annexe B).
- **[proposition - à valider]** : choix proposé, sans trace existante ; à arbitrer.
- **[à vérifier]** : invisible depuis l'extérieur du site ; à confirmer avec Laurent.

---

## 1. Les cinq niveaux plateforme

Les niveaux sont **cumulatifs** : chaque niveau conserve tout ce que permet le précédent.
Ils décrivent la plateforme YesWiki (e-sol.fr). Le forum Discourse (forum.e-sol.fr) a ses
propres comptes et rôles, signalés à part (voir 4.4 et 4.5).

### 1.1 Visiteur·euse non inscrit·e

- **Définition** : toute personne qui consulte e-sol.fr sans compte.
- **Ce qu'on peut faire** : consulter toutes les pages publiques, l'annuaire et les fiches
  membres (dans leur version publique), les communautés, l'Espace Actions ; lire le forum ;
  s'inscrire. **[constaté]** Ne peut ni éditer, ni commenter (« Se connecter pour commenter »).
- **Comment on y accède** : état par défaut, aucun compte requis.
- **Qui l'attribue** : personne, c'est l'absence de rôle.

### 1.2 Membre inscrit·e

- **Définition** : personne disposant d'un compte e-Sol, créé automatiquement lors de
  l'envoi du formulaire d'inscription (sa fiche annuaire et son compte ne font qu'un).
- **Ce qu'on peut faire** : tout ce que fait un·e visiteur·euse, plus : éditer sa propre
  fiche (une seule fiche par personne **[constaté]**), commenter là où c'est ouvert, créer
  des fiches action, déposer une petite annonce, rejoindre des communautés, proposer la
  création d'une communauté, contribuer aux communs [proposition - à valider].
- **Comment on y accède** : formulaire d'inscription, gratuit et ouvert à toute personne
  intéressée par les sols **[constaté]**, sous les conditions de la charte (accepter la
  charte, fournir des informations de base, soutenir l'AFES, esprit de coopération).
- **Qui l'attribue** : personne (auto-inscription immédiate) **[constaté]**. Une modération
  d'entrée (compte créé seulement après validation de la fiche) est possible nativement
  mais n'est pas activée aujourd'hui [à vérifier].
- **Correspondance charte** : ce niveau correspond au statut « Contributeurs » de la charte.

### 1.3 Membre d'une communauté

- **Définition** : membre inscrit·e rattaché·e à une ou plusieurs communautés (les
  « pièces » de la maison e-Sol).
- **Ce qu'on peut faire** : tout ce que fait un·e inscrit·e, plus : participer aux espaces
  de sa communauté (documents partagés, discussions, sous-pages), et, si sa communauté le
  décide, éditer certaines pages ou accéder à un cercle restreint (voir section 2).
- **Comment on y accède** : selon le régime choisi par chaque communauté : bouton
  « Rejoindre » (accès immédiat) ou demande à l'animateur·rice (accès validé). Les deux
  formules coexistent dans les textes actuels sans arbitrage [proposition - à valider :
  laisser ce choix à chaque communauté, voir section 2].
- **Qui l'attribue** : la communauté elle-même (son animateur·rice). Techniquement, le
  rattachement est aujourd'hui **purement déclaratif** : le champ « communautés » de la
  fiche n'alimente aucun groupe d'utilisateurs (paramètre « Groupes où ajouter
  l'utilisateur » vide) **[constaté]**. Pour donner des droits réels par communauté, il
  faudra des groupes YesWiki (voir 4.6).

### 1.4 Animateur·rice de communauté

- **Définition** : membre qui anime une communauté et en est l'interlocuteur·rice ; la
  charte parle d'« Animateur / coordinateur de communauté ». Une communauté peut avoir
  plusieurs animateur·rices.
- **Ce qu'on peut faire** : tout ce que fait un membre de la communauté, plus : accueillir
  et intégrer les nouveaux membres, valider les adhésions (si régime validé), éditer les
  pages de la communauté, créer et organiser ses sous-pages, décider d'activer ou non le
  cercle restreint, modérer son périmètre (rôle prévu par la charte : veiller au respect
  de la charte, faire remonter au COPIL), animer sa catégorie de forum.
- **Comment on y accède** : en pratique, fondateur·rice de la communauté ou désigné·e par
  elle ; le cadre formel (engagements, durée, critères) reste à écrire (phase 3 annoncée
  dans les contenus existants) [proposition - à valider].
- **Qui l'attribue** : la communauté, avec validation du COPIL lors de la création
  [proposition - à valider ; la charte donne au COPIL l'arbitrage et la cohérence
  d'ensemble]. Techniquement : propriétaire YesWiki des pages de sa communauté, et membre
  d'un groupe dédié si les groupes par communauté sont créés (voir 4.6, 4.10).

### 1.5 Administrateur·rice de la plateforme

- **Définition** : membre du groupe technique `@admins` de YesWiki, garant du
  fonctionnement du site et dernier recours.
- **Ce qu'on peut faire** : tout : gérer les utilisateurs et les groupes, poser les droits
  d'accès (ACL) de toute page, créer et modifier les formulaires Bazar (donc la liste des
  statuts reconnus), éditer ou supprimer toute page, fiche ou commentaire.
- **Comment on y accède / qui l'attribue** : seul un·e admin peut ajouter quelqu'un au
  groupe `@admins` **[doc]**. Proposition : attribution décidée par l'AFES dans le cadre
  du COPIL, liste publique des admins dans le référentiel [proposition - à valider].
- **Attention à l'homonymie** : le statut reconnu « Administrateur AFES » (champ de la
  fiche membre, qui désigne les membres du conseil d'administration de l'association) est
  **distinct** du rôle technique d'administrateur·rice de la plateforme. Deux notions, deux
  mots à garder séparés [proposition - à valider avec Lucile].

**Statut transitoire** : la charte prévoit aussi « Ancien·ne / sortant·e accompagné·e »
(membre qui quitte le réseau). Ce statut ne crée pas de niveau de droits supplémentaire ;
proposition : le traiter comme un état de la fiche (question ouverte : que deviennent la
fiche et le compte au départ ?).

---

## 2. La granularité intra-communauté : un modèle paramétrable

Au sein d'une communauté, trois positions :

| Position | En une phrase |
|---|---|
| **Membre simple** | Participe aux espaces de la communauté. |
| **Membre du cercle restreint** | Accède en plus à des espaces ou droits spécifiques (pages réservées, documents de travail, co-écriture). |
| **Animateur·rice** | Anime, accueille, configure, modère (voir 1.4). |

**Le cercle restreint est un outil à activer, pas une règle.** Chaque communauté décide de
son réglage ; le rôle de la plateforme est de rendre ces choix possibles et lisibles.
Concrètement, chaque communauté arbitre trois curseurs :

| Choix à faire | Options | Réglage YesWiki natif correspondant |
|---|---|---|
| Régime d'adhésion | Ouvert (« Rejoindre » immédiat) ou sur validation (demande à l'animateur·rice) | Groupe alimenté automatiquement ou ajout manuel au groupe après accord (voir 4.6) |
| Cercle restreint | Activé ou non | Groupe supplémentaire `@cercle-nomcommunaute` + pages en lecture/écriture réservées à ce groupe (ACL) |
| Écriture des pages de la communauté | Animateur·rice(s) seulement, ou ouverte au groupe | ACL d'écriture de la page : `@animateurs-nomcommunaute` ou `@nomcommunaute` |

Ces réglages sont des ACL et des groupes natifs : aucun développement n'est nécessaire,
mais la **gestion des groupes est aujourd'hui réservée aux admins de la plateforme** (voir
4.7), donc tout changement de régime passe par un·e admin tant que ce point n'est pas
résolu.

**Motifs déjà existants sur e-sol.fr qui préfigurent ce modèle [constaté] :**

- Le formulaire d'inscription contient des champs de **rôles par communauté**
  (`bf_promosolterrain_roles`, `bf_secteurprive_roles`, `bf_afes_roles`), affichés
  conditionnellement selon les communautés cochées : la différenciation intra-communauté
  est déjà dans le modèle de données.
- La communauté Sols & Arts dispose de **son propre formulaire** « Fiche membre
  Orchestre » : une communauté peut gérer sa propre liste de membres avec un formulaire
  Bazar dédié.
- La communauté **AFES-admins** est décrite « Espace réservé aux administrateurs de
  l'AFES »... mais sa page est en réalité **publique** (aucune ACL posée). C'est le
  contre-exemple fondateur de ce référentiel : un cercle restreint déclaré doit être
  configuré, sinon il n'existe pas.
- Le **forum Discourse** a une catégorie par communauté : un cercle restreint peut aussi
  s'y prolonger (catégorie à accès restreint), côté réglages Discourse.

---

## 3. La matrice droits × niveaux

Niveaux (cumulatifs) : **V** visiteur·euse non inscrit·e · **I** membre inscrit·e ·
**C** membre d'une communauté · **A** animateur·rice de communauté · **P**
administrateur·rice de la plateforme.

✅ oui · 🟡 sous condition (renvoi numéroté) · ❌ non

| Droit | V | I | C | A | P |
|---|---|---|---|---|---|
| Consulter les pages publiques | ✅ | ✅ | ✅ | ✅ | ✅ |
| Consulter l'annuaire | ✅ (1) | ✅ | ✅ | ✅ | ✅ |
| Voir une fiche membre complète | 🟡 (2) | 🟡 (2) | 🟡 (2) | 🟡 (2) | ✅ |
| Accéder au forum (lire) | ✅ (3) | ✅ (3) | ✅ (3) | ✅ (3) | ✅ (3) |
| Poster sur le forum | ❌ | 🟡 (4) | 🟡 (4) | 🟡 (4) | 🟡 (4) |
| Rejoindre une communauté | ❌ | ✅ (5) | ✅ (5) | ✅ | ✅ |
| Valider une adhésion | ❌ | ❌ | ❌ | ✅ (6) | ✅ |
| Créer / éditer une fiche action | ❌ (7) | ✅ (7) | ✅ (7) | ✅ (7) | ✅ |
| Déposer un commun | ❌ | ✅ (8) | ✅ (8) | ✅ (8) | ✅ |
| Éditer la page de la communauté | ❌ | ❌ | 🟡 (9) | ✅ | ✅ |
| Créer une sous-page | ❌ | 🟡 (10) | 🟡 (10) | ✅ | ✅ |
| Modérer | ❌ | ❌ | ❌ | 🟡 (11) | ✅ |
| Écrire à un groupe | ❌ | 🟡 (12) | 🟡 (12) | 🟡 (12) | 🟡 (12) |
| Gérer les statuts reconnus | ❌ | ❌ (13) | ❌ (13) | ❌ (13) | ✅ (13) |
| Créer une communauté | ❌ | 🟡 (14) | 🟡 (14) | 🟡 (14) | ✅ (14) |

**Conditions :**

1. **[constaté]** L'annuaire est aujourd'hui public (302 fiches visibles sans compte le
   30/07/2026), en cohérence avec la mention d'information du formulaire (« vos
   coordonnées partagées seront visibles par tous les visiteurs de la plateforme »).
   Maintenir ou restreindre aux inscrit·es : à re-valider avec Lucile (voir 6.1).
2. « Complète » n'existe que pour les admins et pour soi-même. La fiche publique est
   partielle par construction : certains champs sont déjà restreints par ACL de champ
   **[constaté]** : email lisible par le groupe `@adherents` (et affichage brut réservé au
   propriétaire), communautés cochées lisibles par `@adherents`, rôles par communauté,
   adhésion AFES et consentement lisibles par le propriétaire seul. En revanche téléphone
   et adresse sont publics s'ils sont remplis [à re-valider, voir 6.1]. Chacun·e voit et
   édite toujours sa propre fiche.
3. Forum Discourse : les catégories actuelles sont lisibles sans compte **[constaté juin
   2026]** ; Discourse permet des catégories restreintes, réglées côté forum.
4. Poster exige un **compte forum distinct** du compte plateforme (aucun lien technique
   entre les deux aujourd'hui). La formulation « mêmes identifiants que la plateforme »
   présente dans les contenus existants est inexacte : à corriger (voir 6.1) ou à réaliser
   techniquement (SSO, hors périmètre : voir 6.2).
5. Selon le régime de la communauté (ouvert ou validé, voir section 2). Nombre de
   communautés non limité.
6. Décision de l'animateur·rice (rôle d'accueil prévu par la charte). Exécution technique :
   tant que la gestion des groupes n'est pas déléguée, l'ajout effectif au groupe est fait
   par un·e admin sur demande de l'animateur·rice (voir 4.7).
7. Toute personne inscrite peut créer une fiche action ; chaque fiche est ensuite
   modifiable par son propriétaire (champs en écriture `%` **[constaté]**) et par les
   admins. Le droit de création effectif du formulaire 7 (inscrit·es seulement ou
   visiteurs aussi) est à confirmer [à vérifier].
8. [proposition - à valider] La lecture des communs est libre pour tous ; la contribution
   (dépôt, amélioration) est réservée aux inscrit·es. Aucun formulaire « Commun » n'existe
   encore : à créer (session communs).
9. Si la communauté a choisi d'ouvrir l'écriture de ses pages à son groupe (curseur 3 de
   la section 2).
10. Techniquement possible dès lors qu'on sait éditer (le droit d'écriture par défaut du
    site s'applique aussi à la création de pages) ; par convention, une sous-page de
    communauté (`NomCommunaute-...`) se crée dans le périmètre de sa communauté, en accord
    avec l'animateur·rice. Le réglage par défaut du site est à confirmer [à vérifier].
11. Dans son périmètre (pages et fiches de sa communauté, sa catégorie de forum), et selon
    l'outillage réel (voir 4.12). La modération générale relève des admins ; la charte
    prévoit que « la modération peut intervenir en cas de non-respect de la charte ».
12. Contact individuel : natif (bouton contact d'une fiche, selon les ACL email du
    formulaire). Envoi groupé (« écrire à tous les membres de X ») : **pas de fonction
    native** ; aujourd'hui le canal de groupe est la catégorie de forum de la communauté.
    Besoin réel d'e-mails groupés : hors périmètre, à documenter pour Laurent (voir 6.2).
13. La liste des statuts se gère dans l'éditeur du formulaire 5, réservé aux admins
    **[doc]**. Mais attention : l'**attribution** d'un statut est aujourd'hui
    auto-déclarative (voir section 5), ce qui est incohérent avec la notion de « statut
    reconnu » : à corriger.
14. Tout membre peut **proposer** une communauté ; la **création est validée par le
    comité de pilotage** (règle écrite existante) ; la mise en place technique (page,
    groupe, sous-pages, catégorie forum) est faite par un·e admin avec l'animateur·rice
    pressenti·e. Checklist de création à écrire en session 3.

---

## 4. Faisable en YesWiki natif ? Droit par droit

Grille de lecture : la doctrine du projet impose de préférer la plus petite solution
native (ordre : prototype autonome, puis surcharge de template Bazar, action custom, JS
custom, thème, extension, modification du cœur en dernier recours). Bonne nouvelle : **la
quasi-totalité du modèle proposé se règle au niveau zéro de cette pile** (configuration
native : ACL de pages, droits de formulaires et de champs, groupes), sans développement.
Les exceptions sont listées en fin de section.

Rappel des mécanismes natifs mobilisés (détail et sources en annexe B) :

- **ACL par page** : trois droits par page (lecture, écriture, commentaires), éditables
  par le propriétaire de la page et par les admins. Syntaxe : `*` tout le monde, `+`
  personnes identifiées, `@groupe`, noms d'utilisateurs, `!` négation, `%` propriétaire.
  Défauts du site définis dans `wakka.config.php` (`default_read_acl`,
  `default_write_acl`, `default_comment_acl`), livrés à `*`. **[doc]**
- **Groupes d'utilisateurs** : définis via l'action `{{editgroups}}`, **réservée au groupe
  `@admins`** ; utilisables partout dans les droits via `@nomdugroupe`. **[doc]**
- **Droits d'un formulaire Bazar** : « Peut voir la fiche », « Peut éditer la fiche »,
  droits par défaut des commentaires ; option « une seule fiche par personne » ;
  création de compte à partir de la fiche (« Créer un utilisateur lorsque la fiche est
  validée »), avec ajout automatique à des groupes possible (« Groupes où ajouter
  l'utilisateur », y compris piloté par un champ : `@groupe,bf_champ`). **[doc + constaté]**
- **Droits par champ** : « Peut être lu par » / « Peut être saisi par » sur chaque champ
  (tout le monde, utilisateurs identifiés, propriétaire de la fiche et admins, membres
  d'un groupe). Déjà utilisés en production sur le formulaire 5. **[constaté]**
- **Email** : « Affichage brut de l'email autorisé pour », « Envoi d'email autorisé
  pour », remplacement par un bouton contact. **[constaté sur formulaire 5]**

### 4.1 Consulter les pages publiques
Réglage natif : ACL de lecture par défaut (`*`) et par page. État actuel conforme.
Rien à faire.

### 4.2 Consulter l'annuaire
Réglage natif : ACL de lecture de la page `?Annuaire` + « Peut voir la fiche » du
formulaire 5. Aujourd'hui tout est public **[constaté]**. Restreindre aux inscrit·es, si
souhaité, = passer ces droits à `+` : natif, cinq minutes, mais c'est une décision de
politique d'accès, pas une décision technique (voir 6.1).

### 4.3 Voir une fiche membre complète
Réglage natif : droits **par champ** du formulaire 5, déjà partiellement en place
**[constaté]** (voir condition 2). Le modèle cible « fiche publique partielle, fiche
complète pour les inscrit·es, données sensibles pour soi et les admins » est entièrement
faisable par champ, sans template ni code. Point d'attention : le groupe `@adherents`
utilisé dans les ACL actuelles introduit de fait un niveau « adhérent·e AFES » absent des
5 niveaux du présent référentiel ; à trancher (voir 6.1 et 6.2).

### 4.4 Accéder au forum (lire)
Hors YesWiki : réglages Discourse (catégories publiques ou restreintes). État actuel :
lecture publique **[constaté juin 2026]**.

### 4.5 Poster sur le forum
Hors YesWiki : compte Discourse séparé. Aucun pont technique entre les comptes wiki et
forum aujourd'hui ; le SSO est identifié comme besoin (hors périmètre, voir 6.2).

### 4.6 Rejoindre une communauté
Deux mécaniques natives au choix de chaque communauté :
- **Régime ouvert** : l'appartenance est pilotée par un champ de la fiche (le paramètre
  « Groupes où ajouter l'utilisateur » accepte un nom de champ : cocher la communauté
  ajoute au groupe). Ce paramètre est **vide aujourd'hui** **[constaté]** : le rattachement
  est déclaratif et ne donne aucun droit.
- **Régime validé** : demande (message, formulaire dédié, ou fiche du formulaire propre à
  la communauté comme le fait Sols & Arts), puis ajout au groupe après accord de
  l'animateur·rice.
Dans les deux cas, la création des groupes par communauté est le prérequis (voir 4.7).

### 4.7 Valider une adhésion
Côté décision : l'animateur·rice (natif : rien à régler, c'est un process). Côté
exécution : l'ajout à un groupe passe par `{{editgroups}}`, **réservé aux admins**, et la
documentation officielle ne décrit aucune délégation **[doc]**. Conséquence : soit les
animateur·rices deviennent admins (à éviter : trop de droits), soit un·e admin exécute les
demandes (process actuel proposé), soit il existe un moyen de déléguer la gestion d'un
groupe : **question clef pour Laurent** (besoin : « qu'un·e animateur·rice puisse gérer la
liste des membres de sa communauté sans être admin du site »). Voir 6.2.

### 4.8 Créer / éditer une fiche action
Natif : droits du formulaire 7. État actuel **[constaté]** : champs lisibles par tous,
modifiables par le propriétaire (`%`) ; l'édition d'une fiche est donc réservée à son
auteur·rice et aux admins. Le droit de création (inscrit·es seulement ?) est à confirmer
[à vérifier]. Aucun développement nécessaire.

### 4.9 Déposer un commun
Natif : créer un formulaire Bazar « Commun » (comme il existe « Fiche action »), création
réservée aux identifié·es (`+`), lecture publique, édition propriétaire + admins,
éventuellement un champ « contributeur·rices » ouvert. N'existe pas encore : proposition
pour la session communs. Cycle de vie (proposition, brouillon, révision, actif, archivé)
gérable par un champ « statut » comme le fait déjà le formulaire 7 (Brouillon / Publiée /
Terminée) **[constaté]**.

### 4.10 Éditer la page de la communauté
Natif : ACL d'écriture de la page, posées par le propriétaire de la page ou un·e admin
**[doc]**. Modèle proposé : l'animateur·rice est propriétaire des pages de sa communauté
(via « Appropriation » si besoin) et règle l'écriture sur `@animateurs-nomcommunaute` ou
`@nomcommunaute` selon son curseur (section 2).

### 4.11 Créer une sous-page
Natif : la création d'une page suit le droit d'écriture par défaut du site
(`default_write_acl`). À trancher : défaut à `+` (toute personne identifiée peut créer,
gouvernance par convention de nommage `NomCommunaute-...`) ou plus restrictif. Valeur
actuelle du site : à confirmer [à vérifier].

### 4.12 Modérer
Natif partiellement : les admins peuvent tout éditer et supprimer (pages, fiches,
commentaires) ; un·e animateur·rice ne peut modérer que ce sur quoi il·elle a des droits
d'écriture (ses pages) ou de propriété. Il n'existe **pas de rôle « modérateur »
intermédiaire natif** : la modération fine des commentaires et fiches d'autrui reste aux
admins. Pour le forum : outils de modération Discourse, indépendants. La charte fournit la
base de légitimité (« la modération peut intervenir en cas de non-respect de la charte »).

### 4.13 Écrire à un groupe
Natif : contact individuel par fiche (ACL email + bouton contact) **[constaté]**.
**Pas d'envoi groupé natif** : l'extension Contact (hors cœur, handler `/mail` réservé aux
admins) couvre l'envoi de pages par mail, pas un publipostage par groupe **[doc]**. Canal
de groupe actuel : la catégorie de forum de la communauté. Le besoin « notifications et
e-mails groupés » est acté hors périmètre : à documenter pour Laurent (6.2).

### 4.14 Gérer les statuts reconnus
Natif : la liste des options du champ `statutreconnu` s'édite dans l'éditeur du formulaire
5, réservé aux admins **[doc]**. Voir section 5 pour le problème d'attribution.

### 4.15 Créer une communauté
Natif mais multi-étapes manuel : page de communauté + sous-pages, groupe(s), ACL,
éventuel formulaire dédié, catégorie de forum. Validation préalable par le COPIL (règle
écrite existante). À outiller par une checklist (session 3) plutôt que par du
développement.

### Ce qui ne tient PAS en natif (récapitulatif)

| Besoin | Pourquoi ça coince | Où c'est traité |
|---|---|---|
| Déléguer la gestion d'un groupe à un·e animateur·rice | `{{editgroups}}` réservé `@admins`, pas de délégation documentée | 6.2 (Laurent) |
| E-mails groupés / notifications | Aucune fonction native ; extension Contact insuffisante | 6.2 (Laurent, hors périmètre acté) |
| SSO wiki ↔ forum | Deux systèmes de comptes indépendants | 6.2 (Laurent, hors périmètre acté) |
| Messagerie interne membre à membre | Rien de natif ; le forum (messages directs Discourse) en tient lieu | Hors périmètre acté |

---

## 5. Les statuts reconnus

### 5.1 La liste actuelle [constaté, formulaire 5, 30/07/2026]

Champ « Statut(s) reconnu(s) » (identifiant technique `statutreconnu`), cases à cocher :

| Identifiant technique | Libellé affiché |
|---|---|
| `RCP` | Pédologue reconnu compétent par l'AFES |
| `IPRSOLS` | Référent qualité des sols forestiers |
| `FRESQUE` | Animateur Pro de la Fresque du Sol |
| `referent_promosolsterrain` | Référent PromoSolsTerrain |
| `administrateur_afes` | Administrateur AFES |
| `inscrit_sur_la_liste_des_experts_de_justice` | Inscrit sur la liste des experts de justice |

Le champ est **lisible par tous** (il alimente le filtre « Statut(s) Reconnu(s) » de
l'annuaire public) et son écriture n'est **pas restreinte au niveau du champ** : chaque
membre coche donc ses statuts sur sa propre fiche. **Les statuts « reconnus » sont
aujourd'hui auto-déclarés**, sans étape de reconnaissance. C'est le principal écart entre
le mot et la mécanique, à corriger : en natif, il suffit de passer « Peut être saisi
par » du champ à « admins » (ou à un groupe d'attestation) pour que seuls les statuts
validés apparaissent [proposition - à valider ; process d'attribution à définir avec
Lucile : qui atteste quoi, sur quel critère, par exemple l'AFES pour « RCP »].

### 5.2 Les deux ajouts demandés en réunion

À ajouter à la liste (intitulés exacts **à confirmer**, aucun des deux n'a été retrouvé
par écrit ailleurs que dans le compte-rendu de réunion) :

- « **porteur de projet SRP Sol** » : cohérent avec la communauté « Sciences et
  recherches participatives » (SRP), qui se décrit comme un réseau de porteurs de projet.
  Intitulé à caler sur le modèle existant (« Référent PromoSolsTerrain ») et sur le nom
  exact de la communauté [à confirmer].
- « **référent Soléar** » : le motif « Référent X » existe déjà dans la liste, mais
  « Soléar » n'apparaît nulle part (ni sur le site, ni dans les repos, ni dans les
  dossiers de travail). Orthographe, nature (outil ? programme ? partenariat ?) et
  intitulé complet à confirmer avant ajout [à confirmer].

### 5.3 Trois notions à ne pas confondre (piège de nommage)

| Notion | Champ actuel | Nature |
|---|---|---|
| Fonction professionnelle | `bf_fonction` (texte libre) | Déclaratif, non contrôlé (« Chercheur », « Consultante »...) |
| Statut reconnu | `statutreconnu` (liste fermée) | Référentiel réseau, devrait être attesté |
| Rôle dans une communauté | `bf_promosolterrain_roles`, `bf_secteurprive_roles`, `bf_afes_roles` (listes fermées conditionnelles) | Granularité interne à chaque communauté |

Toute évolution du formulaire d'inscription doit préserver cette distinction (et les
futures fixtures de la démo devraient renommer leur champ `role` en conséquence).

---

## 6. Points à trancher

### 6.1 À valider avec Lucile (contenu, vocabulaire, politique d'accès)

1. **Vocabulaire du rôle d'animation** : « animateur·rice » (contenus démo, présent
   référentiel), « référent·e » (autres pages démo), « Animateur / coordinateur »
   (charte), « équipe d'animation » (FAQ). Choisir un terme et s'y tenir partout.
2. **Visibilité de l'annuaire et des fiches** : confirmer (ou amender) la politique
   actuelle du tout-public : annuaire visible sans compte, téléphone et adresse publics
   si remplis, localisation sur carte publique. Alternative naturelle : fiche publique
   minimale (nom, structure, spécialités) et détail pour les inscrit·es ; techniquement
   trivial (4.3), mais c'est un choix de politique et d'image du réseau.
3. **Régime d'adhésion par défaut des communautés** : ouvert ou validé ? (chaque
   communauté peut ensuite dévier, section 2). Harmoniser les textes existants qui disent
   les deux.
4. **Place de l'adhésion AFES** : la charte demande de « soutenir l'AFES », le formulaire
   propose « Non, accès limité », et les ACL actuelles réservent déjà des champs au groupe
   `@adherents`, alors que les contenus d'accueil promettent un accès « gratuit et
   indépendant de l'adhésion ». Clarifier ce que change (ou non) l'adhésion AFES, et si le
   niveau « adhérent·e » doit apparaître dans le référentiel.
5. **Statuts reconnus** : valider le principe « attribution attestée » (5.1), le process
   (qui atteste quoi), les intitulés exacts des deux nouveaux statuts (5.2), et le devenir
   du statut transitoire « Ancien·ne / sortant·e accompagné·e » (1.5).
6. **Forum** : corriger la formulation « mêmes identifiants que la plateforme » dans les
   contenus (tant que le SSO n'existe pas).
7. **Cercle restreint** : valider le principe paramétrable (section 2) et le vocabulaire
   (« cercle restreint » vs « espace réservé »).

### 6.2 À vérifier avec Laurent (faisabilité et configuration)

Formulés en besoin, conformément à la convention du projet ; l'état des lieux détaillé du
30/07/2026 est en annexe A.

1. **Inventaire de l'existant** : quels groupes existent (`@admins`, `@adherents`,
   autres ?), qui en est membre, quelles ACL sont posées et où ; valeurs des droits par
   défaut du site (`default_read_acl`, `default_write_acl`, `default_comment_acl`) ;
   droits de création de fiches des formulaires 5 et 7.
2. **Besoin : gestion déléguée des membres d'une communauté.** Qu'un·e animateur·rice
   puisse tenir à jour la liste (le groupe) de sa communauté sans être admin du site.
   Existe-t-il un mécanisme (natif, extension, à développer) ?
3. **Besoin : que cocher une communauté donne (ou non) l'appartenance réelle.** Le
   paramètre « Groupes où ajouter l'utilisateur » du formulaire 5 est vide : confirmer si
   c'est un choix ou un reste à faire, et s'il faut le brancher sur `bf_communautes`.
4. **Confirmer la sémantique de `%`** dans les ACL de champ (propriétaire de la fiche,
   d'après les libellés de l'interface) et l'absence de modération d'entrée à
   l'inscription (compte créé immédiatement ?).
5. **Besoin : poser les ACL manquantes sur les espaces déclarés réservés**, à commencer
   par `?AFES-admins` (aujourd'hui public, avec PV de CA et liens de visioconférence
   accessibles).
6. **Besoin : écrire à un groupe** (e-mails groupés, notifications) : hors périmètre
   acté, à instruire (extension ? liste de diffusion externe branchée sur les fiches ?).
7. **Besoin : un seul compte pour le wiki et le forum** (SSO) : hors périmètre acté, à
   instruire.
8. **Sécurité connexe** relevée pendant l'enquête : certificat TLS de forum.e-sol.fr
   expiré (connexions refusées le 30/07/2026) ; formulaire d'inscription sans captcha
   visible (l'antispam côté serveur est-il actif ?).

---

## Annexe A : état des lieux relevé (lecture seule)

Relevés du 30/07/2026 sauf mention contraire. Aucune connexion, aucune écriture.

| Constat | Détail |
|---|---|
| Annuaire public | 302 fiches, filtres Spécialité(s) / Communauté(s) / Statut(s) Reconnu(s), vues annuaire / carte / trombinoscope ; commentaires réservés aux connecté·es |
| Inscription | Formulaire 5 ouvert aux visiteurs, création de compte automatique (champ `utilisateur_wikini`, email `bf_mail`), une fiche par personne (`bn_only_one_entry = Y`), pas de captcha visible |
| ACL par champ (formulaire 5) | `bf_mail` : lecture `@adherents`, affichage brut `%` ; `bf_communautes` : lecture `@adherents` ; `bf_promosolterrain_roles`, `bf_secteurprive_roles`, `bf_afes_roles`, `bf_adhesion_afes`, `bf_rgpd` : lecture `%` ; tout le reste (dont téléphone, adresse, `statutreconnu`) : lecture `*` |
| Groupes | `@adherents` référencé par les ACL ci-dessus ; « Groupes où ajouter l'utilisateur » : vide (le champ communautés n'alimente aucun groupe) |
| Formulaire 7 (Fiche action) | Lecture `*` partout ; écriture `%` sur les champs de contenu ; statuts de fiche Brouillon / Publiée / Terminée ; pas d'unicité |
| AFES-admins | Page publique malgré la description « Espace réservé aux administrateurs » (PV de CA, liens visio accessibles sans compte) |
| Charte en ligne | Plan : Préambule et valeurs / Adhésion / Coordination, gouvernance et rôles de pilotage / Droits, obligations et limites d'usage / Création et valorisation des communs / Révision. Statuts : Contributeurs ; Animateur / coordinateur de communauté ; Ancien·ne / sortant·e accompagné·e. Principes : transparence et responsabilité, création de communs, évolutivité, robustesse. Licence CC BY-SA |
| Forum | Discourse (forum.e-sol.fr), catégories par communauté lisibles sans compte (juin 2026) ; comptes distincts du wiki ; certificat TLS expiré au 30/07/2026 |
| Version | YesWiki 4.6.6 (juin 2026), thème Margot |

## Annexe B : sources

**Site e-sol.fr (lecture seule, GET uniquement)** : `?api/forms/5`, `?api/forms/7`,
`?Charte/raw`, `?Annuaire`, `?AFES-admins`, `?FormulaireInscription`, `?ListeCommunautes`
(relevés 30/07/2026) ; captures du 12/06/2026 (annuaire, formulaires, forum).

**Documentation YesWiki** :
- Groupes d'utilisateurs (action `{{editgroups}}`, réservée `@admins`, syntaxe
  `@nomdugroupe`) : https://yeswiki.net/archive/?DocumentationGroupes=
- Droits d'accès des pages (lecture / écriture / commentaires, propriétaire,
  « éditer permissions », « Appropriation », syntaxe) :
  https://yeswiki.net/wakka.php?wiki=CoursUtilisationYesWiki et
  https://yeswiki.net/?GererLesDroitsLectureEcriture=
- Valeurs par défaut (`default_read_acl`, `default_write_acl`, `default_comment_acl`
  dans `wakka.config.php`) : https://github.com/YesWiki/yeswiki (branche doryphore)
- Une fiche par personne, « l'utilisateur ne voit que sa fiche », création de compte par
  fiche : https://forum.yeswiki.net/t/comment-associer-une-fiche-par-user/2996
- Extension Contact (envoi de pages par mail, `/mail` réservé admins) :
  https://yeswiki.net/archive/?DocumentationContact=
- Libellés de l'éditeur de formulaires (« Peut être lu par », « Peut être saisi par »,
  « Créer un utilisateur lorsque la fiche est validée », « Groupes où ajouter
  l'utilisateur »...) : bundle de traduction YesWiki 4.6.6 chargé par e-sol.fr.

**Repos de travail** : `e-sol-demo` (brief docs/prompts-sessions.md, gouvernance
diagram-gouvernance.md, contenus premiers-pas et glossaire) ; `afes-yeswiki-collab`
(doctrine docs/yeswiki-regles-techniques.md, scrapes du site).

---

*Document établi le 30 juillet 2026 (session 1 du jeu de prompts). Toute évolution des
droits réels du site doit être répercutée ici en premier : ce fichier est la source.*
