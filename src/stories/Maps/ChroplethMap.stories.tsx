/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChoroplethMap } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof ChoroplethMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/Choropleth map',
  component: ChoroplethMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  x?: number | string | null;
  countryCode: string;
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
      table: {
        type: {
          summary: 'number[] | string[]',
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
    mapData: {
      control: 'object',
    },
    centerPoint: {
      control: 'text',
      table: {
        type: {
          summary: '[number, number]',
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
    showValues: {
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    labelOrder: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
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
      control: 'boolean',
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
    sortData: {
      control: 'inline-radio',
      options: ['asc', 'desc'],
      table: { type: { summary: "'asc' | 'desc'" } },
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
      { label: '2020 Q1', size: 3 },
      { label: '2020 Q2', size: 8 },
      { label: '2020 Q3', size: 11 },
      { label: '2020 Q4', size: 19 },
      { label: '2021 Q1', size: 3 },
      { label: '2022 Q2', size: 8 },
      { label: '2023 Q3', size: 11 },
      { label: '2024 Q4', size: 19 },
    ],
  },
  render: ({
    colors,
    labelOrder,
    highlightedDataPoints,
    backgroundColor,
    colorDomain,
    ...args
  }) => {
    return (
      <ChoroplethMap
        colors={parseValue(colors, colors)}
        labelOrder={parseValue(labelOrder)}
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

type Story = StoryObj<typeof ChoroplethMap>;

export const Default: Story = {};
