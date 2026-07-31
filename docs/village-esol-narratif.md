# Le village e-Sol : narratif

> **Phase 6A du jeu de prompts.** Texte uniquement, aucun visuel, aucun code.
> **Statut : proposition, révisée après le retour de Thomas du 31/07/2026.**
> Rien n'est supprimé tant que le village n'est pas validé : `src/pages/maison-esol.html`,
> `src/components/illustration-maison.html` et `docs/maison-esol-yeswiki.md` restent en place.

Ce document fait évoluer la métaphore fondatrice d'e-Sol : le réseau n'est plus **une maison dont
les communautés sont les pièces**, il est **un village dont chaque communauté est une maison**.
Décision prise en réunion Thomas / Lucile du 29 juillet 2026.

**Décisions prises** (retours du 31/07) :

- nouvelle page `village-esol.html`, sans toucher à la maison existante ;
- bascule du vocabulaire dans le reste du site reportée en phase 6E ;
- le principe directeur de la section 2, qui remplace la liste de lieux décoratifs envisagée
  d'abord : un lieu, une fonction réelle ;
- les douze vignettes de communautés dessinées d'emblée, pas de pilote partiel ;
- **les communs et les ressources sont deux lieux distincts, et pas deux bâtiments pour la même
  chose** : la bibliothèque garde ce qui sert à se servir d'e-Sol (tutoriels, guides, glossaire),
  l'atelier abrite ce que les communautés fabriquent et partagent. Ce sont deux choses différentes,
  elles ne se rangent pas au même endroit ;
- mots simples uniquement, pas d'intitulés alambiqués.

---

## 1. Le point dur : où passe le « toit commun » ?

C'est le cœur du changement, donc je le traite en premier.

Dans la maison, le toit portait trois choses à la fois :

1. **un abri partagé** : tout le monde est logé sous le même toit, donc tout le monde fait partie
   du même ensemble ;
2. **une continuité** : on passe d'une pièce à l'autre sans jamais sortir ;
3. **un nom** : le toit portait la mention « AFES », juste au-dessus du texte qui expliquait que
   l'AFES ne possède rien.

Dans le village, chaque maison a son propre toit. Les trois charges doivent donc se reporter
ailleurs, et elles ne se reportent pas au même endroit.

### a) L'abri partagé devient le sol

**On ne partage plus un toit, on partage un sol.**

Les fondations existaient déjà dans la métaphore de la maison : c'était la charte, dessinée en
soubassement de pierre avec la mention « FONDATIONS · CHARTE · VALEURS ». Elles étaient enterrées,
sous le bâtiment, invisibles une fois la maison construite. Dans le village, le sol est sous les
pieds de tout le monde, en permanence, et il est visible.

Ce déplacement est le vrai gain du changement de métaphore, pour deux raisons :

- il donne enfin à la charte la place que le texte lui accordait déjà (« sans fondations, pas de
  maison ») mais que l'image reléguait au bas du dessin ;
- pour un réseau dont l'objet est le sol, dire que le commun est le sol n'est pas un jeu de mots :
  c'est la seule chose sur laquelle aucune maison ne peut faire bande à part.

### b) La continuité devient le centre du village

Ce que la maison mettait au rez-de-chaussée, sous les pièces, passe **au milieu, entre les
maisons** : la place et son agora, l'atelier, la bibliothèque, le panneau d'affichage.

Le changement de position dit quelque chose de vrai que la maison disait mal : personne n'a les
communs sous ses pieds, il faut **sortir de chez soi** pour y aller. C'est exactement ce qui se
passe dans la réalité du réseau, où déposer un commun ou aller sur le forum est une démarche
volontaire, pas un réflexe de proximité.

S'y ajoute un troisième porteur, plus discret : **les chemins**. Le lien ne vient plus du bâtiment,
il vient de la circulation. On peut habiter plusieurs maisons (c'était déjà vrai : « on peut être
dans plusieurs pièces »), et les habitant·es de maisons différentes se croisent sur la place.

### c) Le nom : l'AFES perd le toit et ne gagne pas de château

