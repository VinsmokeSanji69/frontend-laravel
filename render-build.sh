#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo "Installing NPM dependencies..."
npm ci

echo "Building frontend assets..."
npm run build

echo "Caching Laravel configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build completed successfully!"
