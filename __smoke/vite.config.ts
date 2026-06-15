/**
 * vite.config.ts — Smoke test Vite config.
 *
 * This is a standalone app that simulates a real end-user project that has
 * run `npm install kenikool-ui`. It serves static HTML from this directory
 * and resolves kenikool-ui subpath exports from node_modules.
 *
 * No special aliases are needed — Vite 8 resolves package.json `exports`
 * automatically, so `import 'kenikool-ui/vanilla'` works out of the box.
 */
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // Serve node_modules as static assets so <link> tags in HTML work.
  // Vite dev server resolves bare module imports from node_modules automatically.
  server: {
    port: 5174,
    open: '/index.html',
  },
  // Optimise the pre-bundled vanilla entry (contains dompurify — no peer deps needed)
  optimizeDeps: {
    include: ['kenikool-ui/vanilla'],
  },
});