Proposition : **l'AFES tient les communs, pas les maisons.** Elle garde la place ouverte, entretient
les chemins et la bibliothèque, accueille celles et ceux qui arrivent. Et elle habite le village
comme les autres : dans les 12 communautés de `src/data/communities.json`, deux sont les siennes
(GT Communication, Administrateurs).

Le COPIL e-Sol devient **l'assemblée du village** : il oriente, il arbitre, il valide l'ouverture
d'une nouvelle maison, il ne décide pas de ce qui se dit à l'intérieur.

C'est plus fidèle à la formule existante (« anime, héberge, ne possède pas ») que ne l'était le
toit, qui affirmait visuellement le contraire de ce que le texte s'employait à démentir juste en
dessous : un toit couvre et un toit appartient.

**Mots écartés volontairement** : la mairie, le maire, le conseil municipal, le château, le clocher,
les remparts, le portail du village. Tous portent de l'autorité, de la propriété ou de la clôture.

---

## 2. Le principe directeur : un lieu, une fonction réelle

**Aucun bâtiment décoratif. Chaque lieu du village correspond à une fonctionnalité réelle d'e-Sol,
et mène à la page qui la porte.** Le plan du village est le plan du site.

C'est ce principe qui distingue ce village d'une jolie image : on ne dessine pas un four à pain
parce que ça fait village, on dessine un panneau d'affichage parce que les petites annonces
existent vraiment et qu'on doit pouvoir cliquer dessus.

Il a aussi une conséquence directe sur la phase 6B : le village devient une **carte de navigation**,
et non une illustration à légender.

### La légende du village

| Lieu | Ce qu'on y fait | Où ça mène |
|---|---|---|
| **L'accueil**, à l'entrée du village | On se présente et on prend sa clef. Le village se visite librement, mais participer demande un compte. | `inscription.html`, `premiers-pas.html` |
| **Les maisons**, autour de la place | Une par communauté. On entre dans celles qui nous concernent, on peut en habiter plusieurs. | `communautes.html`, puis chaque `communaute-detail.html` |
| **La place et son agora** | On discute, on pose une question, on annonce un chantier, on répond. C'est le forum. | `forum.e-sol.fr`, `tutoriels-forum.html` |
| **Le panneau d'affichage**, sur la place | On lit et on dépose une offre, une demande, une information. | `annonces.html` |
| **L'atelier**, sur la place | On fabrique et on récupère ce que les communautés produisent pour tout le monde : protocoles, données, kits pédagogiques, référentiels. | `communs.html` |
| **La bibliothèque**, près de la place | On apprend à se servir d'e-Sol : tutoriels, fiches du forum, guides d'usage, vocabulaire. | `tutoriels.html`, `glossaire.html` |
| **Le registre**, à l'accueil | On regarde qui habite le village, et où. | `annuaire.html` |
| **Le sol**, sous tout le village | Ce sur quoi tout est bâti : la charte, les valeurs, les licences ouvertes. | `charte.html` |
| **Les jardins et les chemins**, autour | Ce qui sort du village : ateliers grand public, événements, projets pilotes, plaidoyer. | `participer.html` |

Deux fonctions n'ont pas de bâtiment, volontairement :

- **L'intendance** (AFES) et **l'assemblée** (COPIL) : elles ne sont pas un lieu, elles sont ce qui
  entretient les lieux. Voir section 1c. Le lien de contact se rattache à l'accueil.
- **Les rôles et les droits**, et **Qu'est-ce qu'une communauté** : ce sont des pages
  d'explication, pas des lieux. Elles se lient depuis le bloc des maisons.

### Sur l'inscription

Le village n'a ni remparts ni portail : les pages publiques se consultent sans compte, c'est le
fonctionnement réel relevé en session 1. Mais **pour participer, il faut sa clef** : poster sur le
forum, rejoindre une maison, déposer un commun, apparaître au registre.

Cette nuance est un progrès sur la maison. L'ancienne « porte d'entrée » mélangeait quatre choses
distinctes (la charte, l'inscription, l'annuaire, le forum) en un seul seuil. Le village leur donne
quatre lieux différents, et chacun devient cliquable.

---

## 3. Ce que je garde, ce que je déplace, ce que j'abandonne

