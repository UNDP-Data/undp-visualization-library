/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DualAxisLineChart } from '@/index';
import {
  CLASS_NAME_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';
import { parseValue } from '../assets/parseValue';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DualAxisLineChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Dual axis line chart',
  component: DualAxisLineChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  date: number | string;
  y1?: number;
  y2?: number;
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
    lineColors: {
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

    // Values and Ticks
    minDate: { control: 'text' },
    maxDate: { control: 'text' },
    noOfXTicks: {
      table: { defaultValue: { summary: '5' } },
    },
    noOfYTicks: {
      table: { defaultValue: { summary: '5' } },
    },

    // Graph parameters
    animateLine: {
      control: 'text',
      table: {
        type: {
          summary: 'boolean | number',
          detail:
            'If the type is number then it uses the number as the time in seconds for animation.',
        },
      },
    },
    labels: {
      control: 'text',
    },
    dateFormat: {
      table: {
        defaultValue: { summary: 'yyyy' },
      },
    },
    showValues: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    curveType: {
      control: 'radio',
      options: ['linear', 'curve', 'step', 'stepAfter', 'stepBefore'],
      table: {
        defaultValue: { summary: 'curve' },
      },
    },
    lineSuffixes: {
      control: 'text',
    },
    linePrefixes: {
      control: 'text',
    },
    highlightAreaSettings: {
      control: 'object',
      table: {
        type: {
          detail: `{
  coordinates: [number | string | null, number | string | null];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}`,
        },
      },
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

    // Interactions and Callbacks
    onSeriesMouseOver: {
      action: 'seriesMouseOver',
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
      { date: '2020', y1: 3, y2: 5 },
      { date: '2021', y1: 8, y2: 15 },
      { date: '2022', y1: 11, y2: 10 },
      { date: '2023', y1: 19, y2: 6 },
      { date: '2024', y1: 3, y2: 9 },
      { date: '2025', y1: 8, y2: 5 },
      { date: '2026', y1: 11, y2: 8 },
      { date: '2027', y1: 19, y2: 10 },
    ],
    labels: ['Apples', 'Oranges'],
  },
  render: ({
    animateLine,
    backgroundColor,
    lineColors,
    linePrefixes,
    lineSuffixes,
    labels,
    ...args
  }) => {
    return (
      <DualAxisLineChart
        animateLine={
          (animateLine as any) === 'false'
            ? false
            : (animateLine as any) === 'true'
            ? true
            : Number(animateLine)
        }
        lineColors={parseValue(lineColors)}
        lineSuffixes={parseValue(lineSuffixes)}
        linePrefixes={parseValue(linePrefixes)}
        labels={parseValue(labels, ['Apples', 'Oranges'])}
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

type Story = StoryObj<typeof DualAxisLineChart>;

export const Default: Story = {};
