/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import isEqual from 'lodash.isequal';
import intersection from 'lodash.intersection';
import { P } from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
  DataTableColumnDataType,
  SourcesDataType,
} from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import {
  FilterIcon,
  FilterIconApplied,
  SortingIcon,
  SortingIconAscending,
  SortingIconDescending,
} from '../../Icons/Icons';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  graphTitle?: string;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  graphID?: string;
  width?: number;
  height?: number;
  columnData: DataTableColumnDataType[];
  onSeriesMouseClick?: (_d: any) => void;
  data: any;
  language?: 'ar' | 'he' | 'en';
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  backgroundColor?: string | boolean;
  padding?: string;
  resetSelectionOnDoubleClick?: boolean;
}

const TotalWidth = (columns: (number | undefined)[]) => {
  const columnWidth = columns.map(d => d || 1);
  const sum = columnWidth.reduce((acc, cur) => acc + cur, 0);
  return sum;
};

export function DataTable(props: Props) {
  const {
    width,
    height,
    graphTitle,
    sources,
    graphDescription,
    footNote,
    graphID,
    data,
    columnData,
    onSeriesMouseClick,
    language = 'en',
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    backgroundColor = false,
    padding,
    resetSelectionOnDoubleClick = true,
  } = props;
  const [columnSortBy, setColumnSortBy] = useState<string | undefined>(
    undefined,
  );
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [popupVisible, setPopupVisible] = useState<string | undefined>(
    undefined,
  );
  const [popupStyle, setPopupStyle] = useState({});
  const [filterOption, setFilterOption] = useState(
    columnData
      .filter(d => d.filterOptions && d.filterOptions.length > 0)
      .map(d => ({ id: d.columnId, option: d.filterOptions as string[] })),
  );
  const [sortedData, setSortedData] = useState(data);
  useEffect(() => {
    const dataFiltered: any = [];
    data.forEach((d: any) => {
      let filter = true;
      filterOption.forEach(el => {
        if (
          typeof d[el.id] !== 'object' &&
          typeof d[el.id] !== 'function' &&
          typeof d[el.id] !== 'symbol'
        ) {
          if (
            columnData[columnData.findIndex(cd => cd.columnId === el.id)]
              .separator
          ) {
            const arr = d[el.id].split(
              columnData[columnData.findIndex(cd => cd.columnId === el.id)]
                .separator,
            );
            if (intersection(arr, el.option).length === 0) filter = false;
          } else if (el.option.indexOf(d[el.id]) === -1) filter = false;
        }
      });
      if (filter) dataFiltered.push(d);
    });
    if (columnSortBy && data) {
      setSortedData(
        sortDirection === 'asc'
          ? sortBy(dataFiltered, [columnSortBy])
          : sortBy(dataFiltered, [columnSortBy]).reverse(),
      );
    } else {
      setSortedData(dataFiltered);
    }
  }, [columnSortBy, sortDirection, data, filterOption]);
  return (
    <div
      className={`ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
      style={{
        ...backgroundStyle,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is an data table. ${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
    >
      <div
        className='flex grow'
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
        }}
      >
        <div className='flex flex-col gap-3 w-full justify-between grow'>
          {graphTitle || graphDescription ? (
            <GraphHeader
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
            />
          ) : null}
          <div className='grow flex flex-col justify-center'>
            <div
              className='undp-viz-scrollbar'
              style={{
                width: width ? `${width}px` : '100%',
                height: height ? `${height}px` : 'auto',
              }}
            >
              {data ? (
                <table
                  className='w-full'
                  style={{ borderCollapse: 'collapse' }}
                >
                  <thead
                    className='text-left'
                    style={{
                      backgroundColor: UNDPColorModule[mode].grays['gray-300'],
                    }}
                  >
                    <tr>
                      {columnData?.map((d, i) => (
                        <th
                          className='text-sm'
                          style={{
                            width: `calc(${
                              (100 * (d.columnWidth || 1)) /
                              TotalWidth(
                                columnData.map(cd => cd.columnWidth || 1),
                              )
                            }%`,
                            color: UNDPColorModule[mode].grays.black,
                          }}
                          key={i}
                        >
                          <div className='flex gap-2 justify-between items-center p-4'>
                            <P
                              marginBottom='none'
                              className={`text-sm md:text-sm w-fit grow text-${
                                d.align || 'left'
                              } font-bold`}
                            >
                              {d.columnTitle || d.columnId}
                            </P>
                            {d.sortable ? (
                              <button
                                type='button'
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  border: 0,
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  if (columnSortBy === d.columnId) {
                                    if (sortDirection === 'asc') {
                                      setSortDirection('desc');
                                    }
                                    if (sortDirection === 'desc') {
                                      setColumnSortBy(undefined);
                                    }
                                  } else {
                                    setColumnSortBy(d.columnId);
                                    setSortDirection('asc');
                                  }
                                }}
                              >
                                {columnSortBy === d.columnId ? (
                                  sortDirection === 'asc' ? (
                                    <SortingIconAscending />
                                  ) : (
                                    <SortingIconDescending />
                                  )
                                ) : (
                                  <SortingIcon />
                                )}
                              </button>
                            ) : null}
                            {d.filterOptions && d.filterOptions.length ? (
                              <button
                                type='button'
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  border: 0,
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                }}
                                onClick={event => {
                                  if (popupVisible === d.columnId) {
                                    setPopupVisible(undefined);
                                  } else if (event.currentTarget) {
                                    setPopupVisible(d.columnId);
                                    const rect =
                                      event.currentTarget.getBoundingClientRect();
                                    setPopupStyle({
                                      position: 'absolute',
                                      top: rect.bottom + window.scrollY,
                                      left:
                                        rect.left + window.scrollX - 160 < 0
                                          ? rect.left + window.scrollX
                                          : rect.left + window.scrollX - 160,
                                      padding: '0.75rem',
                                      background: `${UNDPColorModule[mode].grays.white}`,
                                      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
                                      zIndex: '1000',
                                      borderRadius: '2px',
                                      width: '10rem',
                                    });
                                  }
                                }}
                              >
                                {filterOption[
                                  filterOption.findIndex(
                                    el => el.id === d.columnId,
                                  )
                                ].option.length === d.filterOptions?.length ? (
                                  <FilterIcon />
                                ) : (
                                  <FilterIconApplied />
                                )}
                              </button>
                            ) : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData?.map((d: any, i: number) => (
                      <tr
                        key={i}
                        className={`cursor-${
                          onSeriesMouseClick ? 'pointer' : 'auto'
                        }`}
                        style={{
                          borderBottom: `1px solid ${UNDPColorModule[mode].grays['gray-400']}`,
                          backgroundColor: isEqual(mouseClickData, d)
                            ? UNDPColorModule[mode].grays['gray-200']
                            : 'transparent',
                        }}
                        onClick={() => {
                          if (onSeriesMouseClick) {
                            if (
                              isEqual(mouseClickData, d) &&
                              resetSelectionOnDoubleClick
                            ) {
                              setMouseClickData(undefined);
                              onSeriesMouseClick(undefined);
                            } else {
                              setMouseClickData(d);
                              onSeriesMouseClick(d);
                            }
                          }
                        }}
                      >
                        {columnData.map((el, j) => (
                          <td
                            key={j}
                            className={`text-sm text-${d.align || 'left'}`}
                            style={{
                              width: `calc(${
                                (100 * (d.columnWidth || 1)) /
                                TotalWidth(
                                  columnData.map(cd => cd.columnWidth || 1),
                                )
                              }%`,
                              color: UNDPColorModule[mode].grays.black,
                            }}
                          >
                            <div
                              className={`flex p-4 ${
                                el.align === 'right'
                                  ? 'justify-end'
                                  : el.align === 'center'
                                  ? 'justify-center'
                                  : 'justify-start'
                              }`}
                              style={{
                                color: UNDPColorModule[mode].grays.black,
                              }}
                            >
                              {typeof d[el.columnId] === 'number' ? (
                                <P
                                  marginBottom='none'
                                  className={`text-sm md:text-sm w-fit ${
                                    el.chip
                                      ? 'grow-0 rounded-sm p-2 md:p-2'
                                      : 'grow rounded-none p-0 md:p-0'
                                  } text-${d.align || 'left'}`}
                                  style={{
                                    backgroundColor: el.chip
                                      ? el.chipColors
                                        ? el.chipColors[
                                            el.chipColors.findIndex(
                                              c => c.value === d[el.columnId],
                                            )
                                          ].color
                                        : UNDPColorModule[mode].grays[
                                            'gray-300'
                                          ]
                                      : 'transparent',
                                    color: UNDPColorModule[mode].grays.black,
                                  }}
                                >
                                  {numberFormattingFunction(
                                    d[el.columnId],
                                    el.prefix,
                                    el.suffix,
                                  )}
                                </P>
                              ) : typeof d[el.columnId] === 'string' ? (
                                el.separator ? (
                                  <div
                                    className='flex flex-wrap gap-2'
                                    style={{
                                      color: UNDPColorModule[mode].grays.black,
                                    }}
                                  >
                                    {d[el.columnId]
                                      .split(el.separator)
                                      .map((element: string, indx: number) => (
                                        <P
                                          key={indx}
                                          marginBottom='none'
                                          className={`text-sm md:text-sm w-fit ${
                                            el.chip
                                              ? 'grow-0 rounded-sm p-2 md:p-2'
                                              : 'grow rounded-none p-0 md:p-0'
                                          } text-${d.align || 'left'}`}
                                          style={{
                                            backgroundColor: el.chip
                                              ? el.chipColors
                                                ? el.chipColors[
                                                    el.chipColors.findIndex(
                                                      c =>
                                                        c.value ===
                                                        d[el.columnId],
                                                    )
                                                  ].color
                                                : UNDPColorModule[mode].grays[
                                                    'gray-300'
                                                  ]
                                              : 'transparent',
                                            color:
                                              UNDPColorModule[mode].grays.black,
                                          }}
                                        >{`${el.prefix || ''}${element}${
                                          el.suffix || ''
                                        }`}</P>
                                      ))}
                                  </div>
                                ) : (
                                  <P
                                    marginBottom='none'
                                    className={`text-sm md:text-sm w-fit ${
                                      el.chip
                                        ? 'grow-0 rounded-sm p-2 md:p-2'
                                        : 'grow rounded-none p-0 md:p-0'
                                    } text-${el.align || 'left'}`}
                                    style={{
                                      backgroundColor: el.chip
                                        ? el.chipColors
                                          ? el.chipColors[
                                              el.chipColors.findIndex(
                                                c => c.value === d[el.columnId],
                                              )
                                            ].color
                                          : UNDPColorModule[mode].grays[
                                              'gray-300'
                                            ]
                                        : 'transparent',
                                      color: UNDPColorModule[mode].grays.black,
                                    }}
                                  >{`${el.prefix || ''}${d[el.columnId]}${
                                    el.suffix || ''
                                  }`}</P>
                                )
                              ) : (
                                <div>{d[el.columnId]}</div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
          {sources || footNote ? (
            <GraphFooter sources={sources} footNote={footNote} width={width} />
          ) : null}
        </div>
        {popupVisible && (
          <div style={popupStyle}>
            <div className='max-w-60'>
              <P className='text-sm md:text-sm mb-1 md:mb-1 font-bold'>
                Filter data by
              </P>
              <div className='flex flex-col gap-2'>
                {columnData[
                  columnData.findIndex(d => d.columnId === popupVisible)
                ].filterOptions?.map((el, i) => (
                  <div key={i}>
                    <label key={i} className='undp-viz-label'>
                      <input
                        type='checkbox'
                        className='undp-viz-checkbox'
                        checked={
                          filterOption[
                            filterOption.findIndex(d => d.id === popupVisible)
                          ].option.indexOf(el) !== -1
                        }
                        onChange={() => {
                          const indx = filterOption.findIndex(
                            d => d.id === popupVisible,
                          );
                          const opt = [...filterOption[indx].option];
                          if (opt.indexOf(el) !== -1) {
                            opt.splice(opt.indexOf(el), 1);
                            const filterOptionDuplicate = [...filterOption];
                            filterOptionDuplicate[indx].option = opt;
                            setFilterOption(filterOptionDuplicate);
                          } else {
                            opt.push(el);
                            const filterOptionDuplicate = [...filterOption];
                            filterOptionDuplicate[indx].option = opt;
                            setFilterOption(filterOptionDuplicate);
                          }
                        }}
                      />
                      {el}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
