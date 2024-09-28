import { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  DashboardColumnDataType,
  DashboardLayoutDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  FilterUiSettingsDataType,
  SelectedFilterDataType,
} from '../../Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
} from '../../Utils/fetchAndParseData';
import { UNDPColorModule } from '../ColorPalette';
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';
import GraphEl from './GraphEl';
import { transformDataForGraph } from '../../Utils/transformData/transformDataForGraph';
import { getUniqValue } from '../../Utils/getUniqValue';
import { transformDataForAggregation } from '../../Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '../Elements/GraphHeader';
import { filterData } from '../../Utils/transformData/filterData';

interface Props {
  dashboardId?: string;
  dashboardLayout: DashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
}

const TotalWidth = (columns: DashboardColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function MultiGraphDashboard(props: Props) {
  const { dashboardId, dashboardLayout, dataSettings, filters } = props;
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
        dataSettings.fileType === 'json'
          ? fetchAndParseJSON(dataSettings.dataURL)
          : fetchAndParseCSV(dataSettings.dataURL, dataSettings.delimiter);
      fetchData.then(d => {
        const tempData = dataSettings.columnsToArray
          ? transformColumnsToArray(d, dataSettings.columnsToArray)
          : d;
        setDataFromFile(tempData);
        setFilterSettings(
          filters?.map(el => ({
            filter: el.column,
            singleSelect: el.singleSelect,
            clearable: el.clearable,
            defaultValue: el.defaultValue,
            availableValues: getUniqValue(tempData, el.column).map(v => ({
              value: v,
              label: v,
            })),
          })) || [],
        );
      });
    } else {
      setDataFromFile(dataSettings.data);
      setFilterSettings(
        filters?.map(el => ({
          filter: el.column,
          singleSelect: el.singleSelect,
          clearable: el.clearable,
          defaultValue: el.defaultValue,
          availableValues: getUniqValue(dataSettings.data, el.column).map(
            v => ({
              value: v,
              label: v,
            }),
          ),
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
          ? UNDPColorModule.grays['gray-200']
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
            />
          ) : null}
          {data ? (
            <>
              {filterSettings.length !== 0 ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexDirection: dashboardLayout.rtl ? 'row-reverse' : 'row',
                  }}
                >
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
                        className='undp-viz-typography'
                        style={{
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem',
                          textAlign: dashboardLayout.rtl ? 'right' : 'left',
                        }}
                      >
                        Filter by {d.filter}
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
                          isRtl={dashboardLayout.rtl}
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
                        minWidth: '320px',
                        height: 'inherit',
                      }}
                    >
                      <GraphEl
                        graph={el.graphType}
                        graphData={transformDataForGraph(
                          el.dataTransform
                            ? transformDataForAggregation(
                                filterData(data, el.dataFilter || []),
                                el.dataTransform.keyColumn,
                                el.dataTransform.aggregationColumnsSetting,
                              )
                            : filterData(data, el.dataFilter || []),
                          el.graphType,
                          el.graphDataConfiguration,
                        )}
                        settings={{
                          ...el.settings,
                          rtl: dashboardLayout.rtl,
                          language: dashboardLayout.language,
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className='undp-viz-loader' />
          )}
        </div>
      </div>
    </div>
  );
}
