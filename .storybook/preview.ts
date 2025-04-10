import type { Preview } from '@storybook/react'
import '@undp-data/undp-design-system-react/dist/style.css';
import '../src/styles/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Add the docs configuration
    docs: {
      controls: { sort: 'none' },
    },
    options: {
      storySort: {
        order: [
          'Getting started',
          'Graphs',
          'Maps',
          'Animated graphs',
          'Animated maps',
          'Utilities',
          '*',
        ],
      },
    },
  },
};

export default preview;