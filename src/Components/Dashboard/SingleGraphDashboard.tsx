import { useEffect, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import {
  AggregationSettingsDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
  GraphConfigurationDataType,
  GraphSettingsDataType,
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

interface Props {
  backgroundColor?: string | boolean;
  graphId?: string;
  graphSettings?: any;
  dataSettings: DataSettingsDataType;
  filters?: string[];
  graphType: GraphType;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  graphDataConfiguration?: GraphConfigurationDataType[];
}

export function SingleGraphDashboard(props: Props) {
  const {
    backgroundColor,
    graphId,
    graphSettings,
    dataSettings,
    filters,
    graphType,
    dataTransform,
    graphDataConfiguration,
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const graphParentDiv = useRef<HTMLDivElement>(null);
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
        width: graphSettings?.width ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: graphSettings?.width ? 0 : 1,
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
              <GraphEl
                graph={graphType}
                graphData={transformDataForGraph(
                  dataTransform
                    ? transformDataForAggregation(
                        data,
                        dataTransform.keyColumn,
                        dataTransform.aggregationColumnsSetting,
                      )
                    : data,
                  graphType,
                  graphDataConfiguration,
                )}
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
