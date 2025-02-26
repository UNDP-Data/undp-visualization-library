import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import min from 'lodash.min';
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
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';
import GraphEl from './GraphEl';
import { transformDataForGraph } from '../../Utils/transformData/transformDataForGraph';
import { getUniqValue } from '../../Utils/getUniqValue';
import { transformDataForAggregation } from '../../Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '../Elements/GraphHeader';
import { GraphFooter } from '../Elements/GraphFooter';
import { filterData } from '../../Utils/transformData/filterData';
import { ColorLegend } from '../Elements/ColorLegend';
import { checkIfNullOrUndefined } from '../../Utils/checkIfNullOrUndefined';
import { checkIfMultiple } from '../../Utils/checkIfMultiple';
import Checkbox from '../Elements/Checkbox';
import Radio from '../Elements/Radio';
import { getReactSelectTheme } from '../../Utils/getReactSelectTheme';
import { transformDefaultValue } from '../../Utils/transformDataForSelect';

interface Props {
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
  showCommonColorScale?: boolean;
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  minGraphHeight?: number;
  minGraphWidth?: number;
  debugMode?: boolean;
  mode?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
}

export function GriddedGraphs(props: Props) {
  const {
    graphSettings,
    dataSettings,
    filters,
    graphType,
    dataTransform,
    graphDataConfiguration,
    relativeHeightForGraph,
    noOfColumns,
    columnGridBy,
    dataFilters,
    showCommonColorScale,
    minGraphHeight,
    minGraphWidth,
    debugMode,
    dataSelectionOptions,
    advancedDataSelectionOptions,
    mode = 'light',
    readableHeader,
    noOfFiltersPerRow = 4,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [gridOption, setGridOption] = useState<(string | number)[]>([]);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const [graphConfig, setGraphConfig] = useState<
    GraphConfigurationDataType[] | undefined
  >(graphDataConfiguration);
  const [filterSettings, setFilterSettings] = useState<
    FilterSettingsDataType[]
  >([]);
  const [advancedGraphSettings, setAdvancedGraphSettings] = useState<
    GraphSettingsDataType | object
  >({});

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );

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
    setData(filteredData);
  }, [filteredData]);

  const fetchDataHandler = useCallback(async () => {
    if (dataSettings) {
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

        const gridValue = getUniqValue(d, columnGridBy) as (string | number)[];
        setGridOption(gridValue);
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
  }, [dataSettings, filters, debugMode]);
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);
  useEffect(() => {
    setGraphConfig(graphDataConfiguration);
  }, [graphDataConfiguration]);
  const handleFilterChange = useCallback((filter: string, values: any) => {
    setFilterSettings(prev =>
      prev.map(f => (f.filter === filter ? { ...f, value: values } : f)),
    );
  }, []);
  return (
    <div
      style={{
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
      aria-label={
        graphSettings?.ariaLabel ||
        `${
          graphSettings?.graphTitle
            ? `The graph shows ${graphSettings?.graphTitle}. `
            : ''
        }This is a gridded chart.${
          graphSettings?.graphDescription
            ? ` ${graphSettings?.graphDescription}`
            : ''
        }`
      }
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
        <div className='flex flex-col w-full gap-4 grow justify-between'>
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
          {data && gridOption.length > 0 ? (
            <>
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
                          onChange={(el: any) => {
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
                          theme={(theme: any) =>
                            getReactSelectTheme(theme, mode)
                          }
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
                            setAdvancedGraphSettings(el.graphSettings || {});
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
                            controlShouldRenderValue
                            onChange={(el: any) => {
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
                            theme={(theme: any) =>
                              getReactSelectTheme(theme, mode)
                            }
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
                          onChange={(el: any) => {
                            const newGraphConfig = {
                              columnId: el.map(
                                (item: any) => item.value,
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
                          theme={(theme: any) =>
                            getReactSelectTheme(theme, mode)
                          }
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
                        flexWrap: 'wrap',
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
                          onChange={(el: any) => {
                            handleFilterChange(d.filter, el);
                          }}
                          defaultValue={d.defaultValue}
                          theme={(theme: any) =>
                            getReactSelectTheme(theme, mode)
                          }
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
                            onChange={(el: any) => {
                              handleFilterChange(d.filter, el);
                            }}
                            defaultValue={d.defaultValue}
                            isRtl={graphSettings?.rtl}
                            theme={(theme: any) =>
                              getReactSelectTheme(theme, mode)
                            }
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
              {showCommonColorScale !== false &&
              graphSettings?.colorDomain &&
              graphSettings?.showColorScale !== false ? (
                <ColorLegend
                  rtl={graphSettings?.rtl}
                  language={graphSettings?.language}
                  width={graphSettings?.width}
                  colorLegendTitle={graphSettings?.colorLegendTitle}
                  colors={
                    (graphSettings?.colors as string[] | undefined) ||
                    UNDPColorModule[mode].categoricalColors.colors
                  }
                  colorDomain={graphSettings?.colorDomain}
                  showNAColor={
                    graphSettings?.showNAColor === undefined ||
                    graphSettings?.showNAColor === null
                      ? true
                      : graphSettings?.showNAColor
                  }
                  mode={mode}
                />
              ) : null}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  flexDirection: graphSettings?.rtl ? 'row-reverse' : 'row',
                  justifyContent: 'center',
                }}
              >
                {gridOption.map((el, i) => (
                  <div
                    key={i}
                    style={{
                      width: `calc(${
                        100 /
                        (noOfColumns ||
                          (min([4, gridOption.length || 0]) as number))
                      }% - ${
                        ((noOfColumns ||
                          (min([4, gridOption.length || 0]) as number)) -
                          1) /
                        (noOfColumns ||
                          (min([4, gridOption.length || 0]) as number))
                      }rem)`,
                      minWidth: checkIfNullOrUndefined(minGraphWidth)
                        ? '280px'
                        : `${minGraphWidth}px`,
                    }}
                  >
                    <GraphEl
                      graph={graphType}
                      graphDataConfiguration={graphConfig}
                      graphData={
                        transformDataForGraph(
                          dataTransform
                            ? transformDataForAggregation(
                                filterData(data, dataFilters || []).filter(
                                  (d: any) => d[columnGridBy] === el,
                                ),
                                dataTransform.keyColumn,
                                dataTransform.aggregationColumnsSetting,
                              )
                            : filterData(data, dataFilters || []).filter(
                                (d: any) => d[columnGridBy] === el,
                              ),
                          graphType,
                          graphConfig,
                        ) || []
                      }
                      debugMode={debugMode}
                      settings={{
                        ...graphSettings,
                        ...advancedGraphSettings,
                        width: undefined,
                        height: undefined,
                        relativeHeight: relativeHeightForGraph || 0.67,
                        minHeight: minGraphHeight,
                        graphTitle: `${el}`,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                        footNote: undefined,
                        source: undefined,
                        showColorScale:
                          graphSettings?.showColorScale === false
                            ? false
                            : showCommonColorScale === false,
                      }}
                      readableHeader={readableHeader || []}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='undp-viz-loader' />
          )}
          {graphSettings?.source || graphSettings?.footNote ? (
            <GraphFooter
              rtl={graphSettings?.rtl}
              language={graphSettings?.language}
              sources={graphSettings?.sources}
              footNote={graphSettings?.footNote}
              width={graphSettings?.width}
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
