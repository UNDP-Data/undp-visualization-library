import { GraphConfigurationDataType, GraphType } from '../../Types';
import { checkDataConfigValidity } from '../checkDataValidity';
import { checkIfNullOrUndefined } from '../checkIfNullOrUndefined';
import { GraphList } from '../getGraphList';
import ChartConfiguration from './graphConfig.json';

export function transformDataForGraph(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  graph: GraphType,
  config?: GraphConfigurationDataType[],
) {
  if (
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graph) !== -1
  )
    return data;
  if (!data) return 'Cannot fetch data';
  if (graph === 'dataTable' || graph === 'dataCards' || data.length === 0)
    return data;
  if (!config) {
    console.error('Your data configuration is not accurate');
    return 'No graph configuration is provided';
  }
  const dataConfigValidity = checkDataConfigValidity(
    config,
    graph,
    Object.keys(data[0]),
  );
  if (dataConfigValidity.isValid) {
    const chartConfig =
      ChartConfiguration[ChartConfiguration.findIndex(d => d.chartID === graph)]
        .configuration;
    const dataFormatted = data.map((d: any) => {
      const obj: any = {};
      config
        .filter(el => el.columnId)
        .forEach(el => {
          if (
            chartConfig[chartConfig.findIndex(k => k.id === el.chartConfigId)]
              .multiple
          ) {
            obj[
              chartConfig[
                chartConfig.findIndex(k => k.id === el.chartConfigId)
              ].id
            ] = [];
            (el.columnId as string[]).forEach(l => {
              obj[
                chartConfig[
                  chartConfig.findIndex(k => k.id === el.chartConfigId)
                ].id
              ].push(checkIfNullOrUndefined(d[l]) ? null : d[l]);
            });
          } else {
            obj[
              chartConfig[
                chartConfig.findIndex(k => k.id === el.chartConfigId)
              ].id
            ] = checkIfNullOrUndefined(d[el.columnId as string])
              ? null
              : d[el.columnId as string];
          }
          obj[`${el.chartConfigId}Columns`] = el.columnId;
        });
      obj.data = d;
      return obj;
    });
    return dataFormatted;
  }
  console.error(dataConfigValidity.err);
  return dataConfigValidity.err;
}
