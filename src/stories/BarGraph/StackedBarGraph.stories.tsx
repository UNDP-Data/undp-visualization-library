/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StackedBarGraph } from '@/index';

function parseValue(str?: any, defaultVal?: any) {
  try {
    JSON.parse(str);
    return JSON.parse(str);
  } catch (_e) {
    return defaultVal;
  }
}

type PagePropsAndCustomArgs = React.ComponentProps<typeof StackedBarGraph>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Stacked Bar Graph',
  component: StackedBarGraph,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      description: 'Array of bar graph data',
      table: {
        type: {
          summary: 'StackedBarGraphDataType[]',
          detail: `{
  label: string; 
  size: (number | undefined | null)[];
}`,
        },
      },
    },

    // Titles and Labels and Sources
    graphTitle: {
      control: 'text',
      description: 'Title of the graph',
      table: {
        type: { summary: 'string' },
      },
    },
    graphDescription: {
      control: 'text',
      description: 'Description of the graph',
      table: { type: { summary: 'string' } },
    },
    footNote: {
      control: 'text',
      description: 'Footnote for the graph',
      table: { type: { summary: 'string' } },
    },
    sources: {
      control: 'object',
      description: 'Source data for the graph',
      table: {
        type: {
          summary: 'SourcesDataType[]',
          detail: `{
  source: string; 
  link?: string; 
}`,
        },
      },
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label',
      table: { type: { summary: 'string' } },
    },
    barAxisTitle: {
      control: 'text',
      description: 'Title for the bar axis',
      table: { type: { summary: 'string' } },
    },

    // Colors and Styling
    colors: {
      control: 'text',
      description: 'Color or array of colors for bars',
      table: {
        type: {
          summary: 'string[]',
          detail:
            'Requires a array if color key is present in the data else requires a string',
        },
      },
    },
    colorDomain: {
      control: 'text',
      description: 'Domain of colors for the graph',
      table: { type: { summary: 'string[]' } },
    },
    colorLegendTitle: {
      control: 'text',
      description: 'Title for the color legend',
      table: { type: { summary: 'string' } },
    },
    valueColor: {
      control: 'color',
      description: 'Color of value labels',
      table: { type: { summary: 'string' } },
    },
    backgroundColor: {
      control: 'text',
      description: 'Background color of the graph',
      table: { type: { summary: 'string | boolean' } },
    },
    styles: {
      control: 'object',
      description:
        'Custom styles for the graph. Each object should be a valid React CSS style object.',
      table: {
        type: {
          summary: 'StyleObject',
          detail: `{
    title?: React.CSSProperties;
    footnote?: React.CSSProperties;
    source?: React.CSSProperties;
    description?: React.CSSProperties;
    graphBackground?: React.CSSProperties;
    tooltip?: React.CSSProperties;
    xAxis?: {
      gridLines?: React.CSSProperties;
      labels?: React.CSSProperties;
      title?: React.CSSProperties;
      axis?: React.CSSProperties;
    };
    yAxis?: {
      gridLines?: React.CSSProperties;
      labels?: React.CSSProperties;
      title?: React.CSSProperties;
      axis?: React.CSSProperties;
    };
    graphObjectValues?: React.CSSProperties;
    dataConnectors?: React.CSSProperties;
    mouseOverLine?: React.CSSProperties;
    regLine?: React.CSSProperties;
  }`,
        },
      },
    },
    classNames: {
      control: 'object',
      description: 'Custom class names',
      table: {
        type: {
          summary: 'ClassNameObject',
          detail: `{
  title?: string;
  footnote?: string;
  source?: string;
  description?: string;
  graphBackground?: string;
  tooltip?: string;
  xAxis?: {
    gridLines?: string;
    labels?: string;
    title?: string;
    axis?: string;
  };
  yAxis?: {
    gridLines?: string;
    labels?: string;
    title?: string;
    axis?: string;
  };
  graphObjectValues?: string;
  dataConnectors?: string;
  mouseOverLine?: string;
  regLine?: string;
}`,
        },
      },
    },

    // Size and Spacing
    width: {
      control: 'number',
      description: 'Width of the graph',
      table: { type: { summary: 'number' } },
    },
    height: {
      control: 'number',
      description: 'Height of the graph',
      table: { type: { summary: 'number' } },
    },
    minHeight: {
      control: { type: 'number', min: 0 },
      description: 'Minimum height of the graph',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    relativeHeight: {
      control: 'number',
      description:
        'Relative height scaling factor. This overwrites the height props',
      table: { type: { summary: 'number' } },
    },
    padding: {
      control: 'text',
      description: 'Padding around the graph',
      table: { type: { summary: 'string' } },
    },
    leftMargin: {
      control: 'number',
      description: 'Left margin of the graph',
      table: { type: { summary: 'number' } },
    },
    rightMargin: {
      control: 'number',
      description: 'Right margin of the graph',
      table: { type: { summary: 'number' } },
    },
    topMargin: {
      control: 'number',
      description: 'Top margin of the graph',
      table: { type: { summary: 'number' } },
    },
    bottomMargin: {
      control: 'number',
      description: 'Bottom margin of the graph',
      table: { type: { summary: 'number' } },
    },
    barPadding: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Padding between bars',
      table: { type: { summary: 'number' } },
    },
    maxBarThickness: {
      control: 'number',
      description: 'Maximum thickness of bars',
      table: { type: { summary: 'number' } },
    },
    minBarThickness: {
      control: 'number',
      description: 'Minimum thickness of bars',
      table: { type: { summary: 'number' } },
    },
    maxNumberOfBars: {
      control: { type: 'number', min: 0 },
      description: 'Maximum number of bars shown in the graph',
      table: { type: { summary: 'number' } },
    },

    // Values and Ticks
    prefix: {
      control: 'text',
      description: 'Prefix for values',
      table: { type: { summary: 'string' } },
    },
    suffix: {
      control: 'text',
      description: 'Suffix for values',
      table: { type: { summary: 'string' } },
    },
    maxValue: {
      control: 'number',
      description: 'Maximum value for the chart',
      table: { type: { summary: 'number' } },
    },
    truncateBy: {
      control: 'number',
      description: 'Truncate labels by specified length',
      table: { type: { summary: 'number' }, defaultValue: { summary: '999' } },
    },
    refValues: {
      control: 'object',
      description: 'Reference values for comparison',
      table: {
        type: {
          summary: 'ReferenceDataType[]',
          detail: `{
    value: number | null;
    text: string;
    color?: string;
    styles?: {
      line?: React.CSSProperties;
      text?: React.CSSProperties;
    };
    classNames?: {
      line?: string;
      text?: string;
    };
  }`,
        },
      },
    },
    noOfTicks: {
      control: 'number',
      description: 'Number of ticks on the axis',
      table: { type: { summary: 'number' }, defaultValue: { summary: '5' } },
    },

    // Graph parameters
    showLabels: {
      control: 'boolean',
      description: 'Toggle visibility of labels',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showValues: {
      control: 'boolean',
      description: 'Toggle visibility of values',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    labelOrder: {
      control: 'text',
      description: 'Custom order for labels',
      table: { type: { summary: 'string[]' } },
    },
    showTicks: {
      control: 'boolean',
      description: 'Toggle visibility of axis ticks',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    graphDownload: {
      control: 'boolean',
      description: 'Enable graph download option as png',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dataDownload: {
      control: 'boolean',
      description: 'Enable data download option as a csv',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    resetSelectionOnDoubleClick: {
      control: 'boolean',
      description: 'Reset selection on double-click',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },

    // Interactions and Callbacks
    tooltip: {
      control: 'text',
      description:
        'Tooltip content. This uses the handlebar template to display the data',
      table: { type: { summary: 'string' } },
    },
    detailsOnClick: {
      control: 'text',
      description:
        'Details displayed on the modal when user clicks of a data point',
      table: { type: { summary: 'string' } },
    },
    onSeriesMouseOver: {
      action: 'seriesMouseOver',
      description: 'Callback for mouse over event',
      table: { type: { summary: '(_d: any) => void' } },
    },
    onSeriesMouseClick: {
      action: 'seriesMouseClick',
      description: 'Callback for mouse click event',
      table: { type: { summary: '(_d: any) => void' } },
    },

    // Configuration and Options
    sortParameter: {
      control: 'number',
      description:
        'Parameter to sort the data. If a number is provided, it refers to the index of the size array to determine which value to sort by. If set to total, it sorts by the sum of all the values.',
      table: {
        type: { summary: "'number' | 'total'" },
      },
    },
    language: {
      control: 'select',
      options: [
        'en',
        'ar',
        'az',
        'bn',
        'cy',
        'he',
        'hi',
        'jp',
        'ka',
        'km',
        'ko',
        'my',
        'ne',
        'zh',
        'custom',
      ],
      description: 'Language setting',
      table: {
        type: {
          summary:
            "'en' | 'ar' | 'az' | 'bn' | 'cy' | 'he' | 'hi' | 'jp' | 'ka' | 'km' | 'ko' | 'my' | 'ne' | 'zh' | 'custom',",
        },
        defaultValue: { summary: 'en' },
      },
    },
    mode: {
      control: 'inline-radio',
      options: ['light', 'dark'],
      description: 'Theme mode',
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: 'light' },
      },
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Orientation of the graph',
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: 'vertical' },
      },
    },
    graphID: {
      control: 'text',
      description: 'Unique ID for the graph',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    data: [
      { label: '2020 Q1', size: [3, 4, 5] },
      { label: '2020 Q2', size: [8, 9, 10] },
      { label: '2020 Q3', size: [6, 7, 8] },
      { label: '2020 Q4', size: [5, 6, 7] },
    ],
    colorDomain: ['Apples', 'Mangoes', 'Oranges'],
  },
  parameters: {
    docs: {
      argTypes: {
        sort: 'none',
      },
      source: {
        type: 'dynamic',
      },
    },
  },
  render: ({ colors, labelOrder, backgroundColor, colorDomain, ...args }) => {
    return (
      <StackedBarGraph
        colors={parseValue(colors)}
        labelOrder={parseValue(labelOrder)}
        colorDomain={parseValue(colorDomain, ['Apples', 'Mangoes', 'Oranges'])}
        backgroundColor={backgroundColor === 'true' ? true : backgroundColor}
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof StackedBarGraph>;

export const Default: Story = {};