### Ce que je garde

| Élément | Pourquoi il tient toujours |
|---|---|
| Les **communs** et leur nom | Cœur du projet, inchangé : utilisables et entretenus par tout le monde |
| La **charte** comme socle | Conservée, et promue : elle devient le sol |
| « **anime, héberge, ne possède pas** » | Formule conservée mot pour mot, mieux servie par le village |
| Le **jardin** | Devient les jardins et les chemins autour, avec le même contenu |
| Le **nouvel arrivant** qui marche vers l'entrée | Personnage conservé : il marche vers l'accueil et la place |
| La **cheminée qui fume** | Conservée, et elle devient utile : plus de fumée et volets fermés = communauté en sommeil |
| « On peut être dans plusieurs pièces » | Devient « on peut habiter plusieurs maisons » |
| L'**échelle domestique** et le ton chaleureux | C'est ce qui distingue le récit d'une présentation de plateforme : on habite, on ne se connecte pas |
| Le **cycle de vie** des communautés (session 3) | Naissance, animation, production de communs, sommeil ou essaimage : se raconte mieux avec des maisons |
| Les **scènes de la maison en coupe** | Les gens autour d'une table, les livres, les outils : ces vignettes ne disparaissent pas, elles se répartissent dans les maisons et les lieux (section 6) |

### Ce que je déplace

| Avant | Après | Ce que le déplacement gagne |
|---|---|---|
| « la maison » = le réseau | « la maison » = une communauté | Le mot ne disparaît pas, il change d'échelle |
| Les communs au rez-de-chaussée, sous les pièces | L'atelier, au centre | Il faut sortir de chez soi pour y aller, ce qui est vrai |
| Le forum = « le hall », rattaché à la porte d'entrée | Le forum = la place et son agora, lieu à part entière | Le forum n'est pas un sas d'accueil, c'est là que la vie collective se passe (et il a son propre compte, distinct du site) |
| Les fondations enterrées | Le sol visible | Voir section 1a |
| L'AFES et le COPIL au-dessus (le toit) | L'intendance et l'assemblée, à côté | Cohérent avec « ne possède pas » |
| L'annuaire = « se présenter à la porte » | Le registre, consultable | Devient une fonction repérable, pas une formalité d'entrée |
| La cuisine, l'atelier, la bibliothèque, la salle commune (4 sous-espaces décoratifs d'un seul bloc) | L'atelier (les communs) et la bibliothèque (les ressources), deux lieux qui mènent à deux pages différentes | Fin de la liste décorative : chaque lieu est cliquable, et la distinction porte enfin sur quelque chose de vrai |

### Ce que j'abandonne

| Abandonné | Pourquoi, et ce que ça coûte |
|---|---|
| **« Les pièces »** pour dire les communautés | Remplacé par « les maisons ». C'est le plus gros coût : une trentaine de formulations à reprendre dans le site (section 8), reporté en phase 6E |
| **Le toit** comme image de l'AFES | Volontaire : un toit couvre et appartient |
| **La porte d'entrée unique** et l'arche « BIENVENUE » | Le seuil unique mélangeait quatre fonctions. Il éclate en quatre lieux. L'accueil et la clef restent, l'enceinte disparaît |
| **Les étages** (rez-de-chaussée / étage) | La hiérarchie verticale disparaît, remplacée par centre / pourtour |
| **La cuisine** comme lieu | Elle ne correspond à aucune fonction du site. Son idée (« on produit ensemble ») passe dans l'atelier |
| **La vue en coupe du réseau entier** | On ne voit plus tout l'intérieur d'un seul coup d'œil. Compensé par les scènes des maisons (section 6) et par le survol de la phase 6B |

---

## 4. Le lexique du village

