import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Storybook 9 configuration.
 * Uses @storybook/react-vite framework (Vite 8 + Rolldown under the hood).
 * addon-themes provides the theme toolbar switcher that sets data-theme
 * on the preview iframe's <html> element.
 */
const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(ts|tsx)',
    '../stories/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
  ],
  framework: {
    name:    '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false, // tsup handles type checking; skip in Storybook for speed
  },
};

export default config;
