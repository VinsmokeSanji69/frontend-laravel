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
COPY vite.config.js tsconfig.json postcss.config.cjs ./
COPY tailwind.config.js* ./

# Copy source files BEFORE public directory
COPY resources ./resources

# Create a minimal public directory structure for build
RUN mkdir -p public

# Build frontend assets
RUN npm run build

# Verify the build output
RUN echo "=== Checking build output ===" && \
    ls -la public/build/ && \
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

# Copy application files EXCEPT public/build
COPY --chown=www-data:www-data . .

# Remove any existing build directory from source
RUN rm -rf /var/www/public/build

# Copy ONLY the built assets from node-builder
COPY --from=node-builder --chown=www-data:www-data /var/www/public/build /var/www/public/build

# Verify files were copied successfully
RUN echo "=== Verifying copied files ===" && \
    ls -laR /var/www/public/build/ && \
    cat /var/www/public/build/manifest.json

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set proper permissions
RUN chmod -R 755 /var/www/public && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE ${PORT:-8000}

# Start the application (without caching commands for simplicity)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
