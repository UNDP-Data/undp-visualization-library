/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MultiLineChart } from '@/index';
import {
  CLASS_NAME_OBJECT,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';
import { parseValue } from '../assets/parseValue';

type PagePropsAndCustomArgs = React.ComponentProps<typeof MultiLineChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Multi-line chart',
  component: MultiLineChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  date: number | string;
  y: (number | undefined | null)[];
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
    refValues: {
      table: {
        type: {
          detail: REF_VALUE_OBJECT,
        },
      },
    },
    noOfXTicks: {
      table: { defaultValue: { summary: '5' } },
    },
    noOfYTicks: {
      table: { defaultValue: { summary: '5' } },
    },
    minDate: { control: 'text' },
    maxDate: { control: 'text' },

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
    annotations: {
      control: 'object',
      table: {
        type: {
          detail: `{
  text: string;
  maxWidth?: number;
  xCoordinate?: number | string;
  yCoordinate?: number | string;
  xOffset?: number;
  yOffset?: number;
  align?: 'center' | 'left' | 'right';
  color?: string;
  fontWeight?: 'regular' | 'bold' | 'medium';
  showConnector?: boolean | number;
  connectorRadius?: number;
  classNames?: {
    connector?: string;
    text?: string;
  };
  styles?: {
    connector?: React.CSSProperties;
    text?: React.CSSProperties;
  };
}`,
        },
      },
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
    customHighlightAreaSettings: {
      control: 'object',
      table: {
        type: {
          detail: `{
  coordinates: (number | string)[];
  closePath?: boolean;
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
    highlightedLines: {
      control: 'text',
    },
    labels: {
      control: 'text',
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
      { date: '2020', y: [3, 5] },
      { date: '2021', y: [8, 5] },
      { date: '2022', y: [11, 5] },
      { date: '2023', y: [19, 5] },
      { date: '2024', y: [3, 5] },
      { date: '2025', y: [8, 5] },
      { date: '2026', y: [11, 5] },
      { date: '2027', y: [19, 5] },
    ],
    labels: ['Apples', 'Oranges'],
  },
  render: ({
    animateLine,
    backgroundColor,
    labels,
    highlightedLines,
    lineColors,
    ...args
  }) => {
    return (
      <MultiLineChart
        animateLine={
          (animateLine as any) === 'false'
            ? false
            : (animateLine as any) === 'true'
            ? true
            : Number(animateLine)
        }
        lineColors={parseValue(lineColors)}
        labels={parseValue(labels, ['Apples', 'Oranges'])}
        highlightedLines={parseValue(highlightedLines)}
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

type Story = StoryObj<typeof MultiLineChart>;

export const Default: Story = {};
