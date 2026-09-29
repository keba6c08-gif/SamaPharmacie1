# SamaPharmacie — Guide de projet pour les futurs modèles IA

## 1. Vue d’ensemble

SamaPharmacie est une application web de recherche de médicaments et de pharmacie de garde, pensée pour le contexte sénégalais. L’objectif principal est de permettre à un patient de:

- rechercher rapidement un médicament,
- comparer les pharmacies qui le vendent,
- voir les prix et les quantités disponibles,
- filtrer par ville ou quartier,
- utiliser la géolocalisation pour trier les pharmacies par proximité,
- voir les pharmacies de garde actives.

Le projet a aussi un espace pharmacien qui permet de:

- gérer un stock de médicaments,
- ajouter des références,
- ajuster des quantités,
- signaler une pharmacie comme de garde,
- consulter un tableau de bord métier de démonstration.

Le projet est actuellement un prototype fonctionnel front-end avec une logique de démonstration, sans dépendance externe de production complète encore branchée sur une base de données réelle en temps réel.

---

## 2. Ce que fait l’application

### Côté patient

L’utilisateur arrive sur la page d’accueil et peut :

- rechercher un médicament par nom,
- filtrer par ville ou quartier,
- utiliser sa position pour trier les pharmacies par distance,
- voir la liste des pharmacies où le médicament est disponible,
- comparer les prix et savoir si un médicament est en stock,
- accéder aux itinéraires Google Maps pour aller vers la pharmacie,
- voir les pharmacies de garde actives.

### Côté pharmacien

Le pharmacien peut accéder à un espace dédié où il voit :

- le nom de sa pharmacie,
- le responsable,
- les commandes récentes de démonstration,
- les références à réapprovisionner,
- les ordonnances à vérifier,
- le statut de vérification du dossier,
- le bouton pour mettre la pharmacie en garde,
- la gestion du stock.

### Gestion du stock

Dans l’espace pharmacien, il peut :

- consulter le stock existant,
- rechercher une référence dans le catalogue,
- ajouter une référence au stock,
- modifier les quantités (ajout ou retrait),
- marquer qu’un médicament nécessite une ordonnance,
- visualiser les références faibles en stock.

---

## 3. Fonctionnalités implémentées

### Fonctionnalités déjà codées

#### Accueil patient

- Hero section avec photo de pharmacie et texte d’introduction
- recherche de médicament par input
- recherche par ville/quartier
- bouton de localisation navigateur
- tri des pharmacies par distance calculée avec la formule haversine
- comparaison de prix et stocks
- liens Google Maps avec itinéraire
- section “Pharmacies de garde”
- boutons rapides de recherche populaire
- gestion de l’état “soumis / non soumis”

#### Pharmacies de garde

- liste de pharmacies de garde
- filtre par ville
- affichage de distance à partir de la position utilisateur
- bouton itinéraire
- système de démonstration via localStorage pour simuler l’état de garde dans le navigateur
- bouton “Mettre en garde” dans le panneau pharmacien

#### Espace pharmacien

- tableau de bord avec résumé d’activité
- métriques de commandes, stock faible, ordonnances
- statut de vérification du dossier
- accès à la gestion du stock
- bouton “Mettre en garde / Terminer la garde”
- signal d’état “Garde activée / Garde désactivée”
- aperçu de démonstration distinct de la vraie route protégée

#### Gestion du stock

- tableau des médicaments avec quantité, prix et statut ordonnance
- recherche dans le stock
- ajout d’une référence
- modification de quantité via boutons +/-
- compteur “stock faible”
- notice de confirmation d’action

#### Authentification / navigation

- navigation globale avec header
- bouton de connexion pharmacie
- routes de démonstration pour le tableau pharmacien et le stock
- routes de patient et pharmacien définies dans l’application
- garde de routes côté serveur pour les pages pharmacien réelles

#### UI / design

- palette bleu/teal inspirée de la santé et de la confiance
- cartes, boutons, badges et sections visuelles cohérentes
- mise en page responsive mobile/desktop
- composants visuels en Tailwind CSS

---

## 4. Architecture et structure des fichiers

### Arborescence principale

- app/
  - page.tsx : page d’accueil principale du patient
  - layout.tsx : layout global, header, navigation
  - globals.css : styles globaux et palette Tailwind
  - login/
    - page.tsx : écran de connexion et aperçu du compte pharmacien
    - actions.ts : actions de connexion/inscription
    - role-selector.tsx : sélection du rôle
  - patient/
    - page.tsx : espace patient
  - pharmacien/
    - page.tsx : route réelle pharmacien protégée
    - dashboard-client.tsx : tableau de bord pharmacien
    - stock/
      - page.tsx : gestion du stock
      - actions.ts : actions stock si besoin
  - apercu-pharmacie/
    - page.tsx : aperçu démonstration public
    - stock/page.tsx : aperçu stock de démonstration

- lib/
  - demo-on-call-pharmacies.ts : stockage local des pharmacies de garde
  - supabase/
    - client.ts
    - middleware.ts
    - server.ts

- prisma/
  - schema.prisma : modèle de données Prisma
  - seed.js : données de seed / démonstration

- public/
  - pharmacie-accompagnement.jpg : image de la pharmacie utilisée sur l’accueil
  - pharmacien-en-pharmacie.jpg : ancienne image de référence non utilisée

