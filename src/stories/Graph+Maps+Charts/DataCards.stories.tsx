/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataCards } from '@/index';
import { parseValue } from '../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DataCards>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Graphs/Data Cards',
  component: DataCards,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: 'object',
      table: {
        type: {
          summary: 'object[]',
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
      },
    },
    cardFilters: {
      control: 'object',
      table: {
        type: {
          detail: `{
  column: string;
  label?: string;
  defaultValue?: string;
  excludeValues?: string[];
  width?: string;
}`,
        },
      },
    },
    cardSortingOptions: {
      control: 'object',
      table: {
        type: {
          detail: `{
  defaultValue?: string;
  options: {
    value: string;
    label: string;
    type: 'asc' | 'desc';
  }[];
  width?: string;
}`,
        },
      },
    },
    cardSearchColumns: {
      control: 'text',
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

    // Interactions and Callbacks
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
  },
  args: {
    data: [
      {
        label: 'Project A',
        category: 'Category 1',
        description: 'Lorem ipsum dolor sit amet <...>',
      },
      {
        label: 'Project B',
        category: 'Category 2',
        description: 'Lorem ipsum dolor sit amet <...>',
      },
      {
        label: 'Project C',
        category: 'Category 3',
        description: 'Lorem ipsum dolor sit amet <...>',
      },
    ],
    cardTemplate:
      "<div style='padding: 24px;'><h6 class='undp-viz-typography'>{{label}}</h6><p class='undp-viz-typography' style='font-size: 16px;'>{{description}}</p></div>",
  },
  render: ({ backgroundColor, cardSearchColumns, ...args }) => {
    return (
      <DataCards
        backgroundColor={
          backgroundColor === 'false'
            ? false
            : backgroundColor === 'true'
            ? true
            : backgroundColor
        }
        cardSearchColumns={parseValue(cardSearchColumns)}
        {...args}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof DataCards>;

export const Default: Story = {};
