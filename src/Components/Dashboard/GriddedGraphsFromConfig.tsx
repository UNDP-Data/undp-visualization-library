import { useEffect, useState } from 'react';
import {
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphType,
} from '../../Types';
import { fetchAndParseJSON } from '../../Utils/fetchAndParseData';
import { GriddedGraphs } from './GriddedGraphs';
import { validateConfigSchema } from '../../Utils/validateSchema';

interface ConfigObject {
  noOfColumns?: number;
  columnGridBy: string;
  graphSettings?: any;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: Exclude<GraphType, 'geoHubMap' | 'geoHubCompareMap'>;
  relativeHeightForGraph?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  showCommonColorScale?: boolean;
  minGraphWidth?: number;
  minGraphHeight?: number;
  debugMode?: boolean;
  dataSelectionOptions?: DataSelectionDataType[];
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
  if (!validateConfigSchema(configSettings, 'griddedGraph').isValid)
    return (
      <p
        className='undp-viz-typography'
        style={{
          textAlign: 'center',
          padding: '0.5rem',
          color: '#D12800',
          fontSize: '0.875rem',
        }}
      >
        {validateConfigSchema(configSettings, 'griddedGraph').err}
      </p>
    );
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
      dataFilters={configSettings.dataFilters}
      showCommonColorScale={configSettings.showCommonColorScale}
      debugMode={configSettings.debugMode}
      dataSelectionOptions={configSettings.dataSelectionOptions}
    />
  );
}
