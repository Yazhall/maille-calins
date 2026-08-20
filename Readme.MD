# Maille & Câlins 🧶

Plateforme e-commerce dédiée à la vente d'articles en crochet et en tricot faits main (amigurumis, décorations, accessoires, cadeaux).

Projet réalisé dans le cadre de la certification **Développeur Web et Web Mobile (DWWM)**, conçu avec vocation à être mis en production réelle pour une créatrice de crochet/tricot.

---

## Sommaire

- [Présentation du projet](#présentation-du-projet)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Comptes de test](#comptes-de-test)
- [Commandes utiles](#commandes-utiles)
- [Dépannage](#dépannage)

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
- Modération des avis clients

---

## Stack technique

### Backend
- **Symfony 8.1** (PHP 8.4)
- **Doctrine ORM** — accès aux données PostgreSQL
- **Doctrine ODM** — accès aux données MongoDB
- **LexikJWTAuthenticationBundle** — authentification par JWT
- **Symfony Mailer + Messenger** — envoi d'emails

### Frontend
- **React 18** (Vite)
- **React Router**
- **Tailwind CSS v4**
- **Axios**

### Bases de données
- **PostgreSQL 16** — données transactionnelles (utilisateurs, adresses, panier, commandes, paiements)
- **MongoDB 7** — catalogue (produits, catégories, avis, wishlists)

### Environnement
- **Docker / Docker Compose**

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

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose installés
- Git

Aucune autre dépendance n'est nécessaire sur la machine hôte : PHP, Node.js, PostgreSQL et MongoDB tournent entièrement dans des conteneurs Docker.

---

## Installation

### 1. Cloner le dépôt

```bash
git clone git@github.com:Yazhall/maille-calins.git
cd maille-calins
```

### 2. Configurer les variables d'environnement backend

Créer le fichier `backend/.env.local` avec le contenu suivant :

```env
DATABASE_URL="postgresql://amdin:password@postgres:5432/maille_calins?serverVersion=16&charset=utf8"
MONGODB_URL="mongodb://mongo:27017"
MONGODB_DB="maille_calins_catalog"

JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=une_passphrase_de_votre_choix

MAILER_DSN=smtp://mailhog:1025
```

> ⚠️ Adaptez les identifiants PostgreSQL (`amdin`/`password`) selon ceux définis dans `docker-compose.yml`.

### 3. Démarrer les conteneurs

```bash
docker compose up -d
```

### 4. Installer les dépendances backend

```bash
docker exec -it maille_php composer install
```

### 5. Générer les clés JWT

```bash
docker exec -it maille_php php bin/console lexik:jwt:generate-keypair
```

### 6. Exécuter les migrations de base de données

```bash
docker exec -it maille_php php bin/console doctrine:migrations:migrate
```

### 7. Charger les données de test (fixtures)

```bash
docker exec -it maille_php php bin/console doctrine:fixtures:load
```

### 8. Corriger les permissions du dossier d'upload

```bash
docker exec -it maille_php chmod -R a+rwX /var/www/backend/public/uploads
```

### 9. Installer les dépendances frontend

```bash
docker exec -it maille_node npm install
```

---

## Utilisation

Une fois l'installation terminée, les services sont accessibles aux adresses suivantes :

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:5173 | Application React |
| API Backend | http://localhost:8080/api | API REST Symfony |
| Adminer | http://localhost:8081 | Interface d'administration PostgreSQL |
| Mongo Express | http://localhost:8082 | Interface d'administration MongoDB |
| MailHog | http://localhost:8025 | Capture des emails envoyés en développement |

---

## Structure du projet

```
maille-calins/
├── backend/
│   ├── src/
│   │   ├── Controller/       # Contrôleurs (dont Admin/ pour le back-office)
│   │   ├── Service/          # Logique métier
│   │   ├── Dto/              # Objets de transfert de données validés
│   │   ├── Entity/           # Entités PostgreSQL (Doctrine ORM)
│   │   ├── Document/         # Documents MongoDB (Doctrine ODM)
│   │   └── DataFixtures/     # Données de test
│   ├── config/
│   ├── migrations/
│   └── public/uploads/       # Fichiers uploadés (images produits)
├── frontend/
│   ├── src/
│   │   ├── api/               # Appels HTTP vers le backend
│   │   ├── components/        # Composants React réutilisables
│   │   ├── context/           # Contextes globaux (Auth, Cart)
│   │   ├── pages/              # Pages de l'application
│   │   └── utils/
├── docker-compose.yml
└── README.md
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

## Commandes utiles

```bash
# Recharger entièrement les données de test (supprime et recrée tout)
docker exec -it maille_php php bin/console doctrine:fixtures:load

# Vérifier l'état des migrations
docker exec -it maille_php php bin/console doctrine:migrations:status

# Consulter les logs applicatifs Symfony
docker exec -it maille_php tail -f var/log/dev.log

# Consulter les logs d'un conteneur
docker logs maille_php --tail 50

# Redémarrer un conteneur
docker restart maille_node
```

---

## Dépannage

**Erreur "Unable to write in the uploads directory"**
```bash
docker exec -it maille_php chmod -R a+rwX /var/www/backend/public/uploads
```

**Erreur d'import de module frontend après une nouvelle installation de package**
```bash
docker exec -it maille_node rm -rf node_modules/.vite
docker restart maille_node
```

**Emails non reçus dans MailHog**
Vérifier que le transport `SendEmailMessage` est bien routé en `sync` (et non `async`) dans `backend/config/packages/messenger.yaml`, faute de quoi les emails restent en file d'attente sans être traités (aucun worker Messenger n'est configuré dans cet environnement de développement).

---

## Auteur

Développé par Maël Vigier dans le cadre de la certification DWWM (Hesias).