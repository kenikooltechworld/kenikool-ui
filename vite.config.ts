import { defineConfig } from 'vite';

/**
 * Vite config — used exclusively for Storybook dev server and build.
 * Vite 8 ships with Rolldown (Rust-based bundler) replacing Rollup.
 * The library production build is handled by tsup, not Vite.
 */
export default defineConfig({
  build: {
    target: 'es2020',
  },
});
