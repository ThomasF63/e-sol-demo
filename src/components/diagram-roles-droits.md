# Schéma des rôles et droits e-Sol

Diagrammes Mermaid versionnables des rôles et droits de la plateforme.
Source de vérité : [docs/roles-et-droits.md](../../docs/roles-et-droits.md) (référentiel établi le 30/07/2026,
statut « proposition, à valider »). Les points marqués `*` dans les schémas portent la même
mention « proposition, à valider » que dans le référentiel.

## Vue générale : les cinq niveaux plateforme

Les niveaux sont **cumulatifs** : chaque cadre contient le précédent, comme des cercles
concentriques. Ce qu'on gagne à un niveau s'ajoute à tout ce qu'on avait déjà.

```mermaid
%%{init: {"flowchart": {"rankSpacing": 26, "nodeSpacing": 30, "padding": 8}}}%%
flowchart TB
    subgraph NIV5["5 - ADMINISTRATEUR·RICE DE LA PLATEFORME"]
      direction TB
      D5["+ comptes, groupes et droits d'accès<br/>+ formulaires et statuts reconnus<br/>+ peut tout éditer ou supprimer (dernier recours)"]
      subgraph NIV4["4 - ANIMATEUR·RICE DE COMMUNAUTÉ"]
        direction TB
        D4["+ accueillir les nouveaux membres<br/>+ éditer les pages<br/>+ gérer le cercle restreint*<br/>+ modérer son périmètre"]
        subgraph NIV3["3 - MEMBRE D'UNE COMMUNAUTÉ"]
          direction TB
          D3["+ participer aux espaces de ses communautés :<br/>documents, discussions, sous-pages<br/>+ accéder au cercle restreint si activé*"]
          subgraph NIV2["2 - MEMBRE INSCRIT·E"]
            direction TB
            D2["+ tenir sa fiche annuaire, commenter<br/>+ créer fiches action, petites annonces<br/>+ rejoindre des communautés"]
            subgraph NIV1["1 - VISITEUR·EUSE NON INSCRIT·E"]
              D1["consulter les pages publiques et l'annuaire<br/>lire le forum - s'inscrire"]
            end
          end
        end
      end
    end

    D5 ~~~ NIV4
    D4 ~~~ NIV3
    D3 ~~~ NIV2
    D2 ~~~ NIV1

    classDef droits fill:#fdfbf9,stroke:#b09570,color:#1a1512,stroke-width:1px
    class D1,D2,D3,D4,D5 droits

    style NIV1 fill:#fdfbf9,stroke:#8c7166,stroke-width:1.5px,color:#1a1512
    style NIV2 fill:#eeeef8,stroke:#4e4e88,stroke-width:1.5px,color:#3d3d5c
    style NIV3 fill:#ffdbcc,stroke:#9c3f00,stroke-width:1.5px,color:#7a3000
    style NIV4 fill:#dbe9a9,stroke:#586330,stroke-width:1.5px,color:#3d4d1f
    style NIV5 fill:#9c3f00,stroke:#7a3000,stroke-width:2px,color:#fdfbf9
```

## Lecture du schéma

- **L'emboîtement dit tout** : un·e animateur·rice (4) reste membre de ses communautés (3),
  inscrit·e (2) et visiteur·euse (1). Aucun niveau ne retire de droits.
