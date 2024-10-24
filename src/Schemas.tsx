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
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    leftBarTitle: { type: 'string' },
    rightBarTitle: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphDescription: { type: 'string' },
    leftBarTitle: { type: 'string' },
    rightBarTitle: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
  },
};

export const dataTableSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    source: { type: 'string' },
    graphDescription: { type: 'string' },
    sourceLink: { type: 'string' },
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
    mainText: { type: 'string' },
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
    source: { type: 'string' },
    graphDescription: { type: 'string' },
    sourceLink: { type: 'string' },
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
    fillContainer: { type: 'boolean' },
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
  },
};

export const dumbbellChartSettingsSchema = {
  type: 'object',
  properties: {
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    lineTitles: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 2,
    },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
    graphID: { type: 'string' },
    color: { type: 'string' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
            oneOf: [{ type: 'string' }, { type: 'number' }],
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
      minItems: 4,
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
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
            oneOf: [{ type: 'string' }, { type: 'number' }],
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
      minItems: 4,
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
    colors: {
      type: 'array',
      items: { type: 'string' },
    },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
            oneOf: [{ type: 'string' }, { type: 'number' }],
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
      minItems: 4,
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    radius: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    mapData: { oneOf: [{ type: 'object' }, { type: 'string' }] },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    radius: { type: 'number' },
    source: { type: 'string' },
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
    source: { type: 'string' },
    graphDescription: { type: 'string' },
    sourceLink: { type: 'string' },
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
    mapStyle: { type: 'string' },
    center: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    zoomLevel: { type: 'number' },
    graphTitle: { type: 'string' },
    source: { type: 'string' },
    graphDescription: { type: 'string' },
    sourceLink: { type: 'string' },
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

export const paretoChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    barTitle: { type: 'string' },
    lineTitle: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
            type: 'number',
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
      minItems: 4,
    },
  },
};

export const animatedScatterPlotSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
            type: 'number',
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
      minItems: 4,
    },
  },
};

export const slopeChartSettingsSchema = {
  type: 'object',
  properties: {
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
            oneOf: [{ type: 'string' }, { type: 'number' }],
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
      minItems: 4,
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
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
    sourceLink: { type: 'string' },
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
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    source: { type: 'string' },
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
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    suffix: { type: 'string' },
    prefix: { type: 'string' },
    source: { type: 'string' },
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
    gridSize: { type: 'number' },
    fillContainer: { type: 'boolean' },
    unitPadding: { type: 'number' },
    size: { type: 'number' },
    graphTitle: { type: 'string' },
    graphDescription: { type: 'string' },
    footNote: { type: 'string' },
    sourceLink: { type: 'string' },
    source: { type: 'string' },
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
  },
};

export const SettingsSchema = {
  properties: {
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
      type: 'string',
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
      type: 'string',
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
            oneOf: [{ type: 'string' }, { type: 'number' }],
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
      minItems: 4,
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
    source: {
      type: 'string',
    },
    sourceLink: {
      type: 'string',
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
  },
  type: 'object',
};

export const singleGraphJSONSchema = {
  type: 'object',
  properties: {
    graphSettings: SettingsSchema,
    dataSettings: {
      type: 'object',
      properties: {
        dataURL: { type: 'string' },
        fileType: { type: 'string', enum: ['csv', 'json'] },
        delimiter: { type: 'string' },
        columnsToArray: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column: { type: 'string' },
              delimiter: { type: 'string' },
            },
            required: ['column'],
          },
        },
        data: { type: 'array', items: {} },
      },
    },
    filters: {
      items: {
        properties: {
          clearable: {
            type: 'boolean',
          },
          column: {
            type: 'string',
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
    },
    graphType: {
      type: 'string',
      enum: [
        'horizontalBarChart',
        'horizontalStackedBarChart',
        'horizontalGroupedBarChart',
        'verticalBarChart',
        'verticalStackedBarChart',
        'verticalGroupedBarChart',
        'lineChart',
        'dualAxisLineChart',
        'multiLineChart',
        'stackedAreaChart',
        'choroplethMap',
        'biVariateChoroplethMap',
        'dotDensityMap',
        'donutChart',
        'slopeChart',
        'scatterPlot',
        'horizontalDumbbellChart',
        'verticalDumbbellChart',
        'treeMap',
        'circlePacking',
        'heatMap',
        'horizontalStripChart',
        'verticalStripChart',
        'horizontalBeeSwarmChart',
        'verticalBeeSwarmChart',
        'butterflyChart',
        'histogram',
        'sparkLine',
        'paretoChart',
        'dataTable',
        'statCard',
        'unitChart',
        'animatedScatterPlot',
        'animatedHorizontalBarChart',
        'animatedHorizontalStackedBarChart',
        'animatedHorizontalGroupedBarChart',
        'animatedVerticalBarChart',
        'animatedVerticalStackedBarChart',
        'animatedVerticalGroupedBarChart',
        'animatedChoroplethMap',
        'animatedBiVariateChoroplethMap',
        'animatedDotDensityMap',
        'animatedHorizontalDumbbellChart',
        'animatedVerticalDumbbellChart',
        'animatedButterflyChart',
      ],
    },
    dataTransform: {
      type: 'object',
      properties: {
        keyColumn: { type: 'string' },
        aggregationColumnsSetting: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column: { type: 'string' },
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
    },
    dataFilters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string' },
          includeValues: {
            type: 'array',
            items: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
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
              ],
            },
          },
        },
        required: ['column'],
      },
    },
    graphDataConfiguration: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          columnId: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
          chartConfigId: { type: 'string' },
        },
        required: ['columnId', 'chartConfigId'],
      },
    },
    readableHeader: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          label: {
            type: 'string',
          },
        },
        required: ['value', 'label'],
      },
    },
    dataSelectionOptions: {
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
                value: { type: 'string' },
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
    },
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  required: ['dataSettings', 'graphType'],
};

