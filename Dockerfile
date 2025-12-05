# =========================
#  NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy Vite + TS configs
COPY vite.config.js ./
COPY tsconfig.json ./
COPY postcss.config.cjs ./

# Copy Laravel frontend resources
COPY resources ./resources

# Copy public folder (needed for assets)
COPY public ./public

# Run Vite build
RUN npm run build

# Ensure build output exists
RUN echo "=== Checking Vite build ===" \
    && if [ ! -d "public/build" ]; then echo "ERROR: public/build does NOT exist!"; exit 1; fi \
    && ls -la public/build \
    && cat public/build/manifest.json

# =========================
#  LARAVEL PHP STAGE
# =========================
FROM php:8.3-fpm

# Install system deps + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy Laravel app
COPY . .

# Copy Vite build from node stage
COPY --from=node-builder /var/www/public/build ./public/build

# Verify assets copied
RUN echo "=== Final Vite build check ===" \
    && ls -la public/build \
    && cat public/build/manifest.json

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build \
    && chmod -R 755 public

EXPOSE 10000

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=10000

CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan serve --host 0.0.0.0 --port ${PORT}
