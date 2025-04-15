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
          'Dashboard',
          [
            'Single graphs with filters',
            'Multi graph dashboard',
            'Small multiples or gridded graph',
            'Multi graph dashboard (wide to long)',
            'From JSON config',
            'Data types',
            [
              'graphType',
              'graphSettings',
              'dataSettings',
              'dataSettings (wide to long)',
              'dataTransform',
              'dataFilters',
              'graphDataConfiguration',
              'filters',
              'dataSelectionOptions',
              'advancedDataSelectionOptions',
              'dashboardLayout',
              'dashboardLayout (wide to long)',
              '*'
            ],
            '*'
          ],
          'Utilities',
          ['Data fetching', 'Data transformation', 'Colors', 'Downloads', '*'],
          'Data types',
          '*',
        ],
      },
    },
  },
};

export default preview;