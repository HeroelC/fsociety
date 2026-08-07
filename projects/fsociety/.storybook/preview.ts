import type { Preview } from '@storybook/angular';
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
import { restorePalette } from './palette';

setCompodocJson(docJson);

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Color theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark',  title: 'Dark',  icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (storyFn, context) => {
      const theme = (context.globals['theme'] as string) ?? 'light';
      // Surface colors are driven from [data-theme] in preview-head.html so that
      // Docs pages get the same treatment as the Canvas.
      document.documentElement.setAttribute('data-theme', theme);
      document.body.style.transition = 'background-color 0.2s ease';

      // Re-apply whatever brand palette was picked in Foundations/Branding, so
      // every story renders with it. It only writes the numbered colour stops as
      // inline custom properties, which leaves the theme-dependent alias layer
      // to the stylesheet.
      restorePalette();

      return storyFn();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
};

export default preview;
