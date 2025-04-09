/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GeoHubCompareMaps } from '@/index';
import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof GeoHubCompareMaps>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/GeoHub maps with comparison',
  component: GeoHubCompareMaps,
  tags: ['autodocs'],
  argTypes: {
    // Titles and Labels and Sources
    sources: {
      table: {
        type: {
          detail: SOURCE_OBJECT,
        },
      },
    },

    // Colors and Styling
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
    mapStyles: {
      control: 'text',
      table: {
        type: {
          summary: '[string, string]',
        },
      },
    },

    // Values and Ticks
    center: {
      control: 'text',
      table: {
        type: {
          summary: '[number, number]',
        },
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
    mapStyles: [
      'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
      'https://api.maptiler.com/maps/streets/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
    ],
  },
  render: ({ center, backgroundColor, mapStyles, ...args }) => {
    return (
      <GeoHubCompareMaps
        mapStyles={parseValue(mapStyles, [
          'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
          'https://api.maptiler.com/maps/streets/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
        ])}
        center={parseValue(center)}
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

type Story = StoryObj<typeof GeoHubCompareMaps>;

export const Default: Story = {};
