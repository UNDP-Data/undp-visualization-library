import { GraphType } from '../Types';
import { GraphList } from '../Utils/getGraphList';
import {
  barGraphDataSchema,
  stackedBarGraphDataSchema,
  groupedBarGraphDataSchema,
  animatedBarGraphDataSchema,
  animatedStackedBarGraphDataSchema,
  animatedGroupedBarGraphDataSchema,
  lineChartDataSchema,
  dualAxisLineChartDataSchema,
  differenceLineChartDataSchema,
  multiLineChartDataSchema,
  areaChartDataSchema,
  choroplethMapDataSchema,
  biVariateChoroplethMapDataSchema,
  dotDensityMapDataSchema,
  animatedChoroplethMapDataSchema,
  animatedBiVariateChoroplethMapDataSchema,
  animatedDotDensityMapDataSchema,
  donutChartDataSchema,
  slopeChartDataSchema,
  scatterPlotDataSchema,
  animatedScatterPlotDataSchema,
  dumbbellChartDataSchema,
  animatedDumbbellChartDataSchema,
  treeMapDataSchema,
  circlePackingDataSchema,
  heatMapDataSchema,
  stripChartDataSchema,
  beeSwarmChartDataSchema,
  butterflyChartDataSchema,
  animatedButterflyChartDataSchema,
  histogramDataSchema,
  paretoChartDataSchema,
  statCardDataSchema,
  unitChartDataSchema,
  sankeyChartDataSchema,
  simpleBarChartSettingsSchema,
  stackedBarChartSettingsSchema,
  groupedBarChartSettingsSchema,
  animatedSimpleBarChartSettingsSchema,
  animatedStackedBarChartSettingsSchema,
  animatedGroupedBarChartSettingsSchema,
  lineChartSettingsSchema,
  dualAxisLineChartSettingsSchema,
  multiLineChartSettingsSchema,
  differenceLineChartSettingsSchema,
  stackedAreaChartSettingsSchema,
  choroplethMapSettingsSchema,
  biVariateChoroplethMapSettingsSchema,
  dotDensityMapSettingsSchema,
  animatedChoroplethMapSettingsSchema,
  animatedBiVariateChoroplethMapSettingsSchema,
  animatedDotDensityMapSettingsSchema,
  donutChartSettingsSchema,
  slopeChartSettingsSchema,
  scatterPlotSettingsSchema,
  animatedScatterPlotSettingsSchema,
  dumbbellChartSettingsSchema,
  animatedDumbbellChartSettingsSchema,
  treeMapSettingsSchema,
  circlePackingSettingsSchema,
  heatMapSettingsSchema,
  stripChartSettingsSchema,
  beeSwarmChartSettingsSchema,
  butterflyChartSettingsSchema,
  animatedButterflyChartSettingsSchema,
  histogramSettingsSchema,
  sparkLineSettingsSchema,
  paretoChartSettingsSchema,
  dataTableSettingsSchema,
  statCardSettingsSchema,
  geoHubCompareMapSettingsSchema,
  geoHubMapSettingsSchema,
  geoHubMapWithLayerSelectionSettingsSchema,
  unitChartSettingsSchema,
  sankeyChartSettingsSchema,
  SettingsSchema,
  lineChartWithConfidenceIntervalDataSchema,
  lineChartWithConfidenceIntervalSettingsSchema,
} from './schemaList';

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
    case 'lineChartWithConfidenceInterval':
      return lineChartWithConfidenceIntervalDataSchema;
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export function getSettingsSchema(graph: GraphType | 'allGraphs') {
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
    case 'lineChartWithConfidenceInterval':
      return lineChartWithConfidenceIntervalSettingsSchema;
    case 'allGraphs':
      return SettingsSchema;
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export function getGraphConfigChartConfigIdEnum(
  chartType?: GraphType | 'dashboardWideToLong' | 'dashboard',
) {
  switch (chartType) {
    case 'horizontalBarChart':
      return ['label', 'size', 'color'];
    case 'verticalBarChart':
      return ['label', 'size', 'color'];
    case 'animatedHorizontalBarChart':
      return ['label', 'size', 'color', 'date'];
    case 'animatedVerticalBarChart':
      return ['label', 'size', 'color', 'date'];
    case 'treeMap':
      return ['label', 'size', 'color'];
    case 'circlePacking':
      return ['label', 'size', 'color'];
    case 'butterflyChart':
      return ['label', 'leftBar', 'rightBar'];
    case 'verticalGroupedBarChart':
      return ['label', 'size'];
    case 'verticalStackedBarChart':
      return ['label', 'size'];
    case 'horizontalGroupedBarChart':
      return ['label', 'size'];
    case 'horizontalStackedBarChart':
      return ['label', 'size'];
    case 'animatedButterflyChart':
      return ['label', 'leftBar', 'rightBar', 'date'];
    case 'animatedVerticalGroupedBarChart':
      return ['label', 'size', 'date'];
    case 'animatedVerticalStackedBarChart':
      return ['label', 'size', 'date'];
    case 'animatedHorizontalGroupedBarChart':
      return ['label', 'size', 'date'];
    case 'animatedHorizontalStackedBarChart':
      return ['label', 'size', 'date'];
    case 'verticalDumbbellChart':
      return ['x', 'label'];
    case 'horizontalDumbbellChart':
      return ['x', 'label'];
    case 'animatedVerticalDumbbellChart':
      return ['x', 'label', 'date'];
    case 'animatedHorizontalDumbbellChart':
      return ['x', 'label', 'date'];
    case 'donutChart':
      return ['size', 'label'];
    case 'histogram':
      return ['value'];
    case 'choroplethMap':
      return ['x', 'countryCode'];
    case 'biVariateChoroplethMap':
      return ['x', 'y', 'countryCode'];
    case 'animatedChoroplethMap':
      return ['x', 'countryCode', 'date'];
    case 'animatedBiVariateChoroplethMap':
      return ['x', 'y', 'countryCode', 'date'];
    case 'lineChart':
      return ['date', 'y'];
    case 'multiLineChart':
      return ['date', 'y'];
    case 'stackedAreaChart':
      return ['date', 'y'];
    case 'scatterPlot':
      return ['x', 'y', 'radius', 'color', 'label'];
    case 'animatedScatterPlot':
      return ['x', 'y', 'radius', 'color', 'label', 'date'];
    case 'dualAxisLineChart':
      return ['date', 'y1', 'y2'];
    case 'paretoChart':
      return ['label', 'bar', 'line'];
    case 'dotDensityMap':
      return ['lat', 'long', 'radius', 'color', 'label'];
    case 'animatedDotDensityMap':
      return ['lat', 'long', 'radius', 'color', 'label', 'date'];
    case 'slopeChart':
      return ['y1', 'y2', 'color', 'label'];
    case 'heatMap':
      return ['row', 'column', 'value'];
    case 'horizontalBeeSwarmChart':
      return ['label', 'position', 'radius', 'color'];
    case 'verticalBeeSwarmChart':
      return ['label', 'position', 'radius', 'color'];
    case 'verticalStripChart':
      return ['label', 'position', 'color'];
    case 'horizontalStripChart':
      return ['label', 'position', 'color'];
    case 'statCard':
      return ['value'];
    case 'sankeyChart':
      return ['source', 'target', 'value'];
    case 'differenceLineChart':
      return ['date', 'y1', 'y2'];
    case 'unitChart':
      return ['label', 'value'];
    case 'sparkLine':
      return ['date', 'y'];
    case 'lineChartWithConfidenceInterval':
      return ['date', 'y', 'yMin', 'yMax'];
    case 'dashboardWideToLong':
      return ['label', 'size', 'color', 'value'];
    case 'dashboard':
      return [
        'label',
        'radius',
        'size',
        'row',
        'y1',
        'y',
        'rightBar',
        'position',
        'leftBar',
        'x',
        'bar',
        'line',
        'y2',
        'column',
        'date',
        'value',
        'color',
        'long',
        'lat',
        'countryCode',
        'source',
        'target',
        'yMin',
        'yMax',
      ];
    default:
      return [
        'label',
        'radius',
        'size',
        'row',
        'y1',
        'y',
        'rightBar',
        'position',
        'leftBar',
        'x',
        'bar',
        'line',
        'y2',
        'column',
        'date',
        'value',
        'color',
        'long',
        'lat',
        'countryCode',
        'source',
        'target',
        'yMin',
        'yMax',
      ];
  }
}

function getColumnEnum(columns?: string[]) {
  if (!columns || columns.length === 0) return {};
  return { enum: columns };
}
export const getColumnsToArraySchema = (columnList?: string[]) => ({
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
});

export const getDataSettingsSchema = (columnList?: string[]) => ({
  properties: {
    columnsToArray: getColumnsToArraySchema(columnList),
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
              columnsToArray: getColumnsToArraySchema(),
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

export const getGraphDataConfigurationSchema = (
  columnList?: string[],
  graphType?: GraphType | 'dashboard' | 'dashboardWideToLong',
) => ({
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
      chartConfigId: {
        type: 'string',
        ...getColumnEnum(getGraphConfigChartConfigIdEnum(graphType)),
      },
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
          graphSettings: getSettingsSchema(graphType),
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
    : graphType === 'dataTable'
    ? {
        type: 'object',
        properties: {
          graphSettings: getSettingsSchema(graphType),
          dataSettings: getDataSettingsSchema(columnList),
          filters: getFiltersSchema(columnList),
          graphType: {
            type: 'string',
            enum: GraphList.map(el => el.graphID),
          },
          dataTransform: getDataTransformSchema(columnList),
          dataFilters: getDataFiltersSchema(columnList),
          readableHeader: getReadableHeaderSchema(columnList),
          dataSelectionOptions: getDataSelectionSchema(columnList),
          debugMode: { type: 'boolean' },
          mode: { type: 'string', enum: ['dark', 'light'] },
        },
        required: ['dataSettings', 'graphType'],
      }
    : {
        type: 'object',
        properties: {
          graphSettings: graphType
            ? getSettingsSchema(graphType)
            : getSettingsSchema('allGraphs'),
          dataSettings: getDataSettingsSchema(columnList),
          filters: getFiltersSchema(columnList),
          graphType: {
            type: 'string',
            enum: GraphList.map(el => el.graphID),
          },
          dataTransform: getDataTransformSchema(columnList),
          dataFilters: getDataFiltersSchema(columnList),
          graphDataConfiguration: getGraphDataConfigurationSchema(
            columnList,
            graphType,
          ),
          readableHeader: getReadableHeaderSchema(columnList),
          dataSelectionOptions: getDataSelectionSchema(columnList),
          debugMode: { type: 'boolean' },
          mode: { type: 'string', enum: ['dark', 'light'] },
        },
        required: !graphType
          ? ['graphType']
          : ['dataSettings', 'graphType', 'graphDataConfiguration'],
      };

export const getGriddedGraphJSONSchema = (
  columnList?: string[],
  graphType?: GraphType,
) =>
  graphType === 'dataTable'
    ? {
        type: 'object',
        properties: {
          graphSettings: getSettingsSchema(graphType),
          dataSettings: getDataSettingsSchema(columnList),
          filters: getFiltersSchema(columnList),
          graphType: {
            type: 'string',
            enum: GraphList.filter(
              el => el.availableInGriddedGraph !== false,
            ).map(el => el.graphID),
          },
          dataTransform: getDataTransformSchema(columnList),
          dataFilters: getDataFiltersSchema(columnList),
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
      }
    : {
        type: 'object',
        properties: {
          graphSettings: graphType
            ? getSettingsSchema(graphType)
            : getSettingsSchema('allGraphs'),
          dataSettings: getDataSettingsSchema(columnList),
          filters: getFiltersSchema(columnList),
          graphType: {
            type: 'string',
            enum: GraphList.filter(
              el => el.availableInGriddedGraph !== false,
            ).map(el => el.graphID),
          },
          dataTransform: getDataTransformSchema(columnList),
          dataFilters: getDataFiltersSchema(columnList),
          graphDataConfiguration: getGraphDataConfigurationSchema(
            columnList,
            graphType,
          ),
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
        required: !graphType
          ? ['columnGridBy', 'dataSettings', 'graphType']
          : [
              'columnGridBy',
              'dataSettings',
              'graphType',
              'graphDataConfiguration',
            ],
      };

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
                    graphDataConfiguration: getGraphDataConfigurationSchema(
                      undefined,
                      'dashboard',
                    ),
                    graphType: {
                      enum: GraphList.map(el => el.graphID),
                      type: 'string',
                    },
                    settings: getSettingsSchema('allGraphs'),
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
                    graphDataConfiguration: getGraphDataConfigurationSchema(
                      undefined,
                      'dashboardWideToLong',
                    ),
                    graphType: {
                      enum: GraphList.filter(
                        el => el.availableInWideToLongFormat,
                      ).map(el => el.graphID),
                      type: 'string',
                    },
                    settings: getSettingsSchema('allGraphs'),
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
        ...getDataSettingsSchema().properties,
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
