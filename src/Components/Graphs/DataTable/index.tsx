import { useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import isEqual from 'lodash.isequal';
import { DataTableColumnDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import {
  SortingIcon,
  SortingIconAscending,
  SortingIconDescending,
} from '../../Icons/Icons';

interface Props {
  graphTitle?: string;
  source?: string;
  graphDescription?: string;
  sourceLink?: string;
  footNote?: string;
  graphID?: string;
  width?: number;
  height?: number;
  columnData: DataTableColumnDataType[];
  onSeriesMouseClick?: (_d: any) => void;
  data: any;
}

export function DataTable(props: Props) {
  const {
    width,
    height,
    sourceLink,
    graphTitle,
    source,
    graphDescription,
    footNote,
    graphID,
    data,
    columnData,
    onSeriesMouseClick,
  } = props;
  const [columnSortBy, setColumnSortBy] = useState<string | undefined>(
    undefined,
  );
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortedData, setSortedData] = useState(data);
  useEffect(() => {
    if (columnSortBy && data) {
      setSortedData(
        sortDirection === 'asc'
          ? sortBy(data, [columnSortBy])
          : sortBy(data, [columnSortBy]).reverse(),
      );
    } else {
      setSortedData(data);
    }
  }, [columnSortBy, sortDirection, data]);
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
          gap: 'var(--spacing-04)',
          width: '100%',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
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
            className='undp-scrollbar'
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
                    backgroundColor: 'var(--gray-300)',
                  }}
                >
                  <tr>
                    {columnData?.map((d, i) => (
                      <th
                        className='padding-05 undp-typography small-font'
                        key={i}
                      >
                        <div className='flex-div flex-space-between flex-vert-align-center gap-03'>
                          <div
                            style={{
                              textAlign: d.align || 'left',
                              flexGrow: 1,
                              fontFamily: 'var(--fontFamily)',
                            }}
                          >
                            {d.columnTitle || d.columnId}
                          </div>
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
                        borderBottom: '1px solid var(--gray-400)',
                        cursor: onSeriesMouseClick ? 'pointer' : 'auto',
                        backgroundColor: isEqual(mouseClickData, d)
                          ? 'var(--gray-200)'
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
                          className='padding-05 small-font undp-typography small-font'
                          key={j}
                          style={{ textAlign: d.align || 'left' }}
                        >
                          <div className='flex-div'>
                            {typeof d[el.columnId] === 'number' ? (
                              <div
                                style={{
                                  textAlign: el.align || 'left',
                                  flexGrow: 1,
                                  fontFamily: 'var(--fontFamily)',
                                }}
                              >
                                {numberFormattingFunction(
                                  d[el.columnId],
                                  el.prefix || '',
                                  el.suffix || '',
                                )}
                              </div>
                            ) : typeof d[el.columnId] === 'string' ? (
                              <div
                                style={{
                                  textAlign: el.align || 'left',
                                  flexGrow: 1,
                                  fontFamily: 'var(--fontFamily)',
                                }}
                              >{`${el.prefix || ''}${d[el.columnId]}${
                                el.suffix || ''
                              }`}</div>
                            ) : (
                              <div>{d[el.columnId]}</div>
                            )}
                            {d.sortable ? <SortingIcon /> : null}
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
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
            width={width}
          />
        ) : null}
      </div>
    </div>
  );
}
