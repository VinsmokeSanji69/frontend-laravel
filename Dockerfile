# Use PHP FPM base image
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    nodejs npm \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
RUN npm install && npm run build

# Set permissions for Laravel storage and cache
RUN chmod -R 777 storage bootstrap/cache

# Expose the port Laravel will run on
EXPOSE 10000

# Start Laravel server
CMD php artisan serve --host=0.0.0.0 --port=${PORT}
