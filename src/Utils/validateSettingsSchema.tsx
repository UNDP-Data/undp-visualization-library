import Ajv from 'ajv';
import { GraphType } from '../Types';
import {
  simpleBarChartSettingsSchema,
  stackedBarChartSettingsSchema,
  groupedBarChartSettingsSchema,
  lineChartSettingsSchema,
  dualAxisLineChartSettingsSchema,
  multiLineChartSettingsSchema,
  stackedAreaChartSettingsSchema,
  choroplethMapSettingsSchema,
  biVariateChoroplethMapSettingsSchema,
  dotDensityMapSettingsSchema,
  donutChartSettingsSchema,
  slopeChartSettingsSchema,
  scatterPlotSettingsSchema,
  dumbbellChartSettingsSchema,
  treeMapSettingsSchema,
  circlePackingSettingsSchema,
  heatMapSettingsSchema,
  stripChartSettingsSchema,
  beeSwarmChartSettingsSchema,
  butterflyChartSettingsSchema,
  histogramSettingsSchema,
  sparkLineSettingsSchema,
  paretoChartSettingsSchema,
  dataTableSettingsSchema,
  statCardSettingsSchema,
  geoHubCompareMapSettingsSchema,
  geoHubMapSettingsSchema,
} from '../Schemas';

const ajv = new Ajv();

export const validateSettingsSchema = (settings: any, graph: GraphType) => {
  let schema: any;

  switch (graph) {
    case 'horizontalBarChart':
      schema = simpleBarChartSettingsSchema;
      break;
    case 'horizontalStackedBarChart':
      schema = stackedBarChartSettingsSchema;
      break;
    case 'horizontalGroupedBarChart':
      schema = groupedBarChartSettingsSchema;
      break;
    case 'verticalBarChart':
      schema = simpleBarChartSettingsSchema;
      break;
    case 'verticalStackedBarChart':
      schema = stackedBarChartSettingsSchema;
      break;
    case 'verticalGroupedBarChart':
      schema = groupedBarChartSettingsSchema;
      break;
    case 'lineChart':
      schema = lineChartSettingsSchema;
      break;
    case 'dualAxisLineChart':
      schema = dualAxisLineChartSettingsSchema;
      break;
    case 'multiLineChart':
      schema = multiLineChartSettingsSchema;
      break;
    case 'stackedAreaChart':
      schema = stackedAreaChartSettingsSchema;
      break;
    case 'choroplethMap':
      schema = choroplethMapSettingsSchema;
      break;
    case 'biVariateChoroplethMap':
      schema = biVariateChoroplethMapSettingsSchema;
      break;
    case 'dotDensityMap':
      schema = dotDensityMapSettingsSchema;
      break;
    case 'donutChart':
      schema = donutChartSettingsSchema;
      break;
    case 'slopeChart':
      schema = slopeChartSettingsSchema;
      break;
    case 'scatterPlot':
      schema = scatterPlotSettingsSchema;
      break;
    case 'horizontalDumbbellChart':
      schema = dumbbellChartSettingsSchema;
      break;
    case 'verticalDumbbellChart':
      schema = dumbbellChartSettingsSchema;
      break;
    case 'treeMap':
      schema = treeMapSettingsSchema;
      break;
    case 'circlePacking':
      schema = circlePackingSettingsSchema;
      break;
    case 'heatMap':
      schema = heatMapSettingsSchema;
      break;
    case 'horizontalStripChart':
      schema = stripChartSettingsSchema;
      break;
    case 'verticalStripChart':
      schema = stripChartSettingsSchema;
      break;
    case 'horizontalBeeSwarmChart':
      schema = beeSwarmChartSettingsSchema;
      break;
    case 'verticalBeeSwarmChart':
      schema = beeSwarmChartSettingsSchema;
      break;
    case 'butterflyChart':
      schema = butterflyChartSettingsSchema;
      break;
    case 'histogram':
      schema = histogramSettingsSchema;
      break;
    case 'sparkLine':
      schema = sparkLineSettingsSchema;
      break;
    case 'paretoChart':
      schema = paretoChartSettingsSchema;
      break;
    case 'dataTable':
      schema = dataTableSettingsSchema;
      break;
    case 'statCard':
      schema = statCardSettingsSchema;
      break;
    case 'geoHubCompareMap':
      schema = geoHubCompareMapSettingsSchema;
      break;
    case 'geoHubMap':
      schema = geoHubMapSettingsSchema;
      break;
    default:
      console.error('Unknown chart type:', graph);
      break;
  }

  if (!schema) return false;

  const validate = ajv.compile(schema);
  const valid = validate(settings);
  if (!valid) {
    console.error(validate.errors);
    return false;
  }
  return true;
};
