import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

// Configure axios for CSRF
const csrfToken = document.querySelector('meta[name="csrf-token"]');
if (csrfToken instanceof HTMLMetaElement) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
}

createInertiaApp({
    title: (title) => (title ? `${title}` : "ExamBits"),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#E7000B',
    },
});
