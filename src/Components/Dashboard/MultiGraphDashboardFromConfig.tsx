import { useEffect, useState } from 'react';
import {
  DashboardLayoutDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
} from '../../Types';
import { fetchAndParseJSON } from '../../Utils/fetchAndParseData';
import { MultiGraphDashboard } from './MultiGraphDashboard';
import { validateConfigSchema } from '../../Utils/validateSchema';

interface ConfigObject {
  dashboardId?: string;
  dashboardLayout: DashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  debugMode?: boolean;
}

interface Props {
  config: string | ConfigObject;
}

export function MultiGraphDashboardFromConfig(props: Props) {
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
  if (!validateConfigSchema(configSettings, 'multiGraphDashboard').isValid)
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
        {validateConfigSchema(configSettings, 'multiGraphDashboard').err}
      </p>
    );
  return (
    <MultiGraphDashboard
      dashboardId={configSettings.dashboardId}
      dashboardLayout={configSettings.dashboardLayout}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      debugMode={configSettings.debugMode}
    />
  );
}
