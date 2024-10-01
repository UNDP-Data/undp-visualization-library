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
import { SingleGraphDashboard } from './SingleGraphDashboard';
import { validateConfigSchema } from '../../Utils/validateSchema';

interface ConfigObject {
  graphSettings?: any;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: Exclude<GraphType, 'geoHubMap' | 'geoHubCompareMap'>;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  dataFilter?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  debugMode?: boolean;
}

interface Props {
  config: string | ConfigObject;
}

export function SingleGraphDashboardFromConfig(props: Props) {
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
  if (!validateConfigSchema(configSettings, 'singleGraphDashboard').isValid)
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
        {validateConfigSchema(configSettings, 'singleGraphDashboard').err}
      </p>
    );
  return (
    <SingleGraphDashboard
      graphSettings={configSettings.graphSettings}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      graphType={configSettings.graphType}
      dataTransform={configSettings.dataTransform}
      graphDataConfiguration={configSettings.graphDataConfiguration}
      dataFilter={configSettings.dataFilter}
      debugMode={configSettings.debugMode}
    />
  );
}
