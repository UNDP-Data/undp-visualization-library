/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedDumbbellChart } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<
  typeof AnimatedDumbbellChart
>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Animated graphs/Dumbbell Chart',
  component: AnimatedDumbbellChart,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          detail: `{
  label: string; 
  x: (number | undefined | null)[];
  date: string | number;
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
    dateFormat: {
      table: {
        defaultValue: { summary: 'yyyy' },
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
      { label: 'Category 1', x: [3, 6], date: '2020' },
      { label: 'Category 1', x: [8, 2], date: '2021' },
      { label: 'Category 1', x: [11, 5], date: '2022' },
      { label: 'Category 1', x: [19, 7], date: '2023' },

      { label: 'Category 2', x: [3, 4], date: '2020' },
      { label: 'Category 2', x: [8, 12], date: '2021' },
      { label: 'Category 2', x: [11, 15], date: '2022' },
      { label: 'Category 2', x: [19, 5], date: '2023' },

      { label: 'Category 3', x: [5, 9], date: '2020' },
      { label: 'Category 3', x: [7, 14], date: '2021' },
      { label: 'Category 3', x: [10, 13], date: '2022' },
      { label: 'Category 3', x: [12, 6], date: '2023' },

      { label: 'Category 4', x: [4, 8], date: '2020' },
      { label: 'Category 4', x: [6, 11], date: '2021' },
      { label: 'Category 4', x: [9, 12], date: '2022' },
      { label: 'Category 4', x: [14, 10], date: '2023' },
    ],
    colorDomain: ['Apple', 'Oranges'],
  },
  render: ({ backgroundColor, colorDomain, sortParameter, ...args }) => {
    return (
      <AnimatedDumbbellChart
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

type Story = StoryObj<typeof AnimatedDumbbellChart>;

export const Default: Story = {};
