/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SankeyChart } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof SankeyChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Sankey chart',
  component: SankeyChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          detail: `{
  source: string | number;
  target: string | number;
  value: number;
}`,
        },
      },
    },

    // Titles and Labels and Sources
    sources: {
      table: {
        type: {
          detail: SOURCE_OBJECT,
        },
      },
    },

    // Colors and Styling
    sourceColors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail: 'Requires a array sources need to be a different colors',
        },
      },
    },
    targetColors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail: 'Requires a array targets need to be a different colors',
        },
      },
    },
    sourceColorDomain: {
      control: 'text',
      table: {
        type: {
          summary: '(string | number)[]',
        },
      },
    },
    targetColorDomain: {
      control: 'text',
      table: {
        type: {
          summary: '(string | number)[]',
        },
      },
    },
    backgroundColor: {
      control: 'text',
      table: {
        type: {
          summary: 'string | boolean',
          detail: 'If type is string then background uses the string as color',
        },
      },
    },
    styles: {
      table: {
        type: {
          detail: STYLE_OBJECT,
        },
      },
    },
    classNames: {
      table: {
        type: {
          detail: CLASS_NAME_OBJECT,
        },
      },
    },

    // Size and Spacing
    minHeight: {
      table: { defaultValue: { summary: '0' } },
    },

    // Graph parameters
    showLabels: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showValues: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    sortNodes: {
      control: 'inline-radio',
      options: ['asc', 'desc', 'mostReadable', 'none'],
      table: { type: { summary: "'asc' | 'desc' | 'mostReadable' | 'none'" } },
    },
    animateLinks: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | number',
          detail:
            'If the type is number then it uses the number as the time in seconds for animation.',
        },
      },
    },
    highlightedSourceDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    highlightedTargetDataPoints: {
      control: 'text',
      table: { type: { summary: '(string | number)[]' } },
    },
    graphDownload: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    dataDownload: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    resetSelectionOnDoubleClick: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },

    // Interactions and Callbacks
    onSeriesMouseOver: {
      action: 'seriesMouseOver',
    },
    onSeriesMouseClick: {
      action: 'seriesMouseClick',
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
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: 'light' },
      },
    },
    graphID: {
      control: 'text',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    data: [
      { source: 'A', target: 'B', value: 10 },
      { source: 'A', target: 'C', value: 15 },
      { source: 'B', target: 'D', value: 5 },
      { source: 'C', target: 'D', value: 10 },
      { source: 'C', target: 'E', value: 5 },
      { source: 'D', target: 'F', value: 8 },
      { source: 'E', target: 'F', value: 2 },
    ],
  },
  render: ({
    sourceColors,
    sourceColorDomain,
    targetColors,
    targetColorDomain,
    highlightedSourceDataPoints,
    highlightedTargetDataPoints,
    backgroundColor,
    ...args
  }) => {
    return (
      <SankeyChart
        sourceColors={parseValue(sourceColors, sourceColors)}
        sourceColorDomain={parseValue(sourceColorDomain)}
        targetColors={parseValue(targetColors, targetColors)}
        targetColorDomain={parseValue(targetColorDomain)}
        highlightedSourceDataPoints={parseValue(highlightedSourceDataPoints)}
        highlightedTargetDataPoints={parseValue(highlightedTargetDataPoints)}
        backgroundColor={
          backgroundColor === 'false'
            ? false
            : backgroundColor === 'true'
            ? true
            : backgroundColor
        }
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof SankeyChart>;

export const Default: Story = {};
