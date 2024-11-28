import { useEffect, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import min from 'lodash.min';
import {
  AggregationSettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphType,
  SelectedFilterDataType,
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
    mode,
    readableHeader,
    noOfFiltersPerRow,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [gridOption, setGridOption] = useState<(string | number)[]>([]);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const [graphConfig, setGraphConfig] = useState<
    GraphConfigurationDataType[] | undefined
  >(graphDataConfiguration);
  const [selectedFilters, setSelectedFilters] = useState<
    SelectedFilterDataType[]
  >(
    filters?.map(d => ({
      filter: d.column,
      value: d.defaultValue
        ? typeof d.defaultValue === 'string'
          ? [d.defaultValue]
          : d.defaultValue
        : undefined,
    })) || [],
  );
  const [filterSettings, setFilterSettings] = useState<
    FilterSettingsDataType[]
  >([]);

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };

  useEffect(() => {
    setSelectedFilters(
      filters?.map(d => ({
        filter: d.column,
        value: d.defaultValue
          ? typeof d.defaultValue === 'string'
            ? [d.defaultValue]
            : d.defaultValue
          : undefined,
      })) || [],
    );
  }, [filters]);

  useEffect(() => {
    if (dataFromFile) {
      const filteredData = dataFromFile.filter((item: any) =>
        selectedFilters.every(filter =>
          filter.value && filter.value.length > 0
            ? intersection(flattenDeep([item[filter.filter]]), filter.value)
                .length > 0
            : true,
        ),
      );
      setData(filteredData);
    }
  }, [selectedFilters, dataFromFile]);

  useEffect(() => {
    if (dataSettings.dataURL) {
      const fetchData =
        typeof dataSettings.dataURL === 'string'
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
            );
      fetchData.then(d => {
        setDataFromFile(d);
        const gridValue = getUniqValue(d, columnGridBy) as (string | number)[];
        setGridOption(gridValue);
        setFilterSettings(
          filters?.map(el => ({
            filter: el.column,
            label: el.label || `Filter by ${el.column}`,
            singleSelect: el.singleSelect,
            clearable: el.clearable,
            defaultValue: el.defaultValue,
            availableValues: getUniqValue(d, el.column)
              .filter(v =>
                el.excludeValues
                  ? el.excludeValues.indexOf(`${v}`) === -1
                  : true,
              )
              .map(v => ({
                value: v,
                label: v,
              })),
          })) || [],
        );
      });
    } else {
      const tempData = dataSettings.columnsToArray
        ? transformColumnsToArray(
            dataSettings.data,
            dataSettings.columnsToArray,
          )
        : dataSettings.data;
      setDataFromFile(tempData);
      const gridValue = getUniqValue(tempData, columnGridBy) as (
        | string
        | number
      )[];
      setGridOption(gridValue);
      setFilterSettings(
        filters?.map(el => ({
          filter: el.column,
          label: el.label || `Filter by ${el.column}`,
          singleSelect: el.singleSelect,
          clearable: el.clearable,
          defaultValue: el.defaultValue,
          availableValues: getUniqValue(tempData, el.column)
            .filter(v =>
              el.excludeValues ? el.excludeValues.indexOf(`${v}`) === -1 : true,
            )
            .map(v => ({
              value: v,
              label: v,
            })),
        })) || [],
      );
    }
  }, [dataSettings]);
  useEffect(() => {
    setGraphConfig(graphDataConfiguration);
  }, [graphDataConfiguration]);
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
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
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
              mode={mode || 'light'}
            />
          ) : null}
          {data && gridOption.length > 0 ? (
            <>
              {filterSettings.length !== 0 ||
              (dataSelectionOptions || []).length !== 0 ? (
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
                  {dataSelectionOptions?.map((d, i) => (
                    <div
                      style={{
                        width: `calc(${100 / (noOfFiltersPerRow || 4)}% - ${
                          ((noOfFiltersPerRow || 4) - 1) /
                          (noOfFiltersPerRow || 4)
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
                          color: UNDPColorModule[mode || 'light'].grays.black,
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
                                  ].value
                                : ''
                            }
                            onChange={el => {
                              const newGraphConfig = {
                                columnId: el,
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
                              columnId: el.map(item => item.value) as string[],
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
                        width: `calc(${100 / (noOfFiltersPerRow || 4)}% - ${
                          ((noOfFiltersPerRow || 4) - 1) /
                          (noOfFiltersPerRow || 4)
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
                          color: UNDPColorModule[mode || 'light'].grays.black,
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
                            const filterTemp = [...selectedFilters];
                            filterTemp[
                              filterTemp.findIndex(f => f.filter === d.filter)
                            ].value = el?.value ? [el?.value] : [];
                            setSelectedFilters(filterTemp);
                          }}
                          defaultValue={
                            d.defaultValue
                              ? {
                                  value: d.defaultValue as string,
                                  label: d.defaultValue as string,
                                }
                              : undefined
                          }
                          theme={theme => getReactSelectTheme(theme, mode)}
                        />
                      ) : (
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
                            const filterTemp = [...selectedFilters];
                            filterTemp[
                              filterTemp.findIndex(f => f.filter === d.filter)
                            ].value = el?.map(val => val.value) || [];
                            setSelectedFilters(filterTemp);
                          }}
                          defaultValue={
                            d.defaultValue
                              ? (d.defaultValue as string[]).map(el => ({
                                  value: el,
                                  label: el,
                                }))
                              : undefined
                          }
                          isRtl={graphSettings?.rtl}
                          theme={theme => getReactSelectTheme(theme, mode)}
                        />
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
                    UNDPColorModule[mode || 'light'].categoricalColors.colors
                  }
                  colorDomain={graphSettings?.colorDomain}
                  showNAColor={
                    graphSettings?.showNAColor === undefined ||
                    graphSettings?.showNAColor === null
                      ? true
                      : graphSettings?.showNAColor
                  }
                  mode={mode || 'light'}
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
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
