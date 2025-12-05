#!/bin/bash
set -e

# Set production environment
export APP_ENV=production
export APP_DEBUG=false

# Clear and cache configs/routes/views
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM server (production-ready)
php-fpm