| Maison (avant) | Village (après) | Ce que ça désigne dans le réel |
|---|---|---|
| la maison e-Sol | **le village e-Sol** | le réseau |
| une pièce | **une maison** | une communauté |
| le toit, l'AFES | **l'intendance** (AFES) et **l'assemblée** (COPIL) | animation, hébergement, orientation |
| la porte d'entrée | **l'accueil** et **la clef** | l'inscription |
| le hall | **la place** et **l'agora** | le forum |
| les outils partagés (cuisine, bibliothèque, atelier, salle commune) | **l'atelier** | les communs |
| (rien) | **la bibliothèque** | le centre de ressources et le glossaire |
| (rien) | **le panneau d'affichage** | les annonces |
| (rien) | **le registre** | l'annuaire |
| les fondations | **le sol du village** | la charte, les valeurs, les licences ouvertes |
| le jardin | **les jardins et les chemins** | les actions, le lien avec la société |
| habiter la maison | **habiter le village** | être membre inscrit |
| une pièce réservée | **la pièce du fond** | le cercle restreint, si la communauté en active un |

Trois lieux sont des créations : la bibliothèque, le panneau d'affichage et le registre. Ils ne
remplacent rien dans l'ancienne métaphore, ils rendent visibles des fonctions du site que la maison
ne montrait pas du tout.

Un mot sur le partage entre l'atelier et la bibliothèque, parce que c'est le point qui a le plus
bougé : la maison rangeait tout dans un seul bloc « outils partagés », en distinguant quatre
sous-espaces qui ne correspondaient à rien de précis. Le village ne garde qu'une distinction, mais
elle est réelle : **l'atelier abrite ce que les communautés produisent pour le réseau et au-delà**
(protocoles, données, kits, référentiels, sous licence ouverte), **la bibliothèque abrite ce qui
sert à se servir d'e-Sol** (tutoriels, guides d'usage, glossaire). Deux pages différentes, deux
publics différents, deux lieux.

---

## 5. Le texte de la page, réécrit

Prêt à intégrer en phase 6B, sur `src/pages/village-esol.html`.

Une nouveauté par rapport à `maison-esol.html` : la **légende du village** (le tableau de la
section 2) est placée juste sous l'illustration. Elle sert trois fois : repère de lecture pour
tout le monde, repli accessible exigé par le point 5 du prompt 6B, et base du portage YesWiki en
phase 6E. Un seul objet, trois usages.

### Héro

> **Badge** : Comprendre e-Sol
> **Titre** : Le village e-Sol
> **Chapô** : Une métaphore pour voir d'un coup d'œil comment le réseau fonctionne, qui fait quoi,
> et où vous pouvez prendre place. Chaque lieu du village est une porte vers une page du site.

### Phrase-signature

> « e-Sol, c'est un **village** : chaque communauté y a sa maison, et toutes sont bâties sur le
> même sol. »

