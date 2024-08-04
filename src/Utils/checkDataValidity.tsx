import flattenDeep from 'lodash.flattendeep';
import { GraphConfigurationDataType, GraphType } from '../Types';
import ChartConfiguration from './transformData/graphConfig.json';

function arrayContainsArray(superset: string[], subset: string[]) {
  return subset.every(value => superset.includes(value));
}

export function checkDataConfigValidity(
  dataConfig: GraphConfigurationDataType[],
  graph: GraphType,
  dataKeys: string[],
) {
  const dataKeyFromDataConfig = flattenDeep(dataConfig.map(d => d.columnId));
  const checkDataKeys = arrayContainsArray(dataKeys, dataKeyFromDataConfig);
  if (!checkDataKeys) return false;
  const ids = dataConfig.map(el => el.chartConfigId);
  const requiredIds = ChartConfiguration[
    ChartConfiguration.findIndex(el => el.chartID === graph)
  ].configuration
    .filter(el => el.required)
    .map(el => el.id);
  const ifRequiredIdsPresent = arrayContainsArray(ids, requiredIds);
  return ifRequiredIdsPresent;
}
