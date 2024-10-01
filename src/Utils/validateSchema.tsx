import Ajv from 'ajv';
import { GraphType } from '../Types';
import { getDataSchema, getSettingsSchema } from './getSchema';
import {
  dashboardJSONSchema,
  griddedGraphJSONSchema,
  singleGraphJSONSchema,
} from '../Schemas';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

export function validateDataSchema(data: any, graph: GraphType) {
  if (graph === 'geoHubCompareMap' || graph === 'geoHubMap')
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
  if (graph === 'dataTable' || data.length === 0)
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
  graph: 'singleGraphDashboard' | 'multiGraphDashboard' | 'griddedGraph',
) {
  let schema: any;
  switch (graph) {
    case 'griddedGraph':
      schema = griddedGraphJSONSchema;
      break;
    case 'multiGraphDashboard':
      schema = dashboardJSONSchema;
      break;
    case 'singleGraphDashboard':
      schema = singleGraphJSONSchema;
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