- proxy.ts : configuration de proxy ou utilité de dev local
- package.json : scripts npm et dépendances
- next.config.ts : configuration Next.js
- tsconfig.json : configuration TypeScript
- .env.example : fichier d’exemple de variables d’environnement

---

## 5. Technologies utilisées

### Front-end

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### UI / iconographie

- lucide-react pour les icônes
- composants React construits sur mesure
- layout responsive personnalisé

### Données / backend

- Prisma ORM
- PostgreSQL via Supabase
- Supabase Auth / SSR helpers

### Démo / simulation

- localStorage pour simuler l’état de garde des pharmacies
- données en dur dans les composants pour des tests visuels rapides
- route d’aperçu sans session authentifiée

### Outils de dev

- ESLint
- Next.js dev server
- npm scripts

---

## 6. Décisions de design à retenir

### 1. Priorité au patient

L’application a été pensée pour mettre l’expérience patient au centre : la page d’accueil met en avant la recherche de médicaments et non l’espace pharmacie.

### 2. Séparation claire des parcours

- patient = recherche, prix, disponibilité, garde
- pharmacien = gestion du stock, commandes, vérification, garde

### 3. Prototype robuste sans dépendre de la vraie base

Le projet utilise des données de démonstration pour pouvoir rendre l’UX tangible sans avoir encore un vrai flux backend fini.

### 4. Les routes de démonstration sont claires

Aucune vraie authentification n’est forcée pour voir l’aperçu : les pages de démonstration sont explicitement séparées des routes réelles, pour éviter la confusion entre démonstration et production.

### 5. Le système de garde est basé sur un état local de démonstration

La logique de garde est simulée dans le navigateur via `localStorage` afin de montrer dynamiquement l’apparition des pharmacies de garde sur l’accueil.

### 6. Les contenus de démonstration sont visibles mais clairement identifiés

Les pages indiquent explicitement “Démonstration”, “Données fictives” ou “Aperçu”, pour éviter toute confusion sur le statut du système.

---

## 7. Instructions pour un futur modèle IA

### Objectif principal

Respecter la logique produit suivante :

- l’application est centrée sur le patient,
- le parcours pharmacie reste secondaire mais disponible,
- l’UX doit rester simple, claire et orientée recherche + proximité,
- les écrans doivent être lisibles et rassurants,

### À ne pas faire

- ne pas réintroduire un bouton “Espace patient” dans le header si le design a choisi de le cacher,
- ne pas mélanger les pages de démonstration avec les vraies routes authentifiées,
- ne pas exposer des données sensibles ou variables d’environnement dans le dépôt,
- ne pas utiliser de vrais comptes par défaut sans configuration Supabase,

### À respecter quand on modifie le projet

- garder l’orientation patient-first sur la page d’accueil,
- conserver les routes de démonstration claires,
- utiliser les noms de fichiers et la structure déjà existante,
- maintenir la séparation entre interface utilisateur et logique de démonstration,
- garder les styles cohérents avec la palette de santé bleue / teal,
- préserver les composants déjà écrits avant d’en créer de nouveaux,

### Bonnes pratiques pour le prochain modèle

- préfère les modifications ciblées sur le composant concerné,
- si tu changes la navigation, vérifie que les pages de démonstration restent cohérentes,
- si tu touches la logique de garde, valide le comportement sur la page d’accueil patient,
- si tu ajoutes des fonctionnalités backend, pense d’abord au schéma Prisma correspondant,
- si tu touches la config Next.js ou Supabase, vérifie qu’aucune donnée sensible n’est commitée,

### Vérification recommandée avant finalisation

- `npm run build`
- `npx eslint app/page.tsx app/pharmacien/dashboard-client.tsx app/pharmacien/stock/page.tsx`
- vérifier l’UX sur la page d’accueil et la page pharmacien

---

## 8. État actuel du projet

Le projet est actuellement dans un état de prototype fonctionnel / démonstration :

- accueil patient complet,
- pharmacies de garde simulées,
- parcours pharmacien visible,
- stock de démonstration,
- préparation pour le vrai branchement Supabase / Prisma,
- image locale d’accueil en place,
- build validé.

Le site n’est pas encore une vraie application de production complète avec authentification et base de données finalisée, mais il a une architecture saine et des fonctionnalités visuelles bien structurées pour évoluer rapidement.

---

## 9. Résumé court pour un futur modèle IA

SamaPharmacie est une application de recherche de médicaments et de pharmacies de garde pour le Sénégal. Elle expose un parcours patient optimisé pour trouver un médicament, comparer les pharmacies, voir les prix, la disponibilité et la distance. Elle expose aussi un espace pharmacien avec dashboard, gestion du stock et signalement en garde. Le projet est construit en Next.js + TypeScript + Tailwind, avec Prisma et Supabase en préparation. Les données de démonstration sont gérées localement pour des raisons de prototype. Le design est centré sur la santé, la confiance et une navigation simple.

---

## 10. À garder en tête pour la suite

Le but futur n’est pas de “tout reconstruire”, mais de faire évoluer cette base en ajoutant progressivement :

- vraie authentification Supabase,
- vraie base PostgreSQL via Prisma,
- accès réel au stock et aux pharmacies,
- commandes patient réelles,
- validation d’ordonnance,
- données pharmacies, horaires, localisation,
- intégration backend + API durable.

Le projet actuel est une base solide, claire et cohérente pour continuer par étapes sans perdre la logique produit.
