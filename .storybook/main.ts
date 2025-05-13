import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/stories/*.mdx',
    '../src/stories/Utilities/**/*.mdx',
    '../src/stories/GraphsFromConfig/**/*.mdx',
    '../src/stories/Dashboards/*.mdx',
    '../src/stories/Dashboards/PageSections/ComplexDataTypes/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  managerHead: head => `
    ${head}
    <meta name="description" content="Documentation and examples for UNDP data viz library" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="UNDP data viz library" />
    <meta property="og:url" content="https://dataviz.design.undp.org/" />
    <meta property="og:title" content="Documentation | UNDP data viz library" />
    <meta property="og:description" content="Documentation and examples for UNDP data viz library" />
    <meta property="og:image" content="/Cover.png" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://dataviz.design.undp.org/" />
    <meta name="twitter:title" content="Documentation | UNDP data viz library" />
    <meta name="twitter:description" content="Documentation and examples for UNDP data viz library" />
    <meta name="twitter:image" content="/Cover.png" />

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" />
  `,
};
export default config;
