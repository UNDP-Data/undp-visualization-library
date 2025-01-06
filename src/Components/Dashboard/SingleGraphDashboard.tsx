import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  AdvancedDataSelectionDataType,
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphSettingsDataType,
  GraphType,
} from '../../Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '../../Utils/fetchAndParseData';
import { UNDPColorModule } from '../ColorPalette';
import { transformDataForGraph } from '../../Utils/transformData/transformDataForGraph';
import { getUniqValue } from '../../Utils/getUniqValue';
import { transformDataForAggregation } from '../../Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '../Elements/GraphHeader';
import { filterData } from '../../Utils/transformData/filterData';
import GraphEl from './GraphEl';
import { checkIfMultiple } from '../../Utils/checkIfMultiple';
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';
import Checkbox from '../Elements/Checkbox';
import Radio from '../Elements/Radio';
import { GraphList } from '../../Utils/getGraphList';
import { getReactSelectTheme } from '../../Utils/getReactSelectTheme';
import { transformDefaultValue } from '../../Utils/transformDataForSelect';

interface Props {
  graphSettings?: any;
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataSettings?: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  graphType: GraphType;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  debugMode?: boolean;
  mode?: 'dark' | 'light';
  updateFilters?: (_d: string) => void;
}

const addMinAndMax = (config: GraphConfigurationDataType[]) => {
  if (
    config.findIndex(d => d.chartConfigId === 'yMin') !== -1 &&
    config.findIndex(d => d.chartConfigId === 'yMax') !== -1
  )
    return config;
  const configTemp = [...config];
  if (config.findIndex(d => d.chartConfigId === 'yMin') === -1) {
    configTemp.push({
      chartConfigId: 'yMin',
      columnId: `${
        config[config.findIndex(d => d.chartConfigId === 'y')].columnId
      }Min`,
    });
  }
  if (config.findIndex(d => d.chartConfigId === 'yMax') === -1) {
    configTemp.push({
      chartConfigId: 'yMax',
      columnId: `${
        config[config.findIndex(d => d.chartConfigId === 'y')].columnId
      }Max`,
    });
  }
  return configTemp;
};

