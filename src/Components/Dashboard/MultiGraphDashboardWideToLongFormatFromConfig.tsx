import { useEffect, useState } from 'react';
import {
  DashboardFromWideToLongFormatLayoutDataType,
  DataFilterDataType,
  DataSettingsWideToLongDataType,
} from '../../Types';
import { fetchAndParseJSON } from '../../Utils/fetchAndParseData';
import { validateConfigSchema } from '../../Utils/validateSchema';
import { UNDPColorModule } from '../ColorPalette';
import { MultiGraphDashboardWideToLongFormat } from './MultiGraphDashboardWideToLongFormat';

interface ConfigObject {
  dashboardId?: string;
  dashboardLayout: DashboardFromWideToLongFormatLayoutDataType;
  dataSettings: DataSettingsWideToLongDataType;
  debugMode?: boolean;
  mode?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataFilters?: DataFilterDataType[];
}

interface Props {
  config: string | ConfigObject;
}

export function MultiGraphDashboardWideToLongFormatFromConfig(props: Props) {
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
  if (
    !validateConfigSchema(configSettings, 'multiGraphDashboardWideToLongFormat')
      .isValid
  )
    return (
      <p
        className='undp-viz-typography'
        style={{
          textAlign: 'center',
          padding: '0.5rem',
          color: UNDPColorModule[configSettings.mode || 'light'].alerts.darkRed,
          fontSize: '0.875rem',
        }}
      >
        {
          validateConfigSchema(
            configSettings,
            'multiGraphDashboardWideToLongFormat',
          ).err
        }
      </p>
    );
  return (
    <MultiGraphDashboardWideToLongFormat
      dashboardId={configSettings.dashboardId}
      dashboardLayout={configSettings.dashboardLayout}
      dataSettings={configSettings.dataSettings}
      debugMode={configSettings.debugMode}
      mode={configSettings.mode}
      readableHeader={configSettings.readableHeader}
      dataFilters={configSettings.dataFilters}
    />
  );
}
