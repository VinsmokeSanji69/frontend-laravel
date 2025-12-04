import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            // Ensure assets are built to public/build
            build: {
                manifest: true,
                outDir: 'public/build',
            },
        }),
        react({
            include: '**/*.{jsx,tsx}',
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    // Use the production URL for assets to prevent mixed content issues
    base: process.env.APP_URL ? process.env.APP_URL + '/build/' : '/build/',
});
