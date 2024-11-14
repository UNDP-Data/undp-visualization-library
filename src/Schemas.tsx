import { GraphType } from './Types';
import { GraphList } from './Utils/getGraphList';

export const treeMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: {
        oneOf: [{ type: 'null' }, { type: 'number' }],
      },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const circlePackingDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: {
        oneOf: [{ type: 'null' }, { type: 'number' }],
      },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const sankeyChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      source: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      target: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      value: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['source', 'target', 'value'],
  },
};

export const butterflyChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      leftBar: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      rightBar: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const animatedButterflyChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      leftBar: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      rightBar: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['label', 'date'],
  },
};

export const barGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: { type: ['number', 'null'] },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const groupedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: {
        type: 'array',
        items: { type: ['number', 'null'] },
      },
      data: { type: 'object' },
    },
    required: ['label', 'size'],
  },
};

export const stackedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: {
        type: 'array',
        items: { type: ['number', 'null'] },
      },
      data: { type: 'object' },
    },
    required: ['label', 'size'],
  },
};

export const animatedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: { type: ['number', 'null'] },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label', 'date'],
  },
};

export const animatedGroupedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: {
        type: 'array',
        items: { type: ['number', 'null'] },
      },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['label', 'size', 'date'],
  },
};

export const animatedStackedBarGraphDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      size: {
        type: 'array',
        items: { type: ['number', 'null'] },
      },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['label', 'size', 'date'],
  },
};

export const dumbbellChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: {
        type: 'array',
        items: { type: 'number' },
      },
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['x', 'label'],
  },
};

export const unitChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      value: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['value', 'label'],
  },
};

export const animatedDumbbellChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: {
        type: 'array',
        items: [{ type: 'null' }, { type: 'number' }],
      },
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['x', 'label', 'date'],
  },
};

export const donutChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      size: { type: 'number' },
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['size', 'label'],
  },
};

export const histogramDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['value'],
  },
};

export const choroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      countryCode: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['countryCode'],
  },
};

export const biVariateChoroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { type: ['number', 'null'] },
      y: { type: ['number', 'null'] },
      countryCode: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['countryCode'],
  },
};

export const animatedChoroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      countryCode: { type: 'string' },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['countryCode', 'date'],
  },
};

export const animatedBiVariateChoroplethMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { type: ['number', 'null'] },
      y: { type: ['number', 'null'] },
      countryCode: { type: 'string' },
      data: { type: 'object' },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    required: ['countryCode', 'date'],
  },
};

export const lineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      y: { type: 'number' },
      data: { type: 'object' },
    },
    required: ['date', 'y'],
  },
};

export const multiLineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      y: {
        type: 'array',
        items: { type: ['number', 'null'] },
      },
      data: { type: 'object' },
    },
    required: ['date', 'y'],
  },
};

export const areaChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      y: {
        type: 'array',
        items: { type: 'number' },
      },
      data: { type: 'object' },
    },
    required: ['date', 'y'],
  },
};

export const scatterPlotDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { type: ['number', 'null'] },
      y: { type: ['number', 'null'] },
      radius: { type: 'number' },
      color: { type: 'string' },
      label: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      data: { type: 'object' },
    },
  },
};

export const animatedScatterPlotDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      x: { type: ['number', 'null'] },
      y: { type: ['number', 'null'] },
      radius: { type: 'number' },
      color: { type: 'string' },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      label: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      data: { type: 'object' },
    },
    required: ['label', 'date'],
  },
};

export const dualAxisLineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      y1: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      y2: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      data: { type: 'object' },
    },
    required: ['date'],
  },
};

export const differenceLineChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      y1: {
        oneOf: [{ type: 'number' }],
      },
      y2: {
        oneOf: [{ type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['date', 'y1', 'y2'],
  },
};

export const paretoChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'number' }, { type: 'string' }],
      },
      bar: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      line: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      data: { type: 'object' },
    },
    required: ['label'],
  },
};

export const dotDensityMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      lat: { type: 'number' },
      long: { type: 'number' },
      radius: { type: 'number' },
      color: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['lat', 'long'],
  },
};

export const animatedDotDensityMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      lat: { type: 'number' },
      long: { type: 'number' },
      radius: { type: 'number' },
      color: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      date: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['lat', 'long', 'date'],
  },
};

export const slopeChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      y1: { type: 'number' },
      y2: { type: 'number' },
      color: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['y1', 'y2', 'label'],
  },
};

export const heatMapDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      row: { type: 'string' },
      column: { type: 'string' },
      value: {
        oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }],
      },
      data: { type: 'object' },
    },
    required: ['row', 'column'],
  },
};

export const beeSwarmChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      position: { type: 'number' },
      radius: { type: 'number' },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label', 'position'],
  },
};

export const stripChartDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      label: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      position: { type: 'number' },
      color: { type: 'string' },
      data: { type: 'object' },
    },
    required: ['label', 'position'],
  },
};

export const statCardDataSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
      data: { type: 'object' },
    },
    required: ['value'],
  },
};

export const sankeyChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showValues: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    highlightedSourceDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    highlightedTargetDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    sortNodes: {
      type: 'string',
      enum: ['asc', 'desc', 'mostReadable', 'none'],
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    ariaLabel: { type: 'string' },
    nodePadding: { type: 'number' },
    nodeWidth: { type: 'number' },
    defaultLinkOpacity: { type: 'number', minimum: 0, maximum: 1 },
    sourceTitle: { type: 'string' },
    targetTitle: { type: 'string' },
    fillContainer: { type: 'boolean' },
    animateLinks: {
      oneOf: [{ type: 'number' }, { type: 'boolean' }],
    },
    sourceColors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    targetColors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    sourceColorDomain: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    targetColorDomain: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
  },
};

export const simpleBarChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    ariaLabel: { type: 'string' },
  },
};

export const groupedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    ariaLabel: { type: 'string' },
  },
  required: ['colorDomain'],
};

export const stackedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    labelOrder: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    sortParameter: {
      oneOf: [{ type: 'string', enum: ['total'] }, { type: 'number' }],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const animatedSimpleBarChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    autoPlay: { type: 'boolean' },
    autoSort: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
  },
};

export const animatedGroupedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    maxBarThickness: { type: 'number' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['colorDomain'],
};

