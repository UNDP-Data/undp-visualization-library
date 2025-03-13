import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createFilter,
  DropdownSelect,
  Label,
  Spinner,
} from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
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
import { GraphHeader } from '../Elements/GraphHeader';
import { SingleGraphDashboard } from './SingleGraphDashboard';
import { wideToLongTransformation } from '../../Utils/wideToLongTranformation';
import { filterData } from '../../Utils/transformData/filterData';
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';

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
  graphBackgroundStyle?: BackgroundStyleDataType;
  graphBackgroundColor?: string | boolean;
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
    mode = 'light',
    readableHeader,
    dataFilters,
    graphBackgroundStyle,
    graphBackgroundColor,
  } = props;

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );
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
  const fetchDataHandler = useCallback(async () => {
    if (dataSettings) {
      try {
        const fetchData = dataSettings.dataURL
          ? typeof dataSettings.dataURL === 'string'
            ? dataSettings.fileType === 'json'
              ? fetchAndParseJSON(
                  dataSettings.dataURL,
                  undefined,
                  dataSettings.dataTransformation,
                  debugMode,
                )
              : dataSettings.fileType === 'api'
              ? fetchAndTransformDataFromAPI(
                  dataSettings.dataURL,
                  dataSettings.apiHeaders,
                  undefined,
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
              )
          : transformColumnsToArray(dataSettings.data, undefined);

        const d = await fetchData;
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
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    }
  }, [dataSettings, dataFilters, debugMode]);
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);
  return (
    <div
      className={`${mode || 'light'} flex  ${
        width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={
        dashboardLayout.language === 'he' || dashboardLayout.language === 'ar'
          ? 'rtl'
          : undefined
      }
    >
      <div
        className={`${
          !dashboardLayout?.backgroundColor
            ? 'bg-transparent '
            : dashboardLayout?.backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }flex flex-col h-inherit w-full ml-auto mr-auto grow gap-4 ${
          dashboardLayout?.language || 'en'
        }`}
        style={{
          ...(dashboardLayout?.backgroundColor &&
          dashboardLayout?.backgroundColor !== true
            ? { backgroundColor: dashboardLayout?.backgroundColor }
            : {}),
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
          <div className='flex flex-col w-full gap-4 grow justify-between'>
            {dashboardLayout.title || dashboardLayout.description ? (
              <GraphHeader
                graphTitle={dashboardLayout.title}
                graphDescription={dashboardLayout.description}
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
                    {dashboardLayout.dropdownLabel ? (
                      <Label className='mb-2'>
                        {dashboardLayout.dropdownLabel}
                      </Label>
                    ) : null}
                    <DropdownSelect
                      options={filterValues.map(d => ({
                        value: d,
                        label: d,
                      }))}
                      isClearable={false}
                      isSearchable
                      controlShouldRenderValue
                      filterOption={createFilter(filterConfig)}
                      onChange={(el: any) => {
                        setSelectedFilterValues(el?.value);
                      }}
                      defaultValue={{
                        value: selectedFilterValues as string,
                        label: selectedFilterValues as string,
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
                    }}
                  >
                    {d.columns.map((el, j) => (
                      <div
                        key={j}
                        className='flex bg-transparent h-inherit grow min-w-60'
                        style={{
                          width: `calc(${
                            (100 * (el.columnWidth || 1)) /
                            TotalWidth(d.columns)
                          }% - ${
                            (TotalWidth(d.columns) - (el.columnWidth || 1)) /
                            TotalWidth(d.columns)
                          }rem)`,
                          minHeight: 'inherit',
                        }}
                      >
                        <SingleGraphDashboard
                          graphType={el.graphType}
                          dataFilters={el.dataFilters}
                          graphSettings={{
                            ...el.settings,
                            width: undefined,
                            height: undefined,
                            radius:
                              el.graphType === 'donutChart'
                                ? undefined
                                : el.settings?.radius,
                            size:
                              el.graphType === 'unitChart'
                                ? el.settings.size
                                : undefined,
                            language: dashboardLayout.language,
                            mode: mode || el.settings?.mode,
                            backgroundStyle:
                              el.settings?.backgroundStyle ||
                              graphBackgroundStyle,
                            backgroundColor:
                              el.settings?.backgroundColor ||
                              graphBackgroundColor,
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
