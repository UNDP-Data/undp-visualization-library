import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  CheckboxGroup,
  CheckboxGroupItem,
  createFilter,
  DropdownSelect,
  Label,
  P,
  RadioGroup,
  RadioGroupItem,
  Spinner,
} from '@undp-data/undp-design-system-react';
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
import { transformDataForGraph } from '../../Utils/transformData/transformDataForGraph';
import { getUniqValue } from '../../Utils/getUniqValue';
import { transformDataForAggregation } from '../../Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '../Elements/GraphHeader';
import { filterData } from '../../Utils/transformData/filterData';
import GraphEl from './GraphEl';
import { checkIfMultiple } from '../../Utils/checkIfMultiple';
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';
import { GraphList } from '../../Utils/getGraphList';
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
      <P
        size='xs'
        className='text-center text-accent-dark-red dark:text-accent-red p-2'
      >
        Please make sure either `dataSettings` props are present as they are
        required for data.
      </P>
    );
  return (
    <div
      className={`${mode || 'light'} flex  ${
        graphSettings?.width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={
        graphSettings.language === 'he' || graphSettings.language === 'ar'
          ? 'rtl'
          : undefined
      }
    >
      <div
        className={`${
          !graphSettings?.backgroundColor
            ? 'bg-transparent '
            : graphSettings?.backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col grow h-inherit ${
          graphSettings?.language || 'en'
        }`}
        style={{
          ...(graphSettings?.backgroundStyle || {}),
          ...(graphSettings?.backgroundColor &&
          graphSettings?.backgroundColor !== true
            ? { backgroundColor: graphSettings?.backgroundColor }
            : {}),
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
          <div className='flex flex-col w-full gap-4 grow justify-between'>
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
                        <Label className='mb-2'>
                          {d.label || `Visualize ${d.chartConfigId} by`}
                        </Label>
                        {d.ui !== 'radio' ? (
                          <DropdownSelect
                            options={d.options}
                            isClearable={false}
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
                          />
                        ) : (
                          <RadioGroup
                            defaultValue={
                              d.defaultValue?.label || d.options[0].label
                            }
                            onValueChange={el => {
                              const selectedOption =
                                d.options[
                                  d.options.findIndex(opt => opt.label === el)
                                ];
                              const newGraphConfig = {
                                columnId: selectedOption.value as string[],
                                chartConfigId: d.chartConfigId,
                              };
                              const updatedConfig = graphConfig?.map(item =>
                                item.chartConfigId ===
                                newGraphConfig.chartConfigId
                                  ? newGraphConfig
                                  : item,
                              );
                              setAdvancedGraphSettings(
                                selectedOption.graphSettings || {},
                              );
                              setGraphConfig(updatedConfig);
                            }}
                          >
                            {d.options.map((el, j) => (
                              <RadioGroupItem
                                label={el.label}
                                value={el.label}
                                key={j}
                              />
                            ))}
                          </RadioGroup>
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
                        <Label className='mb-2'>
                          {d.label || `Visualize ${d.chartConfigId} by`}
                        </Label>
                        {!checkIfMultiple(
                          d.chartConfigId,
                          graphConfig || [],
                        ) ? (
                          d.ui !== 'radio' ? (
                            <DropdownSelect
                              options={d.allowedColumnIds}
                              isClearable={false}
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
                                setAdvancedGraphSettings(
                                  el?.graphSettings || {},
                                );
                                setGraphConfig(updatedConfig);
                              }}
                            />
                          ) : (
                            <RadioGroup
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
                              onValueChange={el => {
                                const selectedOption =
                                  d.allowedColumnIds[
                                    d.allowedColumnIds.findIndex(
                                      opt => opt.label === el,
                                    )
                                  ];
                                const newGraphConfig = {
                                  columnId: selectedOption.value,
                                  chartConfigId: d.chartConfigId,
                                };
                                const updatedConfig = graphConfig?.map(item =>
                                  item.chartConfigId ===
                                  newGraphConfig.chartConfigId
                                    ? newGraphConfig
                                    : item,
                                );
                                setAdvancedGraphSettings(
                                  selectedOption.graphSettings || {},
                                );
                                setGraphConfig(updatedConfig);
                              }}
                            >
                              {d.allowedColumnIds.map((el, j) => (
                                <RadioGroupItem
                                  label={el.label}
                                  value={el.label}
                                  key={j}
                                />
                              ))}
                            </RadioGroup>
                          )
                        ) : d.ui !== 'radio' ? (
                          <DropdownSelect
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
                                columnId: (el || []).map(
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
                          />
                        ) : (
                          <CheckboxGroup
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
                            onValueChange={el => {
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
                          >
                            {d.allowedColumnIds.map((el, j) => (
                              <CheckboxGroupItem
                                label={el.label}
                                value={el.label}
                                key={j}
                              />
                            ))}
                          </CheckboxGroup>
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
                        <Label>{d.label}</Label>
                        {d.singleSelect ? (
                          <DropdownSelect
                            options={d.availableValues}
                            isClearable={
                              d.clearable === undefined ? true : d.clearable
                            }
                            isSearchable
                            controlShouldRenderValue
                            filterOption={createFilter(filterConfig)}
                            onChange={(el: any) => {
                              handleFilterChange(d.filter, el);
                            }}
                            value={d.value}
                            defaultValue={d.defaultValue}
                          />
                        ) : (
                          <>
                            <DropdownSelect
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
                              value={d.value}
                              defaultValue={d.defaultValue}
                            />
                            {d.allowSelectAll ? (
                              <button
                                type='button'
                                className='bg-transparent border-0 p-0 mt-2 cursor-pointer text-primary-blue-600 dark:text-primary-blue-400'
                                onClick={() => {
                                  handleFilterChange(
                                    d.filter,
                                    d.availableValues,
                                  );
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
              <div className='w-full flex justify-center p-4'>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
