import { useCallback, useEffect, useMemo, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  BackgroundStyleDataType,
  DashboardColumnDataType,
  DashboardLayoutDataType,
  DataFilterDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  GraphType,
} from '../../Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '../../Utils/fetchAndParseData';
import { UNDPColorModule } from '../ColorPalette';
import { getUniqValue } from '../../Utils/getUniqValue';
import { GraphHeader } from '../Elements/GraphHeader';
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';
import { SingleGraphDashboard } from './SingleGraphDashboard';
import { filterData } from '../../Utils/transformData/filterData';
import { getReactSelectTheme } from '../../Utils/getReactSelectTheme';
import { transformDefaultValue } from '../../Utils/transformDataForSelect';

interface Props {
  dashboardId?: string;
  dashboardLayout: DashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  noOfFiltersPerRow?: number;
  dataFilters?: DataFilterDataType[];
  debugMode?: boolean;
  mode?: 'dark' | 'light';
  filterPosition?: 'top' | 'side';
  readableHeader?: {
    value: string;
    label: string;
  }[];
  graphBackgroundStyle?: BackgroundStyleDataType;
  graphBackgroundColor?: string | boolean;
}

const TotalWidth = (columns: DashboardColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

const GraphWithAttachedFilter: GraphType[] = [
  'horizontalBarChart',
  'verticalBarChart',
  'choroplethMap',
  'biVariateChoroplethMap',
  'circlePacking',
  'treeMap',
];

export function MultiGraphDashboard(props: Props) {
  const {
    dashboardId,
    dashboardLayout,
    dataSettings,
    filters,
    debugMode,
    mode = 'light',
    readableHeader,
    dataFilters,
    noOfFiltersPerRow = 4,
    filterPosition,
    graphBackgroundStyle,
    graphBackgroundColor,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
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
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: 1,
        gap: '1rem',
        backgroundColor: !dashboardLayout.backgroundColor
          ? 'transparent'
          : dashboardLayout.backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : dashboardLayout.backgroundColor,
      }}
      id={dashboardId}
    >
      <div
        style={{
          padding: dashboardLayout.backgroundColor
            ? dashboardLayout.padding || '1rem'
            : dashboardLayout.padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
      className='flex flex-col w-full gap-4 grow justify-between'
        >
          {dashboardLayout.title || dashboardLayout.description ? (
            <GraphHeader
              rtl={dashboardLayout.rtl}
              language={dashboardLayout.language}
              graphTitle={dashboardLayout.title}
              graphDescription={dashboardLayout.description}
              mode={mode}
              isDashboard
            />
          ) : null}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {filterSettings.length !== 0 ? (
              <div
                style={{
                  width: filterPosition === 'side' ? '280px' : '100%',
                  flexGrow: 1,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexDirection: dashboardLayout.rtl ? 'row-reverse' : 'row',
                    position: 'sticky',
                    top: '1rem',
                  }}
                >
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
                          dashboardLayout.rtl
                            ? `undp-viz-typography-${
                                dashboardLayout.language || 'ar'
                              } undp-viz-typography`
                            : 'undp-viz-typography'
                        }
                        style={{
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                          textAlign: dashboardLayout.rtl ? 'right' : 'left',
                          color: UNDPColorModule[mode].grays.black,
                        }}
                      >
                        {d.label}
                      </p>
                      {d.singleSelect ? (
                        <Select
                          className={
                            dashboardLayout.rtl
                              ? `undp-viz-select-${
                                  dashboardLayout.language || 'ar'
                                } undp-viz-select`
                              : 'undp-viz-select'
                          }
                          options={d.availableValues}
                          isClearable={
                            d.clearable === undefined ? true : d.clearable
                          }
                          isRtl={dashboardLayout.rtl}
                          isMulti={false}
                          isSearchable
                          filterOption={createFilter(filterConfig)}
                          onChange={el => {
                            handleFilterChange(d.filter, el);
                          }}
                          defaultValue={d.defaultValue}
                          value={d.value}
                          theme={theme => getReactSelectTheme(theme, mode)}
                        />
                      ) : (
                        <>
                          <Select
                            className={
                              dashboardLayout.rtl
                                ? `undp-viz-select-${
                                    dashboardLayout.language || 'ar'
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
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            filterOption={createFilter(filterConfig)}
                            onChange={el => {
                              handleFilterChange(d.filter, el);
                            }}
                            value={d.value}
                            defaultValue={d.defaultValue}
                            isRtl={dashboardLayout.rtl}
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
              </div>
            ) : null}
            <div
              style={{
                width:
                  filterPosition === 'side'
                    ? 'calc(100% - 280px - 1rem)'
                    : '100%',
                minWidth: '280px',
                flexGrow: 1,
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                flexShrink: '0',
              }}
            >
              {dashboardLayout.rows.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'stretch',
                    minHeight: `${d.height || 0}px`,
                    height: 'auto',
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: dashboardLayout.rtl ? 'row-reverse' : 'row',
                  }}
                >
                  {d.columns.map((el, j) => (
                    <div
                      key={j}
                      style={{
                        display: 'flex',
                        width: `calc(${
                          (100 * (el.columnWidth || 1)) / TotalWidth(d.columns)
                        }% - ${
                          (TotalWidth(d.columns) - (el.columnWidth || 1)) /
                          TotalWidth(d.columns)
                        }rem)`,
                        backgroundColor: 'transparent',
                        minWidth: '240px',
                        height: 'inherit',
                        minHeight: 'inherit',
                        flexGrow: 1,
                      }}
                    >
                      <SingleGraphDashboard
                        graphType={el.graphType}
                        dataFilters={el.dataFilters}
                        graphSettings={{
                          ...el.settings,
                          width: undefined,
                          height: undefined,
                          resetSelectionOnDoubleClick: el.attachedFilter
                            ? false
                            : el.settings?.resetSelectionOnDoubleClick,
                          backgroundStyle:
                            el.settings?.backgroundStyle ||
                            graphBackgroundStyle,
                          backgroundColor:
                            el.settings?.backgroundColor ||
                            graphBackgroundColor,
                          radius:
                            el.graphType === 'donutChart'
                              ? undefined
                              : el.settings?.radius,
                          size:
                            el.graphType === 'unitChart'
                              ? el.settings.size
                              : undefined,
                          rtl: dashboardLayout.rtl,
                          language: dashboardLayout.language,
                        }}
                        dataSettings={{
                          data: data
                            ? filterData(data, dataFilters || [])
                            : undefined,
                        }}
                        updateFilters={
                          el.attachedFilter &&
                          GraphWithAttachedFilter.indexOf(el.graphType) !==
                            -1 &&
                          filterSettings.findIndex(
                            f => f.filter === el.attachedFilter,
                          ) !== -1
                            ? dClicked => {
                                const indx = filterSettings.findIndex(
                                  f => f.filter === el.attachedFilter,
                                );
                                const value = dClicked
                                  ? filterSettings[indx].singleSelect
                                    ? { value: dClicked, label: dClicked }
                                    : [{ value: dClicked, label: dClicked }]
                                  : undefined;
                                handleFilterChange(
                                  el.attachedFilter as string,
                                  value,
                                );
                              }
                            : undefined
                        }
                        dataTransform={el.dataTransform}
                        dataSelectionOptions={el.dataSelectionOptions}
                        advancedDataSelectionOptions={
                          el.advancedDataSelectionOptions
                        }
                        graphDataConfiguration={el.graphDataConfiguration}
                        debugMode={debugMode}
                        readableHeader={readableHeader || []}
                        mode={mode}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
