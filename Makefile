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

.PHONY: up down build sh-php sh-node logs composer-install db-migrate fixtures