export const animatedStackedBarChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    autoSort: {
      type: 'boolean',
    },
    sortParameter: {
      oneOf: [{ type: 'string', enum: ['total'] }, { type: 'number' }],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const beeSwarmChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    radius: { type: 'number' },
    maxRadiusValue: { type: 'number' },
    maxPositionValue: { type: 'number' },
    minPositionValue: { type: 'number' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const butterflyChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    ariaLabel: { type: 'string' },
    leftBarTitle: { type: 'string' },
    rightBarTitle: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    barColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    barPadding: { type: 'number' },
    truncateBy: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showTicks: { type: 'boolean' },
    showValues: { type: 'boolean' },
    centerGap: { type: 'number' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    showColorScale: { type: 'boolean' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const animatedButterflyChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    leftBarTitle: { type: 'string' },
    rightBarTitle: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    barColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    barPadding: { type: 'number' },
    truncateBy: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showTicks: { type: 'boolean' },
    showValues: { type: 'boolean' },
    centerGap: { type: 'number' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    showColorScale: { type: 'boolean' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const circlePackingSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    showColorScale: { type: 'boolean' },
    showValues: { type: 'boolean' },
    graphID: { type: 'string' },
    showNAColor: { type: 'boolean' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    radius: { type: 'number' },
    maxRadiusValue: { type: 'number' },
  },
};

export const dataTableSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    graphID: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    columnData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          columnTitle: { type: 'string' },
          columnId: { type: 'string' },
          sortable: { type: 'boolean' },
          filterOptions: {
            type: 'array',
            items: { type: 'string' },
          },
          chip: { type: 'boolean' },
          chipColors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: { type: 'string' },
                color: { type: 'string' },
              },
              required: ['value', 'color'],
            },
          },
          separator: { type: 'string' },
          align: {
            type: 'string',
            enum: ['left', 'right', 'center'],
          },
          suffix: { type: 'string' },
          prefix: { type: 'string' },
          columnWidth: { type: 'number' },
        },
        required: ['columnId'],
      },
    },
  },
  required: ['columnData'],
};

export const donutChartSettingsSchema = {
  type: 'object',
  properties: {
    mainText: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            label: { type: 'string' },
            suffix: { type: 'string' },
            prefix: { type: 'string' },
          },
          required: ['label'],
        },
      ],
    },
    ariaLabel: { type: 'string' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    graphTitle: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { type: 'string' },
    subNote: { type: 'string' },
    footNote: { type: 'string' },
    radius: { type: 'number' },
    strokeWidth: { type: 'number' },
    graphLegend: { type: 'boolean' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
  },
};

export const dumbbellChartSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    radius: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    maxPositionValue: { type: 'number' },
    minPositionValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    sortParameter: {
      oneOf: [{ type: 'string', enum: ['diff'] }, { type: 'number' }],
    },
    arrowConnector: { type: 'boolean' },
    connectorStrokeWidth: { type: 'number' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const animatedDumbbellChartSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    radius: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    maxPositionValue: { type: 'number' },
    minPositionValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    sortParameter: {
      oneOf: [{ type: 'string', enum: ['diff'] }, { type: 'number' }],
    },
    arrowConnector: { type: 'boolean' },
    connectorStrokeWidth: { type: 'number' },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
  },
  required: ['colorDomain'],
};

export const heatMapSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    scaleType: { type: 'string', enum: ['linear', 'categorical', 'threshold'] },
    domain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
        },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    showColumnLabels: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    truncateBy: { type: 'number' },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    showValues: { type: 'boolean' },
    showRowLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    noDataColor: { type: 'string' },
    showColorScale: { type: 'boolean' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    fillContainer: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['domain'],
};

