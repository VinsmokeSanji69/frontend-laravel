# ----------------- PHP / LARAVEL STAGE -----------------
FROM php:8.3-fpm

# Install PHP extensions and system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev nginx \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql intl mbstring gd bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node.js (needed for npm run dev)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# Copy all files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-interaction \
    && npm install --legacy-peer-deps

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache \
    && chmod -R 755 public

# Expose port
EXPOSE 10000

# Runtime environment variables
ENV APP_URL=${APP_URL:-https://frontend-laravel-1.onrender.com}
ENV PORT=${PORT:-10000}

# Start both Vite dev server and Laravel
CMD npm run dev & php artisan serve --host 0.0.0.0 --port ${PORT}
