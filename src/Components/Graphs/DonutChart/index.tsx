import { useEffect, useRef, useState } from 'react';
import min from 'lodash.min';
import sortBy from 'lodash.sortby';
import { Graph } from './Graph';
import { DonutChartDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';

interface Props {
  mainText?: string;
  data: DonutChartDataType[];
  colors?: string[];
  graphTitle?: string;
  suffix?: string;
  prefix?: string;
  source?: string;
  graphDescription?: string;
  sourceLink?: string;
  subNote?: string;
  footNote?: string;
  radius?: number;
  strokeWidth?: number;
  graphLegend?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  colorDomain?: string[];
  sortData?: 'asc' | 'desc';
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  fillContainer?: boolean;
  mode?: 'light' | 'dark';
}

export function DonutChart(props: Props) {
  const {
    mainText,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    strokeWidth,
    graphDescription,
    sourceLink,
    subNote,
    footNote,
    radius,
    data,
    graphLegend,
    padding,
    backgroundColor,
    tooltip,
    onSeriesMouseOver,
    graphID,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    colorDomain,
    sortData,
    rtl,
    language,
    fillContainer,
    mode,
  } = props;

  const [donutRadius, setDonutRadius] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setDonutRadius(
        (min([entries[0].target.clientWidth, entries[0].target.clientHeight]) ||
          420) / 2,
      );
    });
    if (graphDiv.current) {
      setDonutRadius(
        (min([graphDiv.current.clientWidth, graphDiv.current.clientHeight]) ||
          420) / 2,
      );
      if (!radius) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, radius]);

  const sortedData =
    sortData === 'asc'
      ? sortBy(data, d => d.size)
      : sortData === 'desc'
      ? sortBy(data, d => d.size).reverse()
      : data;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        minHeight: 'inherit',
        width: fillContainer || !radius ? '100%' : 'fit-content',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
          : backgroundColor,
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: 1,
      }}
      id={graphID}
      ref={graphParentDiv}
    >
      <div
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {graphTitle || graphDescription || graphDownload || dataDownload ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={radius && !fillContainer ? radius * 2 : undefined}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
                  : null
              }
              mode={mode || 'light'}
            />
          ) : null}
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: '1rem',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {graphLegend !== false ? (
              <div
                style={{
                  lineHeight: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    marginBottom: 0,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    rowGap: '.75rem',
                    columnGap: '1rem',
                  }}
                >
                  {sortedData.map((d, i) => (
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                      key={i}
                    >
                      <div
                        style={{
                          width: '0.75rem',
                          height: '0.75rem',
                          borderRadius: '1rem',
                          backgroundColor:
                            (
                              colorDomain || sortedData.map(el => el.label)
                            ).indexOf(d.label) !== -1
                              ? (colors ||
                                  UNDPColorModule[mode || 'light']
                                    .categoricalColors.colors)[
                                  (
                                    colorDomain ||
                                    sortedData.map(el => el.label)
                                  ).indexOf(d.label) %
                                    (
                                      colors ||
                                      UNDPColorModule[mode || 'light']
                                        .categoricalColors.colors
                                    ).length
                                ]
                              : UNDPColorModule[mode || 'light'].graphGray,
                        }}
                      />
                      <p
                        className='undp-viz-typography'
                        style={{
                          marginBottom: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {d.label}:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                          {numberFormattingFunction(
                            d.size,
                            prefix || '',
                            suffix || '',
                          )}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div
              style={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',
                lineHeight: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              ref={graphDiv}
            >
              <div
                style={{
                  width: '100%',
                  lineHeight: 0,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {radius || donutRadius ? (
                  <Graph
                    mainText={mainText}
                    data={
                      sortData === 'asc'
                        ? sortBy(data, d => d.size)
                        : sortData === 'desc'
                        ? sortBy(data, d => d.size).reverse()
                        : data
                    }
                    colors={
                      colors ||
                      UNDPColorModule[mode || 'light'].categoricalColors.colors
                    }
                    radius={radius || donutRadius}
                    subNote={subNote}
                    strokeWidth={strokeWidth || 50}
                    tooltip={tooltip}
                    colorDomain={colorDomain || sortedData.map(d => d.label)}
                    onSeriesMouseOver={onSeriesMouseOver}
                    onSeriesMouseClick={onSeriesMouseClick}
                    rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                    language={language || (rtl ? 'ar' : 'en')}
                    mode={mode || 'light'}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {source || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
              width={radius && !fillContainer ? radius * 2 : undefined}
              mode={mode || 'light'}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
