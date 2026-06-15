import { defineConfig } from 'vitest/config';

/**
 * Vitest 4.x configuration.
 * - Uses jsdom environment so Web Components and DOM APIs work in tests.
 * - globals: true means describe/it/expect are available without imports.
 * - Coverage via v8 provider (built into Node 24, no extra binary needed).
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include:  ['src/**/*.ts', 'src/**/*.tsx'],
      exclude:  [
        'src/**/*.types.ts',
        'src/**/index.ts',
        'src/**/*.stories.tsx',
      ],
    },
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
    ],
  },
});
