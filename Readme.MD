# Maille & Câlins 🧶

Plateforme e-commerce dédiée à la vente d'articles en crochet et en tricot faits main (amigurumis, décorations, accessoires, cadeaux).

Projet réalisé dans le cadre de la certification **Développeur Web et Web Mobile (DWWM)**, conçu avec vocation à être mis en production réelle pour une créatrice de crochet/tricot.

---

## Sommaire

- [Présentation du projet](#présentation-du-projet)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Environnement Docker](#environnement-docker)
- [Serveur web FrankenPHP](#serveur-web-frankenphp)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Comptes de test](#comptes-de-test)
- [Tests automatisés](#tests-automatisés)
- [Intégration continue](#intégration-continue)
- [Commandes utiles](#commandes-utiles)
- [Dépannage](#dépannage)
- [État du projet et perspectives](#état-du-projet-et-perspectives)
- [Auteur](#auteur)

---

## Présentation du projet

Maille & Câlins propose un parcours e-commerce complet :

**Côté client :**
- Inscription / connexion avec vérification d'email
- Catalogue de produits filtrable par catégorie
- Panier, gestion des quantités
- Tunnel de commande avec sélection d'adresse et paiement (simulé)
- Historique des commandes
- Gestion de plusieurs adresses (livraison / facturation)
- Avis clients (uniquement sur un produit effectivement acheté)
- Liste d'envies (wishlist)

**Côté administration :**
- Tableau de bord avec statistiques
- Gestion des produits (CRUD + upload d'image)
- Gestion des catégories
- Gestion des commandes (changement de statut)
- Modération des avis clients et réponses aux avis

---

## Stack technique

### Backend
- **Symfony 8.1** (PHP 8.4)
- **FrankenPHP** (basé sur Caddy) — serveur web et exécution de PHP dans un seul conteneur
- **Doctrine ORM** — accès aux données PostgreSQL
- **Doctrine ODM** — accès aux données MongoDB
- **LexikJWTAuthenticationBundle** — authentification par JWT
- **Symfony Mailer + Messenger** — envoi d'emails

### Frontend
- **React 18** (Vite)
- **React Router**
- **Tailwind CSS v4**
- **Axios**
- **Vitest + React Testing Library** — tests unitaires

### Bases de données
- **PostgreSQL 16** — données transactionnelles (utilisateurs, adresses, panier, commandes, paiements)
- **MongoDB 7** — catalogue (produits, catégories, avis, wishlists)

### Environnement
- **Docker / Docker Compose**
- **Make** — automatisation des commandes courantes
- **GitHub Actions** — intégration continue (tests backend + frontend)

---

## Architecture

Le projet utilise une architecture hybride SQL/NoSQL :

| Données | Base | Raison |
|---|---|---|
| Utilisateurs, adresses, panier, commandes, paiements | PostgreSQL | Cohérence transactionnelle forte, relations bien définies |
| Produits, catégories, avis, wishlists | MongoDB | Structure de document flexible, pas de contrainte transactionnelle forte |

Le backend suit une architecture en couches strictes :
```
Controller  →  reçoit la requête, valide (DTO), délègue au service, formate la réponse
Service     →  contient toute la logique métier
Dto         →  objets de transfert de données avec validation
Entity/Document → représentation des tables PostgreSQL / collections MongoDB
```

---

## Environnement Docker

Tous les services tournent dans des conteneurs, orchestrés par `docker-compose.yml` sur un réseau commun (`maille_net`) :

| Service | Conteneur | Rôle | Port hôte |
|---|---|---|---|
| `php` | `maille_php` | API Symfony servie par FrankenPHP | 8080 |
| `node` | `maille_node` | Serveur de développement Vite (React) | 5173 |
| `postgres` | `maille_postgres` | Base PostgreSQL 16 | 5432 |
| `mongo` | `maille_mongo` | Base MongoDB 7 | 27017 |
| `adminer` | `maille_adminer` | Interface d'administration PostgreSQL | 8081 |
| `mongo-express` | `maille_mongo_express` | Interface d'administration MongoDB | 8082 |
| `mailhog` | `maille_mailhog` | Capture des emails (SMTP 1025, interface web 8025) | 1025 / 8025 |

Les données des bases sont conservées dans des volumes Docker nommés (`pgdata`, `mongodata`), qui survivent à la recréation des conteneurs. Les volumes `caddy_data` et `caddy_config` stockent l'état interne de Caddy.

---

## Serveur web FrankenPHP

Le conteneur `php` utilise l'image officielle [FrankenPHP](https://frankenphp.dev/), qui embarque PHP directement dans le serveur Caddy. Il remplace l'ancien couple nginx + PHP-FPM : un seul conteneur au lieu de deux, et plus de port FastCGI à gérer.

- **Image** : définie dans `backend/Dockerfile` (base `dunglas/frankenphp`, PHP 8.4). Les extensions `pdo_pgsql`, `intl`, `zip`, `opcache` et `mongodb` y sont installées.
- **Configuration** : `docker/caddy/Caddyfile`, monté dans le conteneur sur `/etc/frankenphp/Caddyfile`. Il définit la racine (`backend/public`), la limite de taille des uploads (20 Mo), la compression, et délègue le routage à Symfony via `php_server`.
- **Mode worker** : désactivé en développement (le noyau Symfony est rechargé à chaque requête, comme avec PHP-FPM). Il est envisagé pour la production.
- **Sécurité** : toute requête externe vers un chemin contenant `.php` reçoit une 404. Les URL de l'API ne sont pas concernées, car `php_server` les redirige en interne vers `index.php`. Cette règle reproduit l'ancien comportement de nginx et empêche l'exécution d'un fichier PHP qui serait déposé dans `public/uploads`.
- **HTTPS** : désactivé en développement (`auto_https off`), l'API est servie en HTTP sur le port 8080. Caddy peut gérer le HTTPS automatiquement en production.

Après toute modification du `Caddyfile`, redémarrer le conteneur (`docker compose --env-file backend/.env.local restart php`). Après toute modification du `Dockerfile`, reconstruire l'image (`make build`).

---

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose installés
- [Make](https://www.gnu.org/software/make/) (préinstallé sur Linux/macOS ; sous Windows, utiliser WSL2)
- Git

Aucune autre dépendance n'est nécessaire sur la machine hôte : PHP, Node.js, PostgreSQL et MongoDB tournent entièrement dans des conteneurs Docker.

Les ports **8080, 5173, 5432, 27017, 8081, 8082, 1025 et 8025** doivent être libres sur la machine hôte.

---

## Installation

### 1. Cloner le dépôt

```bash
git clone git@github.com:Yazhall/maille-calins.git
cd maille-calins
```

### 2. Configurer les variables d'environnement backend

Créer le fichier `backend/.env.local` avec le contenu suivant (ce fichier sert à la fois à Docker Compose et à Symfony) :

```env
###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=changez_moi_avec_une_valeur_aleatoire
APP_SHARE_DIR=var/share
###< symfony/framework-bundle ###

# --- Docker Compose (bases de données) ---
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=maille_calins
MONGO_DB=maille_calins_catalog
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASSWORD=password

###> symfony/routing ###
DEFAULT_URI=http://localhost
###< symfony/routing ###

###> doctrine/doctrine-bundle ###
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?serverVersion=16&charset=utf8"
MONGODB_URI="mongodb://mongo:27017"
MONGODB_DB="maille_calins_catalog"
###< doctrine/doctrine-bundle ###

###> symfony/messenger ###
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
###< symfony/messenger ###

###> symfony/mailer ###
MAILER_DSN=smtp://mailhog:1025
###< symfony/mailer ###

JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=une_passphrase_de_votre_choix

CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
```

> ⚠️ Les identifiants PostgreSQL/Mongo Express (`admin`/`password`) sont ceux d'un environnement de développement local. `DATABASE_URL` référence automatiquement `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB` via `${...}` (interpolation gérée par le composant Dotenv de Symfony) : modifiez uniquement ces trois variables, `DATABASE_URL` restera cohérent sans risque de désynchronisation. Générez une vraie valeur aléatoire pour `APP_SECRET` et `JWT_PASSPHRASE` plutôt que de garder l'exemple ci-dessus tel quel.

> ℹ️ Docker Compose lit ces variables grâce à l'option `--env-file backend/.env.local`, déjà intégrée aux commandes `make`. Si vous lancez `docker compose` à la main, ajoutez toujours cette option, faute de quoi les variables du conteneur `php` seront vides (voir [Dépannage](#dépannage)).

### 3. Configurer les variables d'environnement frontend

Créer le fichier `frontend/.env` à partir de l'exemple fourni :

```bash
cp frontend/.env.example frontend/.env
```

> Ce fichier définit `VITE_API_BASE_URL`, utilisée par le frontend pour construire les URLs des images produit. Sans lui, les tests frontend échouent avec une erreur `undefined` dans l'URL.

### 4. Installation complète

Une seule commande installe tout (conteneurs, dépendances, clés JWT, migrations, fixtures, permissions) :

```bash
make install
```

Cette commande enchaîne, dans l'ordre : `up` → `composer-install` → `jwt-generate` → `db-migrate` → `fixtures` → `fix-permissions` → `npm-install`.

Pour installer étape par étape (utile pour comprendre ou déboguer) :

```bash
make up                  # démarre tous les conteneurs
make composer-install    # installe les dépendances Symfony
make jwt-generate        # génère la paire de clés JWT
make db-migrate          # applique les migrations de base de données
make fixtures            # charge les données de test
make fix-permissions     # corrige les droits des dossiers public/uploads et var/
make npm-install         # installe les dépendances frontend
```

---

## Utilisation

Une fois l'installation terminée, les services sont accessibles aux adresses suivantes :

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:5173 | Application React |
| API Backend | http://localhost:8080/api | API REST Symfony (FrankenPHP) |
| Adminer | http://localhost:8081 | Interface d'administration PostgreSQL |
| Mongo Express | http://localhost:8082 | Interface d'administration MongoDB |
| MailHog | http://localhost:8025 | Capture des emails envoyés en développement |

---

## Structure du projet

```
maille-calins/
├── .github/workflows/     # Pipeline CI (GitHub Actions)
├── backend/
│   ├── Dockerfile            # Image FrankenPHP (PHP 8.4 + extensions)
│   ├── src/
│   │   ├── Controller/       # Contrôleurs (dont Admin/ pour le back-office)
│   │   ├── Service/          # Logique métier
│   │   ├── Dto/              # Objets de transfert de données validés
│   │   ├── Entity/           # Entités PostgreSQL (Doctrine ORM)
│   │   ├── Document/         # Documents MongoDB (Doctrine ODM)
│   │   ├── Repository/       # Repositories Doctrine
│   │   └── DataFixtures/     # Données de test
│   ├── tests/Service/        # Tests unitaires PHPUnit
│   ├── config/
│   ├── migrations/
│   └── public/uploads/       # Fichiers uploadés (images produits et catégories)
├── docker/
│   └── caddy/Caddyfile       # Configuration du serveur FrankenPHP/Caddy
├── frontend/
│   ├── Dockerfile
│   ├── .env.example          # Modèle de configuration frontend
│   └── src/
│       ├── api/              # Appels HTTP vers le backend
│       ├── components/       # Composants React réutilisables (+ tests Vitest)
│       ├── context/          # Contextes globaux (Auth, Cart)
│       ├── pages/            # Pages de l'application
│       └── utils/
├── docker-compose.yml
├── Makefile
└── Readme.MD
```

---

## Comptes de test

Après le chargement des fixtures, les comptes suivants sont disponibles (mot de passe commun : `password123`) :

| Email | Rôle |
|---|---|
| `admin@maille-calins.fr` | Administrateur |
| `lauryne@example.com` | Client |
| `mael@example.com` | Client |
| *(+ 12 autres comptes clients générés)* | Client |

---

## Tests automatisés

```bash
make test-backend    # tests PHPUnit (backend)
make test-frontend   # tests Vitest (frontend)
make test            # les deux d'un coup
```

Le projet compte actuellement 18 tests backend (services CartService et OrderService) et 11 tests frontend (composants ProductCard, Button, et utilitaire getImageUrl), tous exécutés sans base de données réelle grâce à l'isolation des dépendances (doublons de test).

---

## Intégration continue

Un pipeline GitHub Actions (`.github/workflows/ci.yml`) exécute automatiquement les tests backend et frontend à chaque push ou pull request sur les branches `main` et `develop`. Il garantit qu'aucune régression n'est fusionnée sans que l'ensemble de la suite de tests ne passe.

Le pipeline installe PHP et Node directement sur le runner GitHub : il ne dépend pas des images Docker du projet.

---

## Commandes utiles

```bash
make up               # démarre tous les conteneurs
make down             # stoppe tous les conteneurs
make build            # rebuild les images (après modif Dockerfile)
make logs             # suit les logs de tous les services
make sh-php           # ouvre un shell dans le conteneur PHP
make sh-node          # ouvre un shell dans le conteneur Node

# Recharger entièrement les données de test (supprime et recrée tout)
make fixtures

# Suivre uniquement les logs du serveur FrankenPHP/Caddy
docker compose --env-file backend/.env.local logs -f php

# Vérifier l'état des migrations
docker compose --env-file backend/.env.local exec php php bin/console doctrine:migrations:status

# Consulter les logs applicatifs Symfony
docker compose --env-file backend/.env.local exec php tail -f var/log/dev.log

# Lister les extensions PHP chargées dans le conteneur
docker compose --env-file backend/.env.local exec php php -m
```

---

## Dépannage

**Erreur "Unable to write in the uploads directory" ou erreur sur `var/cache`**

Le processus PHP s'exécute en root dans le conteneur : les fichiers qu'il crée peuvent ne pas être modifiables depuis la machine hôte.
```bash
make fix-permissions
```

**Erreur "port is already allocated" sur le port 8080 au démarrage**

Un ancien conteneur (par exemple `maille_nginx`, de l'époque où nginx servait le backend) occupe encore le port. Lister les conteneurs avec `docker ps`, puis supprimer l'orphelin :
```bash
docker compose --env-file backend/.env.local up -d --remove-orphans
```
Si le port est pris par un autre programme de la machine, l'arrêter ou changer le port publié dans `docker-compose.yml`.

**Le conteneur `php` redémarre en boucle**

Une erreur de syntaxe dans `docker/caddy/Caddyfile` empêche le serveur de démarrer. Consulter les logs du conteneur :
```bash
docker logs --tail 50 maille_php
```

**Variables d'environnement vides dans le conteneur `php` (erreur d'authentification PostgreSQL)**

`docker compose` a été lancé sans `--env-file backend/.env.local`. Recréer les conteneurs avec l'option :
```bash
docker compose --env-file backend/.env.local down
docker compose --env-file backend/.env.local up -d
```
Les commandes `make` l'incluent déjà.

**Erreur d'import de module frontend après une nouvelle installation de package**
```bash
docker compose --env-file backend/.env.local exec node rm -rf node_modules/.vite
docker restart maille_node
```

**Module frontend introuvable après un changement de machine ou un `git pull`**

Le dossier `node_modules` est dans un volume anonyme Docker, qui peut devenir obsolète. Reconstruire les conteneurs en régénérant ces volumes (sans toucher aux volumes nommés `pgdata` et `mongodata`) :
```bash
docker compose --env-file backend/.env.local up -d --build -V
```

**Emails non reçus dans MailHog**

Vérifier que le transport `SendEmailMessage` est bien routé en `sync` (et non `async`) dans `backend/config/packages/messenger.yaml`, faute de quoi les emails restent en file d'attente sans être traités (aucun worker Messenger n'est configuré dans cet environnement de développement).

**Tests frontend en échec avec des valeurs `undefined` dans les URLs**

Le fichier `frontend/.env` est manquant (non versionné par Git, à recréer sur chaque nouveau poste de développement) :
```bash
cp frontend/.env.example frontend/.env
```

---

## État du projet et perspectives

Le projet est fonctionnel en environnement de développement. Les éléments suivants correspondent à la phase actuelle, avec une trajectoire claire vers la production :

| Élément | État actuel | Évolution prévue |
|---|---|---|
| Paiement | Simulé | Intégration de Stripe |
| Stockage des images | Local (`public/uploads`) | Stockage cloud |
| Intégration continue | Tests backend et frontend (GitHub Actions) | — |
| Déploiement continu | Non implémenté (pas de serveur de production) | VPS, Docker Compose, déploiement automatisé |
| Serveur web | FrankenPHP en mode classique, HTTP | Mode worker et HTTPS automatique de Caddy |

---

## Auteur

Développé par Maël Vigier dans le cadre de la certification DWWM (Hesias).