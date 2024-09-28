import Ajv from 'ajv';
import { GraphType } from '../Types';
import { getDataSchema, getSettingsSchema } from './getSchema';

const ajv = new Ajv({ allErrors: true });

export function validateDataSchema(data: any, graph: GraphType) {
  if (graph === 'geoHubCompareMap' || graph === 'geoHubMap') return true;
  if (!data) {
    return false;
  }
  if (graph === 'dataTable' || data.length === 0) return true;

  const schema = getDataSchema(graph);

  if (!schema) return false;

  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
    return false;
  }
  return true;
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