- **Comment on monte d'un niveau** : 1 vers 2 par le formulaire d'inscription (gratuit,
  immédiat) ; 2 vers 3 librement, en se rattachant à la communauté depuis l'inscription,
  sa page ou sa fiche annuaire (l'équipe d'animation est notifiée à l'arrivée) ; 3 vers 4
  par désignation au sein de la communauté (cadre à préciser*) ; 4 vers 5 par ajout au
  groupe `@admins` (proposition : décision AFES / COPIL*).
- `*` **proposition, à valider** : mention identique dans le référentiel
  (cercle restreint paramétrable, cadre du rôle d'animation, attribution du rôle admin).
- **Limite technique actuelle** : le rattachement à une communauté est déclaratif par
  choix (adhésion libre, décision d'août 2026), mais cocher une communauté n'alimente
  aujourd'hui aucun groupe d'utilisateurs. Les droits réels par communauté, cercle
  restreint en tête, supposent des groupes YesWiki dédiés (référentiel, sections 4.6 et 4.7).

## Vue communauté : la granularité interne

Au sein d'une communauté, trois positions : membre, membre du cercle restreint (si la
communauté l'active), animateur·rice. Ce schéma est un **support de décision** pour
l'équipe d'animation : il permet de dire « nous, on active / on n'active pas le cercle
restreint ».

```mermaid
flowchart LR
    M(["Membre de la<br/>communauté"])
    CR(["Membre du<br/>cercle restreint*"])
    AN(["Animateur·rice"])

    subgraph PARTAGE["ESPACES PARTAGÉS - tous les membres de la communauté"]
      direction LR
      E1["Pages et documents<br/>de la communauté"]
      E2["Discussions -<br/>catégorie de forum"]
    end
    subgraph CERCLE["CERCLE RESTREINT - accès sur permission, seulement si la communauté l'active*"]
      direction LR
      R1["Pages réservées - documents de travail<br/>se prolonge sur le forum (catégorie restreinte)"]
    end
    subgraph ANIM["ANIMATION - réservé aux animateur·rices"]
      direction LR
      G1["Accueil - réglages -<br/>modération du périmètre"]
    end

    M --> PARTAGE
    CR --> PARTAGE
    CR --> CERCLE
    AN --> PARTAGE
    AN --> CERCLE
    AN ==> ANIM

    classDef people fill:#eeeef8,stroke:#4e4e88,color:#3d3d5c
    classDef espace fill:#fdfbf9,stroke:#b09570,color:#1a1512

    class M,CR,AN people
    class E1,E2,R1,G1 espace

    style PARTAGE fill:#f6faea,stroke:#586330,stroke-width:1.2px,color:#3d4d1f
    style CERCLE fill:#f5edf2,stroke:#885060,stroke-width:1.2px,stroke-dasharray:6 4,color:#5a3038
    style ANIM fill:#ffdbcc,stroke:#9c3f00,stroke-width:1.2px,color:#7a3000
```

**Lecture** :

- Les trois cadres représentent l'intérieur d'une **même communauté** ; les trois profils
  à gauche sont ses membres. Une flèche = « a accès à ».
- Le **cadre en pointillés** signale un espace optionnel : le cercle restreint est un outil
  à activer, pas une règle imposée*. Une communauté sans cercle restreint est parfaitement
  valable (deux positions seulement : membre, animateur·rice). On entre dans le cercle sur
  permission de l'équipe d'animation, sur la plateforme comme sur le forum (catégorie
  restreinte).
- L'entrée dans une communauté, elle, est libre partout (décision d'août 2026). Chaque
  communauté arbitre **deux curseurs** : cercle restreint (activé ou non), écriture des
  pages (animateur·rices seulement ou tout le groupe). Détail et réglages YesWiki
  correspondants : référentiel, section 2.
- Techniquement, ces choix se traduisent en **groupes et ACL natifs** ; leur exécution
  passe aujourd'hui par un·e admin de la plateforme (la gestion des groupes est réservée
  aux admins, référentiel 4.7).

## Variante simplifiée (parcours de participation)

À utiliser en page d'accueil ou dans un mail d'accueil : le parcours plutôt que
l'emboîtement. Les flèches en pointillés signalent les passages dont le cadre reste à
préciser*.

```mermaid
flowchart LR
    V["1<br/>Visiteur·euse"] -- "s'inscrire" --> I["2<br/>Inscrit·e"]
    I -- "rejoindre une<br/>communauté" --> C["3<br/>Membre de<br/>communauté"]
    C -. "animer*" .-> A["4<br/>Animateur·rice"]
    A -. "désignation*" .-> P["5<br/>Admin<br/>plateforme"]

    classDef n1 fill:#fdfbf9,stroke:#8c7166,color:#1a1512
    classDef n2 fill:#eeeef8,stroke:#4e4e88,color:#3d3d5c
    classDef n3 fill:#ffdbcc,stroke:#9c3f00,color:#7a3000
    classDef n4 fill:#dbe9a9,stroke:#586330,color:#3d4d1f
    classDef n5 fill:#9c3f00,stroke:#7a3000,color:#fdfbf9,stroke-width:2px
    class V n1
    class I n2
    class C n3
    class A n4
    class P n5
```

## Export PNG pour le wiki

YesWiki ne rend pas Mermaid nativement. Pour publier ces schémas sur [e-sol.fr](https://e-sol.fr) :

1. `node build.js` puis `node scripts/capture-village.js` : la vue communauté est rendue
   localement (mêmes bibliothèque, thème et polices que la démo) et exportée en
   `src/img/portage/roles-vue-communaute.png` (~1200 px de large). L'infographie compagne
   `src/components/illustration-roles.html` (le sentier) est exportée par la même commande en
   `src/img/portage/roles-cinq-niveaux.png`. Repli manuel : mermaid.live (procédure au § 2.2
   de `docs/00-portage-README.md`).
2. Téléverser sur la page wiki cible (proposition : `?RolesEtDroits`, nom à valider).
3. Garder ce fichier `.md` comme source éditable : tout changement de droits se répercute
   d'abord dans `docs/roles-et-droits.md`, puis ici, puis dans les exports.

## À mettre à jour quand…

- Le référentiel `docs/roles-et-droits.md` évolue (validations de Lucile, réponses de
  Laurent) : c'est lui la source, les schémas suivent.
- Les points marqués `*` sont tranchés : retirer la mention et figer le libellé
  (cercle restreint, cadre du rôle d'animation, attribution du rôle admin).
- Le vocabulaire du rôle d'animation est arbitré (animateur·rice / référent·e /
  coordinateur·rice) : harmoniser tous les libellés.
- Les groupes par communauté sont branchés sur le formulaire d'inscription (le niveau 3
  cesse d'être purement déclaratif).
- La liste des statuts reconnus change (ajouts « porteur de projet SRP Sol » et
  « référent Soléar » notamment) : vérifier si un schéma doit les mentionner.
