import React, { useEffect, useState, useMemo, memo } from 'react';
import {
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
  mode?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
}

interface Props {
  config: string | ConfigObject;
}

export const GriddedGraphsFromConfig = memo((props: Props) => {
  const { config } = props;
  const [configSettings, setConfigSettings] = useState<
    ConfigObject | undefined
  >(undefined);

  // Memoized data fetching effect
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const settings =
          typeof config === 'string' ? await fetchAndParseJSON(config) : config;
        setConfigSettings(settings);
      } catch (error) {
        console.error('Error loading configuration:', error);
        setConfigSettings(undefined);
      }
    };

    loadConfig();
  }, [config]);

  const validationResult = useMemo(() => {
    return configSettings
      ? validateConfigSchema(configSettings, 'griddedGraph')
      : { isValid: false, err: 'Configuration not loaded' };
  }, [configSettings]);

  const griddedGraphProps = useMemo(() => {
    if (!configSettings) return null;

    return {
      noOfColumns: configSettings.noOfColumns,
      columnGridBy: configSettings.columnGridBy,
      graphSettings: configSettings.graphSettings,
      dataSettings: configSettings.dataSettings,
      filters: configSettings.filters,
      graphType: configSettings.graphType,
      relativeHeightForGraph: configSettings.relativeHeightForGraph,
      minGraphHeight: configSettings.minGraphHeight,
      minGraphWidth: configSettings.minGraphWidth,
      dataTransform: configSettings.dataTransform,
      graphDataConfiguration: configSettings.graphDataConfiguration,
      dataFilters: configSettings.dataFilters,
      showCommonColorScale: configSettings.showCommonColorScale,
      debugMode: configSettings.debugMode,
      dataSelectionOptions: configSettings.dataSelectionOptions,
      mode: configSettings.mode,
      readableHeader: configSettings.readableHeader,
      noOfFiltersPerRow: configSettings.noOfFiltersPerRow,
    };
  }, [configSettings]);

  // Render loading state
  if (!configSettings) {
    return <div className='undp-viz-loader' />;
  }

  // Render validation error
  if (!validationResult.isValid) {
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
        {validationResult.err}
      </p>
    );
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return griddedGraphProps ? <GriddedGraphs {...griddedGraphProps} /> : null;
});

// Add display name for better debugging
GriddedGraphsFromConfig.displayName = 'GriddedGraphsFromConfig';
