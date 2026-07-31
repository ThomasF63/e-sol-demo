# Schéma de gouvernance e-Sol

Diagramme Mermaid versionnable du fonctionnement institutionnel d'e-Sol.
Source de vérité : [Charte e-sol.fr](https://e-sol.fr/?Charte).

## Vue d'ensemble

```mermaid
flowchart TB
    %% ---------- Nodes ----------
    AFES[("<b>AFES</b><br/><i>Association porteuse</i><br/>anime · héberge · valorise")]
    COPIL["<b>COPIL e-Sol</b><br/>AFES · GIS Sol · RMT Sols et Territoires · RNEST<br/><i>soutien : ADEME, OFB</i>"]

    subgraph PIECES["LES PIÈCES — communautés thématiques"]
      direction LR
      C1["Fresque<br/>du Sol"]
      C2["Sols<br/>Forestiers"]
      C3["ZAN ·<br/>Aménagement"]
      C4["Pédologie<br/>de Terrain"]
      C5["+ autres<br/>communautés"]
    end

    subgraph COMMUNS["LES OUTILS PARTAGÉS — communs"]
      direction LR
      K1["Données<br/>&amp; cartes"]
      K2["Guides &amp;<br/>protocoles"]
      K3["Kits<br/>pédagogiques"]
      K4["Outils<br/>logiciels"]
    end

    MEMBRES(["<b>Membres</b><br/>chercheurs · praticiens<br/>citoyens · étudiants"])
    SOCIETE[/"<b>Société &amp; partenaires</b><br/>institutions · public · acteurs"\]

    %% ---------- Relations ----------
    AFES -. "siège &amp; anime" .-> COPIL
    COPIL == "oriente · arbitre" ==> PIECES
    COPIL == "valide · valorise" ==> COMMUNS

    MEMBRES -- "rejoignent" --> PIECES
    PIECES == "produisent" ==> COMMUNS
    COMMUNS -- "bénéficient à" --> SOCIETE
    COMMUNS -. "retombées →&nbsp;animation" .-> AFES

    %% ---------- Styles ----------
    classDef afes fill:#9c3f00,stroke:#7a3000,color:#fdfbf9,stroke-width:2px
    classDef copil fill:#fdfbf9,stroke:#9c3f00,color:#1a1512,stroke-width:1.5px
    classDef community fill:#ffdbcc,stroke:#9c3f00,color:#7a3000
    classDef commun fill:#dbe9a9,stroke:#586330,color:#3d4d1f
    classDef people fill:#eeeef8,stroke:#4e4e88,color:#3d3d5c
    classDef society fill:#f5edf2,stroke:#885060,color:#5a3038

    class AFES afes
    class COPIL copil
    class C1,C2,C3,C4,C5 community
    class K1,K2,K3,K4 commun
    class MEMBRES people
    class SOCIETE society

    style PIECES fill:#fff7f0,stroke:#9c3f00,stroke-width:1.5px,color:#9c3f00
    style COMMUNS fill:#f6faea,stroke:#586330,stroke-width:1.5px,color:#586330
```

## Lecture du schéma

- **AFES** est l'**association porteuse**. Elle anime le réseau et l'héberge techniquement, mais ne possède ni les communautés ni les communs.
- Le **COPIL e-Sol** est l'instance multi-acteurs qui oriente le réseau : AFES + GIS Sol + RMT Sols et Territoires + RNEST, avec le soutien de l'ADEME et de l'OFB.
- Les **membres** rejoignent une ou plusieurs **pièces** (communautés thématiques).
- Les **pièces produisent des outils partagés** (communs) : données, guides, kits, logiciels.
- Les **communs bénéficient à la société et aux partenaires** (intérêt général).
- Les **retombées de la valorisation** des communs alimentent l'animation (cycle vertueux).

## Variante simplifiée (3 niveaux)

À utiliser en page d'accueil YesWiki ou en pied de mail d'accueil — plus accessible que la version complète.

```mermaid
flowchart LR
    AFES[("<b>AFES</b><br/>+ COPIL")]
    PIECES["<b>Communautés</b><br/><i>les pièces de la maison</i>"]
    COMMUNS["<b>Communs</b><br/><i>les outils partagés</i>"]
    SOCIETE["<b>Société</b><br/><i>bénéficiaires</i>"]

    AFES -- "anime" --> PIECES
    PIECES -- "produisent" --> COMMUNS
    COMMUNS -- "bénéficient à" --> SOCIETE

    classDef a fill:#9c3f00,stroke:#7a3000,color:#fdfbf9,stroke-width:2px
    classDef b fill:#ffdbcc,stroke:#9c3f00,color:#7a3000
    classDef c fill:#dbe9a9,stroke:#586330,color:#3d4d1f
    classDef d fill:#f5edf2,stroke:#885060,color:#5a3038
    class AFES a
    class PIECES b
    class COMMUNS c
    class SOCIETE d
```

## Export PNG / SVG pour le wiki

YesWiki ne rend pas Mermaid nativement. Pour publier ce schéma sur [e-sol.fr](https://e-sol.fr) :

1. Coller le bloc Mermaid dans [mermaid.live](https://mermaid.live).
2. Exporter en **PNG** (largeur ~1200px) ou **SVG**.
3. Déposer dans `src/img/maison/` (versions repo) et téléverser sur la page wiki cible (`?MaisonESol` ou `?Gouvernance`).
4. Garder ce fichier `.md` comme source éditable — tout changement de gouvernance se reflète ici en premier.

## À mettre à jour quand…

- Une nouvelle communauté significative est lancée (ajouter dans le subgraph PIECES si pertinent).
- La composition du COPIL change (entrée/sortie d'un partenaire).
- La typologie des communs évolue (cf. phase 4 du plan : cycle de vie).
- Les modalités de retombées économiques changent dans la Charte.
