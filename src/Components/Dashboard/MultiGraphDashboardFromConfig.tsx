import { useEffect, useState } from 'react';
import { P } from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
  DashboardLayoutDataType,
  DataFilterDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
} from '../../Types';
import { fetchAndParseJSON } from '../../Utils/fetchAndParseData';
import { MultiGraphDashboard } from './MultiGraphDashboard';
import { validateConfigSchema } from '../../Utils/validateSchema';
import { UNDPColorModule } from '../ColorPalette';

interface ConfigObject {
  dashboardId?: string;
  dashboardLayout: DashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  filterPosition?: 'top' | 'side';
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

export function MultiGraphDashboardFromConfig(props: Props) {
  const { config } = props;
  const [configSettings, setConfigSettings] = useState<
    ConfigObject | undefined
  >(undefined);
  useEffect(() => {
    const fetchData = async () => {
      if (typeof config === 'string') {
        const data = await fetchAndParseJSON(config);
        setConfigSettings(data);
      } else {
        setConfigSettings(config);
      }
    };
    fetchData();
  }, [config]);
  if (!configSettings) return <div className='undp-viz-loader' />;
  const validationResult = validateConfigSchema(
    configSettings,
    'multiGraphDashboard',
  );
  if (!validationResult.isValid)
    return (
      <P
        className='text-sm p-2 text-center m-0 mb-0 md:text-sm md:m-0 md:mb-0'
        style={{
          color: UNDPColorModule[configSettings.mode || 'light'].alerts.darkRed,
        }}
      >
        {validationResult.err}
      </P>
    );
  return (
    <MultiGraphDashboard
      dashboardId={configSettings.dashboardId}
      dashboardLayout={configSettings.dashboardLayout}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      debugMode={configSettings.debugMode}
      mode={configSettings.mode}
      readableHeader={configSettings.readableHeader}
      dataFilters={configSettings.dataFilters}
      noOfFiltersPerRow={configSettings.noOfFiltersPerRow}
      filterPosition={configSettings.filterPosition}
      graphBackgroundColor={configSettings.graphBackgroundColor}
      graphBackgroundStyle={configSettings.graphBackgroundStyle}
    />
  );
}
