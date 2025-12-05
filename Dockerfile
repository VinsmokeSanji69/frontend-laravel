# ----------------- NODE BUILD STAGE -----------------
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy config files
COPY vite.config.js ./
COPY tsconfig.json ./
COPY postcss.config.cjs ./

# Copy source directories
COPY resources ./resources
COPY public ./public

# Build client assets only (no SSR)
RUN npm run build

# Verify the build output exists
RUN echo "=== Checking build artifacts ===" && \
    ls -la public/build/ && \
    echo "=== Manifest contents ===" && \
    cat public/build/manifest.json

# ----------------- PHP / LARAVEL STAGE -----------------
FROM php:8.3-fpm

# Install PHP extensions and system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy ALL Laravel files
COPY . .

# Copy built assets from Node stage
COPY --from=node-builder /var/www/public/build ./public/build

# Verify build directory exists
RUN echo "=== Final container check ===" && \
    ls -la public/build/ && \
    cat public/build/manifest.json

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build \
    && chmod -R 755 public

# Expose port
EXPOSE 10000

ENV APP_URL=${APP_URL:-https://frontend-laravel.onrender.com}
ENV PORT=${PORT:-10000}
ENV APP_ENV=production
ENV APP_DEBUG=false

# Start Laravel
CMD php artisan config:clear && \
    php artisan cache:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan serve --host 0.0.0.0 --port ${PORT}
