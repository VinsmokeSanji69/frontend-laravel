# ---------- BUILD STAGE ----------
FROM node:20 AS node-builder

WORKDIR /var/www

# Copy package files and configs first
COPY package*.json ./
COPY vite.config.js ./
COPY tsconfig.json ./
COPY tailwind.config.js ./

# Install Node dependencies
RUN npm install

# Copy resources
COPY resources ./resources

# Set environment variables for production build
ENV NODE_ENV=production
# Remove APP_URL from build stage as it causes issues with Vite
ENV VITE_APP_NAME=FrontendLaravel

# Build assets - Use production flag explicitly
RUN npm run build -- --mode=production


# ---------- PHP IMAGE ----------
FROM php:8.3-fpm

# Install PHP system dependencies and extensions
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

# Set environment variables at runtime
ENV APP_URL=${APP_URL:-https://frontend-laravel-1.onrender.com}
ENV PORT=${PORT:-10000}

# Serve Laravel
CMD php artisan serve --host 0.0.0.0 --port ${PORT}
