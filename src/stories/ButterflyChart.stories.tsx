/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButterflyChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<typeof ButterflyChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Butterfly Chart',
  component: ButterflyChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      description: 'Array of bar graph data',
      table: {
        type: {
          summary: 'ButterflyChartDataType[]',
          detail: `{
  label: string | number;
  position: number;
  radius?: number;
  color?: string;
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
    leftBarTitle: {
      control: 'text',
      description: 'Title for the  left bar axis',
      table: { type: { summary: 'string' } },
    },
    rightBarTitle: {
      control: 'text',
      description: 'Title for the right bar axis',
      table: { type: { summary: 'string' } },
    },

    // Colors and Styling
    colorLegendTitle: {
      control: 'text',
      description: 'Title for the color legend',
      table: { type: { summary: 'string' } },
    },
    backgroundColor: {
      control: 'text',
      description: 'Background color of the graph',
      table: { type: { summary: 'string | boolean' } },
    },
    leftBarColor: {
      control: 'color',
      description: 'Color of the left bars',
      table: { type: { summary: 'string' } },
    },
    rightBarColor: {
      control: 'color',
      description: 'Color of the right bars',
      table: { type: { summary: 'string' } },
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
    centerGap: {
      control: { type: 'number', min: 0 },
      description: 'Spacing between the left and right bars',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
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
    minValue: {
      control: 'number',
      description: 'Minimum value for the chart',
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
    showValues: {
      control: 'boolean',
      description: 'Toggle visibility of values',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showTicks: {
      control: 'boolean',
      description: 'Toggle visibility of axis ticks',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showColorScale: {
      control: 'boolean',
      description:
        'Show or hide color scale. This is only applicable if the data props hae color parameter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    graphID: {
      control: 'text',
      description: 'Unique ID for the graph',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    data: [
      { label: '2010', leftBar: 3, rightBar: 5 },
      { label: '2012', leftBar: 8, rightBar: 10 },
      { label: '2014', leftBar: 11, rightBar: 6 },
      { label: '2016', leftBar: 19, rightBar: 17 },
      { label: '2018', leftBar: 3, rightBar: 15 },
      { label: '2020', leftBar: 8, rightBar: 7 },
      { label: '2022', leftBar: 11, rightBar: 8 },
      { label: '2024', leftBar: 19, rightBar: 9 },
    ],
  },
  render: ({ backgroundColor, ...args }) => {
    return (
      <ButterflyChart
        backgroundColor={backgroundColor === 'true' ? true : backgroundColor}
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof ButterflyChart>;

export const Default: Story = {};
