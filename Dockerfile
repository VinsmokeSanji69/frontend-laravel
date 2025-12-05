# =========================
# NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy configs and resources
COPY vite.config.js tsconfig.json postcss.config.cjs ./
COPY resources ./resources
COPY public ./public

# Build Vite assets
RUN npm run build

# =========================
# PHP + LARAVEL + NGINX STAGE
# =========================
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies + PHP extensions + Nginx + Supervisor
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    nginx supervisor \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Laravel app
COPY . .

# Copy Vite build from Node stage
COPY --from=node-builder /var/www/public/build ./public/build

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build \
    && chmod -R 755 public

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/sites-enabled/default

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE ${PORT}

# Start everything
ENTRYPOINT ["docker-entrypoint.sh"]