export const histogramSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    color: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    barPadding: { type: 'number' },
    showValues: { type: 'boolean' },
    showTicks: { type: 'boolean' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showLabels: { type: 'boolean' },
    maxValue: { type: 'number' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    numberOfBins: { type: 'number' },
    truncateBy: { type: 'number' },
    donutStrokeWidth: { type: 'number' },
    sortData: {
      type: 'string',
      enum: ['asc', 'desc'],
    },
    barGraphLayout: {
      type: 'string',
      enum: ['horizontal', 'vertical'],
    },
    graphType: {
      type: 'string',
      enum: ['circlePacking', 'treeMap', 'barGraph', 'donutChart'],
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    maxBarThickness: { type: 'number' },
  },
  required: ['color', 'graphType'],
};

export const dualAxisLineChartSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    lineTitles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    showColorScale: { type: 'boolean' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    lineColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    sameAxes: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    highlightAreaColor: { type: 'string' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    animateLine: {
      oneOf: [{ type: 'number' }, { type: 'boolean' }],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    colorLegendTitle: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const lineChartSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    graphID: { type: 'string' },
    regressionLine: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    color: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      minItems: 2,
      maxItems: 2,
    },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    highlightAreaColor: { type: 'string' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    animateLine: {
      oneOf: [{ type: 'number' }, { type: 'boolean' }],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
  },
};

export const differenceLineChartSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    lineColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    diffAreaColors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    showValues: { type: 'boolean' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    labels: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showColorLegendAtTop: { type: 'boolean' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    highlightAreaColor: { type: 'string' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    animateLine: {
      oneOf: [{ type: 'number' }, { type: 'boolean' }],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    idSuffix: { type: 'string' },
    colorLegendTitle: { type: 'string' },
  },
  required: ['labels', 'idSuffix'],
};

export const multiLineChartSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    labels: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    showValues: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    showColorLegendAtTop: { type: 'boolean' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    highlightedLines: {
      type: 'array',
      items: { type: 'string' },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    highlightAreaColor: { type: 'string' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    animateLine: {
      oneOf: [{ type: 'number' }, { type: 'boolean' }],
    },
    strokeWidth: { type: 'number' },
    showDots: { type: 'boolean' },
    colorLegendTitle: { type: 'string' },
  },
  required: ['labels'],
};

export const sparkLineSettingsSchema = {
  type: 'object',
  properties: {
    color: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    dateFormat: { type: 'string' },
    areaId: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const choroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    domain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
          minItems: 1,
        },
        {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      ],
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    categorical: { type: 'boolean' },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    padding: { type: 'string' },
    isWorldMap: { type: 'boolean' },
    tooltip: { type: 'string' },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedCountryCodes: {
      type: 'array',
      items: { type: 'string' },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    mapProperty: { type: 'string' },
    showAntarctica: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['domain'],
};

export const biVariateChoroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    xColorLegendTitle: { type: 'string' },
    yColorLegendTitle: { type: 'string' },
    xDomain: {
      type: 'array',
      items: { type: 'number' },
      minItems: 4,
      maxItems: 4,
    },
    yDomain: {
      type: 'array',
      items: { type: 'number' },
      minItems: 4,
      maxItems: 4,
    },
    colors: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string' },
        minItems: 5,
        maxItems: 5,
      },
      minItems: 5,
      maxItems: 5,
    },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    padding: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    isWorldMap: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedCountryCodes: {
      type: 'array',
      items: { type: 'string' },
    },
    mapProperty: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const dotDensityMapSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    radius: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colors: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    padding: { type: 'string' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    isWorldMap: { type: 'boolean' },
    tooltip: { type: 'string' },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const animatedChoroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    domain: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'number' },
          minItems: 1,
        },
        {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      ],
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    categorical: { type: 'boolean' },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    padding: { type: 'string' },
    isWorldMap: { type: 'boolean' },
    tooltip: { type: 'string' },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedCountryCodes: {
      type: 'array',
      items: { type: 'string' },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    mapProperty: { type: 'string' },
    showAntarctica: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['domain'],
};

export const animatedBiVariateChoroplethMapSettingsSchema = {
  type: 'object',
  properties: {
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    xColorLegendTitle: { type: 'string' },
    yColorLegendTitle: { type: 'string' },
    xDomain: {
      type: 'array',
      items: { type: 'number' },
      minItems: 4,
      maxItems: 4,
    },
    yDomain: {
      type: 'array',
      items: { type: 'number' },
      minItems: 4,
      maxItems: 4,
    },
    colors: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string' },
        minItems: 5,
        maxItems: 5,
      },
      minItems: 5,
      maxItems: 5,
    },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    padding: { type: 'string' },
    mapBorderColor: { type: 'string' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    isWorldMap: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedCountryCodes: {
      type: 'array',
      items: { type: 'string' },
    },
    mapProperty: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const animatedDotDensityMapSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    radius: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colors: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    scale: { type: 'number' },
    centerPoint: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    mapBorderWidth: { type: 'number' },
    mapNoDataColor: { type: 'string' },
    mapBorderColor: { type: 'string' },
    padding: { type: 'string' },
    showLabels: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    isWorldMap: { type: 'boolean' },
    tooltip: { type: 'string' },
    showColorScale: { type: 'boolean' },
    zoomScaleExtend: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomTranslateExtend: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
        minItems: 2,
        maxItems: 2,
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    showAntarctica: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
  },
};

export const geoHubCompareMapSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    graphID: { type: 'string' },
    mapStyles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomLevel: { type: 'number' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['mapStyles'],
};

export const geoHubMapSettingsSchema = {
  type: 'object',
  properties: {
    mapStyle: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              style: { type: 'string' },
            },
            required: ['name', 'style'],
          },
          minItems: 1,
        },
      ],
    },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    ariaLabel: { type: 'string' },
    zoomLevel: { type: 'number' },
    graphTitle: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    graphID: { type: 'string' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    includeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
    excludeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['mapStyle'],
};

export const geoHubMapWithLayerSelectionSettingsSchema = {
  type: 'object',
  properties: {
    mapStyle: { type: 'string' },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomLevel: { type: 'number' },
    graphTitle: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    graphID: { type: 'string' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    layerSelection: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            layerID: { type: 'array', items: { type: 'string' }, minItems: 1 },
          },
          required: ['name', 'layerID'],
        },
        minItems: 1,
      },
    },
    excludeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['mapStyle', 'layerSelection'],
};

export const paretoChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    barTitle: { type: 'string' },
    lineTitle: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    barColor: { type: 'string' },
    lineColor: { type: 'string' },
    sameAxes: { type: 'boolean' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    barPadding: { type: 'number' },
    truncateBy: { type: 'number' },
    showLabels: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const scatterPlotSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    regressionLine: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showLabels: { type: 'boolean' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    xAxisTitle: { type: 'string' },
    yAxisTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    refXValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    refYValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      minItems: 4,
      maxItems: 4,
    },
    highlightAreaColor: { type: 'string' },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxRadiusValue: { type: 'number' },
    maxXValue: { type: 'number' },
    minXValue: { type: 'number' },
    maxYValue: { type: 'number' },
    minYValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              type: 'number',
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
  },
};

export const animatedScatterPlotSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showLabels: { type: 'boolean' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    xAxisTitle: { type: 'string' },
    yAxisTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    refXValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    refYValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'null' }],
      },
      minItems: 4,
      maxItems: 4,
    },
    highlightAreaColor: { type: 'string' },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxRadiusValue: { type: 'number' },
    maxXValue: { type: 'number' },
    minXValue: { type: 'number' },
    maxYValue: { type: 'number' },
    minYValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    autoPlay: { type: 'boolean' },
    showOnlyActiveDate: { type: 'boolean' },
    dateFormat: { type: 'string' },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              type: 'number',
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
  },
};

export const slopeChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    showLabels: { type: 'boolean' },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    axisTitle: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    fillContainer: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const stackedAreaChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      type: 'array',
      items: { type: 'string' },
      minItems: 0,
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    noOfXTicks: { type: 'number' },
    dateFormat: { type: 'string' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    colorLegendTitle: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    bottomMargin: { type: 'number' },
    tooltip: { type: 'string' },
    refValues: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    highlightAreaSettings: {
      type: 'array',
      items: {
        oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
      },
      minItems: 2,
      maxItems: 2,
    },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    highlightAreaColor: { type: 'string' },
    showColorScale: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
  required: ['colorDomain'],
};

export const statCardSettingsSchema = {
  type: 'object',
  properties: {
    year: {
      oneOf: [{ type: 'number' }, { type: 'string' }],
    },
    ariaLabel: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    footNote: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    graphID: { type: 'string' },
    aggregationMethod: {
      type: 'string',
      enum: ['count', 'max', 'min', 'average', 'sum'],
    },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    countOnly: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
  },
  required: ['graphTitle'],
};

