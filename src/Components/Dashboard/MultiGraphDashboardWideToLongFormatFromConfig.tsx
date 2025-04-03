import { useEffect, useState } from 'react';
import { P, Spinner } from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
  ClassNameObject,
  DashboardFromWideToLongFormatLayoutDataType,
  DataFilterDataType,
  DataSettingsWideToLongDataType,
  StyleObject,
} from '@/Types';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { validateConfigSchema } from '@/Utils/validateSchema';
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
  uiMode?: 'light' | 'normal';
  styles?: StyleObject;
  graphStyles?: StyleObject;
  classNames?: ClassNameObject;
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
      uiMode={configSettings.uiMode}
      styles={configSettings.styles}
      graphStyles={configSettings.graphStyles}
      classNames={configSettings.classNames}
    />
  );
}
