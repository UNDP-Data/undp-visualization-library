import Ajv from 'ajv';
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
} from '../Schemas';

const ajv = new Ajv();

export const validateDataSchema = (data: any, graph: GraphType) => {
  if (!data) {
    return false;
  }
  if (
    graph === 'geoHubCompareMap' ||
    graph === 'geoHubMap' ||
    graph === 'dataTable' ||
    data.length === 0
  )
    return true;

  let schema: any;

  switch (graph) {
    case 'horizontalBarChart':
      schema = barGraphDataSchema;
      break;
    case 'horizontalStackedBarChart':
      schema = stackedBarGraphDataSchema;
      break;
    case 'horizontalGroupedBarChart':
      schema = groupedBarGraphDataSchema;
      break;
    case 'verticalBarChart':
      schema = barGraphDataSchema;
      break;
    case 'verticalStackedBarChart':
      schema = stackedBarGraphDataSchema;
      break;
    case 'verticalGroupedBarChart':
      schema = groupedBarGraphDataSchema;
      break;
    case 'lineChart':
      schema = lineChartDataSchema;
      break;
    case 'dualAxisLineChart':
      schema = dualAxisLineChartDataSchema;
      break;
    case 'multiLineChart':
      schema = multiLineChartDataSchema;
      break;
    case 'stackedAreaChart':
      schema = areaChartDataSchema;
      break;
    case 'choroplethMap':
      schema = choroplethMapDataSchema;
      break;
    case 'biVariateChoroplethMap':
      schema = biVariateChoroplethMapDataSchema;
      break;
    case 'dotDensityMap':
      schema = dotDensityMapDataSchema;
      break;
    case 'donutChart':
      schema = donutChartDataSchema;
      break;
    case 'slopeChart':
      schema = slopeChartDataSchema;
      break;
    case 'scatterPlot':
      schema = scatterPlotDataSchema;
      break;
    case 'horizontalDumbbellChart':
      schema = dumbbellChartDataSchema;
      break;
    case 'verticalDumbbellChart':
      schema = dumbbellChartDataSchema;
      break;
    case 'treeMap':
      schema = treeMapDataSchema;
      break;
    case 'circlePacking':
      schema = circlePackingDataSchema;
      break;
    case 'heatMap':
      schema = heatMapDataSchema;
      break;
    case 'horizontalStripChart':
      schema = stripChartDataSchema;
      break;
    case 'verticalStripChart':
      schema = stripChartDataSchema;
      break;
    case 'horizontalBeeSwarmChart':
      schema = beeSwarmChartDataSchema;
      break;
    case 'verticalBeeSwarmChart':
      schema = beeSwarmChartDataSchema;
      break;
    case 'butterflyChart':
      schema = butterflyChartDataSchema;
      break;
    case 'histogram':
      schema = histogramDataSchema;
      break;
    case 'sparkLine':
      schema = lineChartDataSchema;
      break;
    case 'paretoChart':
      schema = paretoChartDataSchema;
      break;
    case 'statCard':
      schema = statCardDataSchema;
      break;
    default:
      console.error('Unknown chart type:', graph);
      break;
  }

  if (!schema) return false;

  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
    return false;
  }
  return true;
};