export const stripChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    stripType: {
      type: 'string',
      enum: ['strip', 'dot'],
    },
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    radius: { type: 'number' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    tooltip: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    showColorScale: { type: 'boolean' },
    graphID: { type: 'string' },
    maxValue: { type: 'number' },
    minValue: { type: 'number' },
    showAxis: { type: 'boolean' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    prefix: { type: 'string' },
    suffix: { type: 'string' },
    rtl: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    highlightColor: { type: 'string' },
    dotOpacity: { type: 'number' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const treeMapSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' },
        },
      ],
    },
    graphTitle: { type: 'string' },
    ariaLabel: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    leftMargin: { type: 'number' },
    rightMargin: { type: 'number' },
    colorDomain: {
      type: 'array',
      items: { type: 'string' },
    },
    colorLegendTitle: { type: 'string' },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    topMargin: { type: 'number' },
    bottomMargin: { type: 'number' },
    showLabels: { type: 'boolean' },
    tooltip: { type: 'string' },
    showColorScale: { type: 'boolean' },
    showValues: { type: 'boolean' },
    graphID: { type: 'string' },
    highlightedDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    showNAColor: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
  },
};

export const unitChartSettingsSchema = {
  type: 'object',
  properties: {
    totalNoOfDots: { type: 'number' },
    ariaLabel: { type: 'string' },
    gridSize: { type: 'number' },
    unitPadding: { type: 'number' },
    size: { type: 'number' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    backgroundColor: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    padding: { type: 'string' },
    graphID: { type: 'string' },
    graphDownload: { type: 'boolean' },
    dataDownload: { type: 'boolean' },
    rtl: { type: 'boolean' },
    language: {
      type: 'string',
      enum: ['ar', 'he', 'en'],
    },
    graphLegend: { type: 'boolean' },
    showStrokeForWhiteDots: { type: 'boolean' },
    note: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    width: { type: 'number' },
    height: { type: 'number' },
    relativeHeight: { type: 'number' },
    minHeight: { type: 'number' },
  },
};

export const SettingsSchema = {
  properties: {
    mode: {
      type: 'string',
      enum: ['light', 'dark'],
    },
    regressionLine: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    ariaLabel: { type: 'string' },
    includeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
    excludeLayers: {
      type: 'array',
      items: { type: 'string' },
    },
    layerSelection: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            layerID: { type: 'array', items: { type: 'string' }, minItems: 1 },
          },
          required: ['name', 'layerID'],
        },
        minItems: 1,
      },
    },
    maxBarThickness: { type: 'number' },
    minBarThickness: { type: 'number' },
    maxNumberOfBars: { type: 'number' },
    aggregationMethod: {
      enum: ['average', 'count', 'max', 'min', 'sum'],
      type: 'string',
    },
    animateLine: {
      type: ['number', 'boolean'],
    },
    annotations: {
      type: 'array',
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          xCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          yCoordinate: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
          xOffset: {
            type: 'number',
          },
          yOffset: {
            type: 'number',
          },
          align: {
            type: 'string',
            enum: ['center', 'left', 'right'],
          },
          fontWeight: {
            type: 'string',
            enum: ['regular', 'bold', 'medium'],
          },
          showConnector: {
            oneOf: [{ type: 'boolean' }, { type: 'number' }],
          },
          connectorRadius: {
            type: 'number',
          },
          maxWidth: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['text'],
      },
    },
    areaId: {
      type: 'string',
    },
    arrowConnector: {
      type: 'boolean',
    },
    autoPlay: {
      type: 'boolean',
    },
    autoSort: {
      type: 'boolean',
    },
    axisTitle: {
      items: {
        type: 'string',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    backgroundColor: {
      type: ['string', 'boolean'],
    },
    barColor: {
      type: 'string',
    },
    barColors: {
      items: {
        type: 'string',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    barGraphLayout: {
      enum: ['horizontal', 'vertical'],
      type: 'string',
    },
    barPadding: {
      type: 'number',
    },
    barTitle: {
      type: 'string',
    },
    bottomMargin: {
      type: 'number',
    },
    categorical: {
      type: 'boolean',
    },
    center: {
      items: {
        type: 'number',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    centerGap: {
      type: 'number',
    },
    centerPoint: {
      items: {
        type: 'number',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    color: {
      anyOf: [
        {
          items: {
            type: 'string',
          },
          type: 'array',
        },
        {
          type: 'string',
        },
      ],
    },
    colorDomain: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    colorLegendTitle: {
      type: 'string',
    },
    colors: {
      anyOf: [
        {
          items: {
            type: 'string',
          },
          type: 'array',
        },
        {
          items: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          type: 'array',
        },
        {
          type: 'string',
        },
      ],
    },
    columnData: {
      items: {
        properties: {
          align: {
            enum: ['center', 'left', 'right'],
            type: 'string',
          },
          chip: {
            type: 'boolean',
          },
          chipColors: {
            items: {
              properties: {
                color: {
                  type: 'string',
                },
                value: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          columnId: {
            type: 'string',
          },
          columnTitle: {
            type: 'string',
          },
          columnWidth: {
            type: 'number',
          },
          filterOptions: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          prefix: {
            type: 'string',
          },
          separator: {
            type: 'string',
          },
          sortable: {
            type: 'boolean',
          },
          suffix: {
            type: 'string',
          },
        },
        type: 'object',
        required: ['columnId'],
      },
      type: 'array',
    },
    connectorStrokeWidth: {
      type: 'number',
    },
    countOnly: {
      items: {
        type: ['string', 'number'],
      },
      type: 'array',
    },
    dataDownload: {
      type: 'boolean',
    },
    dateFormat: {
      type: 'string',
    },
    domain: {
      anyOf: [
        {
          items: {
            type: 'string',
          },
          type: 'array',
        },
        {
          items: {
            type: 'number',
          },
          type: 'array',
        },
      ],
    },
    donutColorDomain: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    donutStrokeWidth: {
      type: 'number',
    },
    dotOpacity: {
      type: 'number',
    },
    fillContainer: {
      type: 'boolean',
    },
    footNote: {
      type: 'string',
    },
    graphDescription: {
      type: 'string',
    },
    graphDownload: {
      type: 'boolean',
    },
    graphID: {
      type: 'string',
    },
    graphLegend: {
      type: 'boolean',
    },
    graphTitle: {
      type: 'string',
    },
    graphType: {
      enum: ['barGraph', 'circlePacking', 'donutChart', 'treeMap'],
      type: 'string',
    },
    gridSize: {
      type: 'number',
    },
    height: {
      type: 'number',
    },
    highlightAreaColor: {
      type: 'string',
    },
    highlightAreaSettings: {
      anyOf: [
        {
          items: {
            oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }],
          },
          maxItems: 2,
          minItems: 2,
          type: 'array',
        },
        {
          items: {
            oneOf: [{ type: 'number' }, { type: 'null' }],
          },
          maxItems: 4,
          minItems: 4,
          type: 'array',
        },
      ],
    },
    highlightColor: {
      type: 'string',
    },
    highlightedCountryCodes: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    highlightedDataPoints: {
      items: {
        type: ['string', 'number'],
      },
      type: 'array',
    },
    highlightedLines: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    isWorldMap: {
      type: 'boolean',
    },
    labelOrder: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    labels: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    language: {
      enum: ['ar', 'en', 'he'],
      type: 'string',
    },
    leftBarTitle: {
      type: 'string',
    },
    leftMargin: {
      type: 'number',
    },
    lineColor: {
      type: 'string',
    },
    lineColors: {
      items: {
        type: 'string',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    lineTitle: {
      type: 'string',
    },
    lineTitles: {
      items: {
        type: 'string',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    mainText: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            label: { type: 'string' },
            suffix: { type: 'string' },
            prefix: { type: 'string' },
          },
          required: ['label'],
        },
      ],
    },
    mapBorderColor: {
      type: 'string',
    },
    mapBorderWidth: {
      type: 'number',
    },
    mapData: {},
    mapNoDataColor: {
      type: 'string',
    },
    mapProperty: {
      type: 'string',
    },
    mapStyle: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              style: { type: 'string' },
            },
            required: ['name', 'style'],
          },
          minItems: 1,
        },
      ],
    },
    mapStyles: {
      items: {
        type: 'string',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    maxPositionValue: {
      type: 'number',
    },
    maxRadiusValue: {
      type: 'number',
    },
    maxValue: {
      type: 'number',
    },
    maxXValue: {
      type: 'number',
    },
    maxYValue: {
      type: 'number',
    },
    minHeight: {
      type: 'number',
    },
    minPositionValue: {
      type: 'number',
    },
    minValue: {
      type: 'number',
    },
    minXValue: {
      type: 'number',
    },
    minYValue: {
      type: 'number',
    },
    noDataColor: {
      type: 'string',
    },
    noOfXTicks: {
      type: 'number',
    },
    note: {
      type: 'string',
    },
    numberOfBins: {
      type: 'number',
    },
    padding: {
      type: 'string',
    },
    prefix: {
      type: 'string',
    },
    radius: {
      type: 'number',
    },
    refValues: {
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
      type: 'array',
    },
    refXValues: {
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
      type: 'array',
    },
    refYValues: {
      items: {
        properties: {
          color: {
            type: 'string',
          },
          text: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        },
        type: 'object',
        required: ['value', 'text'],
      },
      type: 'array',
    },
    customHighlightAreaSettings: {
      type: 'array',
      items: {
        properties: {
          coordinates: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }],
            },
            minItems: 4,
          },
          color: {
            type: 'string',
          },
          strokeWidth: {
            type: 'number',
          },
          dashedStroke: {
            type: 'boolean',
          },
        },
        type: 'object',
        required: ['coordinates'],
      },
    },
    relativeHeight: {
      type: 'number',
    },
    rightBarTitle: {
      type: 'string',
    },
    rightMargin: {
      type: 'number',
    },
    rtl: {
      type: 'boolean',
    },
    sameAxes: {
      type: 'boolean',
    },
    scale: {
      type: 'number',
    },
    scaleType: {
      enum: ['categorical', 'linear', 'threshold'],
      type: 'string',
    },
    showAntarctica: {
      type: 'boolean',
    },
    showAxis: {
      type: 'boolean',
    },
    showColorLegendAtTop: {
      type: 'boolean',
    },
    showColorScale: {
      type: 'boolean',
    },
    showColumnLabels: {
      type: 'boolean',
    },
    showLabels: {
      type: 'boolean',
    },
    showNAColor: {
      type: 'boolean',
    },
    showOnlyActiveDate: {
      type: 'boolean',
    },
    showRowLabels: {
      type: 'boolean',
    },
    showStrokeForWhiteDots: {
      type: 'boolean',
    },
    showTicks: {
      type: 'boolean',
    },
    showValues: {
      type: 'boolean',
    },
    size: {
      type: 'number',
    },
    sortData: {
      enum: ['asc', 'desc'],
      type: 'string',
    },
    sortParameter: {
      anyOf: [
        {
          type: 'string',
          enum: ['diff', 'total'],
        },
        {
          type: 'number',
        },
      ],
    },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          link: { type: 'string' },
        },
        required: ['source'],
      },
    },
    stripType: {
      enum: ['dot', 'strip'],
      type: 'string',
    },
    strokeWidth: {
      type: 'number',
    },
    subNote: {
      type: 'string',
    },
    suffix: {
      type: 'string',
    },
    tooltip: {
      type: 'string',
    },
    topMargin: {
      type: 'number',
    },
    totalNoOfDots: {
      type: 'number',
    },
    truncateBy: {
      type: 'number',
    },
    unitPadding: {
      type: 'number',
    },
    value: {
      type: 'number',
    },
    width: {
      type: 'number',
    },
    xAxisTitle: {
      type: 'string',
    },
    xColorLegendTitle: {
      type: 'string',
    },
    xDomain: {
      items: {
        type: 'number',
      },
      maxItems: 4,
      minItems: 4,
      type: 'array',
    },
    yAxisTitle: {
      type: 'string',
    },
    yColorLegendTitle: {
      type: 'string',
    },
    yDomain: {
      items: {
        type: 'number',
      },
      maxItems: 4,
      minItems: 4,
      type: 'array',
    },
    year: {
      type: ['string', 'number'],
    },
    zoomLevel: {
      type: 'number',
    },
    zoomScaleExtend: {
      items: {
        type: 'number',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    zoomTranslateExtend: {
      items: {
        items: {
          type: 'number',
        },
        maxItems: 2,
        minItems: 2,
        type: 'array',
      },
      maxItems: 2,
      minItems: 2,
      type: 'array',
    },
    sortNodes: {
      type: 'string',
      enum: ['asc', 'desc', 'mostReadable', 'none'],
    },
    nodePadding: { type: 'number' },
    nodeWidth: { type: 'number' },
    defaultLinkOpacity: { type: 'number', minimum: 0, maximum: 1 },
    animateLinks: {
      oneOf: [{ type: 'number' }, { type: 'boolean' }],
    },
    sourceColors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    targetColors: {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
    sourceColorDomain: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    targetColorDomain: {
      type: 'array',
      items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    },
    sourceTitle: { type: 'string' },
    targetTitle: { type: 'string' },
    highlightedSourceDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
    highlightedTargetDataPoints: {
      type: 'array',
      items: {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      },
    },
  },
  type: 'object',
};

export function getDataSchema(graph: GraphType) {
  if (
    graph === 'geoHubCompareMap' ||
    graph === 'geoHubMap' ||
    graph === 'geoHubMapWithLayerSelection'
  )
    return null;

  switch (graph) {
    case 'dataTable':
      return {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
        },
      };
    case 'horizontalBarChart':
      return barGraphDataSchema;
    case 'horizontalStackedBarChart':
      return stackedBarGraphDataSchema;
    case 'horizontalGroupedBarChart':
      return groupedBarGraphDataSchema;
    case 'verticalBarChart':
      return barGraphDataSchema;
    case 'verticalStackedBarChart':
      return stackedBarGraphDataSchema;
    case 'verticalGroupedBarChart':
      return groupedBarGraphDataSchema;
    case 'animatedHorizontalBarChart':
      return animatedBarGraphDataSchema;
    case 'animatedHorizontalStackedBarChart':
      return animatedStackedBarGraphDataSchema;
    case 'animatedHorizontalGroupedBarChart':
      return animatedGroupedBarGraphDataSchema;
    case 'animatedVerticalBarChart':
      return animatedBarGraphDataSchema;
    case 'animatedVerticalStackedBarChart':
      return animatedStackedBarGraphDataSchema;
    case 'animatedVerticalGroupedBarChart':
      return animatedGroupedBarGraphDataSchema;
    case 'lineChart':
      return lineChartDataSchema;
    case 'dualAxisLineChart':
      return dualAxisLineChartDataSchema;
    case 'differenceLineChart':
      return differenceLineChartDataSchema;
    case 'multiLineChart':
      return multiLineChartDataSchema;
    case 'stackedAreaChart':
      return areaChartDataSchema;
    case 'choroplethMap':
      return choroplethMapDataSchema;
    case 'biVariateChoroplethMap':
      return biVariateChoroplethMapDataSchema;
    case 'dotDensityMap':
      return dotDensityMapDataSchema;
    case 'animatedChoroplethMap':
      return animatedChoroplethMapDataSchema;
    case 'animatedBiVariateChoroplethMap':
      return animatedBiVariateChoroplethMapDataSchema;
    case 'animatedDotDensityMap':
      return animatedDotDensityMapDataSchema;
    case 'donutChart':
      return donutChartDataSchema;
    case 'slopeChart':
      return slopeChartDataSchema;
    case 'scatterPlot':
      return scatterPlotDataSchema;
    case 'animatedScatterPlot':
      return animatedScatterPlotDataSchema;
    case 'horizontalDumbbellChart':
      return dumbbellChartDataSchema;
    case 'verticalDumbbellChart':
      return dumbbellChartDataSchema;
    case 'animatedHorizontalDumbbellChart':
      return animatedDumbbellChartDataSchema;
    case 'animatedVerticalDumbbellChart':
      return animatedDumbbellChartDataSchema;
    case 'treeMap':
      return treeMapDataSchema;
    case 'circlePacking':
      return circlePackingDataSchema;
    case 'heatMap':
      return heatMapDataSchema;
    case 'horizontalStripChart':
      return stripChartDataSchema;
    case 'verticalStripChart':
      return stripChartDataSchema;
    case 'horizontalBeeSwarmChart':
      return beeSwarmChartDataSchema;
    case 'verticalBeeSwarmChart':
      return beeSwarmChartDataSchema;
    case 'butterflyChart':
      return butterflyChartDataSchema;
    case 'animatedButterflyChart':
      return animatedButterflyChartDataSchema;
    case 'histogram':
      return histogramDataSchema;
    case 'sparkLine':
      return lineChartDataSchema;
    case 'paretoChart':
      return paretoChartDataSchema;
    case 'statCard':
      return statCardDataSchema;
    case 'unitChart':
      return unitChartDataSchema;
    case 'sankeyChart':
      return sankeyChartDataSchema;
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export function getSettingsSchema(graph: GraphType) {
  switch (graph) {
    case 'horizontalBarChart':
      return simpleBarChartSettingsSchema;
    case 'horizontalStackedBarChart':
      return stackedBarChartSettingsSchema;
    case 'horizontalGroupedBarChart':
      return groupedBarChartSettingsSchema;
    case 'verticalBarChart':
      return simpleBarChartSettingsSchema;
    case 'verticalStackedBarChart':
      return stackedBarChartSettingsSchema;
    case 'verticalGroupedBarChart':
      return groupedBarChartSettingsSchema;
    case 'animatedHorizontalBarChart':
      return animatedSimpleBarChartSettingsSchema;
    case 'animatedHorizontalStackedBarChart':
      return animatedStackedBarChartSettingsSchema;
    case 'animatedHorizontalGroupedBarChart':
      return animatedGroupedBarChartSettingsSchema;
    case 'animatedVerticalBarChart':
      return animatedSimpleBarChartSettingsSchema;
    case 'animatedVerticalStackedBarChart':
      return animatedStackedBarChartSettingsSchema;
    case 'animatedVerticalGroupedBarChart':
      return animatedGroupedBarChartSettingsSchema;
    case 'lineChart':
      return lineChartSettingsSchema;
    case 'dualAxisLineChart':
      return dualAxisLineChartSettingsSchema;
    case 'multiLineChart':
      return multiLineChartSettingsSchema;
    case 'differenceLineChart':
      return differenceLineChartSettingsSchema;
    case 'stackedAreaChart':
      return stackedAreaChartSettingsSchema;
    case 'choroplethMap':
      return choroplethMapSettingsSchema;
    case 'biVariateChoroplethMap':
      return biVariateChoroplethMapSettingsSchema;
    case 'dotDensityMap':
      return dotDensityMapSettingsSchema;
    case 'animatedChoroplethMap':
      return animatedChoroplethMapSettingsSchema;
    case 'animatedBiVariateChoroplethMap':
      return animatedBiVariateChoroplethMapSettingsSchema;
    case 'animatedDotDensityMap':
      return animatedDotDensityMapSettingsSchema;
    case 'donutChart':
      return donutChartSettingsSchema;
    case 'slopeChart':
      return slopeChartSettingsSchema;
    case 'scatterPlot':
      return scatterPlotSettingsSchema;
    case 'animatedScatterPlot':
      return animatedScatterPlotSettingsSchema;
    case 'horizontalDumbbellChart':
      return dumbbellChartSettingsSchema;
    case 'verticalDumbbellChart':
      return dumbbellChartSettingsSchema;
    case 'animatedHorizontalDumbbellChart':
      return animatedDumbbellChartSettingsSchema;
    case 'animatedVerticalDumbbellChart':
      return animatedDumbbellChartSettingsSchema;
    case 'treeMap':
      return treeMapSettingsSchema;
    case 'circlePacking':
      return circlePackingSettingsSchema;
    case 'heatMap':
      return heatMapSettingsSchema;
    case 'horizontalStripChart':
      return stripChartSettingsSchema;
    case 'verticalStripChart':
      return stripChartSettingsSchema;
    case 'horizontalBeeSwarmChart':
      return beeSwarmChartSettingsSchema;
    case 'verticalBeeSwarmChart':
      return beeSwarmChartSettingsSchema;
    case 'butterflyChart':
      return butterflyChartSettingsSchema;
    case 'animatedButterflyChart':
      return animatedButterflyChartSettingsSchema;
    case 'histogram':
      return histogramSettingsSchema;
    case 'sparkLine':
      return sparkLineSettingsSchema;
    case 'paretoChart':
      return paretoChartSettingsSchema;
    case 'dataTable':
      return dataTableSettingsSchema;
    case 'statCard':
      return statCardSettingsSchema;
    case 'geoHubCompareMap':
      return geoHubCompareMapSettingsSchema;
    case 'geoHubMap':
      return geoHubMapSettingsSchema;
    case 'geoHubMapWithLayerSelection':
      return geoHubMapWithLayerSelectionSettingsSchema;
    case 'unitChart':
      return unitChartSettingsSchema;
    case 'sankeyChart':
      return sankeyChartSettingsSchema;
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

function getColumnEnum(columns?: string[]) {
  if (columns) return { enum: columns };
  return {};
}

export const getDataSettingsSchema = (columnList?: string[]) => ({
  properties: {
    columnsToArray: {
      items: {
        properties: {
          column: {
            type: 'string',
            ...getColumnEnum(columnList),
          },
          delimiter: {
            type: 'string',
          },
        },
        type: 'object',
        required: ['column'],
      },
      type: 'array',
    },
    data: {},
    dataURL: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fileType: {
                enum: ['csv', 'json', 'api'],
                type: 'string',
              },
              apiHeaders: {},
              apiRequestBody: {},
              apiMethod: {
                enum: ['POST', 'GET', 'DELETE', 'PUT'],
                type: 'string',
              },
              dataTransformation: {
                type: 'string',
              },
              idColumnName: {
                type: 'string',
              },
              dataURL: { type: 'string' },
              delimiter: {
                type: 'string',
              },
              columnsToArray: {
                items: {
                  properties: {
                    column: {
                      type: 'string',
                    },
                    delimiter: {
                      type: 'string',
                    },
                  },
                  type: 'object',
                  required: ['column'],
                },
                type: 'array',
              },
            },
            required: ['dataURL', 'idColumnName'],
          },
        },
      ],
    },
    delimiter: {
      type: 'string',
    },
    fileType: {
      enum: ['csv', 'json', 'api'],
      type: 'string',
    },
    apiHeaders: {},
    apiRequestBody: {},
    apiMethod: {
      enum: ['POST', 'GET', 'DELETE', 'PUT'],
      type: 'string',
    },
    dataTransformation: {
      type: 'string',
    },
    idColumnTitle: {
      type: 'string',
    },
  },
  type: 'object',
});

