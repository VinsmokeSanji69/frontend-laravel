# =========================
# NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder
WORKDIR /var/www
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY vite.config.js tsconfig.json postcss.config.cjs ./
COPY resources ./resources
COPY public ./public
RUN npm run build
COPY public/build ./public/build

# =========================
# PHP + LARAVEL STAGE
# =========================
FROM php:8.3-cli

WORKDIR /var/www

# Install deps
RUN apt-get update && apt-get install -y git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel + Vite build
COPY . .
COPY --from=node-builder /var/www/public/build ./public/build

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build \
    && chmod -R 755 public

# Expose dynamic port
EXPOSE ${PORT}

# Use artisan serve for Render
CMD php artisan serve --host=0.0.0.0 --port=${PORT}
