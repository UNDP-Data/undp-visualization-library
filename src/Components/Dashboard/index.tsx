import { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  DashboardColumnDataType,
  DashboardLayoutDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
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

interface Props {
  backgroundColor?: string | boolean;
  dashboardId?: string;
  dashboardLayout: DashboardLayoutDataType;
  dataSettings: DataSettingsDataType;
  filters?: string[];
}

const TotalWidth = (columns: DashboardColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function MultiGraphDashboard(props: Props) {
  const {
    backgroundColor,
    dashboardId,
    dashboardLayout,
    dataSettings,
    filters,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [selectedFilters, setSelectedFilters] = useState<
    SelectedFilterDataType[]
  >(
    filters?.map(d => ({
      filter: d,
      value: undefined,
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
            filter: el,
            availableValues: getUniqValue(tempData, el).map(v => ({
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
          filter: el,
          availableValues: getUniqValue(dataSettings.data, el).map(v => ({
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
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule.grays['gray-200']
          : backgroundColor,
      }}
      id={dashboardId}
    >
      {data ? (
        <>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {filterSettings?.map((d, i) => (
              <div
                style={{ width: '25% - 0.75rem', flexGrow: 1, flexShrink: 0 }}
                key={i}
              >
                <p
                  className='undp-viz-typography'
                  style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}
                >
                  Filter by {d.filter}
                </p>
                <Select
                  className='undp-viz-select'
                  options={d.availableValues}
                  isMulti
                  isClearable
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
              </div>
            ))}
          </div>
          {dashboardLayout.rows.map((d, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'stretch',
                height: `${d.height}px` || 'auto',
                width: '100%',
              }}
            >
              {d.columns.map((el, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex',
                    width: `calc(${
                      (100 * (el.columnWidth || 1)) / TotalWidth(d.columns)
                    }% - ${(d.columns.length - 1) / d.columns.length}rem)`,
                    backgroundColor: 'transparent',
                    height: 'inherit',
                  }}
                >
                  <GraphEl
                    graph={el.graphType}
                    graphData={transformDataForGraph(
                      el.dataTransform
                        ? transformDataForAggregation(
                            data,
                            el.dataTransform.keyColumn,
                            el.dataTransform.aggregationColumnsSetting,
                          )
                        : data,
                      el.graphType,
                      el.graphDataConfiguration,
                    )}
                    settings={el.settings}
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
  );
}