export const getReadableHeaderSchema = (columnList?: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'string', ...getColumnEnum(columnList) },
      label: {
        type: 'string',
      },
    },
    required: ['value', 'label'],
  },
});

export const getFiltersSchema = (columnList?: string[]) => ({
  items: {
    properties: {
      clearable: {
        type: 'boolean',
      },
      excludeValues: {
        items: {
          type: 'string',
        },
        type: 'array',
      },
      column: {
        type: 'string',
        ...getColumnEnum(columnList),
      },
      defaultValue: {
        anyOf: [
          {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          {
            type: 'string',
          },
        ],
      },
      label: {
        type: 'string',
      },
      singleSelect: {
        type: 'boolean',
      },
    },
    required: ['column'],
    type: 'object',
  },
  type: 'array',
});

export const getDataSelectionSchema = (columnList?: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      chartConfigId: { type: 'string' },
      label: {
        type: 'string',
      },
      allowedColumnIds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            value: { type: 'string', ...getColumnEnum(columnList) },
            label: {
              type: 'string',
            },
          },
          required: ['value', 'label'],
        },
        minItems: 1,
      },
      ui: { type: 'string', enum: ['select', 'radio'] },
    },
    required: ['chartConfigId', 'allowedColumnIds'],
  },
});

export const getDataFiltersSchema = (columnList?: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      column: { type: 'string', ...getColumnEnum(columnList) },
      includeValues: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'null' },
          ],
        },
      },
      excludeValues: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'null' },
          ],
        },
      },
    },
    required: ['column'],
  },
});

