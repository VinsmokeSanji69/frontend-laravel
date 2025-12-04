#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== Starting build process ==="

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "Installing NPM dependencies..."
npm ci --include=optional

echo "Building Vite assets..."
npm run build

echo "Clearing and caching Laravel configurations..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Build completed successfully ==="
