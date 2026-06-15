// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * ESLint 9 flat config.
 * Enforces strict TypeScript, bans eval/new Function, and ensures
 * no `any` types slip through — all required by the workspace standards.
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,

  // TypeScript source files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService:  true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Security — non-negotiable
      'no-eval':         'error',
      'no-new-func':     'error',
      'no-implied-eval': 'error',

      // TypeScript strictness
      '@typescript-eslint/no-explicit-any':                'error',
      '@typescript-eslint/no-non-null-assertion':          'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/consistent-type-imports':        ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // DOM safety
      'no-innerHTML-assignment': 'off', // we use sanitizeHtml() — handled in code review
    },
  },

  // Ignore generated and config files
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      '.storybook/**',
      'stories/**',
    ],
  }
);
