/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BeeSwarmChart } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof BeeSwarmChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Beeswarm Chart',
  component: BeeSwarmChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
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
    colorDomain: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
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

    // Values and Ticks
    refValues: {
      table: {
        type: {
          detail: REF_VALUE_OBJECT,
        },
      },
    },
    noOfTicks: {
      table: { defaultValue: { summary: '5' } },
    },
    // Graph parameters
    showLabels: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showTicks: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showColorScale: {
      table: {
        defaultValue: { summary: 'true' },
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
    radius: {
      table: {
        defaultValue: { summary: '5' },
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
      options: LANGUAGE_OPTIONS,
      table: {
        type: {
          summary:
            "'en' | 'ar' | 'az' | 'bn' | 'cy' | 'he' | 'hi' | 'jp' | 'ka' | 'km' | 'ko' | 'my' | 'ne' | 'zh' | 'custom'",
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
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: 'vertical' },
      },
    },
  },
  args: {
    data: [
      { label: '2020 Q1', position: 3 },
      { label: '2020 Q2', position: 8 },
      { label: '2020 Q3', position: 11 },
      { label: '2020 Q4', position: 19 },
      { label: '2021 Q1', position: 3 },
      { label: '2022 Q2', position: 8 },
      { label: '2023 Q3', position: 11 },
      { label: '2024 Q4', position: 19 },
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
      <BeeSwarmChart
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

type Story = StoryObj<typeof BeeSwarmChart>;

export const Default: Story = {};
