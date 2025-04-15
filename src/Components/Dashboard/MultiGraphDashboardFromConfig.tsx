import { useEffect, useState } from 'react';
import { P, Spinner } from '@undp-data/undp-design-system-react';
import {
  ClassNameObject,
  DashboardLayoutDataType,
  DataFilterDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
  StyleObject,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { MultiGraphDashboard } from './MultiGraphDashboard';
import { validateConfigSchema } from '@/Utils/validateSchema';

interface ConfigObject {
  dashboardID?: string;
  dashboardLayout: DashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  filterPosition?: 'top' | 'side';
  debugMode?: boolean;
  theme?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataFilters?: DataFilterDataType[];
  uiMode?: 'light' | 'normal';
  graphStyles?: StyleObject;
  graphClassNames?: ClassNameObject;
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
  if (!configSettings)
    return (
      <div className='w-full flex justify-center p-4'>
        <Spinner />
      </div>
    );
  const validationResult = validateConfigSchema(
    configSettings,
    'multiGraphDashboard',
  );
  if (!validationResult.isValid)
    return (
      <P
        size='sm'
        marginBottom='none'
        className='p-2 text-center text-accent-dark-red dark:text-accent-red'
      >
        {validationResult.err}
      </P>
    );
  return (
    <MultiGraphDashboard
      dashboardID={configSettings.dashboardID}
      dashboardLayout={configSettings.dashboardLayout}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      debugMode={configSettings.debugMode}
      theme={configSettings.theme}
      readableHeader={configSettings.readableHeader}
      dataFilters={configSettings.dataFilters}
      noOfFiltersPerRow={configSettings.noOfFiltersPerRow}
      filterPosition={configSettings.filterPosition}
      uiMode={configSettings.uiMode}
      graphStyles={configSettings.graphStyles}
      graphClassNames={configSettings.graphClassNames}
    />
  );
}
