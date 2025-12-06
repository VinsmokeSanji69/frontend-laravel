# =========================
# 1. NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder

WORKDIR /var/www

# cache layer for npm
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# copy source files that Vite needs
COPY vite.config.js tsconfig.json postcss.config.cjs ./
COPY resources ./resources
COPY public ./public

# build frontend assets (creates public/build/manifest.json)
RUN npm run build

# =========================
# 2. PHP / LARAVEL STAGE
# =========================
FROM php:8.3-cli

WORKDIR /var/www

# system deps + PHP extensions
RUN apt-get update && apt-get install -y \
      git curl zip unzip libonig-dev libxml2-dev libicu-dev \
      libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# copy Laravel source
COPY . .

# copy Vite build artefacts into the exact path Laravel expects
COPY --from=node-builder /var/www/public/build /var/www/public/build

# install production PHP packages
RUN composer install --no-dev --optimize-autoloader --no-interaction

# permissions
RUN chown -R www-data:www-data /var/www \
 && chmod -R 775 storage bootstrap/cache public/build

# Render supplies PORT at runtime
EXPOSE ${PORT}

CMD php artisan serve --host=0.0.0.0 --port=${PORT}
