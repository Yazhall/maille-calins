FROM dunglas/frankenphp:1-php8.4-alpine

# Extensions PHP (install-php-extensions est fourni par l'image FrankenPHP)
RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    opcache \
    mongodb

# Outils utilisés par Composer
RUN apk add --no-cache git unzip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# On garde le même chemin que l'ancienne image php-fpm (Makefile, chmod, etc.)
WORKDIR /var/www/backend

# php.ini dev (à adapter en prod)
RUN { \
    echo "memory_limit=512M"; \
    echo "upload_max_filesize=20M"; \
    echo "post_max_size=20M"; \
    echo "display_errors=1"; \
  } > /usr/local/etc/php/conf.d/dev.ini

# Le Caddyfile est monté depuis docker/caddy/Caddyfile (voir docker-compose.yml)
EXPOSE 80
