# Portage YesWiki : Série de tutoriels forum (Discourse)

Produit de la session 4 (plan du 29/07/2026). Huit fiches courtes, une par geste, à porter
sur [e-sol.fr](https://e-sol.fr) : une page d'entrée `?TutosForum` et huit pages de fiches.
À relire et adapter avec **Lucile** avant publication.

> ⚠️ **BLOQUANT AVANT TOUTE PUBLICATION : le forum est aujourd'hui inaccessible.**
> Le certificat de sécurité de `forum.e-sol.fr` a expiré le **19/07/2026** (Let's Encrypt,
> renouvellement automatique en échec). Depuis cette date, tout navigateur affiche un
> avertissement de sécurité au lieu du forum ; certains antivirus (constaté avec
> Bitdefender) bloquent carrément la page. Publier des tutoriels qui envoient les membres
> vers un site bloqué serait contre-productif : **faire réparer le certificat d'abord**
> (voir « Nécessite Laurent »).

---

## État des lieux du forum réel (relevé du 31/07/2026)

Relevé effectué en lecture seule, sans compte, via l'interface publique de données de
Discourse (le certificat expiré empêchait la navigation classique). Rien n'a été créé,
modifié ni publié.

**L'infrastructure** : Discourse version `2026.4.0-latest`, interface en français,
connexion par compte local (aucun bouton « se connecter avec Google » ou autre).
**L'activité** : 48 comptes, 52 sujets, 113 messages. Lecture publique sans compte.

**La structure réelle des catégories** :

| Catégorie | Sujets | Remarques |
|---|---|---|
| Général | 2 | Contient le sujet épinglé « Bienvenue sur Forum e-Sol ! » |
| Commentaires sur le site | 4 | Retours sur la plateforme et le forum |
| Communautés e-Sol | 3 | Se présente comme le regroupement des communautés, mais voir écart n° 2 |
| Charte & fonctionnement d'e-Sol | 0 | Vide |
| Questions Scientifiques | 2 | Questions ouvertes sur les sols |
| Animateurs Fresque du Sol | 1 | Espace de la communauté Fresque du Sol |
| Sols Forestiers (IPRSol) | 5 | Sous-catégorie : « Biodiversité des sols forestiers » (8 sujets, la plus active) |
| PromoSolsTerrain | 5 | Sous-catégorie : « 2026 - Pédologie en contexte volcanique auvergnat » |
| SRP Sols (Sciences et Recherches Participatives) | 0 | Vide |
| AFES - Photothèque | 0 | Vide |
| Biofunctool | 0 | Sous-catégories : « Général » et « Retour expériences » |
| Sans catégorie | | Catégorie technique par défaut de Discourse |

**Les étiquettes** : une seule existe (« techniques »), utilisée une fois. Le système est
en place mais pas investi.

**Les comptes** : le compte forum est **distinct** du compte e-sol.fr. Aucun lien
technique entre les deux (constat déjà acté dans `docs/roles-et-droits.md`, section 4.5).

### Écarts entre l'organisation actuelle et ce que les tutoriels décrivent

1. **Forum inaccessible** (certificat expiré depuis le 19/07). Écart le plus grave :
   aucun tutoriel ne compensera un site auquel on ne peut pas accéder.
2. **« Communautés e-Sol » ne regroupe pas les communautés.** Sa description annonce
   « regrouper les communautés thématiques », mais les espaces de communautés
   (Animateurs Fresque du Sol, Sols Forestiers, PromoSolsTerrain, SRP Sols, Photothèque,
   Biofunctool) sont des catégories de premier niveau posées à côté. Deux options :
   en faire des sous-catégories de « Communautés e-Sol », ou reformuler la description.
   Décision à prendre avec Lucile, geste d'administration forum ensuite.
3. **6 communautés sur 12 seulement ont un espace forum.** Le référentiel des rôles
   annonce « une catégorie par communauté » : à harmoniser (créer les catégories
   manquantes, ou assumer que seules les communautés qui le demandent en ont une).
4. **Deux catégories s'appellent « Général »** : celle de la racine et une sous-catégorie
   de Biofunctool. Source de confusion pour un débutant (« poste dans Général » est
   ambigu). Renommer l'une des deux serait sage.
5. **Catégories vides** (Charte & fonctionnement, SRP Sols, Photothèque, Biofunctool) :
   un nouveau membre qui y entre ne voit rien. Chaque catégorie mériterait au moins un
   sujet d'accueil épinglé (voir fiche H, geste n° 2).
6. **Étiquettes à l'abandon** : une seule étiquette pour tout le forum. La fiche B les
   présente donc brièvement, sans en faire un pilier. Si une politique d'étiquetage est
   souhaitée (par exemple : type de sujet = question / annonce / ressource), elle reste
   à définir.
7. **« Mêmes identifiants que la plateforme » est inexact.** La page Premiers pas
   (étape 3) et le mail de bienvenue éventuel doivent être corrigés : tant que les
   comptes ne sont pas reliés, on crée un compte forum séparé. Snippet de correction
   fourni dans les notes de portage de la fiche A.
8. **Intitulés wiki / forum non alignés** : « Sols Forestiers (IPRSol) » mélange le nom
   de la communauté et un sigle, « AFES - Photothèque » ne reprend pas l'intitulé wiki
   de la communauté. À trancher avec Lucile (vocabulaire), puis renommage côté forum.

---

## Architecture proposée des pages wiki

Une page d'entrée et huit fiches, chacune courte et autonome, chaînées par un
« Et après ? » :

```
?TutosForum (page d'entrée de la série)
 ├── A. ?TutoForumRejoindre      Rejoindre le forum et se connecter
 ├── B. ?TutoForumOrganisation   Comprendre l'organisation
 ├── C. ?TutoForumSuivre         Suivre une catégorie
 ├── D. ?TutoForumPoster         Poster un nouveau sujet
 ├── E. ?TutoForumRepondre       Répondre, citer, mentionner
 ├── F. ?TutoForumMessagePrive   Envoyer un message direct
 ├── G. ?TutoForumNotifications  Régler notifications et résumé e-mail
 └── H. ?TutoForumAnimer         Spécial animateur·rice
```

Alternative si huit pages paraissent trop lourdes à maintenir : une seule page
`?TutosForum` avec les huit fiches en sections et une ancre par fiche. La version
huit pages est recommandée : chaque fiche reste courte, imprimable et partageable par
un lien direct (« regarde la fiche Répondre »).

Convention d'écriture retenue : vouvoiement, une action par étape, impératif,
vocabulaire expliqué à la première occurrence. Les personnes citées en exemple sont
fictives (distribution officielle des guides, ici Cécile Chanteloup).

---

## Page wiki : `?TutosForum`

### Titre proposé
**Le forum e-Sol, pas à pas**

### Corps de la page (Markdown / YesWiki)

```markdown
Le [[https://forum.e-sol.fr/ forum]] est le hall de la maison e-Sol : l'endroit où l'on
se croise entre communautés, où l'on pose ses questions et où les conversations restent
lisibles par tou·tes, contrairement aux e-mails qui s'égarent.

Huit fiches courtes, à prendre dans l'ordre ou à la carte. Chacune se termine par la
suivante : suivez le fil.

**Découvrir**
- [[TutoForumRejoindre A. Rejoindre le forum et se connecter]] · 5 min
- [[TutoForumOrganisation B. Comprendre l'organisation du forum]] · 5 min
- [[TutoForumSuivre C. Suivre une catégorie qui m'intéresse]] · 3 min

**Participer**
- [[TutoForumPoster D. Poster un nouveau sujet]] · 5 min
- [[TutoForumRepondre E. Répondre, citer, mentionner]] · 5 min
- [[TutoForumMessagePrive F. Envoyer un message direct]] · 3 min

**S'installer confortablement**
- [[TutoForumNotifications G. Régler mes notifications et mon résumé par e-mail]] · 5 min

**Animer**
- [[TutoForumAnimer H. Animer sa catégorie (fiche animateur·rice)]] · 10 min

> Première visite sur la plateforme ? Commencez par [[PremiersPas les premiers pas]],
> le forum y est la troisième étape.
```

### Notes de portage `?TutosForum`

- Créer cette page en dernier, une fois les huit fiches publiées (sinon liens rouges).
- Lier depuis `?PremiersPas` (étape 3), depuis `?Tutoriels` et depuis le futur centre
  de ressources (session 5).

---

## Fiche A. Page wiki : `?TutoForumRejoindre`

### Titre proposé
**Rejoindre le forum et se connecter**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : créer votre compte sur le forum et savoir vous reconnecter ensuite.
**Durée** : 5 minutes. **Prérequis** : une adresse e-mail. Rien d'autre.

> **Bon à savoir** : le forum a son propre compte, distinct de votre compte e-sol.fr.
> Même si vous êtes déjà inscrit·e sur la plateforme, il faut créer un compte forum
> la première fois. C'est une limite connue, qui pourrait évoluer.

{{attach file="forum-a-accueil.png" desc="La page d'accueil du forum, avec les boutons S'inscrire et Se connecter" class="center"}}

### Créer votre compte

1. Ouvrez [[https://forum.e-sol.fr/ forum.e-sol.fr]] dans votre navigateur.
2. Cliquez sur **S'inscrire**, en haut à droite.
3. Renseignez votre **adresse e-mail**.
4. Choisissez votre **nom d'utilisateur** : court, sans espaces, reconnaissable
   (par exemple `CecileChanteloup`). C'est le nom que les autres verront et
   utiliseront pour s'adresser à vous.
5. Renseignez votre **nom** complet, puis choisissez un **mot de passe**.
6. Cliquez sur le bouton de création du compte.
7. Ouvrez votre boîte mail, puis cliquez sur le **lien de confirmation** reçu
   (regardez dans les indésirables s'il n'arrive pas).

### Vous reconnecter plus tard

1. Ouvrez [[https://forum.e-sol.fr/ forum.e-sol.fr]].
2. Cliquez sur **Se connecter**, en haut à droite.
3. Saisissez votre nom d'utilisateur (ou votre e-mail) et votre mot de passe.

**Astuce** : une fois connecté·e, lisez le sujet épinglé
[[https://forum.e-sol.fr/t/bienvenue-sur-forum-e-sol/5 « Bienvenue sur Forum e-Sol ! »]]
et présentez-vous en quelques lignes : qui vous êtes, ce qui vous amène. C'est la
meilleure première contribution possible.

**Et après ?** Repérez-vous dans les lieux : [[TutoForumOrganisation B. Comprendre l'organisation du forum]].
```

### Notes de portage fiche A

- **Captures à téléverser** : `forum-a-accueil.png`, `forum-a-inscription.png`
  (formulaire de création), `forum-a-connexion.png` (formulaire de connexion).
  Aucune n'a pu être produite tant que le certificat est expiré : voir la section
  « Captures d'écran » en fin de document.
- **Libellés à confirmer à l'écran** une fois l'accès rétabli : « S'inscrire »,
  « Se connecter », intitulé exact du bouton de création de compte (« Créer votre
  compte » attendu). L'inscription est réputée ouverte (le tutoriel existant
  « s'inscrire au forum » le confirme) ; revérifier qu'aucune approbation manuelle
  n'a été activée depuis.
- **Correction à faire ailleurs (écart n° 7)** : dans `?PremiersPas`, étape 3,
  remplacer « Je rejoins le forum (mêmes identifiants que la plateforme) » par :
  « Je rejoins le forum (compte distinct de la plateforme : créez-le en 2 minutes,
  voir [[TutoForumRejoindre la fiche]]) ».

---

## Fiche B. Page wiki : `?TutoForumOrganisation`

### Titre proposé
**Comprendre l'organisation : catégories, sujets, réponses, étiquettes**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : savoir ce qu'est une catégorie, un sujet, une réponse, une étiquette,
et ne plus vous perdre. **Durée** : 5 minutes. **Prérequis** : aucun, tout se
visite sans compte.

Le forum est rangé comme une maison :

- une **catégorie** est une salle, consacrée à un thème (une communauté, les questions
  scientifiques, les retours sur le site…) ;
- une **sous-catégorie** est un coin de cette salle, pour un chantier précis ;
- un **sujet** est une conversation : quelqu'un l'ouvre avec un premier message,
  les autres y répondent à la suite ;
- une **réponse** est un message ajouté à un sujet existant ;
- une **étiquette** est un mot-clef que l'on peut accrocher à un sujet pour le
  retrouver (encore peu utilisées sur notre forum, ne vous en souciez pas au début).

### Visite guidée

1. Ouvrez [[https://forum.e-sol.fr/ forum.e-sol.fr]] : la page d'accueil liste les
   sujets récents, toutes catégories confondues.
2. Cliquez sur **Catégories** (bandeau de navigation) pour voir toutes les salles.
3. Parcourez la liste : chaque catégorie affiche sa description et ses derniers sujets.
4. Entrez dans **Sols Forestiers (IPRSol)**, une des plus actives.
5. Remarquez sa sous-catégorie **Biodiversité des sols forestiers**.
6. Ouvrez un sujet et observez : le **titre** en haut, la catégorie juste dessous,
   puis les messages du plus ancien au plus récent.
7. Cliquez sur le logo e-Sol (en haut à gauche) pour revenir à l'accueil. Réflexe
   à retenir : le logo ramène toujours au point de départ.

{{attach file="forum-b-categories.png" desc="La page Catégories : chaque ligne est une salle du forum" class="center"}}

**Astuce** : la loupe (en haut à droite) cherche dans tout le forum. Avant d'ouvrir
un sujet, cherchez si la question a déjà été posée.

**Et après ?** Choisissez votre salle préférée :
[[TutoForumSuivre C. Suivre une catégorie qui m'intéresse]].
```

### Notes de portage fiche B

- **Captures à téléverser** : `forum-b-categories.png` (page Catégories),
  `forum-b-sujet.png` (un sujet ouvert, identités floutées).
- Le tableau des catégories réelles figure en tête de ce document : si la
  réorganisation (écart n° 2) a lieu avant publication, adapter l'étape 4-5 à la
  nouvelle arborescence.
- Terme à trancher avec Lucile : « étiquette » (traduction Discourse) ou « mot-clef ».
  La fiche emploie « étiquette » qui est le libellé affiché par le forum.

---

## Fiche C. Page wiki : `?TutoForumSuivre`

### Titre proposé
**Suivre une catégorie qui m'intéresse**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : être prévenu·e de ce qui se passe dans les salles qui comptent pour
vous, sans surveiller le forum tous les jours. **Durée** : 3 minutes.
**Prérequis** : avoir un compte ([[TutoForumRejoindre fiche A]]) et être connecté·e.

1. Ouvrez la catégorie qui vous intéresse, par exemple celle de votre communauté.
2. Repérez la **cloche** à droite, au niveau du titre de la catégorie.
3. Cliquez dessus : une liste de niveaux d'attention s'ouvre.
4. Choisissez votre niveau :
   - **Surveillé** : vous êtes averti·e de chaque nouveau sujet et de chaque réponse.
     Pour la ou les catégories qui comptent vraiment pour vous.
   - **Suivi** : les nouveaux sujets sont mis en avant, sans notification à chaque
     réponse. Bon réglage par défaut pour votre communauté.
   - **Normal** : vous n'êtes averti·e que si quelqu'un s'adresse à vous.
   - **Silencieux** : la catégorie disparaît de vos listes. Pour ce qui ne vous
     concerne pas du tout.
5. C'est tout : le réglage s'applique immédiatement, il n'y a rien à enregistrer.

**Astuce** : commencez modeste (« Suivi » sur une ou deux catégories). Vous pourrez
toujours monter d'un cran si vous voulez ne rien manquer, ou redescendre si cela
fait trop de notifications.

**Et après ?** Lancez votre première conversation :
[[TutoForumPoster D. Poster un nouveau sujet]].
```

### Notes de portage fiche C

- **Captures à téléverser** : `forum-c-categorie.png` (une page de catégorie),
  `forum-c-cloche.png` (le menu de la cloche ouvert, nécessite un compte connecté).
- **Libellés à confirmer à l'écran** : « Surveillé », « Suivi », « Normal »,
  « Silencieux » (traductions standard de Discourse en français ; il existe aussi
  « Surveiller les premiers messages », volontairement omis pour rester simple).

---

## Fiche D. Page wiki : `?TutoForumPoster`

### Titre proposé
**Poster un nouveau sujet : où, et comment le titrer**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : ouvrir une conversation au bon endroit, avec un titre qui donne envie
de répondre. **Durée** : 5 minutes. **Prérequis** : être connecté·e
([[TutoForumRejoindre fiche A]]).

### Choisir la salle avant de parler

- Question ou discussion liée à **votre communauté** : postez dans sa catégorie.
- **Question scientifique** ouverte à tou·tes : catégorie *Questions Scientifiques*.
- Remarque sur **le site ou le forum** : catégorie *Commentaires sur le site*.
- Rien de tout cela : catégorie *Général*.

En cas de doute, ne vous bloquez pas : postez dans *Général*, un sujet peut être
déplacé ensuite sans rien perdre.

### Ouvrir le sujet

1. Cliquez sur **Nouveau sujet** (bouton en haut à droite des listes de sujets).
2. Écrivez le **titre** : résumez votre question ou votre proposition en une phrase.
   - Plutôt « Quel protocole simple pour un inventaire de vers de terre avec des
     scolaires ? » que « Besoin d'aide ».
   - Plutôt « Retour sur la formation tarière d'août : ce qui a marché » que
     « Formation ».
3. Vérifiez la **catégorie** proposée sous le titre, changez-la si besoin.
4. Écrivez votre message : une idée par sujet, des paragraphes courts, et terminez
   par une question si vous attendez des réponses.
5. Cliquez sur **Créer le sujet**.

**Astuce** : si vous quittez la page en cours de route, votre brouillon est conservé
automatiquement ; vous le retrouverez en recliquant sur Nouveau sujet.

**Et après ?** Faites vivre les conversations des autres :
[[TutoForumRepondre E. Répondre, citer, mentionner]].
```

### Notes de portage fiche D

- **Capture à téléverser** : `forum-d-nouveau-sujet.png` (la fenêtre de rédaction,
  nécessite un compte connecté).
- **Libellés à confirmer à l'écran** : « Nouveau sujet », « Créer le sujet »
  (le bouton final peut s'intituler « Créer un sujet » selon la version).
- Les exemples de titres sont inventés mais calqués sur l'activité réelle
  (webinaires, formations de terrain, protocoles participatifs). Adapter librement.

---

## Fiche E. Page wiki : `?TutoForumRepondre`

### Titre proposé
**Répondre à un sujet, citer, mentionner quelqu'un**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : répondre au bon endroit, citer un passage précis, et attirer
l'attention de la bonne personne. **Durée** : 5 minutes. **Prérequis** : être
connecté·e ([[TutoForumRejoindre fiche A]]).

### Répondre

1. Ouvrez le sujet, lisez-le jusqu'au bout (la réponse attendue y est peut-être déjà).
2. Cliquez sur **Répondre** : celui en bas du sujet répond à la conversation ;
   celui sous un message précis répond à ce message.
3. Écrivez, puis cliquez sur **Répondre** dans la fenêtre de rédaction.

### Citer un passage

1. Dans un message existant, **sélectionnez à la souris** le passage qui vous
   intéresse.
2. Un petit bouton **Citation** apparaît au-dessus de la sélection : cliquez dessus.
3. La fenêtre de rédaction s'ouvre avec le passage cité ; écrivez votre réponse
   en dessous. La personne citée est automatiquement prévenue.

### Mentionner quelqu'un

1. Dans votre message, tapez le caractère **@**.
2. Commencez à taper le nom : une liste apparaît, par exemple `@CecileChanteloup`.
3. Choisissez la bonne personne : elle recevra une notification.

**Astuce** : mentionnez avec parcimonie. Une mention est un petit coup de coude ;
trois mentions dans un message, c'est trois personnes dérangées.

**Et après ?** Pour les échanges qui ne regardent que vous deux :
[[TutoForumMessagePrive F. Envoyer un message direct]].
```

### Notes de portage fiche E

- **Captures à téléverser** : `forum-e-repondre.png` (les deux boutons Répondre),
  `forum-e-citation.png` (le bouton Citation sur une sélection). Compte requis.
- **Libellés à confirmer à l'écran** : « Répondre », « Citation » (le bouton
  contextuel peut s'intituler « Citer » selon la version).
- La personne mentionnée en exemple (Cécile Chanteloup) est fictive, conformément
  à la règle des livrables ; ne pas la remplacer par un vrai compte.

---

## Fiche F. Page wiki : `?TutoForumMessagePrive`

### Titre proposé
**Envoyer un message direct**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : écrire en privé à un·e membre quand la conversation publique n'est
pas le bon canal. **Durée** : 3 minutes. **Prérequis** : être connecté·e
([[TutoForumRejoindre fiche A]]).

**D'abord, le bon réflexe** : par défaut, préférez le message public. Une question
posée en public profite à tou·tes ceux et celles qui se la poseront après vous.
Le message direct sert aux cas particuliers : coordonner un rendez-vous, transmettre
une information personnelle, signaler quelque chose avec délicatesse.

1. Cliquez sur l'**avatar** (la vignette) de la personne, dans un de ses messages
   ou dans sa fiche.
2. Sa carte de profil s'ouvre : cliquez sur le bouton **Message**.
3. Donnez un **titre** court à votre message, comme pour un e-mail.
4. Écrivez, puis envoyez.
5. Pour retrouver vos conversations privées : cliquez sur votre avatar en haut à
   droite, puis sur l'icône **enveloppe** (vos messages).

**Astuce** : un message direct peut inclure plusieurs personnes, comme un e-mail à
plusieurs destinataires. Ajoutez-les au champ destinataires à la création.

**Et après ?** Réglez la machine à votre main :
[[TutoForumNotifications G. Régler mes notifications et mon résumé par e-mail]].
```

### Notes de portage fiche F

- **Capture à téléverser** : `forum-f-message.png` (carte de profil avec le bouton
  Message). Compte requis. Utiliser deux comptes fictifs ou flouter.
- **Libellés à confirmer à l'écran** : « Message », intitulé du bouton d'envoi,
  chemin exact vers la liste des messages privés dans le menu utilisateur.
- Point de politique à valider avec Lucile : faut-il encourager le message direct
  vers les animateur·rices pour les demandes d'adhésion aux communautés, ou
  privilégier les canaux du wiki ? La fiche reste neutre.

---

## Fiche G. Page wiki : `?TutoForumNotifications`

### Titre proposé
**Régler mes notifications et mon résumé par e-mail**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : recevoir ce qui vous intéresse, rien de plus. **Durée** : 5 minutes.
**Prérequis** : être connecté·e ([[TutoForumRejoindre fiche A]]).

Le forum vous prévient de deux façons : des **notifications** sur le site (le
compteur près de votre avatar) et des **e-mails**. Tout se règle au même endroit.

1. Cliquez sur votre **avatar**, en haut à droite.
2. Ouvrez vos **préférences** (icône en forme de personne, puis le bouton
   d'engrenage ou le lien Préférences, selon l'affichage).
3. Ouvrez l'onglet **Notifications** : vous y choisissez quand le forum vous
   signale quelque chose (mentions, citations, réponses…). Les réglages par défaut
   conviennent à la plupart des gens.
4. Ouvrez l'onglet **E-mails** : vous y réglez le **résumé d'activités**, cet
   e-mail périodique qui récapitule ce que vous avez manqué. Choisissez sa
   fréquence (hebdomadaire est un bon point de départ) ou décochez-le.
5. Ouvrez l'onglet **Suivi** : vous y retrouvez, catégorie par catégorie, les
   niveaux d'attention de la [[TutoForumSuivre fiche C]].
6. Cliquez sur **Enregistrer les modifications** en bas de page.

**Astuce** : trop d'e-mails ? Ne vous désabonnez pas de tout : passez d'abord le
résumé en hebdomadaire et repassez une ou deux catégories de « Surveillé » à
« Suivi ». On garde le contact, sans le bruit.

**Et après ?** Vous animez une communauté ?
[[TutoForumAnimer H. Animer sa catégorie]]. Sinon, retour au
[[TutosForum sommaire de la série]].
```

### Notes de portage fiche G

- **Captures à téléverser** : `forum-g-preferences-notifications.png`,
  `forum-g-preferences-emails.png`. Compte requis.
- **Libellés et chemins à confirmer à l'écran** : intitulés exacts des onglets
  (« Notifications », « E-mails », « Suivi »), du bouton « Enregistrer les
  modifications », et le chemin avatar > préférences (l'étape 2 est volontairement
  décrite avec prudence). Vérifier aussi la fréquence par défaut du résumé
  d'activités sur notre forum.

---

## Fiche H. Page wiki : `?TutoForumAnimer`

### Titre proposé
**Animer sa catégorie (fiche animateur·rice)**

### Corps de la page (Markdown / YesWiki)

```markdown
**Objectif** : les cinq gestes qui font vivre la catégorie de votre communauté.
**Durée** : 10 minutes de lecture, puis au fil de l'eau.
**Prérequis** : être animateur·rice d'une communauté. Certains gestes demandent des
droits de modération sur votre catégorie : s'ils vous manquent, demandez-les à
l'équipe d'animation de la plateforme ([[Contact contact]]).

### 1. Poser un sujet d'accueil

Chaque catégorie possède un sujet de présentation (« À propos de la catégorie… »),
affiché en tête. Rédigez-le, ou complétez-le : à quoi sert cette salle, pour qui,
et comment y démarrer. C'est la première chose qu'un nouveau membre lit.

### 2. Épingler ce qui doit rester visible

Un sujet épinglé reste en haut de la liste. Épinglez peu : le sujet d'accueil,
un événement à venir, une ressource de référence.

1. Ouvrez le sujet, puis le menu **clef à molette** (actions d'administration).
2. Choisissez **Épingler le sujet** et sa portée (dans la catégorie).
3. Pensez à désépingler quand l'actualité est passée.

### 3. Accueillir celles et ceux qui arrivent

Quand quelqu'un poste pour la première fois dans votre catégorie, répondez-lui
dans les jours qui suivent, même brièvement : un bonjour, une piste, un lien vers
une ressource. Un premier message resté sans réponse est souvent un dernier message.

### 4. Relancer un fil qui s'endort

Une conversation utile s'est arrêtée ? Relancez-la avec de la matière : une
nouvelle information, un retour d'expérience, une question ouverte à la cantonade.
Évitez le simple « des nouvelles ? », qui relance rarement.

### 5. Modérer, avec la charte comme boussole

- Un message hors sujet : déplacez-le vers la bonne catégorie (menu clef à
  molette du sujet) en le signalant à son auteur·rice.
- Un échange qui chauffe : intervenez tôt, avec courtoisie, au nom de la
  [[Charte charte]] (« la modération peut intervenir en cas de non-respect »).
- Un contenu problématique (spam, attaque personnelle) : utilisez **Signaler**
  sous le message, et prévenez les administrateur·rices pour les suites.

**Astuce** : dix minutes par semaine suffisent souvent : un tour des nouveaux
sujets, une réponse d'accueil, une relance. La régularité compte plus que le temps
passé.

**Et après ?** Retour au [[TutosForum sommaire de la série]]. Pour le cadre général
du rôle d'animateur·rice, voir [[RolesEtDroits le référentiel des rôles]].
```

### Notes de portage fiche H

- **Capture à téléverser** : `forum-h-actions-sujet.png` (menu clef à molette d'un
  sujet, vu avec des droits de modération). Compte animateur ou admin requis.
- **Toute cette fiche est à re-vérifier à l'écran une fois l'accès rétabli** : les
  droits réels des animateur·rices sur leur catégorie n'ont jamais été relevés
  (`docs/roles-et-droits.md`, 4.12, le signale déjà). Selon la configuration, les
  gestes 2 et 5 (épingler, déplacer) peuvent être réservés aux admins : la fiche
  devra alors dire « demandez à un·e admin » au lieu du pas-à-pas.
- Le sujet « À propos de la catégorie… » est créé automatiquement par Discourse ;
  vérifier qu'il existe et est visible pour chaque catégorie de communauté (les
  catégories vides de l'écart n° 5 n'en affichent peut-être pas).
- Lien `RolesEtDroits` : nom de page wiki à aligner sur le portage réel du
  référentiel (session 1).

---

## Captures d'écran : état et procédure

**Aucune capture n'a pu être produite pendant cette session** : le certificat expiré
bloque tout navigateur (avertissement de sécurité, et blocage complet par l'antivirus
Bitdefender constaté sur le poste de travail). Forcer le passage avec la session
administrateur aurait été imprudent ; attendre la réparation est le bon ordre.

Le dossier cible `src/img/tutos/forum/` est prêt, ainsi qu'un script de capture
automatisée : `scripts/capture-tutos-forum.js` (voir son en-tête pour l'usage).
Dès que le certificat est renouvelé :

1. `npm i puppeteer-core` (une fois), puis `node scripts/capture-tutos-forum.js` :
   produit les 7 captures publiques ci-dessous, avatars et noms floutés
   automatiquement (règle : jamais de vrais membres dans les livrables).
2. Les captures d'écrans connectés (fiches C à H) se font en session guidée avec
   Thomas : elles montrent des vues qui nécessitent un compte, à prendre avec un
   compte de démonstration plutôt qu'avec le compte admin si possible.

| Fichier | Fiche | Vue | Compte requis |
|---|---|---|---|
| `forum-a-accueil.png` | A | Accueil, boutons S'inscrire / Se connecter | non |
| `forum-a-inscription.png` | A | Formulaire de création de compte | non |
| `forum-a-connexion.png` | A | Formulaire de connexion | non |
| `forum-b-categories.png` | B | Page Catégories | non |
| `forum-b-sujet.png` | B | Un sujet ouvert (identités floutées) | non |
| `forum-b-recherche.png` | B | La recherche | non |
| `forum-c-categorie.png` | C | Une page de catégorie | non |
| `forum-c-cloche.png` | C | Menu des niveaux d'attention | oui |
| `forum-d-nouveau-sujet.png` | D | Fenêtre de rédaction d'un sujet | oui |
| `forum-e-repondre.png` | E | Boutons Répondre | oui |
| `forum-e-citation.png` | E | Bouton Citation sur sélection | oui |
| `forum-f-message.png` | F | Carte de profil, bouton Message | oui |
| `forum-g-preferences-notifications.png` | G | Préférences, onglet Notifications | oui |
| `forum-g-preferences-emails.png` | G | Préférences, onglet E-mails | oui |
| `forum-h-actions-sujet.png` | H | Menu clef à molette d'un sujet | oui (modération) |

---

## Ce qui n'a pas pu être vérifié, et pourquoi

Cause commune : **certificat TLS expiré depuis le 19/07/2026**, donc pas de
navigation possible (ni anonyme ni connectée) depuis le poste, l'antivirus bloquant
la page. Le relevé s'est fait par l'interface publique de données de Discourse, qui
donne la structure et le contenu mais pas l'apparence des écrans.

1. **Les libellés exacts des boutons et menus** (S'inscrire, Créer votre compte,
   Nouveau sujet, Créer le sujet, Citation, niveaux Surveillé / Suivi / Normal /
   Silencieux, onglets des préférences…). Les fiches emploient les traductions
   standard de Discourse en français, cohérentes avec la version relevée
   (2026.4.0) : à confronter aux écrans dès l'accès rétabli, avant publication.
2. **Le mode d'inscription** : ouverte a priori (le tutoriel existant le suppose),
   mais une approbation manuelle ou une liste d'invitation ont pu être activées.
3. **Les réglages par défaut des notifications et du résumé d'activités** sur
   notre forum (fréquence du résumé, niveaux par défaut).
4. **Les droits réels des animateur·rices** sur leur catégorie (fiche H) : jamais
   relevés, y compris avant l'expiration du certificat (point déjà ouvert dans le
   référentiel des rôles, 4.12).
5. **Les permissions d'écriture par catégorie** (qui peut poster où) : l'interface
   publique n'expose que la lecture. Aucune catégorie n'est restreinte en lecture ;
   l'écriture est à vérifier en admin.
6. **L'existence des sujets « À propos de la catégorie »** dans les catégories de
   communautés, et leur contenu.
7. **Toutes les captures d'écran** (voir section précédente).

---

## Points à valider avec Lucile

1. **Vocabulaire** : « étiquette » (libellé Discourse) ou « mot-clef » ; « message
   direct » ou « message privé » ; conserver « catégorie = salle » dans la
   métaphore de la maison (la session 6 fera évoluer la métaphore vers le village,
   prévoir la retouche des fiches B et du hub à ce moment-là).
2. **La réorganisation des catégories** (écarts n° 2, 3, 4, 8) : sous-catégories
   sous « Communautés e-Sol » ou statu quo commenté ; création des espaces
   manquants pour les 6 communautés qui n'en ont pas ; renommages.
3. **La politique d'étiquettes** (écart n° 6) : en définir une ou assumer de s'en
   passer pour l'instant.
4. **Le ton des exemples** de titres (fiche D) et la persona fictive (Cécile
   Chanteloup) : conformes à la règle, à valider une dernière fois.
5. **La priorité de publication** : tout publier d'un coup, ou commencer par
   A + B + le hub (le socle), puis C à H au fil de l'eau.
6. **Le snippet de correction** de `?PremiersPas` (notes de la fiche A).
7. **La fiche F** : position du réseau sur l'usage des messages directs vers les
   animateur·rices (adhésions, sollicitations).

## Nécessite Laurent

Formulé en besoins, pas en solutions :

1. **URGENT : que forum.e-sol.fr soit de nouveau accessible sans avertissement de
   sécurité.** Le certificat a expiré le 19/07/2026 ; depuis, les navigateurs
   bloquent l'accès (et certains antivirus interdisent complètement la page).
   Besoin complémentaire : que le renouvellement ne retombe plus en panne
   silencieusement (le certificat précédent avait déjà expiré fin juillet 2026
   sans que personne ne soit alerté).
2. **Qu'un seul compte serve au wiki et au forum** (besoin déjà acté hors
   périmètre, rappelé ici car il commande la formulation de la fiche A et de
   `?PremiersPas` : tant qu'il n'est pas couvert, les contenus doivent dire
   « compte distinct »).
3. **Que le mail de bienvenue du forum oriente vers les fiches** : quand un compte
   forum est créé, que le message de bienvenue pointe vers `?TutosForum` (réglage
   de contenu côté forum ; à faire par un·e admin du forum une fois les fiches
   publiées, pas de développement attendu).

---

## Checklist de publication

- [ ] Certificat de forum.e-sol.fr renouvelé et vérifié (préalable absolu)
- [ ] Relecture des 8 fiches + hub avec Lucile (vocabulaire, ton, priorités)
- [ ] Vérification à l'écran des libellés marqués « à confirmer » (fiches A à H)
- [ ] Vérification des droits animateur·rices et ajustement de la fiche H
- [ ] Captures publiques : `node scripts/capture-tutos-forum.js`, tri, téléversement
- [ ] Captures connectées (C à H) en session guidée, floutage ou comptes fictifs
- [ ] Création des 8 pages `?TutoForum…` puis du hub `?TutosForum`
- [ ] Correction de `?PremiersPas` étape 3 (compte distinct + lien fiche A)
- [ ] Liens vers `?TutosForum` depuis `?Tutoriels` et le mail de bienvenue du forum
- [ ] Décision : réorganisation des catégories (avec ou sans regroupement)
