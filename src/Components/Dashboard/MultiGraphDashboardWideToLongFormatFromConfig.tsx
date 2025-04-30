import { useEffect, useState } from 'react';
import { P, Spinner } from '@undp/design-system-react';

import { MultiGraphDashboardWideToLongFormat } from './MultiGraphDashboardWideToLongFormat';

import {
  ClassNameObject,
  DashboardFromWideToLongFormatLayoutDataType,
  DataFilterDataType,
  DataSettingsWideToLongDataType,
  StyleObject,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { validateConfigSchema } from '@/Utils/validateSchema';

interface ConfigObject {
  dashboardID?: string;
  dashboardLayout: DashboardFromWideToLongFormatLayoutDataType;
  dataSettings: DataSettingsWideToLongDataType;
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

export function MultiGraphDashboardWideToLongFormatFromConfig(props: Props) {
  const { config } = props;
  const [configSettings, setConfigSettings] = useState<ConfigObject | undefined>(undefined);

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
  if (!configSettings)
    return (
      <div className='w-full flex justify-center p-4'>
        <Spinner />
      </div>
    );
  const validationResult = validateConfigSchema(
    configSettings,
    'multiGraphDashboardWideToLongFormat',
  );
  if (!validationResult.isValid)
    return (
      <P
        size='sm'
        marginBottom='none'
        className='p-2 text-center text-accent-dark-red dark:text-accent-red'
      >
        {validateConfigSchema(configSettings, 'multiGraphDashboardWideToLongFormat').err}
      </P>
    );
  return (
    <MultiGraphDashboardWideToLongFormat
      dashboardID={configSettings.dashboardID}
      dashboardLayout={configSettings.dashboardLayout}
      dataSettings={configSettings.dataSettings}
      debugMode={configSettings.debugMode}
      theme={configSettings.theme}
      readableHeader={configSettings.readableHeader}
      dataFilters={configSettings.dataFilters}
      uiMode={configSettings.uiMode}
      graphStyles={configSettings.graphStyles}
      graphClassNames={configSettings.graphClassNames}
    />
  );
}
