# ----------------- NODE BUILD STAGE -----------------
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files first (for caching dependencies)
COPY package*.json ./
COPY vite.config.js tsconfig.json tailwind.config.js postcss.config.js* ./

# Install Node dependencies
RUN npm install --legacy-peer-deps

# Copy all resource files needed for build
COPY resources ./resources

# Set environment for production build
ENV NODE_ENV=production
ENV VITE_APP_NAME=FrontendLaravel
ENV VITE_APP_URL=https://frontend-laravel-1.onrender.com

# Build Vite assets (standard npm run build command)
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

# Copy Laravel PHP files
COPY . .

# Copy built assets from Node stage
COPY --from=node-builder /var/www/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache \
    && chmod -R 755 public/build

# Expose port
EXPOSE 10000

# Runtime environment variables
ENV APP_URL=${APP_URL:-https://frontend-laravel-1.onrender.com}
ENV PORT=${PORT:-10000}

# Start Laravel server
CMD php artisan serve --host 0.0.0.0 --port ${PORT}
