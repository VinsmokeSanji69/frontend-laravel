# =========================
# 1. NODE BUILD STAGE
# =========================
FROM node:20-alpine AS node-builder

WORKDIR /var/www

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deeps for compatibility
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit

# Copy configuration files
COPY vite.config.js tsconfig.json postcss.config.cjs ./
COPY tailwind.config.js* ./

# Copy source files
COPY resources ./resources

# Create public directory for build output
RUN mkdir -p public

# Build frontend assets
RUN npm run build

# Verify the build output
RUN echo "=== Build output verification ===" && \
    ls -la public/build/ && \
    [ -f public/build/manifest.json ] && echo "Build successful"

# =========================
# 2. PHP / LARAVEL STAGE
# =========================
FROM php:8.3-cli-alpine

WORKDIR /var/www

# Install system dependencies and PHP extensions
RUN apk update && apk add --no-cache \
    git \
    curl \
    zip \
    unzip \
    oniguruma-dev \
    libxml2-dev \
    icu-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    postgresql-dev \
    libzip-dev \
    autoconf \
    g++ \
    make \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        intl \
        mbstring \
        gd \
        bcmath \
        xml \
        zip \
        opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Increase PHP memory limit for Composer
RUN echo 'memory_limit = 1G' > /usr/local/etc/php/conf.d/memory-limit.ini && \
    echo 'opcache.enable=1' > /usr/local/etc/php/conf.d/opcache.ini && \
    echo 'opcache.memory_consumption=128' >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo 'opcache.interned_strings_buffer=8' >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo 'opcache.max_accelerated_files=10000' >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo 'opcache.revalidate_freq=2' >> /usr/local/etc/php/conf.d/opcache.ini

# Clean up APK cache
RUN rm -rf /var/cache/apk/*

# Copy application files
COPY --chown=www-data:www-data . .

# Remove any existing build directory
RUN rm -rf /var/www/public/build

# Copy built assets from node-builder
COPY --from=node-builder --chown=www-data:www-data /var/www/public/build /var/www/public/build

# Set platform requirements before composer install
RUN composer config platform.php 8.3.0 && \
    composer config platform.ext-intl '*' && \
    composer config platform.ext-mbstring '*' && \
    composer config platform.ext-gd '*' && \
    composer config platform.ext-zip '*' && \
    composer config platform.ext-pdo_pgsql '*'

# Validate composer.json
RUN echo "=== Validating composer.json ===" && \
    composer validate --no-check-all --strict

# Clear Composer cache and install dependencies with retry
RUN composer clear-cache && \
    composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist || \
    (echo "First attempt failed, retrying..." && \
     composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist)

# Optimize Laravel
RUN php artisan optimize:clear && \
    php artisan package:discover

# Set proper permissions
RUN chown -R www-data:www-data /var/www && \
    chmod -R 755 /var/www/public && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE ${PORT:-8000}

# Switch to non-root user
USER www-data

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Start the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