export function SingleGraphDashboard(props: Props) {
  const {
    graphSettings,
    dataSettings,
    filters,
    graphType,
    dataTransform,
    graphDataConfiguration,
    dataFilters,
    debugMode,
    dataSelectionOptions,
    advancedDataSelectionOptions,
    mode = 'light',
    readableHeader,
    noOfFiltersPerRow = 4,
    updateFilters,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [graphConfig, setGraphConfig] = useState<
    GraphConfigurationDataType[] | undefined
  >(graphDataConfiguration);
  const [advancedGraphSettings, setAdvancedGraphSettings] = useState<
    GraphSettingsDataType | object
  >({});
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const [filterSettings, setFilterSettings] = useState<
    FilterSettingsDataType[]
  >([]);

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );
  const fetchDataHandler = useCallback(async () => {
    if (
      graphType !== 'geoHubMap' &&
      graphType !== 'geoHubCompareMap' &&
      graphType !== 'geoHubMapWithLayerSelection' &&
      dataSettings
    ) {
      try {
        const fetchData = dataSettings.dataURL
          ? typeof dataSettings.dataURL === 'string'
            ? dataSettings.fileType === 'json'
              ? fetchAndParseJSON(
                  dataSettings.dataURL,
                  dataSettings.columnsToArray,
                  dataSettings.dataTransformation,
                  debugMode,
                )
              : dataSettings.fileType === 'api'
              ? fetchAndTransformDataFromAPI(
                  dataSettings.dataURL,
                  dataSettings.apiHeaders,
                  dataSettings.columnsToArray,
                  dataSettings.dataTransformation,
                  debugMode,
                )
              : fetchAndParseCSV(
                  dataSettings.dataURL,
                  dataSettings.dataTransformation,
                  dataSettings.columnsToArray,
                  debugMode,
                  dataSettings.delimiter,
                  true,
                )
            : fetchAndParseMultipleDataSources(
                dataSettings.dataURL,
                dataSettings.idColumnTitle,
              )
          : transformColumnsToArray(
              dataSettings.data,
              dataSettings.columnsToArray,
            );

        const d = await fetchData;
        setDataFromFile(d);

        // Optimize filter settings generation
        const newFilterSettings = (filters || []).map(el => ({
          filter: el.column,
          label: el.label || `Filter by ${el.column}`,
          singleSelect: el.singleSelect,
          clearable: el.clearable,
          defaultValue: transformDefaultValue(el.defaultValue),
          value: transformDefaultValue(el.defaultValue),
          availableValues: getUniqValue(d, el.column)
            .filter(v => !el.excludeValues?.includes(`${v}`))
            .map(v => ({ value: v, label: v })),
          allowSelectAll: el.allowSelectAll,
          width: el.width,
        }));

        setFilterSettings(newFilterSettings);
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    }
  }, [dataSettings, graphType, filters, debugMode]);
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);

  const filteredData = useMemo(() => {
    if (!dataFromFile || filterSettings.length === 0) return dataFromFile;
    const result = dataFromFile.filter((item: any) =>
      filterSettings.every(filter =>
        filter.value && flattenDeep([filter.value]).length > 0
          ? intersection(
              flattenDeep([item[filter.filter]]),
              flattenDeep([filter.value]).map(el => el.value),
            ).length > 0
          : true,
      ),
    );
    return result;
  }, [filterSettings, dataFromFile]);

  useEffect(() => {
    if (
      graphType !== 'geoHubMap' &&
      graphType !== 'geoHubCompareMap' &&
      graphType !== 'geoHubMapWithLayerSelection' &&
      dataFromFile
    ) {
      setData(filteredData);
    }
  }, [filteredData, graphType, dataFromFile]);

  useEffect(() => {
    setGraphConfig(graphDataConfiguration);
  }, [graphDataConfiguration]);

  const handleFilterChange = useCallback((filter: string, values: any) => {
    setFilterSettings(prev =>
      prev.map(f => (f.filter === filter ? { ...f, value: values } : f)),
    );
  }, []);

  const graphData = useMemo(() => {
    if (!data) return undefined;
    const config =
      graphType === 'lineChartWithConfidenceInterval' && graphConfig
        ? addMinAndMax(graphConfig)
        : graphConfig;
    const d =
      graphType !== 'geoHubMap' &&
      graphType !== 'geoHubCompareMap' &&
      graphType !== 'geoHubMapWithLayerSelection'
        ? transformDataForGraph(
            dataTransform
              ? transformDataForAggregation(
                  filterData(data, dataFilters || []),
                  dataTransform.keyColumn,
                  dataTransform.aggregationColumnsSetting,
                )
              : filterData(data, dataFilters || []),
            graphType,
            config,
          )
        : undefined;
    return d;
  }, [graphType, graphConfig, data, dataFilters, dataTransform]);
  if (
    !dataSettings &&
    graphType !== 'geoHubMap' &&
    graphType !== 'geoHubCompareMap' &&
    graphType !== 'geoHubMapWithLayerSelection'
  )
    return (
      <p
        className={
          graphSettings?.rtl
            ? `undp-viz-typography-${
                graphSettings?.language || 'ar'
              } undp-viz-typography`
            : 'undp-viz-typography'
        }
        style={{
          textAlign: 'center',
          padding: '0.5rem',
          color: UNDPColorModule[mode].alerts.darkRed,
          fontSize: '0.875rem',
        }}
      >
        Please make sure either `dataSettings` props are present as they are
        required for data.
      </p>
    );
  return (
    <div
      style={{
        ...(graphSettings?.backgroundStyle || {}),
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        width: graphSettings?.width ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: graphSettings?.width ? 0 : 1,
        backgroundColor: !graphSettings?.backgroundColor
          ? 'transparent'
          : graphSettings?.backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : graphSettings?.backgroundColor,
      }}
      id={graphSettings?.graphId}
      ref={graphParentDiv}
    >
      <div
        style={{
          padding: graphSettings?.backgroundColor
            ? graphSettings?.padding || '1rem'
            : graphSettings?.padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '1rem',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {data ||
          GraphList.filter(el => el.geoHubMapPresentation)
            .map(el => el.graphID)
            .indexOf(graphType) !== -1 ? (
            <>
              {graphSettings?.graphTitle ||
              graphSettings?.graphDescription ||
              graphSettings?.graphDownload ||
              graphSettings?.dataDownload ? (
                <GraphHeader
                  rtl={graphSettings?.rtl}
                  language={graphSettings?.language}
                  graphTitle={graphSettings?.graphTitle}
                  graphDescription={graphSettings?.graphDescription}
                  width={graphSettings?.width}
                  graphDownload={
                    graphSettings?.graphDownload
                      ? graphParentDiv.current
                      : undefined
                  }
                  dataDownload={
                    graphSettings?.dataDownload && data
                      ? data.length > 0
                        ? data
                        : null
                      : null
                  }
                  mode={mode}
                />
              ) : null}
              {filterSettings.length !== 0 ||
              (dataSelectionOptions || []).length !== 0 ||
              (advancedDataSelectionOptions || []).length !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexDirection: graphSettings?.rtl ? 'row-reverse' : 'row',
                  }}
                >
                  {advancedDataSelectionOptions?.map((d, i) => (
                    <div
                      style={{
                        width:
                          d.width ||
                          `calc(${100 / noOfFiltersPerRow}% - ${
                            (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                          }rem)`,
                        flexGrow: 1,
                        flexShrink: d.ui !== 'radio' ? 0 : 1,
                        minWidth: '240px',
                      }}
                      key={i}
                    >
                      <p
                        className={
                          graphSettings?.rtl
                            ? `undp-viz-typography-${
                                graphSettings?.language || 'ar'
                              } undp-viz-typography`
                            : 'undp-viz-typography'
                        }
                        style={{
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                          textAlign: graphSettings?.rtl ? 'right' : 'left',
                          color: UNDPColorModule[mode].grays.black,
                        }}
                      >
                        {d.label || `Visualize ${d.chartConfigId} by`}
                      </p>
                      {d.ui !== 'radio' ? (
                        <Select
                          className={
                            graphSettings?.rtl
                              ? `undp-viz-select-${
                                  graphSettings?.language || 'ar'
                                } undp-viz-select`
                              : 'undp-viz-select'
                          }
                          options={d.options}
                          isClearable={false}
                          isRtl={graphSettings?.rtl}
                          isSearchable
                          controlShouldRenderValue
                          defaultValue={d.defaultValue || d.options[0]}
                          onChange={el => {
                            const newGraphConfig = {
                              columnId: el?.value as string[],
                              chartConfigId: d.chartConfigId,
                            };
                            const updatedConfig = graphConfig?.map(item =>
                              item.chartConfigId ===
                              newGraphConfig.chartConfigId
                                ? newGraphConfig
                                : item,
                            );
                            setAdvancedGraphSettings(el?.graphSettings || {});
                            setGraphConfig(updatedConfig);
                          }}
                          theme={theme => getReactSelectTheme(theme, mode)}
                        />
                      ) : (
                        <Radio
                          rtl={graphSettings?.rtl}
                          options={d.options}
                          language={graphSettings?.language}
                          defaultValue={
                            d.defaultValue?.label || d.options[0].label
                          }
                          onChange={el => {
                            const newGraphConfig = {
                              columnId: el.value as string[],
                              chartConfigId: d.chartConfigId,
                            };
                            const updatedConfig = graphConfig?.map(item =>
                              item.chartConfigId ===
                              newGraphConfig.chartConfigId
                                ? newGraphConfig
                                : item,
                            );
                            setAdvancedGraphSettings(el?.graphSettings || {});
                            setGraphConfig(updatedConfig);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  {dataSelectionOptions?.map((d, i) => (
                    <div
                      style={{
                        width:
                          d.width ||
                          `calc(${100 / noOfFiltersPerRow}% - ${
                            (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                          }rem)`,
                        flexGrow: 1,
                        flexShrink: d.ui !== 'radio' ? 0 : 1,
                        minWidth: '240px',
                      }}
                      key={i}
                    >
                      <p
                        className={
                          graphSettings?.rtl
                            ? `undp-viz-typography-${
                                graphSettings?.language || 'ar'
                              } undp-viz-typography`
                            : 'undp-viz-typography'
                        }
                        style={{
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                          textAlign: graphSettings?.rtl ? 'right' : 'left',
                          color: UNDPColorModule[mode].grays.black,
                        }}
                      >
                        {d.label || `Visualize ${d.chartConfigId} by`}
                      </p>
                      {!checkIfMultiple(d.chartConfigId, graphConfig || []) ? (
                        d.ui !== 'radio' ? (
                          <Select
                            className={
                              graphSettings?.rtl
                                ? `undp-viz-select-${
                                    graphSettings?.language || 'ar'
                                  } undp-viz-select`
                                : 'undp-viz-select'
                            }
                            options={d.allowedColumnIds}
                            isClearable={false}
                            isRtl={graphSettings?.rtl}
                            isSearchable
                            controlShouldRenderValue
                            defaultValue={
                              graphDataConfiguration
                                ? d.allowedColumnIds[
                                    d.allowedColumnIds.findIndex(
                                      j =>
                                        j.value ===
                                        (graphDataConfiguration[
                                          graphDataConfiguration.findIndex(
                                            el =>
                                              el.chartConfigId ===
                                              d.chartConfigId,
                                          )
                                        ].columnId as string),
                                    )
                                  ]
                                : undefined
                            }
                            onChange={el => {
                              const newGraphConfig = {
                                columnId: el?.value as string,
                                chartConfigId: d.chartConfigId,
                              };
                              const updatedConfig = graphConfig?.map(item =>
                                item.chartConfigId ===
                                newGraphConfig.chartConfigId
                                  ? newGraphConfig
                                  : item,
                              );
                              setAdvancedGraphSettings(el?.graphSettings || {});
                              setGraphConfig(updatedConfig);
                            }}
                            theme={theme => getReactSelectTheme(theme, mode)}
                          />
                        ) : (
                          <Radio
                            rtl={graphSettings?.rtl}
                            options={d.allowedColumnIds}
                            language={graphSettings?.language}
                            defaultValue={
                              graphDataConfiguration
                                ? d.allowedColumnIds[
                                    d.allowedColumnIds.findIndex(
                                      j =>
                                        j.value ===
                                        (graphDataConfiguration[
                                          graphDataConfiguration.findIndex(
                                            el =>
                                              el.chartConfigId ===
                                              d.chartConfigId,
                                          )
                                        ].columnId as string),
                                    )
                                  ].label
                                : ''
                            }
                            onChange={el => {
                              const newGraphConfig = {
                                columnId: el.value,
                                chartConfigId: d.chartConfigId,
                              };
                              const updatedConfig = graphConfig?.map(item =>
                                item.chartConfigId ===
                                newGraphConfig.chartConfigId
                                  ? newGraphConfig
                                  : item,
                              );
                              setAdvancedGraphSettings(el.graphSettings || {});
                              setGraphConfig(updatedConfig);
                            }}
                          />
                        )
                      ) : d.ui !== 'radio' ? (
                        <Select
                          className={
                            graphSettings?.rtl
                              ? `undp-viz-select-${
                                  graphSettings?.language || 'ar'
                                } undp-viz-select`
                              : 'undp-viz-select'
                          }
                          options={d.allowedColumnIds}
                          isMulti
                          isSearchable
                          controlShouldRenderValue
                          defaultValue={
                            graphDataConfiguration
                              ? (
                                  graphDataConfiguration[
                                    graphDataConfiguration.findIndex(
                                      el =>
                                        el.chartConfigId === d.chartConfigId,
                                    )
                                  ].columnId as string[]
                                ).map(
                                  el =>
                                    d.allowedColumnIds[
                                      d.allowedColumnIds.findIndex(
                                        j => j.value === el,
                                      )
                                    ],
                                )
                              : undefined
                          }
                          filterOption={createFilter(filterConfig)}
                          onChange={el => {
                            const newGraphConfig = {
                              columnId: (el || []).map(
                                item => item.value,
                              ) as string[],
                              chartConfigId: d.chartConfigId,
                            };
                            const updatedConfig = graphConfig?.map(item =>
                              item.chartConfigId ===
                              newGraphConfig.chartConfigId
                                ? newGraphConfig
                                : item,
                            );
                            setGraphConfig(updatedConfig);
                          }}
                          isRtl={graphSettings?.rtl}
                          theme={theme => getReactSelectTheme(theme, mode)}
                        />
                      ) : (
                        <Checkbox
                          rtl={graphSettings?.rtl}
                          options={d.allowedColumnIds}
                          language={graphSettings?.language}
                          defaultValue={
                            graphDataConfiguration
                              ? (
                                  graphDataConfiguration[
                                    graphDataConfiguration.findIndex(
                                      el =>
                                        el.chartConfigId === d.chartConfigId,
                                    )
                                  ].columnId as string[]
                                )
                                  .map(
                                    el =>
                                      d.allowedColumnIds[
                                        d.allowedColumnIds.findIndex(
                                          j => j.value === el,
                                        )
                                      ],
                                  )
                                  .map(el => el.value)
                              : []
                          }
                          onChange={el => {
                            const newGraphConfig = {
                              columnId: el || [],
                              chartConfigId: d.chartConfigId,
                            };
                            const updatedConfig = graphConfig?.map(item =>
                              item.chartConfigId ===
                              newGraphConfig.chartConfigId
                                ? newGraphConfig
                                : item,
                            );
                            setGraphConfig(updatedConfig);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  {filterSettings?.map((d, i) => (
                    <div
                      style={{
                        width:
                          d.width ||
                          `calc(${100 / noOfFiltersPerRow}% - ${
                            (noOfFiltersPerRow - 1) / noOfFiltersPerRow
                          }rem)`,
                        flexGrow: 1,
                        flexShrink: 0,
                        minWidth: '240px',
                      }}
                      key={i}
                    >
                      <p
                        className={
                          graphSettings?.rtl
                            ? `undp-viz-typography-${
                                graphSettings?.language || 'ar'
                              } undp-viz-typography`
                            : 'undp-viz-typography'
                        }
                        style={{
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                          textAlign: graphSettings?.rtl ? 'right' : 'left',
                          color: UNDPColorModule[mode].grays.black,
                        }}
                      >
                        {d.label}
                      </p>
                      {d.singleSelect ? (
                        <Select
                          className={
                            graphSettings?.rtl
                              ? `undp-viz-select-${
                                  graphSettings?.language || 'ar'
                                } undp-viz-select`
                              : 'undp-viz-select'
                          }
                          options={d.availableValues}
                          isClearable={
                            d.clearable === undefined ? true : d.clearable
                          }
                          isRtl={graphSettings?.rtl}
                          isSearchable
                          controlShouldRenderValue
                          filterOption={createFilter(filterConfig)}
                          onChange={el => {
                            handleFilterChange(d.filter, el);
                          }}
                          value={d.value}
                          defaultValue={d.defaultValue}
                          theme={theme => getReactSelectTheme(theme, mode)}
                        />
                      ) : (
                        <>
                          <Select
                            className={
                              graphSettings?.rtl
                                ? `undp-viz-select-${
                                    graphSettings?.language || 'ar'
                                  } undp-viz-select`
                                : 'undp-viz-select'
                            }
                            options={d.availableValues}
                            isMulti
                            isClearable={
                              d.clearable === undefined ? true : d.clearable
                            }
                            isSearchable
                            controlShouldRenderValue
                            filterOption={createFilter(filterConfig)}
                            onChange={el => {
                              handleFilterChange(d.filter, el);
                            }}
                            value={d.value}
                            defaultValue={d.defaultValue}
                            isRtl={graphSettings?.rtl}
                            theme={theme => getReactSelectTheme(theme, mode)}
                          />
                          {d.allowSelectAll ? (
                            <button
                              type='button'
                              style={{
                                backgroundColor: 'transparent',
                                border: 0,
                                padding: 0,
                                marginTop: '0.5rem',
                                color:
                                  UNDPColorModule[mode].primaryColors[
                                    'blue-600'
                                  ],
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                handleFilterChange(d.filter, d.availableValues);
                              }}
                            >
                              Select all options
                            </button>
                          ) : null}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
              <GraphEl
                graph={graphType}
                graphData={graphData}
                graphDataConfiguration={graphConfig}
                debugMode={debugMode}
                readableHeader={readableHeader || []}
                updateFilters={updateFilters}
                settings={
                  graphSettings
                    ? {
                        ...graphSettings,
                        ...advancedGraphSettings,
                        backgroundStyle: undefined,
                        graphTitle: undefined,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                        mode,
                      }
                    : ({
                        ...advancedGraphSettings,
                        graphTitle: undefined,
                        backgroundStyle: undefined,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                        mode,
                      } as GraphSettingsDataType)
                }
              />
            </>
          ) : (
            <div>
              <div className='undp-viz-loader' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
