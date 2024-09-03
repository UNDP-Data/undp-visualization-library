import { GraphConfigurationDataType, GraphType } from '../../Types';
import { checkDataConfigValidity } from '../checkDataValidity';
import ChartConfiguration from './graphConfig.json';

export function transformDataForGraph(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  graph: GraphType,
  config?: GraphConfigurationDataType[],
) {
  if (!data) return 'Cannot fetch data';
  if (
    graph === 'dataTable' ||
    graph === 'geoHubCompareMap' ||
    graph === 'geoHubMap' ||
    data.length === 0
  )
    return data;
  if (!config) {
    console.error('Your data configuration is not accurate');
    return 'No graph configuration is provided';
  }
  if (checkDataConfigValidity(config, graph, Object.keys(data[0]))) {
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
              ].push(d[l] === null ? undefined : d[l]);
            });
          } else {
            obj[
              chartConfig[
                chartConfig.findIndex(k => k.id === el.chartConfigId)
              ].id
            ] =
              d[el.columnId as string] === null
                ? undefined
                : d[el.columnId as string];
          }
        });
      obj.data = d;
      return obj;
    });
    return dataFormatted;
  }
  return 'Your data configuration is not accurate or the column names are not accurate';
}
