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
import { GriddedGraphs } from './GriddedGraphs';
import { validateConfigSchema } from '../../Utils/validateSchema';
import { UNDPColorModule } from '../ColorPalette';

interface ConfigObject {
  noOfColumns?: number;
  columnGridBy: string;
  graphSettings?: any;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  graphType: Exclude<
    GraphType,
    'geoHubMap' | 'geoHubCompareMap' | 'geoHubMapWithLayerSelection'
  >;
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

export function GriddedGraphsFromConfig(props: Props) {
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

  const validationResult = validateConfigSchema(configSettings, 'griddedGraph');
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
      advancedDataSelectionOptions={configSettings.advancedDataSelectionOptions}
      mode={configSettings.mode}
      readableHeader={configSettings.readableHeader}
      noOfFiltersPerRow={configSettings.noOfFiltersPerRow}
    />
  );
}
