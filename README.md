# e-Sol Demo - Prototype v3

Prototype haute-fidélité du nouveau site **e-sol.fr**, le réseau collaboratif pour la connaissance et la préservation des sols, porté par l'[AFES](https://www.afes.fr).

> ⚡ **Démo statique** - Ce site est un prototype de design. Il ne contient pas de backend ni de connexion à la base de données YesWiki de production.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Accueil - hero, gare d'aiguillage des besoins, aperçu communautés |
| `village-esol.html` | Le village e-Sol - visite illustrée de la plateforme (SVG cliquable) |
| `maison-esol.html` | La maison e-Sol (ancienne métaphore, conservée) |
| `premiers-pas.html` | Premiers pas - les cinq gestes du nouveau membre |
| `qu-est-ce-qu-une-communaute.html` | Comprendre les communautés - cycle de vie, positions, rejoindre, proposer |
| `communautes.html` | Liste filtrable des 12 communautés thématiques |
| `communaute-detail.html` | Fiche détaillée d'une communauté (onglets, équipe d'animation) |
| `communs.html` | Ressources partagées (Communs) - origines, cycle de vie, proposer |
| `commun-detail.html` | Fiche détaillée d'un Commun |
| `annuaire.html` | Annuaire des membres (recherche + grille/liste) |
| `membre.html` | Profil membre |
| `charte.html` | Charte du réseau (sommaire flottant) |
| `roles-et-droits.html` | Rôles et droits - cinq niveaux, positions, curseurs |
| `participer.html` | Comment participer |
| `espace-actions.html` | L'Espace Actions - missions bénévoles des communautés (fiches actions, formulaire « Me proposer ») |
| `espace-actions-suivi.html` | Vue équipe d'animation - propositions reçues par action, statuts de traitement (démo) |
| `inscription.html` | Formulaire d'inscription (communautés + signature de la charte) |
| `annonces.html` | Petites annonces (offres/demandes/infos) |
| `contact.html` | Formulaire de contact |
| `retour.html` | Formulaire de retour (avis par espace) |
| `tutoriels.html` | Centre de ressources - recherche, filtres, FAQ |
| `tutoriels-forum.html` | Le forum, pas à pas - série de 8 fiches (captures annotées) |
| `glossaire.html` | Glossaire du réseau |
| `gallery.html` | Galerie interne de revue des images |

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
                  infobulle.html ← petit « i » explicatif au survol, à inclure en fin de body
  pages/        ← 24 pages HTML
  data/         ← JSON fixtures (communities, communs, members, actions, ressources)
dist/           ← sortie compilée (gitignored)
build.js        ← compilateur simple (inclusion de composants)
```

## Données

Les fichiers JSON dans `src/data/` sont structurés pour correspondre aux futurs formulaires Bazar de YesWiki :

- `communities.json` - 12 communautés réelles d'e-Sol (équipes d'animation fictives)
- `communs.json` - 9 ressources partagées
- `members-sample.json` - 100 profils de membres **entièrement fictifs**, générés par `scripts/generate-fake-members.js`
- `actions.json` - 6 fiches actions **fictives** (missions bénévoles)
- `participations.json` - 8 propositions **fictives** sur les fiches actions (structure calquée sur le futur formulaire Bazar « Participation », voir `docs/circuits-participation-yeswiki.md`)
- `ressources.json` - 21 fiches du centre de ressources

> 🔒 **Données personnelles** - L'annuaire, les profils et les annonces de cette démo ne contiennent aucune personne réelle : noms, structures, rôles et coordonnées sont inventés (e-mails sur le domaine réservé `example.org`). Toute ressemblance avec des personnes réelles serait fortuite.

## Intégration YesWiki

Ce prototype sert de **spécification visuelle** pour la création de :
1. Templates Bazar personnalisés (`custom/templates/bazar/`)
2. Nouveaux formulaires Bazar (Communautés, Communs)
3. Thème CSS override

Voir le dépôt [afes-yeswiki-collab](https://github.com/ThomasF63/afes-yeswiki-collab) pour la documentation d'intégration technique.

## Licence

Ce projet est développé dans le cadre du réseau e-Sol / AFES.

## Exports

- `exports/schemas-esol.pptx` - les 5 schémas clés (sentier des niveaux, gouvernance, vue communauté, premiers pas, village) en formes natives éditables dans PowerPoint ou Google Slides. Régénérer avec `python scripts/build-pptx.py`.
- Polices : Outfit et Inter (Google Fonts, licence OFL). Sans elles, une police de substitution s'affiche ; la mise en page le supporte, mais les installer donne le rendu fidèle.
