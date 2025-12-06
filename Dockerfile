# =========================
# 1. NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy configuration files
COPY vite.config.js tsconfig.json postcss.config.cjs tailwind.config.js* ./

# Copy source files
COPY resources ./resources
COPY public ./public

# Build frontend assets
RUN npm run build

# Verify the build output
RUN echo "Checking build output..." && \
    ls -la public/build/ && \
    if [ ! -f "public/build/manifest.json" ]; then \
        echo "ERROR: manifest.json not found!" && \
        exit 1; \
    fi && \
    echo "manifest.json contents:" && \
    cat public/build/manifest.json

# =========================
# 2. PHP / LARAVEL STAGE
# =========================
FROM php:8.3-cli

WORKDIR /var/www

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
      git curl zip unzip \
      libonig-dev libxml2-dev libicu-dev \
      libpng-dev libjpeg-dev libfreetype6-dev \
      libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Create public/build directory before copying
RUN mkdir -p /var/www/public/build

# Copy the built assets from node-builder stage
COPY --from=node-builder /var/www/public/build /var/www/public/build

# Verify files were copied successfully
RUN echo "Verifying copied files..." && \
    ls -la /var/www/public/build/ && \
    if [ ! -f "/var/www/public/build/manifest.json" ]; then \
        echo "ERROR: manifest.json not found after copy!" && \
        exit 1; \
    fi && \
    cat /var/www/public/build/manifest.json

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set proper permissions
RUN chown -R www-data:www-data /var/www && \
    chmod -R 755 /var/www/public && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Create a startup script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting application..."\n\
echo "Checking manifest.json..."\n\
if [ -f "/var/www/public/build/manifest.json" ]; then\n\
    echo "manifest.json found!"\n\
    cat /var/www/public/build/manifest.json\n\
else\n\
    echo "ERROR: manifest.json not found!"\n\
    ls -la /var/www/public/build/ || echo "build directory does not exist"\n\
    exit 1\n\
fi\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}\n\
' > /var/www/start.sh && chmod +x /var/www/start.sh

EXPOSE ${PORT:-8000}

CMD ["/var/www/start.sh"]

