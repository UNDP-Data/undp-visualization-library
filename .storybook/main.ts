import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/stories/*.mdx",
    "../src/stories/Utilities/**/*.mdx",
    "../src/stories/GraphsFromConfig/**/*.mdx",
    "../src/stories/Dashboards/*.mdx",
    "../src/stories/Dashboards/PageSections/ComplexDataTypes/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-essentials",
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {},
  },
};
export default config;