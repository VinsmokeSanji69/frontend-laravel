# ----------------- NODE BUILD STAGE -----------------
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files first
COPY package*.json ./

# Install ALL Node dependencies
RUN npm install --legacy-peer-deps

# Copy necessary files for Vite build
COPY vite.config.js ./
COPY tsconfig.json ./
COPY postcss.config.cjs ./
COPY tailwind.config.js ./
COPY resources ./resources
COPY public ./public

# Build client assets first, then SSR bundle
RUN npm run build
RUN npm run build:ssr

# Verify the build output exists
RUN echo "=== Checking build artifacts ===" && \
    ls -la public/build/ && \
    echo "=== Manifest contents ===" && \
    cat public/build/manifest.json && \
    echo "=== SSR bundle ===" && \
    ls -la bootstrap/ssr/ || echo "SSR bundle not found"

# ----------------- PHP / LARAVEL STAGE -----------------
FROM php:8.3-fpm

# Install Node.js in the PHP container (needed for SSR)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install PHP extensions and system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy ALL Laravel files FIRST
COPY . .

# Copy built assets from Node stage (AFTER copying Laravel files)
COPY --from=node-builder /var/www/public/build ./public/build
COPY --from=node-builder /var/www/bootstrap/ssr ./bootstrap/ssr

# Verify build directories exist in final container
RUN echo "=== Final container check ===" && \
    ls -la public/build/ && \
    cat public/build/manifest.json && \
    ls -la bootstrap/ssr/ || echo "No SSR bundle"

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build bootstrap/ssr \
    && chmod -R 755 public

# Expose port
EXPOSE 10000

ENV APP_URL=${APP_URL:-https://frontend-laravel.onrender.com}
ENV PORT=${PORT:-10000}
ENV APP_ENV=production
ENV APP_DEBUG=false

# Start Laravel with proper config
CMD php artisan config:clear && \
    php artisan cache:clear && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan serve --host 0.0.0.0 --port ${PORT}
