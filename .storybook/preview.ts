import type { Preview, Decorator } from '@storybook/react';

/**
 * Storybook preview configuration.
 *
 * The theme toolbar item sets `data-theme` on the preview iframe's <html>
 * element, which triggers the CSS cascade to switch all --k-* tokens
 * without any JS component re-renders.
 *
 * Note: base.css is imported here so all --k-* tokens are available
 * in every story. This import will be uncommented once src/styles/base.css
 * is fully populated (T2).
 */

// import '../src/styles/base.css'; // uncomment after T2 is complete

const themeDecorator: Decorator = (Story, context) => {
  const theme = (context.globals['theme'] as string | undefined) ?? 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return Story();
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name:         'Theme',
      description:  'Active kenikool-ui theme',
      defaultValue: 'light',
      toolbar: {
        icon:  'paintbrush',
        items: [
          { value: 'light',   title: '☀️  Light'   },
          { value: 'dark',    title: '🌙  Dark'    },
          { value: 'dracula', title: '🧛  Dracula' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [themeDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
