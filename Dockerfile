# ----------------- NODE BUILD STAGE -----------------
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files first
COPY package*.json ./

# Install ALL Node dependencies (including dev dependencies for build)
RUN npm install --legacy-peer-deps

# Copy necessary config files (NO tailwind.config.js for v4)
COPY vite.config.js tsconfig.json postcss.config.cjs ./

# Copy source files
COPY resources ./resources
COPY public ./public

# Build Vite assets
RUN npm run build

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

# Copy Laravel files
COPY . .

# Copy built assets from Node stage
COPY --from=node-builder /var/www/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache \
    && chmod -R 755 public

# Expose port
EXPOSE 10000

ENV APP_URL=${APP_URL:-https://frontend-laravel.onrender.com}
ENV PORT=${PORT:-10000}
ENV APP_ENV=production

# Start Laravel
CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan serve --host 0.0.0.0 --port ${PORT}
