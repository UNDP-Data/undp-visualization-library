import { useEffect, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  AggregationSettingsDataType,
  APISettingsDataType,
  DataFilterDataType,
  DataSelectionDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  GraphConfigurationDataType,
  GraphSettingsDataType,
  GraphType,
  SelectedFilterDataType,
} from '../../Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
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

interface Props {
  graphSettings?: any;
  dataSettings?: DataSettingsDataType;
  dataFromAPISettings?: APISettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: Exclude<GraphType, 'geoHubMap' | 'geoHubCompareMap'>;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  debugMode?: boolean;
}

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
    dataFromAPISettings,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [graphConfig, setGraphConfig] = useState<
    GraphConfigurationDataType[] | undefined
  >(graphDataConfiguration);
  const graphParentDiv = useRef<HTMLDivElement>(null);
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
    if (dataFromAPISettings) {
      const fetchData = fetchAndTransformDataFromAPI(
        dataFromAPISettings.requestURL,
        dataFromAPISettings.method || 'GET',
        dataFromAPISettings.headers,
        dataFromAPISettings.requestBody,
        dataFromAPISettings.apiDataTransform,
        debugMode,
      );
      fetchData.then(d => {
        setDataFromFile(d);
        setFilterSettings(
          filters?.map(el => ({
            filter: el.column,
            label: el.label || `Filter by ${el.column}`,
            singleSelect: el.singleSelect,
            clearable: el.clearable,
            defaultValue: el.defaultValue,
            availableValues: getUniqValue(d, el.column).map(v => ({
              value: v,
              label: v,
            })),
          })) || [],
        );
      });
    }
    if (dataSettings && !dataFromAPISettings) {
      if (dataSettings.dataURL) {
        const fetchData =
          dataSettings.fileType === 'json'
            ? fetchAndParseJSON(
                dataSettings.dataURL as string,
                dataSettings.columnsToArray,
                debugMode,
              )
            : fetchAndParseCSV(
                dataSettings.dataURL as string,
                dataSettings.columnsToArray,
                debugMode,
                dataSettings.delimiter,
                true,
              );
        fetchData.then(d => {
          setDataFromFile(d);
          setFilterSettings(
            filters?.map(el => ({
              filter: el.column,
              label: el.label || `Filter by ${el.column}`,
              singleSelect: el.singleSelect,
              clearable: el.clearable,
              defaultValue: el.defaultValue,
              availableValues: getUniqValue(d, el.column).map(v => ({
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
        setFilterSettings(
          filters?.map(el => ({
            filter: el.column,
            label: el.label || `Filter by ${el.column}`,
            singleSelect: el.singleSelect,
            clearable: el.clearable,
            defaultValue: el.defaultValue,
            availableValues: getUniqValue(tempData, el.column).map(v => ({
              value: v,
              label: v,
            })),
          })) || [],
        );
      }
    }
  }, [dataSettings, dataFromAPISettings]);
  if (!dataFromAPISettings && !dataSettings)
    return (
      <p
        className='undp-viz-typography'
        style={{
          textAlign: 'center',
          padding: '0.5rem',
          color: '#D12800',
          fontSize: '0.875rem',
        }}
      >
        Please make sure either `dataSettings` or `dataFromAPISettings` props
        are present as they are required for data.
      </p>
    );
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
          ? UNDPColorModule.grays['gray-200']
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
          {data ? (
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
                />
              ) : null}
              {filterSettings.length !== 0 &&
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
                        width: '25% - 0.75rem',
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
                        }}
                      >
                        {d.label || `Visualize ${d.chartConfigId} by`}
                      </p>
                      {!checkIfMultiple(d.chartConfigId, graphConfig || []) ? (
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
                          theme={theme => {
                            return {
                              ...theme,
                              borderRadius: 0,
                              spacing: {
                                ...theme.spacing,
                                baseUnit: 4,
                                menuGutter: 2,
                                controlHeight: 48,
                              },
                              colors: {
                                ...theme.colors,
                                danger: '#D12800',
                                dangerLight: '#D4D6D8',
                                neutral10: '#D4D6D8',
                                primary50: '#B5D5F5',
                                primary25: '#F7F7F7',
                                primary: '#0468b1',
                              },
                            };
                          }}
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
                          options={d.allowedColumnIds}
                          isMulti
                          isSearchable
                          controlShouldRenderValue
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
                          theme={theme => {
                            return {
                              ...theme,
                              borderRadius: 0,
                              spacing: {
                                ...theme.spacing,
                                baseUnit: 4,
                                menuGutter: 2,
                                controlHeight: 48,
                              },
                              colors: {
                                ...theme.colors,
                                danger: '#D12800',
                                dangerLight: '#D4D6D8',
                                neutral10: '#D4D6D8',
                                primary50: '#B5D5F5',
                                primary25: '#F7F7F7',
                                primary: '#0468b1',
                              },
                            };
                          }}
                        />
                      )}
                    </div>
                  ))}
                  {filterSettings?.map((d, i) => (
                    <div
                      style={{
                        width: '25% - 0.75rem',
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
                          theme={theme => {
                            return {
                              ...theme,
                              borderRadius: 0,
                              spacing: {
                                ...theme.spacing,
                                baseUnit: 4,
                                menuGutter: 2,
                                controlHeight: 48,
                              },
                              colors: {
                                ...theme.colors,
                                danger: '#D12800',
                                dangerLight: '#D4D6D8',
                                neutral10: '#D4D6D8',
                                primary50: '#B5D5F5',
                                primary25: '#F7F7F7',
                                primary: '#0468b1',
                              },
                            };
                          }}
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
                          theme={theme => {
                            return {
                              ...theme,
                              borderRadius: 0,
                              spacing: {
                                ...theme.spacing,
                                baseUnit: 4,
                                menuGutter: 2,
                                controlHeight: 48,
                              },
                              colors: {
                                ...theme.colors,
                                danger: '#D12800',
                                dangerLight: '#D4D6D8',
                                neutral10: '#D4D6D8',
                                primary50: '#B5D5F5',
                                primary25: '#F7F7F7',
                                primary: '#0468b1',
                              },
                            };
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
              <GraphEl
                graph={graphType}
                graphData={transformDataForGraph(
                  dataTransform
                    ? transformDataForAggregation(
                        filterData(data, dataFilters || []),
                        dataTransform.keyColumn,
                        dataTransform.aggregationColumnsSetting,
                      )
                    : filterData(data, dataFilters || []),
                  graphType,
                  graphConfig,
                )}
                graphDataConfiguration={graphConfig}
                debugMode={debugMode}
                settings={
                  graphSettings
                    ? {
                        ...graphSettings,
                        graphTitle: undefined,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                      }
                    : ({
                        graphTitle: undefined,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                      } as GraphSettingsDataType)
                }
              />
            </>
          ) : (
            <div className='undp-viz-loader' />
          )}
        </div>
      </div>
    </div>
  );
}