*(le mot « village » porte le dégradé, comme « grande maison » aujourd'hui)*

### Les lieux du village

**Titre de section** : Se repérer dans le village
**Sous-titre** : Chaque lieu correspond à quelque chose qu'on peut faire sur e-Sol. Rien n'est là
pour décorer.

---

**1. L'accueil · à l'entrée**
**On entre librement, on participe avec une clef**

Le village n'a ni portail ni remparts : on y entre par les chemins, on regarde les maisons, on lit
ce qui se dit sur la place. Pour participer, en revanche, il faut sa clef : c'est l'inscription.
Elle prend quelques minutes, elle est gratuite, elle est ouverte à toute personne que les sols
intéressent, et elle ouvre le droit de poster, de rejoindre une maison et de déposer un commun.
À côté de l'accueil se tient le **registre** : qui habite le village, où, et sur quoi chacun·e
travaille.

> Liens : *S'inscrire*, *Premiers pas*, *Voir le registre (annuaire)*

---

**2. Les maisons · autour de la place**
**Une communauté, une maison**

Chaque communauté a sa maison, et chacune a son allure : chez la Fresque du Sol on joue les cartes
sur la table, chez Sols et Art on travaille la terre comme un pigment, chez Sols Forestiers c'est
un coin de forêt, chez ZAN une petite ville qui grignote ses bords. Certaines sont grandes et très
animées, d'autres tiennent à quelques personnes, et c'est très bien ainsi. Chaque maison a son ou
ses animateur·rices, ses habitué·es, et parfois une pièce du fond réservée à un cercle plus
restreint. On peut en habiter plusieurs, et on peut proposer d'en construire une nouvelle.

> Liens : *Voir les maisons*, *Qu'est-ce qu'une communauté ?*, *Les rôles et les droits*

---

**3. La place et son agora · au centre**
**Là où tout le monde se croise**

Les chemins débouchent sur la place. C'est là que se tient l'agora, le forum : on s'y présente, on
pose une question, on annonce un chantier, on répond à quelqu'un qu'on n'a jamais rencontré. Les
habitant·es de toutes les maisons s'y croisent, et il n'y a pas besoin d'être invité·e pour lire ce
qui s'y dit. Un détail qui compte : le forum a son propre compte, distinct de celui du site.

> Liens : *Aller sur le forum*, *Les fiches pour bien démarrer sur le forum*

---

**4. Le panneau d'affichage · sur la place**
**Ce qui se cherche et ce qui se propose**

Contre le mur de la place, le panneau d'affichage : un stage à pourvoir, un jeu de données à
récupérer, un covoiturage vers un colloque, une thèse qui cherche des terrains. On lit, on décroche
ce qui nous intéresse, on épingle sa propre annonce.

> Lien : *Voir les annonces*

---

**5. L'atelier · sur la place**
**Les communs : ce que le réseau fabrique et partage**

L'atelier appartient à tout le monde. C'est là qu'on fabrique ensemble ce qu'on ne saurait pas
faire seul·e, et qu'on récupère ce que les autres ont fabriqué : protocoles, jeux de données,
kits pédagogiques, référentiels, cartes. Ce sont les **communs** : ils naissent dans les maisons,
ils sortent sur la place, et ils sont publiés sous licence ouverte pour que n'importe qui puisse
les reprendre. On y entre sans demander, on emprunte, on rapporte, et on est censé y laisser
quelque chose de temps en temps.

> Lien : *Découvrir les communs*

---

**6. La bibliothèque · près de la place**
**Apprendre à se servir du village**

Personne ne naît en sachant se servir d'un forum ni déposer un commun. La bibliothèque rassemble ce
qui s'apprend : les premiers pas pour s'installer, les fiches pratiques du forum, les guides d'usage
de la plateforme, et le vocabulaire du réseau quand un sigle résiste. Ce n'est pas là qu'on trouve
les communs, c'est là qu'on apprend à s'en servir.

> Liens : *Centre de ressources*, *Glossaire*

---

**7. Le sol · sous tout le village**
**Ce sur quoi tout est bâti : la charte**

Dans une maison, les fondations sont enterrées et on finit par les oublier. Dans un village, le sol
est sous les pieds de tout le monde, tout le temps. La charte e-Sol pose les principes que
partagent toutes les maisons : transparence, biens communs, évolutivité, robustesse. C'est elle qui
garantit que ce qui est produit ici reste ouvert et réutilisable, sous licence CC BY-SA. On ne
partage plus un toit, on partage un sol : c'est le seul point sur lequel personne ne peut faire
bande à part.

> Lien : *Lire la charte*

---

**8. L'intendance · l'AFES et le COPIL**
**Qui entretient le village**

L'AFES anime, héberge, et ne possède pas. Elle n'a pas de toit au-dessus des autres : elle garde la
place ouverte, entretient les chemins et la bibliothèque, accueille celles et ceux qui arrivent.
Elle habite d'ailleurs le village comme les autres, avec ses propres maisons (le groupe
Communication, les administrateurs de l'association). Le COPIL e-Sol (AFES, GIS Sol, RMT Sols et
Territoires, RNEST, avec le soutien de l'ADEME et de l'OFB) est l'assemblée qui oriente : il
arbitre, il valide l'ouverture d'une nouvelle maison, il ne décide pas de ce qui se dit à
l'intérieur.

> Liens : *Site de l'AFES*, *Nous écrire*

---

**9. Les jardins et les chemins · autour**
**Là où le village rencontre le reste du monde**

Un village fermé sur lui-même s'éteint. Autour des maisons, il y a les jardins et les chemins qui
partent : ateliers grand public, événements, projets pilotes, plaidoyer, écoles et collectivités
qui viennent chercher ce qui a été fabriqué ici. C'est là que poussent les graines des prochains
communs, et c'est par là qu'arrive la plupart des nouveaux et nouvelles habitant·es.