export const griddedGraphJSONSchema = {
  type: 'object',
  properties: {
    graphSettings: SettingsSchema,
    dataSettings: {
      type: 'object',
      properties: {
        dataURL: { type: 'string' },
        fileType: { type: 'string', enum: ['csv', 'json'] },
        delimiter: { type: 'string' },
        columnsToArray: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column: { type: 'string' },
              delimiter: { type: 'string' },
            },
            required: ['column'],
          },
        },
        data: { type: 'array', items: {} },
      },
    },
    filters: {
      items: {
        properties: {
          clearable: {
            type: 'boolean',
          },
          column: {
            type: 'string',
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
    },
    graphType: {
      type: 'string',
      enum: [
        'horizontalBarChart',
        'horizontalStackedBarChart',
        'horizontalGroupedBarChart',
        'verticalBarChart',
        'verticalStackedBarChart',
        'verticalGroupedBarChart',
        'lineChart',
        'dualAxisLineChart',
        'multiLineChart',
        'stackedAreaChart',
        'choroplethMap',
        'biVariateChoroplethMap',
        'dotDensityMap',
        'donutChart',
        'slopeChart',
        'scatterPlot',
        'horizontalDumbbellChart',
        'verticalDumbbellChart',
        'treeMap',
        'circlePacking',
        'heatMap',
        'horizontalStripChart',
        'verticalStripChart',
        'horizontalBeeSwarmChart',
        'verticalBeeSwarmChart',
        'butterflyChart',
        'histogram',
        'sparkLine',
        'paretoChart',
        'dataTable',
        'statCard',
        'unitChart',
        'animatedScatterPlot',
        'animatedHorizontalBarChart',
        'animatedHorizontalStackedBarChart',
        'animatedHorizontalGroupedBarChart',
        'animatedVerticalBarChart',
        'animatedVerticalStackedBarChart',
        'animatedVerticalGroupedBarChart',
        'animatedChoroplethMap',
        'animatedBiVariateChoroplethMap',
        'animatedDotDensityMap',
        'animatedHorizontalDumbbellChart',
        'animatedVerticalDumbbellChart',
        'animatedButterflyChart',
      ],
    },
    dataTransform: {
      type: 'object',
      properties: {
        keyColumn: { type: 'string' },
        aggregationColumnsSetting: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              column: { type: 'string' },
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
    },
    dataFilters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string' },
          excludeValues: {
            type: 'array',
            items: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
          },
          includeValues: {
            type: 'array',
            items: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
          },
        },
        required: ['column'],
      },
    },
    graphDataConfiguration: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          columnId: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
          chartConfigId: { type: 'string' },
        },
        required: ['columnId', 'chartConfigId'],
      },
    },
    noOfColumns: { type: 'number' },
    columnGridBy: { type: 'string' },
    relativeHeightForGraph: { type: 'number' },
    showCommonColorScale: { type: 'boolean' },
    minGraphHeight: { type: 'number' },
    minGraphWidth: { type: 'number' },
    readableHeader: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          label: {
            type: 'string',
          },
        },
        required: ['value', 'label'],
      },
    },
    dataSelectionOptions: {
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
                value: { type: 'string' },
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
    },
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  required: ['columnGridBy', 'dataSettings', 'graphType'],
};

