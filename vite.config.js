import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';

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
            generateTypes: false, // <-- avoid PHP calls during Docker build
        }),
    ],
    esbuild: { jsx: 'automatic' },
    base: '/build/',
});
