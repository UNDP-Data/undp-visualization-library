/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UnitChart } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof UnitChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Unit chart',
  component: UnitChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  label: number | string;
  value: number;
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
          summary: 'string[]',
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
    // Values and Ticks

    // Graph parameters
    showColorScale: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    graphDownload: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      table: {
        defaultValue: { summary: '200' },
      },
    },
    totalNoOfDots: {
      table: {
        defaultValue: { summary: '100' },
      },
    },
    unitPadding: {
      table: {
        defaultValue: { summary: '3' },
      },
    },
    gridSize: {
      table: {
        defaultValue: { summary: '10' },
      },
    },
    dataDownload: {
      table: {
        defaultValue: { summary: 'false' },
      },
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
  },
  args: {
    data: [
      { label: 'Male', value: 3 },
      { label: 'Female', value: 8 },
    ],
  },
  render: ({ colors, backgroundColor, ...args }) => {
    return (
      <UnitChart
        colors={parseValue(colors, colors)}
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

type Story = StoryObj<typeof UnitChart>;

export const Default: Story = {};
