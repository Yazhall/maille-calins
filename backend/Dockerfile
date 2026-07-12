FROM php:8.4-fpm-alpine

# Dépendances système + extensions PHP
RUN apk add --no-cache \
    icu-dev \
    libzip-dev \
    postgresql-dev \
    git \
    unzip \
    autoconf \
    g++ \
    make \
    && docker-php-ext-install pdo pdo_pgsql intl zip opcache \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

# php.ini dev (à adapter en prod)
RUN { \
    echo "memory_limit=512M"; \
    echo "upload_max_filesize=20M"; \
    echo "post_max_size=20M"; \
    echo "display_errors=1"; \
  } > /usr/local/etc/php/conf.d/dev.ini

EXPOSE 9000

CMD ["php-fpm"]
