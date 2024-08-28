import { useEffect, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  AggregationSettingsDataType,
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
} from '../../Utils/fetchAndParseData';
import { UNDPColorModule } from '../ColorPalette';
import { transformColumnsToArray } from '../../Utils/transformData/transformColumnsToArray';
import GraphEl from './GraphEl';
import { transformDataForGraph } from '../../Utils/transformData/transformDataForGraph';
import { getUniqValue } from '../../Utils/getUniqValue';
import { transformDataForAggregation } from '../../Utils/transformData/transformDataForAggregation';
import { GraphHeader } from '../Elements/GraphHeader';
import { GraphFooter } from '../Elements/GraphFooter';

interface Props {
  backgroundColor?: string | boolean;
  graphId?: string;
  noOfColumns?: number;
  columnGridBy: string;
  graphSettings: any;
  dataSettings: DataSettingsDataType;
  filters?: FilterUiSettingsDataType[];
  graphType: GraphType;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  relativeHeightForGraph?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  graphDataConfiguration?: GraphConfigurationDataType[];
}

export function GriddedGraphs(props: Props) {
  const {
    backgroundColor,
    graphId,
    graphSettings,
    dataSettings,
    filters,
    graphType,
    dataTransform,
    graphDataConfiguration,
    relativeHeightForGraph,
    noOfColumns,
    columnGridBy,
    rtl,
    language,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [gridOption, setGridOption] = useState<(string | number)[]>([]);
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
        const gridValue = getUniqValue(tempData, columnGridBy) as (
          | string
          | number
        )[];
        setGridOption(gridValue);
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
        width: graphSettings.width ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: graphSettings.width ? 0 : 1,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule.grays['gray-200']
          : backgroundColor,
      }}
      id={graphId}
      ref={graphParentDiv}
    >
      <div
        style={{
          padding: backgroundColor
            ? graphSettings.padding || '1rem'
            : graphSettings.padding || 0,
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
          {graphSettings.graphTitle ||
          graphSettings.graphDescription ||
          graphSettings.graphDownload ||
          graphSettings.dataDownload ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphSettings.graphTitle}
              graphDescription={graphSettings.graphDescription}
              width={graphSettings.width}
              graphDownload={
                graphSettings.graphDownload ? graphParentDiv.current : undefined
              }
            />
          ) : null}
          {data && gridOption.length > 0 ? (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  width: '100%',
                  flexDirection: rtl ? 'row-reverse' : 'row',
                }}
              >
                {filterSettings?.map((d, i) => (
                  <div
                    style={{
                      width: '25% - 0.75rem',
                      flexGrow: 1,
                      flexShrink: 0,
                    }}
                    key={i}
                  >
                    <p
                      className='undp-viz-typography'
                      style={{
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        textAlign: rtl ? 'right' : 'left',
                      }}
                    >
                      Filter by {d.filter}
                    </p>
                    {d.singleSelect ? (
                      <Select
                        className={
                          rtl
                            ? `undp-viz-select-${
                                language || 'ar'
                              } undp-viz-select`
                            : 'undp-viz-select'
                        }
                        options={d.availableValues}
                        isClearable={
                          d.clearable === undefined ? true : d.clearable
                        }
                        isRtl={rtl}
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
                          rtl
                            ? `undp-viz-select-${
                                language || 'ar'
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
                        isRtl={rtl}
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
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  flexDirection: rtl ? 'row-reverse' : 'row',
                }}
              >
                {gridOption.map((el, i) => (
                  <div
                    key={i}
                    style={{
                      width: `calc(${100 / (noOfColumns || 4)}% - ${
                        ((noOfColumns || 4) - 1) / (noOfColumns || 4)
                      }rem)`,
                    }}
                  >
                    <GraphEl
                      graph={graphType}
                      graphData={
                        transformDataForGraph(
                          dataTransform
                            ? transformDataForAggregation(
                                data.filter((d: any) => d[columnGridBy] === el),
                                dataTransform.keyColumn,
                                dataTransform.aggregationColumnsSetting,
                              )
                            : data.filter((d: any) => d[columnGridBy] === el),
                          graphType,
                          graphDataConfiguration,
                        ) || []
                      }
                      settings={{
                        ...graphSettings,
                        rtl,
                        language,
                        width: undefined,
                        relativeHeight: relativeHeightForGraph || 0.67,
                        graphTitle: `${el}`,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                        footNote: undefined,
                        source: undefined,
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='undp-viz-loader' />
          )}
          {graphSettings.source || graphSettings.footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              source={graphSettings.source}
              sourceLink={graphSettings.sourceLink}
              footNote={graphSettings.footNote}
              width={graphSettings.width}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
