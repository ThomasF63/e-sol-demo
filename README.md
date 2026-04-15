# e-Sol Demo — Prototype v3

Prototype haute-fidélité du nouveau site **e-sol.fr**, le réseau collaboratif pour la connaissance et la préservation des sols, porté par l'[AFES](https://www.afes.fr).

> ⚡ **Démo statique** — Ce site est un prototype de design. Il ne contient pas de backend ni de connexion à la base de données YesWiki de production.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Accueil — hero, statistiques, parcours, aperçu communautés |
| `communautes.html` | Liste filtrable des 12 communautés thématiques |
| `communaute-detail.html` | Fiche détaillée d'une communauté (onglets) |
| `communs.html` | Ressources partagées (Communs) |
| `commun-detail.html` | Fiche détaillée d'un Commun |
| `annuaire.html` | Annuaire des membres (recherche + grille/liste) |
| `membre.html` | Profil membre |
| `charte.html` | Charte du réseau (scroll-spy) |
| `participer.html` | Comment participer |
| `inscription.html` | Formulaire d'inscription |
| `annonces.html` | Petites annonces (offres/demandes/infos) |
| `contact.html` | Formulaire de contact |
| `retour.html` | Formulaire de feedback |
| `tutoriels.html` | Ressources & FAQ |

## Lancer en local

```bash
node build.js
npx http-server dist/ -p 3000 --cors -c-1
# → http://localhost:3000/index.html
```

## Structure

```
src/
  components/   ← head.html, header.html, footer.html (design system)
  pages/        ← 14 pages HTML
  data/         ← JSON fixtures (communities, communs, members)
dist/           ← sortie compilée (gitignored)
build.js        ← compilateur simple (inclusion de composants)
```

## Données

Les fichiers JSON dans `src/data/` sont structurés pour correspondre aux futurs formulaires Bazar de YesWiki :

- `communities.json` — 12 communautés réelles d'e-Sol
- `communs.json` — 9 ressources partagées
- `members-sample.json` — 20 membres représentatifs

## Intégration YesWiki

Ce prototype sert de **spécification visuelle** pour la création de :
1. Templates Bazar personnalisés (`custom/templates/bazar/`)
2. Nouveaux formulaires Bazar (Communautés, Communs)
3. Thème CSS override

Voir le dépôt [afes-yeswiki-collab](https://github.com/ThomasF63/afes-yeswiki-collab) pour la documentation d'intégration technique.

## Licence

Ce projet est développé dans le cadre du réseau e-Sol / AFES.
