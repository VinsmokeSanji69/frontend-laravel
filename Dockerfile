# =========================
# NODE BUILD STAGE
# =========================
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files first (for caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install --legacy-peer-deps

# Copy Vite + TS + PostCSS configs
COPY vite.config.js tsconfig.json postcss.config.cjs ./

# Copy frontend resources and public folder
COPY resources ./resources
COPY public ./public

# Run Vite build
RUN npm run build

# =========================
# PHP + LARAVEL STAGE
# =========================
FROM php:8.3-cli

WORKDIR /var/www

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel app
COPY . .

# Copy Vite build from Node build stage
COPY --from=node-builder /var/www/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache public/build \
    && chmod -R 755 public

# Clear caches (in Dockerfile, after copying app)
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear \
    && php artisan cache:clear

# Expose dynamic port for Render
EXPOSE ${PORT}

# Serve Laravel on Render
CMD php artisan serve --host=0.0.0.0 --port=${PORT}
