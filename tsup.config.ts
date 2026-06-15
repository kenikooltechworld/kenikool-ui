import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Recursively copies all .css files from src to dest,
 * preserving the directory structure.
 */
function copyDirRecursive(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath  = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.name.endsWith('.css')) {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * tsup plugin that copies all CSS from src/styles/ → dist/styles/
 * after every build. Runs once after the first (vanilla) entry completes.
 */
const copyStylesPlugin = {
  name: 'copy-styles',
  buildEnd(): void {
    try {
      copyDirRecursive('src/styles', 'dist/styles');
      console.log('✓ CSS copied to dist/styles/');
    } catch (err) {
      console.warn('⚠ CSS copy skipped (src/styles may not exist yet):', err);
    }
  },
};

export default defineConfig([
  // ─── Entry 1: Vanilla JS Web Components ───────────────────────────────────
  // Registers all <k-*> custom elements as a side effect on import.
  // Bundle dompurify so users don't need to install it separately.
  {
    entry:     { index: 'src/vanilla/index.ts' },
    outDir:    'dist/vanilla',
    format:    ['esm', 'cjs'],
    dts:       true,
    clean:     true,
    sourcemap: true,
    target:    'es2020',
    // Bundle dompurify into the vanilla output (no peer-dep needed in the browser)
    noExternal: ['dompurify'],
    sideEffects: true,
    plugins:   [copyStylesPlugin],
  },

  // ─── Entry 2: React Components ────────────────────────────────────────────
  // Externalises react/react-dom — consuming app provides them.
  // Uses the new JSX transform (react/jsx-runtime).
  {
    entry:     { index: 'src/react/index.ts' },
    outDir:    'dist/react',
    format:    ['esm', 'cjs'],
    dts:       true,
    clean:     false,
    sourcemap: true,
    target:    'es2020',
    external:  ['react', 'react-dom', 'react/jsx-runtime'],
    esbuildOptions(o) {
      o.jsx = 'automatic';
    },
  },

  // ─── Entry 3: ThemeSwitcher + useTheme ────────────────────────────────────
  // React-based theme switcher component and hook.
  // Also externalises react/react-dom.
  {
    entry:     { index: 'src/themes/index.ts' },
    outDir:    'dist/themes',
    format:    ['esm', 'cjs'],
    dts:       true,
    clean:     false,
    sourcemap: true,
    target:    'es2020',
    external:  ['react', 'react-dom', 'react/jsx-runtime'],
    esbuildOptions(o) {
      o.jsx = 'automatic';
    },
  },
]);
