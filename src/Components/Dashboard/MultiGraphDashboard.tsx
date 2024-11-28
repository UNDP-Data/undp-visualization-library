import { useEffect, useState } from 'react';
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
  SelectedFilterDataType,
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
}

const TotalWidth = (columns: DashboardColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function MultiGraphDashboard(props: Props) {
  const {
    dashboardId,
    dashboardLayout,
    dataSettings,
    filters,
    debugMode,
    mode,
    readableHeader,
    dataFilters,
    noOfFiltersPerRow,
    filterPosition,
    graphBackgroundStyle,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
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
        setFilterSettings(
          filters?.map(el => ({
            filter: el.column,
            label: el.label || `Filter by ${el.column}`,
            singleSelect: el.singleSelect,
            clearable: el.clearable,
            defaultValue: el.defaultValue,
            allowSelectAll: el.allowSelectAll,
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
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '1rem',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {dashboardLayout.title || dashboardLayout.description ? (
            <GraphHeader
              rtl={dashboardLayout.rtl}
              language={dashboardLayout.language}
              graphTitle={dashboardLayout.title}
              graphDescription={dashboardLayout.description}
              mode={mode || 'light'}
              isDashboard
            />
          ) : null}
          {data ? (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {filterSettings.length !== 0 ? (
                <div
                  style={{
                    width: filterPosition === 'side' ? '320px' : '100%',
                    flexGrow: 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      width: '100%',
                      flexDirection: dashboardLayout.rtl
                        ? 'row-reverse'
                        : 'row',
                      position: 'sticky',
                      top: '1rem',
                    }}
                  >
                    {filterSettings?.map((d, i) => (
                      <div
                        style={{
                          width: `calc(${100 / (noOfFiltersPerRow || 4)}% - ${
                            ((noOfFiltersPerRow || 4) - 1) /
                            (noOfFiltersPerRow || 4)
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
                            color: UNDPColorModule[mode || 'light'].grays.black,
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
                                const filterTemp = [...selectedFilters];
                                filterTemp[
                                  filterTemp.findIndex(
                                    f => f.filter === d.filter,
                                  )
                                ].value = el?.map(val => val.value) || [];
                                setSelectedFilters(filterTemp);
                              }}
                              value={(
                                selectedFilters[
                                  selectedFilters.findIndex(
                                    f => f.filter === d.filter,
                                  )
                                ].value || []
                              ).map(el => ({
                                value: el,
                                label: el,
                              }))}
                              defaultValue={
                                d.defaultValue
                                  ? (d.defaultValue as string[]).map(el => ({
                                      value: el,
                                      label: el,
                                    }))
                                  : undefined
                              }
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
                                    UNDPColorModule[mode || 'light']
                                      .primaryColors['blue-600'],
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  const filterTemp = [...selectedFilters];
                                  filterTemp[
                                    filterTemp.findIndex(
                                      f => f.filter === d.filter,
                                    )
                                  ].value = d.availableValues.map(
                                    el => el.value,
                                  );
                                  setSelectedFilters(filterTemp);
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
                      ? 'calc(100% - 320px - 1rem)'
                      : '100%',
                  minWidth: '320px',
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
                      flexDirection: dashboardLayout.rtl
                        ? 'row-reverse'
                        : 'row',
                    }}
                  >
                    {d.columns.map((el, j) => (
                      <div
                        key={j}
                        style={{
                          display: 'flex',
                          width: `calc(${
                            (100 * (el.columnWidth || 1)) /
                            TotalWidth(d.columns)
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
                            backgroundStyle:
                              el.settings?.backgroundStyle ||
                              graphBackgroundStyle,
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
                            data: filterData(data, dataFilters || []),
                          }}
                          dataTransform={el.dataTransform}
                          dataSelectionOptions={el.dataSelectionOptions}
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
          ) : (
            <div className='undp-viz-loader' />
          )}
        </div>
      </div>
    </div>
  );
}
