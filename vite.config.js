import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            build: {
                manifest: true,
                outDir: 'public/build',
            },
        }),
        react({ include: '**/*.{jsx,tsx}' }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
            generateTypes: false, // <-- Disable PHP calls during build
        }),
    ],
    esbuild: { jsx: 'automatic' },
    base: process.env.APP_URL ? process.env.APP_URL + '/build/' : '/build/',
});
