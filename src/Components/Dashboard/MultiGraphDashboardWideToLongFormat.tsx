import { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import {
  DashboardFromWideToLongFormatColumnDataType,
  DashboardFromWideToLongFormatLayoutDataType,
  DataFilterDataType,
  DataSettingsWideToLongDataType,
} from '../../Types';
import {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndParseMultipleDataSources,
  fetchAndTransformDataFromAPI,
} from '../../Utils/fetchAndParseData';
import { UNDPColorModule } from '../ColorPalette';
import { GraphHeader } from '../Elements/GraphHeader';
import { SingleGraphDashboard } from './SingleGraphDashboard';
import { wideToLongTransformation } from '../../Utils/wideToLongTranformation';
import { filterData } from '../../Utils/transformData/filterData';

interface Props {
  dashboardId?: string;
  dashboardLayout: DashboardFromWideToLongFormatLayoutDataType;
  dataSettings: DataSettingsWideToLongDataType;
  debugMode?: boolean;
  mode?: 'dark' | 'light';
  readableHeader?: {
    value: string;
    label: string;
  }[];
  dataFilters?: DataFilterDataType[];
}

const TotalWidth = (columns: DashboardFromWideToLongFormatColumnDataType[]) => {
  const columnWidth = columns.map(d => d.columnWidth || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function MultiGraphDashboardWideToLongFormat(props: Props) {
  const {
    dashboardId,
    dashboardLayout,
    dataSettings,
    debugMode,
    mode,
    readableHeader,
    dataFilters,
  } = props;

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };
  const [data, setData] = useState<any>(undefined);
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState<
    string | undefined
  >(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);

  useEffect(() => {
    if (dataFromFile) {
      const filteredData = dataFromFile.filter(
        (item: any) => item[dataSettings.keyColumn] === selectedFilterValues,
      );
      setData(filteredData);
    }
  }, [dataFromFile, selectedFilterValues, dataSettings.keyColumn]);
  useEffect(() => {
    if (dataSettings.dataURL) {
      const fetchData =
        typeof dataSettings.dataURL === 'string'
          ? dataSettings.fileType === 'json'
            ? fetchAndParseJSON(
                dataSettings.dataURL,
                dataSettings.dataTransformation,
                undefined,
                debugMode,
              )
            : dataSettings.fileType === 'api'
            ? fetchAndTransformDataFromAPI(
                dataSettings.dataURL,
                dataSettings.apiHeaders,
                dataSettings.dataTransformation,
                debugMode,
              )
            : fetchAndParseCSV(
                dataSettings.dataURL,
                dataSettings.dataTransformation,
                undefined,
                debugMode,
                dataSettings.delimiter,
                true,
              )
          : fetchAndParseMultipleDataSources(
              dataSettings.dataURL,
              dataSettings.idColumnTitle,
            );
      fetchData.then((d: any) => {
        const filteredData = filterData(d, dataFilters || []);
        setFilterValues(
          filteredData.map((el: any) => el[dataSettings.keyColumn]),
        );
        setSelectedFilterValues(filteredData[0][dataSettings.keyColumn]);
        const tempData = wideToLongTransformation(
          filteredData,
          dataSettings.keyColumn,
          readableHeader || [],
          debugMode,
        );
        setDataFromFile(tempData);
      });
    } else {
      const filteredData = filterData(dataSettings.data, dataFilters || []);
      const tempData = wideToLongTransformation(
        filteredData,
        dataSettings.keyColumn,
        readableHeader || [],
        debugMode,
      );
      setFilterValues(
        filteredData.map((el: any) => el[dataSettings.keyColumn]),
      );
      setSelectedFilterValues(filteredData[0][dataSettings.keyColumn]);
      setDataFromFile(tempData);
    }
  }, [dataSettings, dataFilters]);
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
            <>
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
                <div
                  style={{
                    width: '100%',
                    flexGrow: 1,
                    flexShrink: 0,
                    minWidth: '240px',
                  }}
                >
                  <Select
                    className={
                      dashboardLayout.rtl
                        ? `undp-viz-select-${
                            dashboardLayout.language || 'ar'
                          } undp-viz-select`
                        : 'undp-viz-select'
                    }
                    options={filterValues.map(d => ({
                      value: d,
                      label: d,
                    }))}
                    isClearable={false}
                    isRtl={dashboardLayout.rtl}
                    isSearchable
                    controlShouldRenderValue
                    filterOption={createFilter(filterConfig)}
                    onChange={el => {
                      setSelectedFilterValues(el?.value);
                    }}
                    defaultValue={{
                      value: selectedFilterValues as string,
                      label: selectedFilterValues as string,
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
                          danger:
                            UNDPColorModule[mode || 'light'].alerts.darkRed,
                          dangerLight:
                            UNDPColorModule[mode || 'light'].grays['gray-400'],
                          neutral10:
                            UNDPColorModule[mode || 'light'].grays['gray-400'],
                          primary50:
                            UNDPColorModule[mode || 'light'].primaryColors[
                              'blue-400'
                            ],
                          primary25:
                            UNDPColorModule[mode || 'light'].grays['gray-200'],
                          primary:
                            UNDPColorModule[mode || 'light'].primaryColors[
                              'blue-600'
                            ],
                        },
                      };
                    }}
                  />
                </div>
              </div>
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
                          radius: undefined,
                          size:
                            el.graphType === 'unitChart'
                              ? el.settings.size
                              : undefined,
                          rtl: dashboardLayout.rtl,
                          language: dashboardLayout.language,
                          mode: mode || el.settings?.mode,
                        }}
                        dataSettings={{
                          data,
                        }}
                        graphDataConfiguration={
                          el.graphDataConfiguration
                            ? el.graphDataConfiguration
                            : el.graphType === 'unitChart'
                            ? [
                                {
                                  columnId: 'indicator',
                                  chartConfigId: 'label',
                                },
                                { columnId: 'value', chartConfigId: 'value' },
                              ]
                            : [
                                {
                                  columnId: 'indicator',
                                  chartConfigId: 'label',
                                },
                                { columnId: 'value', chartConfigId: 'size' },
                              ]
                        }
                        debugMode={debugMode}
                        readableHeader={readableHeader || []}
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
