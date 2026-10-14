# =====================================================================
# Stage 1 : base — socle commun (FrankenPHP + extensions PHP)
# =====================================================================
FROM dunglas/frankenphp:1-php8.4-alpine AS base

RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    opcache \
    mongodb

# Même chemin que l'ancienne image (Makefile, chmod, etc.)
WORKDIR /var/www/backend


# =====================================================================
# Stage 2 : dev — développement (le code est monté en volume)
# =====================================================================
FROM base AS dev

RUN apk add --no-cache git unzip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# php.ini dev
RUN { \
    echo "memory_limit=512M"; \
    echo "upload_max_filesize=20M"; \
    echo "post_max_size=20M"; \
    echo "display_errors=1"; \
  } > /usr/local/etc/php/conf.d/dev.ini

EXPOSE 80


# =====================================================================
# Stage 3 : vendor — installe les dépendances (jetable, pas dans l'image finale)
# =====================================================================
FROM base AS vendor

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apk add --no-cache git unzip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 1) Les manifestes seuls : cette couche reste en cache tant qu'ils ne changent pas
COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-progress

# 2) Le code, puis l'autoloader optimisé
COPY . .
RUN composer dump-autoload --no-dev --no-scripts --optimize --classmap-authoritative


# =====================================================================
# Stage 4 : prod — image finale
# =====================================================================
FROM base AS prod

ENV APP_ENV=prod \
    APP_DEBUG=0

# php.ini de production fourni par l'image, puis nos réglages
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
RUN { \
    echo "expose_php=Off"; \
    echo "display_errors=Off"; \
    echo "log_errors=On"; \
    echo "memory_limit=256M"; \
    echo "upload_max_filesize=20M"; \
    echo "post_max_size=20M"; \
    echo "opcache.enable=1"; \
    echo "opcache.validate_timestamps=0"; \
    echo "opcache.memory_consumption=128"; \
    echo "opcache.max_accelerated_files=20000"; \
    echo "realpath_cache_size=4096K"; \
    echo "realpath_cache_ttl=600"; \
  } > "$PHP_INI_DIR/conf.d/zz-prod.ini"

# Code + vendor/ venant du stage précédent (sans Composer, sans git)
COPY --from=vendor /var/www/backend /var/www/backend

# Réchauffe le cache Symfony au build (dont les hydrators/proxies MongoDB,
# car auto_generate_* est désactivé en prod dans doctrine_mongodb.yaml)
RUN php bin/console cache:warmup

# --- Utilisateur non root (procédure de la doc FrankenPHP, variante Alpine) ---
# NB : le Caddyfile de prod est monté depuis docker-compose (pas copié dans l'image)
ARG USER=appuser
RUN apk add --no-cache libcap-utils \
    && adduser -D ${USER} \
    && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp \
    && mkdir -p public/uploads/products public/uploads/categories \
    && chown -R ${USER}:${USER} /config/caddy /data/caddy var public/uploads
USER ${USER}

EXPOSE 80 443 443/udp