export const getDataTransformSchema = (columnList?: string[]) => ({
  type: 'object',
  properties: {
    keyColumn: { type: 'string', ...getColumnEnum(columnList) },
    aggregationColumnsSetting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string', ...getColumnEnum(columnList) },
          aggregationMethod: {
            type: 'string',
            enum: ['sum', 'average', 'min', 'max'],
          },
        },
        required: ['column'],
      },
    },
  },
  required: ['keyColumn'],
});

export const getGraphDataConfigurationSchema = (columnList?: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      columnId: {
        oneOf: [
          { type: 'string', ...getColumnEnum(columnList) },
          {
            type: 'array',
            items: { type: 'string', ...getColumnEnum(columnList) },
          },
        ],
      },
      chartConfigId: { type: 'string' },
    },
    required: ['columnId', 'chartConfigId'],
  },
});

export const getSingleGraphJSONSchema = (
  columnList?: string[],
  graphType?: GraphType,
) =>
  graphType === 'geoHubMap' ||
  graphType === 'geoHubCompareMap' ||
  graphType === 'geoHubMapWithLayerSelection'
    ? {
        type: 'object',
        properties: {
          graphSettings: SettingsSchema,
          graphType: {
            type: 'string',
            enum: GraphList.filter(el => el.geoHubMapPresentation).map(
              el => el.graphID,
            ),
          },
          debugMode: { type: 'boolean' },
          mode: { type: 'string', enum: ['dark', 'light'] },
        },
        required: ['graphType'],
      }
    : {
        type: 'object',
        properties: {
          graphSettings: graphType
            ? getSettingsSchema(graphType)
            : SettingsSchema,
          dataSettings: getDataSettingsSchema(columnList),
          filters: getFiltersSchema(columnList),
          graphType: {
            type: 'string',
            enum: GraphList.map(el => el.graphID),
          },
          dataTransform: getDataTransformSchema(columnList),
          dataFilters: getDataFiltersSchema(columnList),
          graphDataConfiguration: getGraphDataConfigurationSchema(columnList),
          readableHeader: getReadableHeaderSchema(columnList),
          dataSelectionOptions: getDataSelectionSchema(columnList),
          debugMode: { type: 'boolean' },
          mode: { type: 'string', enum: ['dark', 'light'] },
        },
        required: ['dataSettings', 'graphType'],
      };

