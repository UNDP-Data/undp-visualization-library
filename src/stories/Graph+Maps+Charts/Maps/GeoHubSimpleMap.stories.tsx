/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GeoHubMap } from '@/index';
import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof GeoHubMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/GeoHub map',
  component: GeoHubMap,
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
    mapStyle: {
      control: 'text',
      table: {
        type: {
          summary: 'string | { style: string; name: string }[]',
          detail:
            'If the type is string, otherwise it creates and dropdown and provide end user to select the map style they would like to',
        },
      },
    },
    minHeight: {
      table: { defaultValue: { summary: '0' } },
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

    // Graph parameters
    includeLayers: {
      control: 'text',
    },
    excludeLayers: {
      control: 'text',
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
    theme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: 'light' },
      },
    },
    uiMode: {
      control: 'inline-radio',
      options: ['light', 'normal'],
      table: {
        type: { summary: "'light' | 'normal'" },
        defaultValue: { summary: 'light' },
      },
    },
  },
  args: {
    mapStyle:
      'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042',
  },
  render: ({
    center,
    backgroundColor,
    mapStyle,
    includeLayers,
    excludeLayers,
    ...args
  }) => {
    return (
      <GeoHubMap
        mapStyle={
          !mapStyle
            ? 'https://api.maptiler.com/maps/hybrid/style.json?key=YbCPLULzWdf1NplssEIc#0.8/-14.45028/20.54042'
            : parseValue(mapStyle, mapStyle)
        }
        center={parseValue(center)}
        includeLayers={parseValue(includeLayers)}
        excludeLayers={parseValue(excludeLayers)}
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

type Story = StoryObj<typeof GeoHubMap>;

export const Default: Story = {};
