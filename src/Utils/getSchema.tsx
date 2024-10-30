import { GraphType } from '../Types';
import {
  barGraphDataSchema,
  stackedBarGraphDataSchema,
  groupedBarGraphDataSchema,
  lineChartDataSchema,
  dualAxisLineChartDataSchema,
  multiLineChartDataSchema,
  areaChartDataSchema,
  choroplethMapDataSchema,
  biVariateChoroplethMapDataSchema,
  dotDensityMapDataSchema,
  donutChartDataSchema,
  slopeChartDataSchema,
  scatterPlotDataSchema,
  dumbbellChartDataSchema,
  treeMapDataSchema,
  circlePackingDataSchema,
  heatMapDataSchema,
  stripChartDataSchema,
  beeSwarmChartDataSchema,
  butterflyChartDataSchema,
  histogramDataSchema,
  paretoChartDataSchema,
  statCardDataSchema,
  animatedGroupedBarGraphDataSchema,
  animatedBarGraphDataSchema,
  animatedStackedBarGraphDataSchema,
  animatedBiVariateChoroplethMapDataSchema,
  animatedChoroplethMapDataSchema,
  animatedDotDensityMapDataSchema,
  animatedScatterPlotDataSchema,
  animatedDumbbellChartDataSchema,
  animatedButterflyChartDataSchema,
  animatedBiVariateChoroplethMapSettingsSchema,
  animatedButterflyChartSettingsSchema,
  animatedChoroplethMapSettingsSchema,
  animatedDotDensityMapSettingsSchema,
  animatedDumbbellChartSettingsSchema,
  animatedGroupedBarChartSettingsSchema,
  animatedScatterPlotSettingsSchema,
  animatedSimpleBarChartSettingsSchema,
  animatedStackedBarChartSettingsSchema,
  beeSwarmChartSettingsSchema,
  biVariateChoroplethMapSettingsSchema,
  butterflyChartSettingsSchema,
  choroplethMapSettingsSchema,
  circlePackingSettingsSchema,
  dataTableSettingsSchema,
  donutChartSettingsSchema,
  dotDensityMapSettingsSchema,
  dualAxisLineChartSettingsSchema,
  dumbbellChartSettingsSchema,
  geoHubCompareMapSettingsSchema,
  geoHubMapSettingsSchema,
  geoHubMapWithLayerSelectionSettingsSchema,
  groupedBarChartSettingsSchema,
  heatMapSettingsSchema,
  histogramSettingsSchema,
  lineChartSettingsSchema,
  multiLineChartSettingsSchema,
  paretoChartSettingsSchema,
  scatterPlotSettingsSchema,
  simpleBarChartSettingsSchema,
  slopeChartSettingsSchema,
  sparkLineSettingsSchema,
  stackedAreaChartSettingsSchema,
  stackedBarChartSettingsSchema,
  statCardSettingsSchema,
  stripChartSettingsSchema,
  treeMapSettingsSchema,
  unitChartSettingsSchema,
  unitChartDataSchema,
  differenceLineChartDataSchema,
  differenceLineChartSettingsSchema,
} from '../Schemas';

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
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}
