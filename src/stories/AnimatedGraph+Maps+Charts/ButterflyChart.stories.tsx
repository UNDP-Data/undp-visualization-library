 
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  REF_VALUE_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../assets/constants';

import { AnimatedButterflyChart } from '@/index';

type PagePropsAndCustomArgs = React.ComponentProps<
  typeof AnimatedButterflyChart
>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Animated graphs/Butterfly chart',
  component: AnimatedButterflyChart,
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
  date: string | number;
  data?: object; //The data key in the object is used when downloading data and can be used to show additional points in mouseover
}`,
        },
      },
    },

    // Titles and Labels and Sources
    sources: { table: { type: { detail: SOURCE_OBJECT } } },

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
    leftBarColor: { control: 'color' },
    rightBarColor: { control: 'color' },
    styles: { table: { type: { detail: STYLE_OBJECT } } },
    classNames: { table: { type: { detail: CLASS_NAME_OBJECT } } },

    // Size and Spacing
    minHeight: { table: { defaultValue: { summary: '0' } } },
    barPadding: {
      control: {
        type: 'range', min: 0, max: 1, step: 0.1, 
      },
    },
    centerGap: { table: { defaultValue: { summary: '100' } } },

    // Values and Ticks
    truncateBy: { table: { defaultValue: { summary: '999' } } },
    refValues: { table: { type: { detail: REF_VALUE_OBJECT } } },
    noOfTicks: { table: { defaultValue: { summary: '5' } } },
    // Graph parameters
    showValues: { table: { defaultValue: { summary: 'true' } } },
    showTicks: { table: { defaultValue: { summary: 'true' } } },
    showColorScale: { table: { defaultValue: { summary: 'false' } } },
    graphDownload: { table: { defaultValue: { summary: 'false' } } },
    dataDownload: { table: { defaultValue: { summary: 'false' } } },
    resetSelectionOnDoubleClick: { table: { defaultValue: { summary: 'true' } } },

    // Interactions and Callbacks
    onSeriesMouseOver: { action: 'seriesMouseOver' },
    onSeriesMouseClick: { action: 'seriesMouseClick' },

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

    dateFormat: { table: { defaultValue: { summary: 'yyyy' } } },
    theme: {
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
        label: 'Category 5', leftBar: 7, rightBar: 9, date: '2010', 
      },
      {
        label: 'Category 5', leftBar: 10, rightBar: 12, date: '2012', 
      },
      {
        label: 'Category 5', leftBar: 6, rightBar: 11, date: '2014', 
      },
      {
        label: 'Category 5', leftBar: 10, rightBar: 14, date: '2016', 
      },

      {
        label: 'Category 4', leftBar: 6, rightBar: 8, date: '2010', 
      },
      {
        label: 'Category 4', leftBar: 9, rightBar: 11, date: '2012', 
      },
      {
        label: 'Category 4', leftBar: 12, rightBar: 10, date: '2014', 
      },
      {
        label: 'Category 4', leftBar: 6, rightBar: 13, date: '2016', 
      },

      {
        label: 'Category 3', leftBar: 5, rightBar: 7, date: '2010', 
      },
      {
        label: 'Category 3', leftBar: 8, rightBar: 10, date: '2012', 
      },
      {
        label: 'Category 3', leftBar: 11, rightBar: 9, date: '2014', 
      },
      {
        label: 'Category 3', leftBar: 14, rightBar: 12, date: '2016', 
      },

      {
        label: 'Category 2', leftBar: 4, rightBar: 6, date: '2010', 
      },
      {
        label: 'Category 2', leftBar: 7, rightBar: 9, date: '2012', 
      },
      {
        label: 'Category 2', leftBar: 10, rightBar: 8, date: '2014', 
      },
      {
        label: 'Category 2', leftBar: 13, rightBar: 11, date: '2016', 
      },

      {
        label: 'Category 1', leftBar: 3, rightBar: 5, date: '2010', 
      },
      {
        label: 'Category 1', leftBar: 6, rightBar: 8, date: '2012', 
      },
      {
        label: 'Category 1', leftBar: 9, rightBar: 7, date: '2014', 
      },
      {
        label: 'Category 1', leftBar: 12, rightBar: 10, date: '2016', 
      },
    ],
  },
  render: ({ backgroundColor, ...args }) => {
    return (
      <AnimatedButterflyChart
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

type Story = StoryObj<typeof AnimatedButterflyChart>;

export const Default: Story = {};
