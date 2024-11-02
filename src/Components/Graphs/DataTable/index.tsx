/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import isEqual from 'lodash.isequal';
import intersection from 'lodash.intersection';
import { DataTableColumnDataType, SourcesDataType } from '../../../Types';
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
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode?: 'light' | 'dark';
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
    rtl,
    language,
    mode,
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
      style={{
        display: 'flex',
        height: 'inherit',
        flexDirection: 'column',
        width: width ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: width ? 0 : 1,
        backgroundColor: 'transparent',
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            rtl={rtl}
            language={language}
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
            mode={mode || 'light'}
          />
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            className='undp-viz-scrollbar'
            style={{
              width: width ? `${width}px` : '100%',
              height: height ? `${height}px` : 'auto',
            }}
          >
            {data ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead
                  style={{
                    fontWeight: '600',
                    textAlign: 'left',
                    backgroundColor:
                      UNDPColorModule[mode || 'light'].grays['gray-300'],
                  }}
                >
                  <tr>
                    {columnData?.map((d, i) => (
                      <th
                        className='undp-viz-typography'
                        style={{
                          fontSize: '0.875rem',
                          width: `calc(${
                            (100 * (d.columnWidth || 1)) /
                            TotalWidth(
                              columnData.map(cd => cd.columnWidth || 1),
                            )
                          }%`,
                          color: UNDPColorModule[mode || 'light'].grays.black,
                        }}
                        key={i}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                          }}
                        >
                          <p
                            style={{
                              textAlign: d.align || 'left',
                              flexGrow: 1,
                              fontFamily: rtl
                                ? language === 'he'
                                  ? 'Noto Sans Hebrew, sans-serif'
                                  : 'Noto Sans Arabic, sans-serif'
                                : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                              color:
                                UNDPColorModule[mode || 'light'].grays.black,
                              margin: 0,
                              fontSize: '0.875rem',
                            }}
                          >
                            {d.columnTitle || d.columnId}
                          </p>
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
                                  <SortingIconAscending
                                    mode={mode || 'light'}
                                  />
                                ) : (
                                  <SortingIconDescending
                                    mode={mode || 'light'}
                                  />
                                )
                              ) : (
                                <SortingIcon mode={mode || 'light'} />
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
                                    background: `${
                                      UNDPColorModule[mode || 'light'].grays
                                        .white
                                    }`,
                                    border: `1px solid ${
                                      UNDPColorModule[mode || 'light'].grays[
                                        'gray-300'
                                      ]
                                    }`,
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
                                <FilterIcon mode={mode || 'light'} />
                              ) : (
                                <FilterIconApplied mode={mode || 'light'} />
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
                      style={{
                        borderBottom: `1px solid ${
                          UNDPColorModule[mode || 'light'].grays['gray-400']
                        }`,
                        cursor: onSeriesMouseClick ? 'pointer' : 'auto',
                        backgroundColor: isEqual(mouseClickData, d)
                          ? UNDPColorModule[mode || 'light'].grays['gray-200']
                          : 'transparent',
                      }}
                      onClick={() => {
                        if (onSeriesMouseClick) {
                          if (isEqual(mouseClickData, d)) {
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
                          className='undp-viz-typography'
                          key={j}
                          style={{
                            textAlign: d.align || 'left',
                            fontSize: '0.875rem',
                            width: `calc(${
                              (100 * (d.columnWidth || 1)) /
                              TotalWidth(
                                columnData.map(cd => cd.columnWidth || 1),
                              )
                            }%`,
                            color: UNDPColorModule[mode || 'light'].grays.black,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent:
                                el.align === 'right'
                                  ? 'end'
                                  : el.align === 'center'
                                  ? 'center'
                                  : 'flex-start',
                              padding: '1rem',
                              color:
                                UNDPColorModule[mode || 'light'].grays.black,
                            }}
                          >
                            {typeof d[el.columnId] === 'number' ? (
                              <p
                                style={{
                                  textAlign: el.align || 'left',
                                  flexGrow: el.chip ? 0 : 1,
                                  fontFamily: rtl
                                    ? language === 'he'
                                      ? 'Noto Sans Hebrew, sans-serif'
                                      : 'Noto Sans Arabic, sans-serif'
                                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                                  backgroundColor: el.chip
                                    ? el.chipColors
                                      ? el.chipColors[
                                          el.chipColors.findIndex(
                                            c => c.value === d[el.columnId],
                                          )
                                        ].color
                                      : UNDPColorModule[mode || 'light'].grays[
                                          'gray-300'
                                        ]
                                    : 'transparent',
                                  padding: el.chip ? '0.5rem' : 0,
                                  width: 'fit-content',
                                  borderRadius: el.chip ? '2px' : 0,
                                  color:
                                    UNDPColorModule[mode || 'light'].grays
                                      .black,
                                  margin: 0,
                                  fontSize: '0.875rem',
                                }}
                              >
                                {numberFormattingFunction(
                                  d[el.columnId],
                                  el.prefix || '',
                                  el.suffix || '',
                                )}
                              </p>
                            ) : typeof d[el.columnId] === 'string' ? (
                              el.separator ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    color:
                                      UNDPColorModule[mode || 'light'].grays
                                        .black,
                                  }}
                                >
                                  {d[el.columnId]
                                    .split(el.separator)
                                    .map((element: string, indx: number) => (
                                      <p
                                        key={indx}
                                        style={{
                                          textAlign: el.align || 'left',
                                          flexGrow: el.chip ? 0 : 1,
                                          fontFamily: rtl
                                            ? language === 'he'
                                              ? 'Noto Sans Hebrew, sans-serif'
                                              : 'Noto Sans Arabic, sans-serif'
                                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                                          backgroundColor: el.chip
                                            ? el.chipColors
                                              ? el.chipColors[
                                                  el.chipColors.findIndex(
                                                    c =>
                                                      c.value ===
                                                      d[el.columnId],
                                                  )
                                                ].color
                                              : UNDPColorModule[mode || 'light']
                                                  .grays['gray-300']
                                            : 'transparent',
                                          padding: el.chip ? '0.5rem' : 0,
                                          width: 'fit-content',
                                          borderRadius: el.chip ? '2px' : 0,
                                          color:
                                            UNDPColorModule[mode || 'light']
                                              .grays.black,
                                          margin: 0,
                                          fontSize: '0.875rem',
                                        }}
                                      >{`${el.prefix || ''}${element}${
                                        el.suffix || ''
                                      }`}</p>
                                    ))}
                                </div>
                              ) : (
                                <p
                                  style={{
                                    textAlign: el.align || 'left',
                                    flexGrow: el.chip ? 0 : 1,
                                    fontFamily: rtl
                                      ? language === 'he'
                                        ? 'Noto Sans Hebrew, sans-serif'
                                        : 'Noto Sans Arabic, sans-serif'
                                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                                    backgroundColor: el.chip
                                      ? el.chipColors
                                        ? el.chipColors[
                                            el.chipColors.findIndex(
                                              c => c.value === d[el.columnId],
                                            )
                                          ].color
                                        : UNDPColorModule[mode || 'light']
                                            .grays['gray-300']
                                      : 'transparent',
                                    padding: el.chip ? '0.5rem' : 0,
                                    width: 'fit-content',
                                    borderRadius: el.chip ? '2px' : 0,
                                    color:
                                      UNDPColorModule[mode || 'light'].grays
                                        .black,
                                    margin: 0,
                                    fontSize: '0.875rem',
                                  }}
                                >{`${el.prefix || ''}${d[el.columnId]}${
                                  el.suffix || ''
                                }`}</p>
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
          <GraphFooter
            rtl={rtl}
            language={language}
            sources={sources}
            footNote={footNote}
            width={width}
            mode={mode || 'light'}
          />
        ) : null}
      </div>
      {popupVisible && (
        <div style={popupStyle}>
          <div style={{ maxWidth: '15rem' }}>
            <p
              className={`${
                rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
              }undp-viz-typography`}
              style={{
                fontSize: '0.875rem',
                marginBottom: '0.25rem',
                fontWeight: 'bold',
              }}
            >
              Filter data by
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
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
  );
}
