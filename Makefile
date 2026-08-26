up: ## Démarre tous les conteneurs
	docker compose --env-file backend/.env.local up -d

down: ## Stoppe tous les conteneurs
	docker compose --env-file backend/.env.local down

build: ## Rebuild les images (après modif Dockerfile)
	docker compose --env-file backend/.env.local build --no-cache

sh-php: ## Ouvre un shell dans le conteneur PHP
	docker compose --env-file backend/.env.local exec php sh

sh-node: ## Ouvre un shell dans le conteneur Node
	docker compose --env-file backend/.env.local exec node sh

logs: ## Suit les logs de tous les services
	docker compose --env-file backend/.env.local logs -f

composer-install: ## Installe les dépendances Symfony
	docker compose --env-file backend/.env.local exec php composer install

db-migrate: ## Applique les migrations Doctrine
	docker compose --env-file backend/.env.local exec php php bin/console doctrine:migrations:migrate --no-interaction

fixtures: ## Charge les fixtures (jeu d'essai)
	docker compose --env-file backend/.env.local exec php php bin/console doctrine:fixtures:load --no-interaction

jwt-generate: ## Génère la paire de clés JWT (à faire une seule fois)
	docker compose --env-file backend/.env.local exec php sh -c "test -f config/jwt/private.pem || php bin/console lexik:jwt:generate-keypair"

fix-permissions: ## Corrige les droits d'écriture sur les dossiers cache et upload
	docker compose --env-file backend/.env.local exec php chmod -R a+rwX /var/www/backend/public/uploads /var/www/backend/var

npm-install: ## Installe les dépendances frontend
	docker compose --env-file backend/.env.local exec node npm install

install: up composer-install jwt-generate db-migrate fixtures fix-permissions npm-install ## Installation complète en une commande

test-backend: ## Lance les tests PHPUnit dans le conteneur
	docker compose --env-file backend/.env.local exec php php bin/phpunit

test-frontend: ## Lance les tests Vitest dans le conteneur
	docker compose --env-file backend/.env.local exec node npm run test -- --run

test: test-backend test-frontend ## Lance tous les tests (backend + frontend)

.PHONY: up down build sh-php sh-node logs composer-install db-migrate fixtures jwt-generate fix-permissions npm-install install test-backend test-frontend test