> Lien : *Espace actions*

---

### Bloc complémentaire : ce qu'il y a dans une maison

Ce bloc n'existe pas dans la page actuelle. Il compense la perte de la vue en coupe et fait le lien
avec les sessions 1 et 3.

> **De la place, on voit des façades**
>
> À l'intérieur, chaque maison s'organise à peu près de la même manière : celles et ceux qui
> habitent là (les membres), la personne qui tient la maison (l'animateur·rice), et parfois une
> pièce du fond dont l'accès est réservé à un cercle plus restreint, quand la communauté a décidé
> d'en ouvrir une. Ce n'est pas une obligation : chaque maison décide.
>
> Liens : *Les rôles et les droits*, *Qu'est-ce qu'une communauté ?*

### Section gouvernance

Le diagramme Mermaid et sa note de bas de bloc ne changent pas. Seuls le sous-titre et le libellé
du sous-graphe évoluent :

- sous-titre : « Un plan complémentaire du village : les flux d'animation, de production et de
  retombées. » (au lieu de « Une vue de coupe complémentaire à la maison »)
- dans `diagram-gouvernance.md` : `LES PIÈCES · communautés thématiques` devient
  `LES MAISONS · communautés thématiques` (report en phase 6E)

### Par où commencer

**Titre de section** : Par où commencer ?
**Sous-titre** : Selon ce que vous cherchez, voici les chemins les plus courts.

| Carte | Texte | Bouton |
|---|---|---|
| Je viens d'arriver | Je prends ma clef, je complète mon profil, je me présente sur l'agora. | S'inscrire |
| Je cherche une maison | J'explore les communautés et je rejoins celle qui correspond à mes sujets. | Voir les maisons |
| Je veux contribuer à un commun | J'apporte une donnée, un guide, un outil, ou j'en propose un nouveau. | Voir les communs |
| Je veux construire une maison | Je porte un projet de communauté et je sollicite l'accompagnement du réseau. | Nous écrire |

---

## 6. Le caractère de chaque maison

Une maison par communauté, et chacune montre ce qu'on y fait. Les scènes ci-dessous sont tirées des
descriptions réelles de `src/data/communities.json`, rien n'est inventé. Elles sont volontairement
simples : deux ou trois objets reconnaissables, à l'échelle d'une vignette de 80 à 120 pixels.

| Communauté | Catégorie | Scène proposée |
|---|---|---|
| Animateurs Fresque du Sol | Formation | Des joueur·ses autour d'une table, les cartes du jeu étalées |
| Sols Forestiers (IPRSol) | Recherche | Un coin de forêt, quelques troncs, un sous-bois |
| Promotion des Sols dans l'Éducation | Éducation | Un tableau, des pupitres, un cartable |
| Pédologie de Terrain | Formation | Une fosse pédologique ouverte, une bêche plantée, un profil de sol visible |
| Refersols | Recherche | Une table couverte de cartes, des rouleaux, une règle |
| Secteur Privé | Professionnel | Une mallette de terrain, un carottier, une enseigne de bureau d'études |
| SRP Sols | Recherche | Des habitant·es et une personne scientifique penchés sur un même prélèvement |
| ZAN | Politique | Une petite ville aux toits serrés, une limite tracée au sol |
| Sols et Art | Culture | Un chevalet, des pigments de terre, une œuvre en cours |
| AFES GT Communication | Institutionnel | Une affiche fraîchement collée, un porte-voix |
| AFES Administrateurs | Institutionnel | Une table de réunion, un registre ouvert |
| Zones Humides | Recherche | Une mare, des roseaux, un ponton de bois |

**Comment cela tient avec l'exigence « piloté par les données » du prompt 6B.** Trois couches :

1. **La coque de la maison est générée** depuis `communities.json` : position, taille, forme de
   toit, teinte selon `category`, état actif ou en sommeil, lien vers la page, `<title>` et
   `aria-label` construits depuis `name` et `shortDescription`.
2. **La scène est une vignette dessinée à la main**, rangée dans un dictionnaire indexé par l'`id`
   de la communauté. Douze vignettes à dessiner une fois.
3. **Deux niveaux de repli** : si l'`id` n'a pas de vignette, on prend une vignette générique de
   catégorie (7 catégories) ; s'il n'y en a pas non plus, la maison reste neutre avec son symbole
   simple.

Conséquence concrète : une 13e communauté ajoutée dans le JSON **apparaît immédiatement** dans le
village, correctement colorée, cliquable et accessible, avec une maison neutre. Elle gagne sa scène
le jour où quelqu'un la dessine. Le village ne casse jamais, il s'enrichit.

---

## 7. Ce que le village dit mieux, et ce qu'il dit moins bien

### Mieux

- **Chaque lieu devient une porte.** La maison était une illustration à légender ; le village est
  une carte de navigation vers les vraies pages du site.
- **Le sommeil d'une communauté devient représentable.** Volets fermés, pas de fumée, teinte plus
  pâle. La maison n'avait aucun moyen de dire qu'une pièce dort. Le cycle de vie écrit en session 3
  devient visible.
- **La 13e communauté ne coûte rien.** On ajoute une maison au bout du chemin. Dans la maison, une
  pièce de plus voulait dire redessiner le plan.
- **L'accès réel est mieux décrit.** Village ouvert sans remparts, participation avec une clef,
  maisons à accès variable : c'est la matrice des droits de la session 1, dessinée.
- **Les tailles inégales cessent d'être un problème.** 124 membres pour la Fresque du Sol, 12 pour
  Pédologie de Terrain. Des maisons de tailles différentes le disent sans commentaire ; des pièces
  alignées au même étage laissaient croire à une égalité qui n'existe pas.
- **Les communautés cessent d'être interchangeables.** Trois pièces identiques avec une étiquette
  différente ne disaient rien du contenu. Un coin de forêt et un atelier d'artiste, si.
- **L'essaimage se voit.** Une maison qui en fait naître une autre un peu plus loin est lisible
  dans un village, illisible dans une pièce.

### Moins bien

- **On ne voit plus tout l'intérieur d'un coup.** La coupe montrait des gens autour d'une table
  dans chaque pièce. Contre-mesures : les scènes de la section 6, le survol et le clic de la
  phase 6B, le bloc « ce qu'il y a dans une maison ».
- **L'unité est moins immédiate.** « Sous le même toit » se comprend en une seconde, « sur le même
  sol » demande une phrase. Le texte doit désormais porter ce que l'image ne dit plus : c'est le
  rôle de la phrase-signature et du bloc « le sol ».
- **Beaucoup d'objets à composer.** 12 maisons avec scène, plus 5 lieux partagés (l'accueil et son
  registre, la place et son agora, le panneau d'affichage, l'atelier, la bibliothèque), plus le sol
  et les chemins. C'est la contrainte forte de la phase 6B, et le vrai risque de cette métaphore.