export const dashboardJSONSchema = {
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
        rows: {
          items: {
            properties: {
              columns: {
                items: {
                  properties: {
                    columnWidth: {
                      type: 'number',
                    },
                    dataFilters: {
                      items: {
                        properties: {
                          column: {
                            type: 'string',
                          },
                          excludeValues: {
                            type: 'array',
                            items: {
                              oneOf: [
                                { type: 'string' },
                                { type: 'number' },
                                { type: 'boolean' },
                              ],
                            },
                          },
                          includeValues: {
                            type: 'array',
                            items: {
                              oneOf: [
                                { type: 'string' },
                                { type: 'number' },
                                { type: 'boolean' },
                              ],
                            },
                          },
                        },
                        type: 'object',
                        required: ['column'],
                      },
                      type: 'array',
                    },
                    dataTransform: {
                      properties: {
                        aggregationColumnsSetting: {
                          items: {
                            properties: {
                              aggregationMethod: {
                                enum: ['average', 'max', 'min', 'sum'],
                                type: 'string',
                              },
                              column: {
                                type: 'string',
                              },
                            },
                            type: 'object',
                            required: ['column'],
                          },
                          type: 'array',
                        },
                        keyColumn: {
                          type: 'string',
                        },
                      },
                      required: ['keyColumn'],
                      type: 'object',
                    },
                    graphDataConfiguration: {
                      items: {
                        properties: {
                          chartConfigId: {
                            type: 'string',
                          },
                          columnId: {
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
                        },
                        required: ['chartConfigId', 'columnId'],
                        type: 'object',
                      },
                      type: 'array',
                    },
                    graphType: {
                      enum: [
                        'animatedBiVariateChoroplethMap',
                        'animatedButterflyChart',
                        'animatedChoroplethMap',
                        'animatedDotDensityMap',
                        'animatedHorizontalBarChart',
                        'animatedHorizontalDumbbellChart',
                        'animatedHorizontalGroupedBarChart',
                        'animatedHorizontalStackedBarChart',
                        'animatedScatterPlot',
                        'animatedVerticalBarChart',
                        'animatedVerticalDumbbellChart',
                        'animatedVerticalGroupedBarChart',
                        'animatedVerticalStackedBarChart',
                        'biVariateChoroplethMap',
                        'butterflyChart',
                        'choroplethMap',
                        'circlePacking',
                        'dataTable',
                        'donutChart',
                        'dotDensityMap',
                        'dualAxisLineChart',
                        'geoHubCompareMap',
                        'geoHubMap',
                        'heatMap',
                        'histogram',
                        'horizontalBarChart',
                        'horizontalBeeSwarmChart',
                        'horizontalDumbbellChart',
                        'horizontalGroupedBarChart',
                        'horizontalStackedBarChart',
                        'horizontalStripChart',
                        'lineChart',
                        'multiLineChart',
                        'paretoChart',
                        'scatterPlot',
                        'slopeChart',
                        'sparkLine',
                        'stackedAreaChart',
                        'statCard',
                        'treeMap',
                        'unitChart',
                        'verticalBarChart',
                        'verticalBeeSwarmChart',
                        'verticalDumbbellChart',
                        'verticalGroupedBarChart',
                        'verticalStackedBarChart',
                        'verticalStripChart',
                      ],
                      type: 'string',
                    },
                    settings: SettingsSchema,
                    dataSelectionOptions: {
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
                                value: { type: 'string' },
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
                    },
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
        rtl: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
      },
      type: 'object',
      required: ['rows'],
    },
    dataSettings: {
      properties: {
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
        data: {},
        dataURL: {
          type: 'string',
        },
        delimiter: {
          type: 'string',
        },
        fileType: {
          enum: ['csv', 'json'],
          type: 'string',
        },
      },
      type: 'object',
    },
    filters: {
      items: {
        properties: {
          clearable: {
            type: 'boolean',
          },
          column: {
            type: 'string',
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
    },
    readableHeader: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          label: {
            type: 'string',
          },
        },
        required: ['value', 'label'],
      },
    },
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  type: 'object',
  required: ['dashboardLayout', 'dataSettings'],
};

export const dashboardWideToLongFormatJSONSchema = {
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
        rows: {
          items: {
            properties: {
              columns: {
                items: {
                  properties: {
                    columnWidth: {
                      type: 'number',
                    },
                    dataFilters: {
                      items: {
                        properties: {
                          column: {
                            type: 'string',
                          },
                          excludeValues: {
                            type: 'array',
                            items: {
                              oneOf: [
                                { type: 'string' },
                                { type: 'number' },
                                { type: 'boolean' },
                              ],
                            },
                          },
                          includeValues: {
                            type: 'array',
                            items: {
                              oneOf: [
                                { type: 'string' },
                                { type: 'number' },
                                { type: 'boolean' },
                              ],
                            },
                          },
                        },
                        type: 'object',
                        required: ['column'],
                      },
                      type: 'array',
                    },
                    graphDataConfiguration: {
                      items: {
                        properties: {
                          chartConfigId: {
                            type: 'string',
                          },
                          columnId: {
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
                        },
                        required: ['chartConfigId', 'columnId'],
                        type: 'object',
                      },
                      type: 'array',
                    },
                    graphType: {
                      enum: [
                        'circlePacking',
                        'donutChart',
                        'horizontalBarChart',
                        'treeMap',
                        'unitChart',
                        'verticalBarChart',
                      ],
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
        rtl: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
      },
      type: 'object',
      required: ['rows'],
    },
    dataSettings: {
      properties: {
        data: {},
        dataURL: {
          type: 'string',
        },
        delimiter: {
          type: 'string',
        },
        fileType: {
          enum: ['csv', 'json'],
          type: 'string',
        },
        keyColumn: {
          type: 'string',
        },
      },
      required: ['keyColumn'],
      type: 'object',
    },
    readableHeader: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: { type: 'string' },
          label: {
            type: 'string',
          },
        },
        required: ['value', 'label'],
      },
    },
    debugMode: { type: 'boolean' },
    mode: { type: 'string', enum: ['dark', 'light'] },
  },
  type: 'object',
  required: ['dashboardLayout', 'dataSettings'],
};
