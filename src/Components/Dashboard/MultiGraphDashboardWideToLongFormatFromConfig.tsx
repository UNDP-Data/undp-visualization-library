import { useEffect, useState } from 'react';
import { P } from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
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
  graphBackgroundStyle?: BackgroundStyleDataType;
  graphBackgroundColor?: string | boolean;
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
  const validationResult = validateConfigSchema(
    configSettings,
    'multiGraphDashboardWideToLongFormat',
  );
  if (!validationResult.isValid)
    return (
      <P
        size='sm'
        marginBottom='none'
        className='p-2 text-center'
        style={{
          color: UNDPColorModule[configSettings.mode || 'light'].alerts.darkRed,
        }}
      >
        {
          validateConfigSchema(
            configSettings,
            'multiGraphDashboardWideToLongFormat',
          ).err
        }
      </P>
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
      graphBackgroundColor={configSettings.graphBackgroundColor}
      graphBackgroundStyle={configSettings.graphBackgroundStyle}
    />
  );
}
