import type { Preview } from '@storybook/angular';
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";

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
