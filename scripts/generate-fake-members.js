/**
 * Génère src/data/members-sample.json : 100 profils ENTIÈREMENT FICTIFS.
 *
 * Toutes les personnes de ce fichier sont inventées pour la démonstration.
 * Aucun nom, rôle, structure ou coordonnée ne correspond à un membre réel
 * du réseau e-Sol. Les noms ont été contrôlés contre l'annuaire réel
 * (aucune collision de nom de famille) et les adresses e-mail utilisent le
 * domaine réservé example.org (RFC 2606). Toute ressemblance avec des
 * personnes réelles serait fortuite.
 *
 * Usage : node scripts/generate-fake-members.js
 * Sortie déterministe (PRNG à graine fixe) : le fichier généré est stable.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// PRNG déterministe (mulberry32)
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260731);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// ---------------------------------------------------------------------------
// Villes (coordonnées approximatives, usage cartographique de démonstration)
// ---------------------------------------------------------------------------
const CITIES = {
  'Lyon':             { region: 'Auvergne-Rhône-Alpes', lat: 45.7640, lng: 4.8357 },
  'Grenoble':         { region: 'Auvergne-Rhône-Alpes', lat: 45.1885, lng: 5.7245 },
  'Clermont-Ferrand': { region: 'Auvergne-Rhône-Alpes', lat: 45.7772, lng: 3.0870 },
  'Annecy':           { region: 'Auvergne-Rhône-Alpes', lat: 45.8992, lng: 6.1294 },
  'Valence':          { region: 'Auvergne-Rhône-Alpes', lat: 44.9334, lng: 4.8924 },
  'Dijon':            { region: 'Bourgogne-Franche-Comté', lat: 47.3220, lng: 5.0415 },
  'Besançon':         { region: 'Bourgogne-Franche-Comté', lat: 47.2378, lng: 6.0241 },
  'Rennes':           { region: 'Bretagne', lat: 48.1173, lng: -1.6778 },
  'Brest':            { region: 'Bretagne', lat: 48.3904, lng: -4.4861 },
  'Quimper':          { region: 'Bretagne', lat: 47.9960, lng: -4.1024 },
  'Vannes':           { region: 'Bretagne', lat: 47.6582, lng: -2.7608 },
  'Orléans':          { region: 'Centre-Val de Loire', lat: 47.9029, lng: 1.9039 },
  'Tours':            { region: 'Centre-Val de Loire', lat: 47.3941, lng: 0.6848 },
  'Bourges':          { region: 'Centre-Val de Loire', lat: 47.0810, lng: 2.3988 },
  'Ajaccio':          { region: 'Corse', lat: 41.9192, lng: 8.7386 },
  'Strasbourg':       { region: 'Grand Est', lat: 48.5734, lng: 7.7521 },
  'Nancy':            { region: 'Grand Est', lat: 48.6921, lng: 6.1844 },
  'Reims':            { region: 'Grand Est', lat: 49.2583, lng: 4.0317 },
  'Metz':             { region: 'Grand Est', lat: 49.1193, lng: 6.1757 },
  'Lille':            { region: 'Hauts-de-France', lat: 50.6292, lng: 3.0573 },
  'Amiens':           { region: 'Hauts-de-France', lat: 49.8941, lng: 2.2958 },
  'Beauvais':         { region: 'Hauts-de-France', lat: 49.4295, lng: 2.0807 },
  'Paris':            { region: 'Île-de-France', lat: 48.8566, lng: 2.3522 },
  'Versailles':       { region: 'Île-de-France', lat: 48.8014, lng: 2.1301 },
  'Créteil':          { region: 'Île-de-France', lat: 48.7904, lng: 2.4556 },
  'Cergy':            { region: 'Île-de-France', lat: 49.0364, lng: 2.0761 },
  'Rouen':            { region: 'Normandie', lat: 49.4432, lng: 1.0993 },
  'Caen':             { region: 'Normandie', lat: 49.1829, lng: -0.3707 },
  'Bordeaux':         { region: 'Nouvelle-Aquitaine', lat: 44.8378, lng: -0.5792 },
  'Poitiers':         { region: 'Nouvelle-Aquitaine', lat: 46.5802, lng: 0.3404 },
  'Limoges':          { region: 'Nouvelle-Aquitaine', lat: 45.8336, lng: 1.2611 },
  'Pau':              { region: 'Nouvelle-Aquitaine', lat: 43.2951, lng: -0.3708 },
  'La Rochelle':      { region: 'Nouvelle-Aquitaine', lat: 46.1603, lng: -1.1511 },
  'Toulouse':         { region: 'Occitanie', lat: 43.6047, lng: 1.4442 },
  'Montpellier':      { region: 'Occitanie', lat: 43.6108, lng: 3.8767 },
  'Perpignan':        { region: 'Occitanie', lat: 42.6887, lng: 2.8948 },
  'Albi':             { region: 'Occitanie', lat: 43.9298, lng: 2.1480 },
  'Rodez':            { region: 'Occitanie', lat: 44.3506, lng: 2.5750 },
  'Nantes':           { region: 'Pays de la Loire', lat: 47.2184, lng: -1.5536 },
  'Angers':           { region: 'Pays de la Loire', lat: 47.4784, lng: -0.5632 },
  'Le Mans':          { region: 'Pays de la Loire', lat: 48.0061, lng: 0.1996 },
  'Marseille':        { region: 'Provence-Alpes-Côte d\'Azur', lat: 43.2965, lng: 5.3698 },
  'Aix-en-Provence':  { region: 'Provence-Alpes-Côte d\'Azur', lat: 43.5297, lng: 5.4474 },
  'Avignon':          { region: 'Provence-Alpes-Côte d\'Azur', lat: 43.9493, lng: 4.8055 },
  'Nice':             { region: 'Provence-Alpes-Côte d\'Azur', lat: 43.7102, lng: 7.2620 },
  'Gap':              { region: 'Provence-Alpes-Côte d\'Azur', lat: 44.5612, lng: 6.0820 },
  'Saint-Denis':      { region: 'La Réunion', lat: -20.8789, lng: 55.4481 },
  'Pointe-à-Pitre':   { region: 'Guadeloupe', lat: 16.2410, lng: -61.5331 },
  'Fort-de-France':   { region: 'Martinique', lat: 14.6161, lng: -61.0588 },
  'Cayenne':          { region: 'Guyane', lat: 4.9224, lng: -52.3134 },
  'Gembloux':         { region: 'International', lat: 50.5622, lng: 4.6889 },
  'Lausanne':         { region: 'International', lat: 46.5197, lng: 6.6323 },
  'Québec':           { region: 'International', lat: 46.8139, lng: -71.2080 },
  'Dakar':            { region: 'International', lat: 14.7167, lng: -17.4677 },
};

// ---------------------------------------------------------------------------
// Profils types : structures (inventées ou génériques) + fonctions génériques
// + communautés de prédilection. Aucune institution réelle n'est nommée.
// ---------------------------------------------------------------------------
const TYPES = {
  recherche: {
    orgs: ['Laboratoire public de recherche', 'Institut de recherche en agronomie', 'Université publique', 'Observatoire régional des sols'],
    roles: {
      m: ['Chercheur en science du sol', 'Enseignant-chercheur', 'Doctorant en pédologie', 'Ingénieur d\'études', 'Technicien de laboratoire', 'Cartographe des sols'],
      f: ['Chercheuse en écologie des sols', 'Enseignante-chercheuse', 'Doctorante en biogéochimie', 'Ingénieure d\'études', 'Technicienne de laboratoire', 'Cartographe des sols'],
    },
    comms: ['srp-sols', 'refersols', 'iprsol', 'zones-humides', 'promosolsterrain'],
  },
  enseignement: {
    orgs: ['Lycée agricole de Valbrenon', 'Lycée agricole du Pays d\'Ambelle', 'Établissement d\'enseignement agricole', 'École supérieure d\'agronomie', 'Collège public'],
    roles: {
      m: ['Enseignant en agronomie', 'Enseignant en SVT', 'Formateur en pédologie', 'Responsable pédagogique'],
      f: ['Enseignante en agronomie', 'Enseignante en SVT', 'Formatrice en agroécologie', 'Responsable pédagogique'],
    },
    comms: ['promosolseduc', 'fresque-sol', 'promosolsterrain'],
  },
  conseil: {
    orgs: ['Cabinet Pédoconseil', 'Bureau d\'études Terre & Talus', 'Bureau d\'études indépendant', 'Cabinet de conseil en agroécologie', 'Atelier Terre & Pente'],
    roles: {
      m: ['Pédologue consultant', 'Ingénieur agronome', 'Consultant en gestion des sols', 'Chargé d\'études environnement'],
      f: ['Pédologue consultante', 'Ingénieure environnement', 'Consultante en gestion des sols', 'Chargée d\'études environnement'],
    },
    comms: ['secteur-prive', 'zan', 'srp-sols'],
  },
  associatif: {
    orgs: ['Association d\'éducation à l\'environnement', 'Association Racines & Humus', 'Maison de la nature du Val Doré', 'Centre d\'initiation à l\'environnement'],
    roles: {
      m: ['Animateur nature', 'Animateur de la Fresque du Sol', 'Médiateur scientifique', 'Chargé de mission biodiversité', 'Coordinateur d\'ateliers pédagogiques'],
      f: ['Animatrice nature', 'Animatrice de la Fresque du Sol', 'Médiatrice scientifique', 'Chargée de mission biodiversité', 'Coordinatrice d\'ateliers pédagogiques'],
    },
    comms: ['fresque-sol', 'promosolseduc', 'sols-et-art', 'zones-humides'],
  },
  collectivite: {
    orgs: ['Collectivité territoriale', 'Communauté de communes', 'Parc naturel régional', 'Agence d\'urbanisme', 'Syndicat de rivière'],
    roles: {
      m: ['Urbaniste', 'Chargé de mission sols et foncier', 'Ingénieur territorial', 'Chargé de mission zones humides', 'Technicien rivières'],
      f: ['Urbaniste', 'Chargée de mission sols et foncier', 'Ingénieure territoriale', 'Chargée de mission zones humides', 'Technicienne rivières'],
    },
    comms: ['zan', 'zones-humides', 'refersols'],
  },
  agri: {
    orgs: ['Exploitation agricole', 'Domaine viticole', 'Coopérative agricole', 'Groupement forestier', 'Ferme en polyculture-élevage'],
    roles: {
      m: ['Agriculteur', 'Viticulteur', 'Technicien forestier', 'Maraîcher en agroécologie', 'Conseiller viticole'],
      f: ['Agricultrice', 'Vigneronne', 'Forestière', 'Maraîchère en agroécologie', 'Conseillère viticole'],
    },
    comms: ['promosolsterrain', 'iprsol', 'fresque-sol', 'secteur-prive'],
  },
  art: {
    orgs: ['Atelier d\'artiste', 'Collectif Terre & Encre', 'Compagnie de théâtre scientifique', 'Atelier indépendant'],
    roles: {
      m: ['Artiste plasticien', 'Photographe naturaliste', 'Céramiste', 'Illustrateur scientifique', 'Scénographe'],
      f: ['Artiste plasticienne', 'Photographe naturaliste', 'Céramiste', 'Illustratrice scientifique', 'Scénographe'],
    },
    comms: ['sols-et-art', 'fresque-sol'],
  },
  autre: {
    orgs: { m: ['Université publique', 'Indépendant', 'Retraité de l\'agronomie', 'En reconversion professionnelle'], f: ['Université publique', 'Indépendante', 'Retraitée de l\'agronomie', 'En reconversion professionnelle'] },
    roles: {
      m: ['Étudiant en BTS Gestion et protection de la nature', 'Étudiant en master Sols et Environnement', 'Citoyen engagé pour les sols', 'Pédologue retraité'],
      f: ['Étudiante en master Sols et Environnement', 'Étudiante en BTS Gestion et protection de la nature', 'Citoyenne engagée pour les sols', 'Pédologue retraitée'],
    },
    comms: ['fresque-sol', 'srp-sols', 'sols-et-art', 'zan'],
  },
};

// Prénoms féminins utilisés (pour accorder rôles et structures)
const FEMALE = new Set(['Solène', 'Claire', 'Inès', 'Olivia', 'Jeanne', 'Cécile', 'Maud', 'Nadia', 'Margot', 'Perrine', 'Capucine', 'Anouk', 'Léonie', 'Faustine', 'Suzanne', 'Apolline', 'Romane', 'Estelle', 'Mona', 'Héloïse', 'Garance', 'Sidonie', 'Colette', 'Bérénice', 'Judith', 'Flavie', 'Prune', 'Victoire', 'Irène', 'Salomé', 'Maëlys', 'Daphné', 'Constance', 'Rosalie', 'Philomène', 'Agathe', 'Honorine', 'Thaïs', 'Clarisse', 'Bertille', 'Ambre', 'Lucile', 'Angèle', 'Isaure', 'Delphine', 'Awa', 'Livia', 'Elena', 'Astrid', 'Maialen', 'Quitterie', 'Sybille']);

const VALID_COMMUNITIES = ['fresque-sol', 'iprsol', 'promosolseduc', 'promosolsterrain', 'refersols', 'secteur-prive', 'srp-sols', 'zan', 'sols-et-art', 'afes-comm', 'afes-admins', 'zones-humides'];

// ---------------------------------------------------------------------------
// Les 100 personnes fictives.
// Entrée : [prénom, nom, profilType, ville, overrides?]
// Les 10 premières reprennent la distribution fictive des guides e-Sol.
// ---------------------------------------------------------------------------
const PEOPLE = [
  // --- Distribution fictive des guides (personnages récurrents) ---
  ['Solène', 'Reverdy', 'conseil', 'Poitiers', {
    org: 'Cabinet Pédoconseil', role: 'Pédologue consultante',
    comms: ['secteur-prive', 'srp-sols', 'afes-comm'], since: 2025,
    bio: 'Pédologue de formation, passionnée par la vie des sols et leur place dans les paysages agricoles. Fondatrice du Cabinet Pédoconseil, elle accompagne collectivités et exploitations dans le diagnostic et la préservation de la qualité des sols. Engagée dans le réseau e-Sol pour relier praticiens et chercheurs autour de la connaissance des sols.',
  }],
  ['Claire', 'Rabeau', 'enseignement', 'Quimper', { role: 'Enseignante en agronomie', comms: ['promosolseduc', 'fresque-sol'], since: 2025 }],
  ['Pierre', 'Reynal', 'collectivite', 'Toulouse', { role: 'Chargé de mission sols et foncier', comms: ['zan'], since: 2025 }],
  ['Lucas', 'Riveau', 'recherche', 'Clermont-Ferrand', { role: 'Doctorant en pédologie', comms: ['srp-sols', 'promosolsterrain'], since: 2026 }],
  ['Hugo', 'Rouvel', 'collectivite', 'Angers', { org: 'Syndicat de rivière', role: 'Technicien rivières', comms: ['zones-humides'], since: 2025 }],
  ['Inès', 'Sablon', 'associatif', 'Paris', { role: 'Médiatrice scientifique', comms: ['fresque-sol', 'promosolseduc'], since: 2025 }],
  ['Octave', 'Sorel', 'autre', 'Tours', { org: 'Retraité de l\'agronomie', role: 'Pédologue retraité', comms: ['refersols', 'afes-admins'], since: 2025 }],
  ['Olivia', 'Suzeau', 'agri', 'Lille', { org: 'Coopérative agricole', role: 'Ingénieure agronome', comms: ['secteur-prive', 'fresque-sol'], since: 2025 }],
  ['Jeanne', 'Tisserand', 'associatif', 'Strasbourg', { role: 'Animatrice nature', comms: ['fresque-sol', 'zones-humides'], since: 2026 }],
  ['Cécile', 'Chanteloup', 'collectivite', 'Caen', { role: 'Chargée d\'études environnement', comms: ['zones-humides', 'zan'], since: 2025 }],
  // --- Auteurs fictifs des petites annonces de la démo ---
  ['Marceau', 'Villandreau', 'associatif', 'Lyon', { org: 'Indépendant', role: 'Formateur, animateur de la Fresque du Sol', comms: ['fresque-sol', 'promosolseduc'], since: 2025 }],
  ['Maud', 'Quernec', 'recherche', 'Rennes', { org: 'Laboratoire public de recherche', role: 'Ingénieure d\'études', comms: ['refersols', 'srp-sols'], since: 2025 }],
  ['Basile', 'Crémancey', 'recherche', 'Dijon', { org: 'Institut de recherche en agronomie', role: 'Enseignant-chercheur', comms: ['promosolsterrain', 'srp-sols'], since: 2025 }],
  ['Nadia', 'Azeroual', 'recherche', 'Montpellier', { role: 'Chercheuse en science du sol', comms: ['srp-sols', 'iprsol'], since: 2025 }],
  // --- Autres membres fictifs ---
  ['Margot', 'Aubrelle', 'recherche', 'Toulouse'],
  ['Tristan', 'Auberton', 'conseil', 'Lyon'],
  ['Perrine', 'Balivet', 'associatif', 'Grenoble'],
  ['Joachim', 'Bassenot', 'collectivite', 'Paris'],
  ['Capucine', 'Beaulande', 'agri', 'Rodez'],
  ['Côme', 'Bellandry', 'recherche', 'Nancy'],
  ['Anouk', 'Berthomiel', 'art', 'Marseille'],
  ['Étienne', 'Boisredon', 'agri', 'Limoges'],
  ['Léonie', 'Bourdanel', 'enseignement', 'Dijon'],
  ['Marius', 'Brelaude', 'autre', 'Rennes'],
  ['Faustine', 'Cabriel', 'recherche', 'Grenoble'],
  ['Théodore', 'Calvray', 'conseil', 'Nantes'],
  ['Suzanne', 'Chambeline', 'associatif', 'Bourges'],
  ['Rémi', 'Chandorne', 'collectivite', 'Lille'],
  ['Apolline', 'Clairfont', 'recherche', 'Paris'],
  ['Gaspard', 'Cormillet', 'agri', 'Avignon'],
  ['Romane', 'Coudrelle', 'associatif', 'Nantes'],
  ['Alban', 'Courbassier', 'collectivite', 'Marseille'],
  ['Estelle', 'Darbelin', 'conseil', 'Versailles'],
  ['Hector', 'Demonceau', 'recherche', 'Gembloux'],
  ['Mona', 'Deslandiers', 'art', 'Paris'],
  ['Corentin', 'Dorvanne', 'recherche', 'Brest'],
  ['Héloïse', 'Doussaint', 'enseignement', 'Amiens'],
  ['Loïs', 'Escurel', 'autre', 'Montpellier'],
  ['Garance', 'Estivel', 'collectivite', 'Bordeaux'],
  ['Armand', 'Fabreguettes', 'conseil', 'Albi'],
  ['Sidonie', 'Falourde', 'associatif', 'Pointe-à-Pitre'],
  ['Maxence', 'Fauvernay', 'agri', 'Dijon'],
  ['Colette', 'Ferrandeau', 'autre', 'La Rochelle'],
  ['Ulysse', 'Flourette', 'art', 'Strasbourg'],
  ['Bérénice', 'Fontarel', 'recherche', 'Orléans'],
  ['Simon', 'Fougerat', 'agri', 'Gap'],
  ['Judith', 'Frémanteau', 'collectivite', 'Rouen'],
  ['Antonin', 'Galichet', 'enseignement', 'Toulouse'],
  ['Flavie', 'Gaubertin', 'recherche', 'Versailles'],
  ['Oscar', 'Gauvrelle', 'associatif', 'Lille'],
  ['Prune', 'Guilloreau', 'conseil', 'Angers'],
  ['Blaise', 'Hautclair', 'recherche', 'Montpellier'],
  ['Victoire', 'Jarlande', 'collectivite', 'Créteil'],
  ['Irène', 'Jouvenceau', 'recherche', 'Québec'],
  ['Gaëtan', 'Lambrunie', 'agri', 'Perpignan'],
  ['Salomé', 'Landrevie', 'associatif', 'Poitiers'],
  ['Basile', 'Lanternier', 'art', 'Aix-en-Provence'],
  ['Maëlys', 'Laurency', 'recherche', 'Rennes'],
  ['Ernest', 'Lavoinette', 'autre', 'Beauvais'],
  ['Daphné', 'Lespinal', 'recherche', 'Aix-en-Provence'],
  ['Timothée', 'Malaubert', 'conseil', 'Clermont-Ferrand'],
  ['Constance', 'Marvezy', 'collectivite', 'Metz'],
  ['Aurélien', 'Mazerolle', 'enseignement', 'Vannes'],
  ['Rosalie', 'Mervoyer', 'associatif', 'Caen'],
  ['Cyprien', 'Montarlot', 'agri', 'Besançon'],
  ['Philomène', 'Orvanne', 'recherche', 'Tours'],
  ['Léandre', 'Peyrissac', 'conseil', 'Toulouse'],
  ['Agathe', 'Plancheret', 'enseignement', 'Brest'],
  ['Edgar', 'Pontaverne', 'collectivite', 'Annecy'],
  ['Honorine', 'Pradelet', 'associatif', 'Valence'],
  ['Éloi', 'Rambourdin', 'conseil', 'Reims'],
  ['Thaïs', 'Salvagnac', 'recherche', 'Montpellier'],
  ['Anatole', 'Sarrelouve', 'agri', 'Quimper'],
  ['Clarisse', 'Saulniers', 'collectivite', 'Nantes'],
  ['Milo', 'Sauvebonne', 'associatif', 'Ajaccio'],
  ['Augustin', 'Sévanne', 'agri', 'Saint-Denis'],
  ['Bertille', 'Solignat', 'enseignement', 'Clermont-Ferrand'],
  ['Grégoire', 'Talvande', 'recherche', 'Orléans'],
  ['Ambre', 'Tarnaud', 'collectivite', 'Fort-de-France'],
  ['Fernand', 'Valanceau', 'agri', 'Bordeaux'],
  ['Lucile', 'Valdeyron', 'conseil', 'Grenoble'],
  ['Stanislas', 'Vaneille', 'recherche', 'Paris'],
  ['Angèle', 'Vaudrenne', 'associatif', 'Rouen'],
  ['Mathurin', 'Verdalle', 'collectivite', 'Pau'],
  ['Isaure', 'Vernholles', 'art', 'Lyon'],
  ['Barnabé', 'Vignolet', 'autre', 'Strasbourg'],
  ['Delphine', 'Ymonet', 'conseil', 'Le Mans'],
  ['Samir', 'Benkacem', 'conseil', 'Marseille'],
  ['Awa', 'Koundoul', 'recherche', 'Dakar'],
  ['Livia', 'Santavella', 'art', 'Nice'],
  ['Elena', 'Corbanese', 'recherche', 'Lausanne'],
  ['Jonas', 'Federlin', 'agri', 'Strasbourg'],
  ['Astrid', 'Reinbach', 'collectivite', 'Metz'],
  ['Nuno', 'Almeirado', 'agri', 'Bordeaux'],
  ['Maialen', 'Arteguy', 'associatif', 'Pau'],
  ['Ibrahima', 'Diouma', 'associatif', 'Cayenne'],
  ['Vinh', 'Lam', 'recherche', 'Paris'],
  ['Quitterie', 'Boissenard', 'autre', 'Cergy'],
  ['Wandrille', 'Charnolet', 'agri', 'Besançon'],
  ['Sybille', 'Grandvoinet', 'enseignement', 'Nancy'],
];

// ---------------------------------------------------------------------------
// Assemblage
// ---------------------------------------------------------------------------
function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z-]/g, '').toLowerCase();
}

const seenCity = {};
const members = PEOPLE.map(([firstName, lastName, typeKey, city, overrides = {}]) => {
  const type = TYPES[typeKey];
  const cityInfo = CITIES[city];
  if (!type) throw new Error(`Profil type inconnu : ${typeKey} (${firstName} ${lastName})`);
  if (!cityInfo) throw new Error(`Ville inconnue : ${city} (${firstName} ${lastName})`);

  // Décalage léger et déterministe pour éviter les marqueurs superposés
  const n = (seenCity[city] = (seenCity[city] || 0) + 1);
  const jitter = (k) => Math.round((k + (n - 1) * 0.014 * (n % 2 === 0 ? 1 : -1)) * 10000) / 10000;

  const gender = FEMALE.has(firstName) ? 'f' : 'm';
  const pool = (x) => (Array.isArray(x) ? x : x[gender]);
  const org = overrides.org || pick(pool(type.orgs));
  const role = overrides.role || pick(pool(type.roles));
  let comms = overrides.comms;
  if (!comms) {
    const count = 1 + Math.floor(rand() * 2) + (rand() < 0.15 ? 1 : 0); // 1 à 3
    comms = [...new Set(Array.from({ length: count }, () => pick(type.comms)))];
  }
  comms.forEach((c) => {
    if (!VALID_COMMUNITIES.includes(c)) throw new Error(`Communauté inconnue : ${c}`);
  });

  const idFirst = stripAccents(firstName);
  const idLast = stripAccents(lastName);
  const member = {
    id: `${idLast}-${idFirst}`,
    firstName,
    lastName,
    organization: org,
    role,
    region: cityInfo.region,
    city,
    lat: jitter(cityInfo.lat),
    lng: jitter(cityInfo.lng),
    communities: comms,
    email: `${idFirst}.${idLast}@example.org`,
    memberSince: overrides.since || (rand() < 0.6 ? 2025 : 2026),
    profileUrl: `membre.html?m=${idLast}-${idFirst}`,
  };
  if (overrides.bio) member.bio = overrides.bio;
  return member;
});

// ---------------------------------------------------------------------------
// Contrôles
// ---------------------------------------------------------------------------
if (members.length !== 100) throw new Error(`Attendu 100 membres, obtenu ${members.length}`);
const ids = new Set(members.map((m) => m.id));
if (ids.size !== members.length) throw new Error('Identifiants en double');
const lastNames = new Set(members.map((m) => m.lastName));
if (lastNames.size !== members.length) throw new Error('Noms de famille en double');
const regions = new Set(members.map((m) => m.region));

// ---------------------------------------------------------------------------
// Écriture (un membre par ligne, comme le format d'origine)
// ---------------------------------------------------------------------------
const outPath = path.join(__dirname, '..', 'src', 'data', 'members-sample.json');
const json = '[\n  ' + members.map((m) => JSON.stringify(m)).join(',\n  ') + '\n]\n';
fs.writeFileSync(outPath, json, 'utf8');

console.log(`✓ ${members.length} profils fictifs écrits dans ${path.relative(process.cwd(), outPath)}`);
console.log(`  Régions couvertes : ${regions.size}`);
console.log(`  Organisations distinctes : ${new Set(members.map((m) => m.organization)).size}`);
