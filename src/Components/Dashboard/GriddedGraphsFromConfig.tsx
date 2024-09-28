import { useEffect, useState } from 'react';
import {
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphType,
} from '../../Types';
import { fetchAndParseJSON } from '../../Utils/fetchAndParseData';
import { GriddedGraphs } from './GriddedGraphs';

interface ConfigObject {
  noOfColumns?: number;
  columnGridBy: string;
  graphSettings: any;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: Exclude<GraphType, 'geoHubMap' | 'geoHubCompareMap'>;
  relativeHeightForGraph?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  dataFilter?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  showCommonColorScale?: boolean;
  minGraphWidth?: number;
  minGraphHeight?: number;
}
interface Props {
  config: string | ConfigObject;
}

export function GriddedGraphsFromConfig(props: Props) {
  const { config } = props;
  const [configSettings, setConfigSettings] = useState<
    ConfigObject | undefined
  >(undefined);

  useEffect(() => {
    if (typeof config === 'string') {
      const fetchData = fetchAndParseJSON(config);
      fetchData.then(d => {
        setConfigSettings(d);
      });
    } else {
      setConfigSettings(config);
    }
  }, [config]);
  if (!configSettings) return <div className='undp-viz-loader' />;
  return (
    <GriddedGraphs
      noOfColumns={configSettings.noOfColumns}
      columnGridBy={configSettings.columnGridBy}
      graphSettings={configSettings.graphSettings}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      graphType={configSettings.graphType}
      relativeHeightForGraph={configSettings.relativeHeightForGraph}
      minGraphHeight={configSettings.minGraphHeight}
      minGraphWidth={configSettings.minGraphWidth}
      dataTransform={configSettings.dataTransform}
      graphDataConfiguration={configSettings.graphDataConfiguration}
      dataFilter={configSettings.dataFilter}
      showCommonColorScale={configSettings.showCommonColorScale}
    />
  );
}
