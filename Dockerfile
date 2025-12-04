# ---------- BUILD STAGE ----------
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy configs and package files
COPY package*.json ./
COPY vite.config.js ./
COPY tsconfig.json ./
COPY tailwind.config.js ./

# Install node modules
RUN npm install

# Copy resources
COPY resources ./resources

# Build assets
RUN npm run build

# ---------- PHP IMAGE ----------
FROM php:8.3-fpm

# Install system deps
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

# Copy built assets from Node build
COPY --from=node-builder /var/www/public/build ./public/build

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader

# Permissions
RUN chmod -R 777 storage bootstrap/cache public/build

# Expose port
EXPOSE 10000

# Serve Laravel
CMD php artisan serve --host 0.0.0.0 --port ${PORT}
