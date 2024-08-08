import { useEffect, useRef, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import uniqBy from 'lodash.uniqby';
import {
  AggregationSettingsDataType,
  DataSettingsDataType,
  FilterSettingsDataType,
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
import GraphEl from './ChooseGraphs';
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
  filters?: string[];
  graphType: GraphType;
  relativeHeightForGraph?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  graphDataConfiguration: GraphConfigurationDataType[];
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
  } = props;
  const [data, setData] = useState<any>(undefined);
  const [dataFromFile, setDataFromFile] = useState<any>(undefined);
  const [gridOption, setGridOption] = useState<any>([]);
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
        setGridOption(
          uniqBy(tempData, (el: any) => el[columnGridBy]).map(
            (el: any) => el[columnGridBy] as string | number,
          ),
        );
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {gridOption.map((el: any, i: number) => (
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
                      graphData={transformDataForGraph(
                        dataTransform
                          ? transformDataForAggregation(
                              data.filter((d: any) => d[columnGridBy] === el),
                              dataTransform.keyColumn,
                              dataTransform.aggregationColumnsSetting,
                            )
                          : data.filter((d: any) => d[columnGridBy] === el),
                        graphType,
                        graphDataConfiguration,
                      )}
                      settings={{
                        ...graphSettings,
                        width: undefined,
                        relativeHeight: relativeHeightForGraph || 0.67,
                        graphTitle: el,
                        graphDescription: undefined,
                        graphDownload: false,
                        dataDownload: false,
                        backgroundColor: undefined,
                        padding: '0',
                        FootNote: undefined,
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
