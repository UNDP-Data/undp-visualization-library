import { useEffect, useState } from 'react';
import { P } from '@undp-data/undp-design-system-react';
import {
  AdvancedDataSelectionDataType,
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphType,
} from '../../Types';
import { fetchAndParseJSON } from '../../Utils/fetchAndParseData';
import { SingleGraphDashboard } from './SingleGraphDashboard';
import { validateConfigSchema } from '../../Utils/validateSchema';
import { UNDPColorModule } from '../ColorPalette';

interface ConfigObject {
  graphSettings?: any;
  dataSettings?: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: GraphType;
  noOfFiltersPerRow?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  debugMode?: boolean;
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  mode?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
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
  const validationResult = validateConfigSchema(
    configSettings,
    'singleGraphDashboard',
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
    <SingleGraphDashboard
      graphSettings={configSettings.graphSettings}
      dataSettings={configSettings.dataSettings}
      filters={configSettings.filters}
      graphType={configSettings.graphType}
      dataTransform={configSettings.dataTransform}
      graphDataConfiguration={configSettings.graphDataConfiguration}
      dataFilters={configSettings.dataFilters}
      debugMode={configSettings.debugMode}
      dataSelectionOptions={configSettings.dataSelectionOptions}
      advancedDataSelectionOptions={configSettings.advancedDataSelectionOptions}
      mode={configSettings.mode}
      readableHeader={configSettings.readableHeader}
      noOfFiltersPerRow={configSettings.noOfFiltersPerRow}
    />
  );
}