- **Le mot « village » traîne une connotation d'entre-soi** (petit, fermé, tout le monde se
  connaît), et e-Sol veut l'inverse. Contre-mesure dans le texte : pas de portail, pas d'enceinte,
  des chemins qui partent vers l'extérieur, et un bloc final consacré à ce qui sort du village.

---

## 8. La dette de vocabulaire dans le reste du site

**Décidé : report en phase 6E.** En 6B, on ne touche qu'à la nouvelle page et aux liens de
navigation. Relevé pour mémoire, à traiter une fois le village définitivement retenu :

**Pages de la démo**

| Fichier | Ce qu'il faudra reprendre |
|---|---|
| `src/pages/premiers-pas.html` | 9 formulations : « nouveau dans la maison », « les pièces », « Parcourir les pièces », « le hall », « les règles de la maison », bouton « Visiter la maison » |
| `src/pages/qu-est-ce-qu-une-communaute.html` | 7 : chapô, cycle de vie (« la pièce est ouverte »), étape 2, « une pièce manque dans la maison », « on ouvre la pièce ensemble » |
| `src/pages/glossaire.html` | 4 entrées : Communs, Communauté (« dans la maison : une pièce »), Sciences participatives, phrase de clôture |
| `src/pages/tutoriels.html` | 4 : encart « je débute », bouton, inclusion de `illustration-maison`, sous-titre de section |
| `src/pages/roles-et-droits.html` | 1 bouton en pied de page |
| `src/components/header.html`, `footer.html` | 1 entrée de menu chacun |
| `src/components/illustration-premiers-pas.html` | Jalon « Pièce » et légende « je lis les règles de la maison » |
| `src/components/diagram-gouvernance.md` | Libellé du sous-graphe, lecture du schéma, variante simplifiée, chemin `src/img/maison/` |
| `src/data/ressources.json` | Fiche `guide-maison` : titre, description, lien, mots-clés |

