import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';

createInertiaApp({
  resolve: name => import(`./Pages/${name}.jsx`),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});

