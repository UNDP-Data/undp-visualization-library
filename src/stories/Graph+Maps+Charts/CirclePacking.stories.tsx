/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CirclePackingGraph } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof CirclePackingGraph>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Circle Packing',
  component: CirclePackingGraph,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          summary: 'CirclePackingGraphDataType[]',
          detail: `{
  label: string | number;
  size?: number | null;
  color?: string;
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
    colors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail:
            'Requires a array if color key is present in the data else requires a string',
        },
      },
    },
    colorDomain: {
      control: 'text',
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
    showColorScale: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showNAColor: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    highlightedDataPoints: {
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
      { label: '2010', size: 3 },
      { label: '2012', size: 8 },
      { label: '2014', size: 11 },
      { label: '2016', size: 19 },
      { label: '2018', size: 3 },
      { label: '2020', size: 8 },
      { label: '2022', size: 11 },
      { label: '2024', size: 19 },
    ],
  },
  render: ({
    colors,
    highlightedDataPoints,
    backgroundColor,
    colorDomain,
    ...args
  }) => {
    return (
      <CirclePackingGraph
        colors={parseValue(colors, colors)}
        highlightedDataPoints={parseValue(highlightedDataPoints)}
        colorDomain={parseValue(colorDomain)}
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

type Story = StoryObj<typeof CirclePackingGraph>;

export const Default: Story = {};
