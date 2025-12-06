import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            publicDirectory: 'public',   // explicitly tell Laravel where the web root is
            buildDirectory: 'build',     // explicitly tell Laravel where the build folder is
            refresh: true,
        }),
        react({ include: '**/*.{jsx,tsx}' }),
    ],
    esbuild: { jsx: 'automatic' },
    build: {
        manifest: true,               // always emit manifest.json
        outDir: 'public/build',       // put everything here
        emptyOutDir: true,            // clean old chunks
    },
});
