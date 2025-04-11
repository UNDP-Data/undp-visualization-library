/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DotDensityMap } from '@/index';
import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<typeof DotDensityMap>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Maps/Dot density map',
  component: DotDensityMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  lat: number;
  long: number;
  radius?: number;
  color?: string | number;
  label?: string | number;
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
    mapNoDataColor: {
      control: 'color',
    },
    mapBorderColor: {
      control: 'color',
    },

    // Colors and Styling
    colors: {
      control: 'text',
      table: {
        type: {
          summary: 'string | string[]',
          detail:
            'Requires a array if color key is present in the data else requires a string',
        },
      },
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
    zoomTranslateExtend: {
      control: 'text',
      table: {
        type: {
          summary: '[[number, number], [number, number]]',
        },
      },
    },
    zoomScaleExtend: {
      control: 'text',
      table: {
        type: {
          summary: '[number, number]',
        },
      },
    },

    // Graph parameters
    showColorScale: {
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
      { lat: 20, long: 10 },
      { lat: 25, long: 26 },
      { lat: 0, long: 0 },
      { lat: 15, long: 5 },
      { lat: 10, long: 20 },
    ],
  },
  render: ({
    colors,
    backgroundColor,
    colorDomain,
    highlightedDataPoints,
    centerPoint,
    zoomScaleExtend,
    zoomTranslateExtend,
    ...args
  }) => {
    return (
      <DotDensityMap
        colors={parseValue(colors, colors)}
        highlightedDataPoints={parseValue(highlightedDataPoints)}
        centerPoint={parseValue(centerPoint)}
        zoomTranslateExtend={parseValue(zoomTranslateExtend)}
        zoomScaleExtend={parseValue(zoomScaleExtend)}
        colorDomain={parseValue(colorDomain, [2, 4, 6, 8])}
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

type Story = StoryObj<typeof DotDensityMap>;

export const Default: Story = {};
