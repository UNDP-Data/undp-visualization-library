/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatCardFromData } from '@/index';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';
import { parseValue } from '@/stories/assets/parseValue';

type PagePropsAndCustomArgs = React.ComponentProps<typeof StatCardFromData>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Stat card from data',
  component: StatCardFromData,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  value: number | string;
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
    backgroundColor: {
      control: 'text',
      table: {
        type: {
          summary: 'string | boolean',
          detail: 'If type is string then background uses the string as color',
        },
        defaultValue: { summary: 'false' },
      },
    },
    styles: {
      table: {
        type: {
          detail: STYLE_OBJECT,
        },
      },
    },
    verticalAlign: {
      control: 'inline-radio',
      options: ['center', 'top', 'bottom'],
      table: {
        type: { summary: "'center' | 'top' | 'bottom'" },
        defaultValue: { summary: 'center' },
      },
    },
    countOnly: {
      control: 'text',
      table: {
        type: { summary: '(string | number)[]' },
      },
    },
    aggregationMethod: {
      control: 'inline-radio',
      options: ['count', 'max', 'min', 'average', 'sum'],
      table: {
        type: {
          summary: "'count' | 'max' | 'min' | 'average' | 'sum'",
          detail:
            'If the data type of value in data object is string then only count is applicable.',
        },
        defaultValue: { summary: 'count' },
      },
    },
    headingFontSize: {
      table: { defaultValue: { summary: '4.375rem' } },
    },
    classNames: {
      table: {
        type: {
          detail: CLASS_NAME_OBJECT,
        },
      },
    },
    // Graph parameters
    centerAlign: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    textBackground: {
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    year: {
      control: 'text',
      table: {
        type: {
          summary: 'number | string',
        },
      },
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
  },
  args: {
    data: [
      { value: 3 },
      { value: 8 },
      { value: 11 },
      { value: 19 },
      { value: 3 },
      { value: 8 },
      { value: 11 },
      { value: 19 },
    ],
  },
  render: ({ backgroundColor, countOnly, ...args }) => {
    return (
      <StatCardFromData
        countOnly={parseValue(countOnly)}
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

type Story = StoryObj<typeof StatCardFromData>;

export const Default: Story = {};
