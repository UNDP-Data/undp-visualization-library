import Ajv from 'ajv';
import { GraphType } from '@/Types';
import {
  getDashboardJSONSchema,
  getDashboardWideToLongFormatJSONSchema,
  getDataSchema,
  getGriddedGraphJSONSchema,
  getSettingsSchema,
  getSingleGraphJSONSchema,
} from '@/Schemas/getSchema';
import { GraphList } from './getGraphList';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

export function validateDataSchema(data: any, graph: GraphType) {
  if (
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graph) !== -1
  )
    return {
      isValid: true,
      err: undefined,
    };
  if (!data) {
    return {
      isValid: false,
      err: `No data provided`,
    };
  }
  if (graph === 'dataTable' || graph === 'dataCards' || data.length === 0)
    return {
      isValid: true,
      err: undefined,
    };

  const schema = getDataSchema(graph);

  if (!schema)
    return {
      isValid: false,
      err: `Invalid chart type: ${graph}`,
    };

  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
    return {
      isValid: false,
      err: validate.errors
        ?.map(error => `Error at ${error.instancePath}: ${error.message}`)
        .join('; '),
    };
  }
  return {
    isValid: true,
    err: undefined,
  };
}

export function validateSettingsSchema(settings: any, graph: GraphType) {
  const schema = getSettingsSchema(graph);

  if (!schema)
    return {
      isValid: false,
      err: `Invalid chart type: ${graph}`,
    };

  const validate = ajv.compile(schema);
  const valid = validate(settings);
  if (!valid) {
    console.error(validate.errors);
    return {
      isValid: false,
      err: validate.errors
        ?.map(error => `Error at ${error.instancePath}: ${error.message}`)
        .join('; '),
    };
  }
  return {
    isValid: true,
    err: undefined,
  };
}

export function validateConfigSchema(
  config: any,
  graph:
    | 'singleGraphDashboard'
    | 'multiGraphDashboard'
    | 'griddedGraph'
    | 'multiGraphDashboardWideToLongFormat',
) {
  let schema: any;
  switch (graph) {
    case 'griddedGraph':
      schema = getGriddedGraphJSONSchema(undefined, config.graphType);
      break;
    case 'multiGraphDashboard':
      schema = getDashboardJSONSchema();
      break;
    case 'singleGraphDashboard':
      schema = getSingleGraphJSONSchema(undefined, config.graphType);
      break;
    case 'multiGraphDashboardWideToLongFormat':
      schema = getDashboardWideToLongFormatJSONSchema();
      break;
    default:
      break;
  }

  if (!schema)
    return {
      isValid: false,
      err: `Invalid chart type: ${graph}`,
    };
  const validate = ajv.compile(schema);
  const valid = validate(config);
  if (!valid) {
    console.error(validate.errors);
    return {
      isValid: false,
      err: validate.errors
        ?.map(error => `Error at ${error.instancePath}: ${error.message}`)
        .join('; '),
    };
  }
  return {
    isValid: true,
    err: undefined,
  };
}