export const getGriddedGraphJSONSchema = (
  columnList?: string[],
  graphType?: GraphType,
) => ({
  type: 'object',
  properties: {
    graphSettings: graphType ? getSettingsSchema(graphType) : SettingsSchema,
    dataSettings: getDataSettingsSchema(columnList),
    filters: getFiltersSchema(columnList),
    graphType: {
      type: 'string',
      enum: GraphList.filter(el => el.availableInGriddedGraph !== false).map(
        el => el.graphID,
      ),
    },
    dataTransform: getDataTransformSchema(columnList),
    dataFilters: getDataFiltersSchema(columnList),
    graphDataConfiguration: getGraphDataConfigurationSchema(columnList),
    noOfColumns: { type: 'number' },
    columnGridBy: { type: 'string' },
    relativeHeightForGraph: { type: 'number' },
    showCommonColorScale: { type: 'boolean' },
    minGraphHeight: { type: 'number' },
    minGraphWidth: { type: 'number' },
    readableHeader: getReadableHeaderSchema(columnList),
    dataSelectionOptions: getDataSelectionSchema(columnList),
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  required: ['columnGridBy', 'dataSettings', 'graphType'],
});

export const getDashboardJSONSchema = (columnList?: string[]) => ({
  properties: {
    dashboardId: {
      type: 'string',
    },
    dashboardLayout: {
      properties: {
        backgroundColor: {
          type: ['string', 'boolean'],
        },
        description: {
          type: 'string',
        },
        language: {
          enum: ['ar', 'en', 'he'],
          type: 'string',
        },
        padding: {
          type: 'string',
        },
        rtl: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
        rows: {
          items: {
            properties: {
              columns: {
                items: {
                  properties: {
                    columnWidth: {
                      type: 'number',
                    },
                    dataFilters: getDataFiltersSchema(),
                    dataTransform: getDataTransformSchema(),
                    graphDataConfiguration: getGraphDataConfigurationSchema(),
                    graphType: {
                      enum: GraphList.map(el => el.graphID),
                      type: 'string',
                    },
                    settings: SettingsSchema,
                    dataSelectionOptions: getDataSelectionSchema(),
                  },
                  type: 'object',
                  required: ['graphType'],
                },
                type: 'array',
              },
              height: {
                type: 'number',
              },
            },
            type: 'object',
            required: ['columns'],
          },
          type: 'array',
        },
      },
      type: 'object',
      required: ['rows'],
    },
    dataSettings: getDataSettingsSchema(columnList),
    filters: getFiltersSchema(columnList),
    readableHeader: getReadableHeaderSchema(columnList),
    dataFilters: getDataFiltersSchema(columnList),
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  type: 'object',
  required: ['dashboardLayout', 'dataSettings'],
});

export const getDashboardWideToLongFormatJSONSchema = () => ({
  properties: {
    dashboardId: {
      type: 'string',
    },
    dashboardLayout: {
      properties: {
        backgroundColor: {
          type: ['string', 'boolean'],
        },
        description: {
          type: 'string',
        },
        language: {
          enum: ['ar', 'en', 'he'],
          type: 'string',
        },
        padding: {
          type: 'string',
        },
        rtl: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
        rows: {
          items: {
            properties: {
              columns: {
                items: {
                  properties: {
                    columnWidth: {
                      type: 'number',
                    },
                    dataFilters: getDataFiltersSchema(),
                    graphDataConfiguration: getGraphDataConfigurationSchema(),
                    graphType: {
                      enum: GraphList.filter(
                        el => el.availableInWideToLongFormat,
                      ).map(el => el.graphID),
                      type: 'string',
                    },
                    settings: SettingsSchema,
                  },
                  type: 'object',
                  required: ['graphType'],
                },
                type: 'array',
              },
              height: {
                type: 'number',
              },
            },
            type: 'object',
            required: ['columns'],
          },
          type: 'array',
        },
      },
      type: 'object',
      required: ['rows'],
    },
    dataSettings: {
      properties: {
        ...getDataSettingsSchema(),
        keyColumn: {
          type: 'string',
        },
      },
      required: ['keyColumn'],
      type: 'object',
    },
    dataFilters: getDataFiltersSchema(),
    readableHeader: getReadableHeaderSchema(),
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  type: 'object',
  required: ['dashboardLayout', 'dataSettings'],
});
