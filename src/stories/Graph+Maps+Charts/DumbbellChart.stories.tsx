/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DumbbellChart } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DumbbellChart>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Dumbbell chart',
  component: DumbbellChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          summary: 'DumbbellChartDataType[]',
          detail: `{
  label: string; 
  x: (number | undefined | null)[];
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
    barPadding: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },

    // Values and Ticks
    truncateBy: {
      control: 'number',
      table: { defaultValue: { summary: '999' } },
    },
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
    arrowConnector: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    connectorStrokeWidth: {
      table: {
        defaultValue: { summary: '2' },
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
    sortParameter: {
      control: 'text',
      table: { type: { summary: "'number' | 'diff'" } },
    },
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
      { label: '2020 Q1', x: [3, 5] },
      { label: '2020 Q2', x: [8, 6] },
      { label: '2020 Q3', x: [11, 8] },
      { label: '2020 Q4', x: [19, 10] },
      { label: '2021 Q1', x: [3, 15] },
      { label: '2022 Q2', x: [8, 5] },
      { label: '2023 Q3', x: [11, 3] },
      { label: '2024 Q4', x: [19, 10] },
    ],
    colorDomain: ['Apple', 'Oranges'],
  },
  render: ({
    labelOrder,
    backgroundColor,
    colorDomain,
    sortParameter,
    ...args
  }) => {
    return (
      <DumbbellChart
        labelOrder={parseValue(labelOrder)}
        colorDomain={parseValue(colorDomain, ['Apple', 'Oranges'])}
        sortParameter={
          !sortParameter
            ? undefined
            : sortParameter === 'diff'
            ? 'diff'
            : /^\d+$/.test(sortParameter as any)
            ? parseInt(sortParameter as any, 10)
            : undefined
        }
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

type Story = StoryObj<typeof DumbbellChart>;

export const Default: Story = {};
