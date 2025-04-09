/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedChoroplethMap } from '@/index';
import { parseValue } from '../../assets/parseValue';
import {
  CLASS_NAME_OBJECT,
  LANGUAGE_OPTIONS,
  SOURCE_OBJECT,
  STYLE_OBJECT,
} from '../../assets/constants';

type PagePropsAndCustomArgs = React.ComponentProps<
  typeof AnimatedChoroplethMap
>;

const meta: Meta<PagePropsAndCustomArgs> = {
  title: 'Animated Maps/Choropleth map',
  component: AnimatedChoroplethMap,
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      table: {
        type: {
          detail: `{
  x?: number | string | null;
  id: string;
  date: string | number;
}`,
        },
      },
    },

    dateFormat: {
      table: {
        defaultValue: { summary: 'yyyy' },
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
          summary: 'string[]',
        },
      },
    },
    colorDomain: {
      control: 'text',
      table: {
        type: {
          summary: 'number[] | string[]',
          detail:
            'If type is string[] then map uses a categorical scale else it uses threshold scale',
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
    highlightedIds: {
      control: 'text',
      table: { type: { summary: 'string[]' } },
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
      { id: 'IND', x: 1, date: '2020' },
      { id: 'FIN', x: 2, date: '2020' },
      { id: 'IDN', x: 3, date: '2020' },

      { id: 'ZAF', x: 4, date: '2021' },
      { id: 'PER', x: 5, date: '2021' },
      { id: 'PAK', x: 6, date: '2021' },

      { id: 'USA', x: 7, date: '2022' },
      { id: 'SWE', x: 8, date: '2022' },
      { id: 'BRA', x: 9, date: '2022' },
    ],
    colorDomain: [2, 4, 6, 8],
  },
  render: ({
    colors,
    backgroundColor,
    colorDomain,
    highlightedIds,
    centerPoint,
    zoomScaleExtend,
    zoomTranslateExtend,
    ...args
  }) => {
    return (
      <AnimatedChoroplethMap
        colors={parseValue(colors)}
        highlightedIds={parseValue(highlightedIds)}
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

type Story = StoryObj<typeof AnimatedChoroplethMap>;

export const Default: Story = {};
