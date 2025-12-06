import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react({ include: '**/*.{jsx,tsx}' }),
    ],
    esbuild: { jsx: 'automatic' },
    build: {
        manifest: 'manifest.json',  // Explicitly set manifest filename
        outDir: 'public/build',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
});