**Brouillons de portage** : `docs/maison-esol-yeswiki.md` (19 occurrences, à refondre ou à
remplacer), `docs/premiers-pas-yeswiki.md` (10), `docs/qu-est-ce-qu-une-communaute-yeswiki.md` (9),
`docs/tutoriels-forum-yeswiki.md` (2), `docs/centre-ressources-yeswiki.md` (1),
`docs/roles-et-droits.md` (1).

Bonne nouvelle : le mot « maison » reste juste partout où il désigne une communauté. Ce qui doit
changer, ce sont les phrases où « la maison » désigne le réseau entier.

---

## 9. Ce que ce narratif impose à la phase 6B

1. **Le village est une carte cliquable, pas une illustration.** Chaque lieu de la légende doit
   être une cible : lien, focus clavier, `<title>`.
2. **Le sol doit être visible et nommé.** Une bande de sol travaillée en bas du dessin, avec la
   charte, pas un simple trait d'horizon.
3. **Composition centre / pourtour.** La place au centre avec ses lieux partagés, les maisons
   autour. Pas de rangée alignée, qui donnerait un lotissement et rétablirait une hiérarchie que
   le texte refuse.
4. **Pas de portail, pas d'enceinte.** L'accueil est une borne ou un auvent, pas une barrière. Des
   chemins qui entrent et qui sortent du cadre.
5. **Trois couches pour les maisons** : coque générée, vignette dessinée, replis. Voir section 6.
6. **Fumée = actif, volets fermés et teinte pâle = en sommeil.**
7. **Les deux maisons de l'AFES sont des maisons comme les autres.** Ne pas les confondre avec
   l'intendance, qui n'a pas de bâtiment.
8. **Sept catégories** (Formation, Recherche, Éducation, Professionnel, Politique, Culture,
   Institutionnel), donc sept teintes `--cat-*` à distinguer sans bariolage.
9. **Densité maîtrisée.** 12 maisons plus 5 lieux partagés : c'est le point de rupture possible.
   Si la lisibilité ne tient pas, ce sont les scènes qui se simplifient, pas les liens qui
   disparaissent.
10. **Taille des maisons** : la tentation est de l'indexer sur le nombre de membres, mais le
    rapport va de 12 à 124. Prévoir une échelle compressée, ou une variation décorrélée des
    effectifs.

---

## 10. Questions ouvertes

1. **« L'intendance »** est-il juste pour l'AFES, ou trop administratif ? Alternatives :
   l'entretien, celles et ceux qui tiennent la place, ou pas de mot du tout et seulement la
   description. Le mot n'apparaît pas dans le dessin, seulement dans le texte du bloc 8.
2. **Un ancrage visuel pour l'AFES ?** Un puits ou une fontaine sur la place, entretenu par tous
   et possédé par personne, ou bien l'AFES reste sans bâtiment, présente uniquement par ce qu'elle
   entretient ?
3. **Les deux maisons de l'AFES dans le village.** `AFES-admins` est décrite comme « espace
   réservé » alors que sa page wiki est publique (annexe A du référentiel des rôles). Question de
   politique d'affichage, pas de dessin : les montre-t-on comme les autres ?
4. **Faut-il une entrée « village » au glossaire**, et que devient l'entrée « Communauté » qui dit
   aujourd'hui « dans la maison : une pièce » ? À traiter en 6E.

Questions tranchées le 31/07 : la page (nouvelle `village-esol.html`), le rythme de bascule du
vocabulaire (phase 6E), les douze vignettes d'emblée, et le partage atelier / bibliothèque.
