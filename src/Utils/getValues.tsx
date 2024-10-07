import { GraphConfigurationDataType } from '../Types';

export function getValues(
  id: string,
  graphConfig: GraphConfigurationDataType[],
) {
  return graphConfig.findIndex(el => el.chartConfigId === id) === -1
    ? undefined
    : graphConfig[graphConfig.findIndex(el => el.chartConfigId === id)]
        .columnId;
}
