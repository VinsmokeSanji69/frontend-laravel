FROM php:8.3-fpm

# Install system deps
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libicu-dev \
    nodejs npm \
    && docker-php-ext-install pdo pdo_mysql intl mbstring gd xml bcmath

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working dir
WORKDIR /var/www

# Copy laravel files
COPY . .

# Install Laravel deps
RUN composer install --no-dev --optimize-autoloader

# Install frontend deps
RUN npm install && npm run build

# Permissions
RUN chmod -R 777 storage bootstrap/cache

EXPOSE 10000

CMD php artisan serve --host 0.0.0.0 --port ${PORT}
