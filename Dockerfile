# =========================
# NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files first
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy configs
COPY vite.config.js tsconfig.json postcss.config.cjs ./

# Copy frontend resources
COPY resources ./resources
COPY public ./public

# Build Vite assets
RUN npm run build

# =========================
# PHP + LARAVEL STAGE
# =========================
FROM php:8.3-fpm

WORKDIR /var/www

# Install system deps + PHP extensions
RUN apt-get update && apt-get install -y git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel app
COPY . .

# Copy Vite build
COPY --from=node-builder /var/www/public/build ./public/build

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build \
    && chmod -R 755 public

# Clear caches at runtime via entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port from Render
EXPOSE ${PORT}

# Start container via entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
