import { useEffect, useRef, useState } from 'react';
import min from 'lodash.min';
import sortBy from 'lodash.sortby';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  CSSObject,
  DonutChartDataType,
  SourcesDataType,
} from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  mainText?: string | { label: string; suffix?: string; prefix?: string };
  data: DonutChartDataType[];
  colors?: string[];
  graphTitle?: string;
  suffix?: string;
  prefix?: string;
  topMargin?: number;
  bottomMargin?: number;
  sources?: SourcesDataType[];
  graphDescription?: string;
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
  mode?: 'light' | 'dark';
  width?: number;
  height?: number;
  minHeight?: number;
  relativeHeight?: number;
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  legendMaxWidth?: string;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function DonutChart(props: Props) {
  const {
    mainText,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    suffix = '',
    sources,
    prefix = '',
    strokeWidth = 50,
    graphDescription,
    subNote,
    footNote,
    radius,
    data,
    graphLegend = true,
    padding,
    backgroundColor = false,
    tooltip,
    onSeriesMouseOver,
    graphID,
    onSeriesMouseClick,
    topMargin = 0,
    bottomMargin = 0,
    graphDownload = false,
    dataDownload = false,
    colorDomain,
    sortData,
    rtl = false,
    language = 'en',
    mode = 'light',
    width,
    height,
    minHeight = 0,
    relativeHeight,
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    legendMaxWidth,
    detailsOnClick,
    tooltipBackgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
  } = props;

  const [donutRadius, setDonutRadius] = useState(0);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 420);
      setSvgHeight(height || entries[0].target.clientHeight || 420);
      setDonutRadius(
        (min([
          width || entries[0].target.clientWidth || 620,
          height || entries[0].target.clientHeight || 480,
        ]) || 420) / 2,
      );
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 420);
      setSvgWidth(graphDiv.current.clientWidth || 420);
      setDonutRadius(
        (min([graphDiv.current.clientWidth, graphDiv.current.clientHeight]) ||
          420) / 2,
      );
      if (!width || !radius) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);

  const sortedData =
    sortData === 'asc'
      ? sortBy(data, d => d.size)
      : sortData === 'desc'
      ? sortBy(data, d => d.size).reverse()
      : data;

  return (
    <div
      style={{
        ...backgroundStyle,
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        minHeight: 'inherit',
        width: width ? 'fit-content' : '100%',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: width ? 0 : 1,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a donut or pie chart chart. ${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
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
              width={width}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
                  : null
              }
              mode={mode}
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
              width: width ? `${width}px` : '100%',
              padding: `${topMargin}px 0 ${bottomMargin}px 0`,
            }}
          >
            {graphLegend ? (
              <div
                style={{
                  lineHeight: 0,
                }}
                aria-label='Color legend'
              >
                <div
                  style={{
                    display: 'flex',
                    marginBottom: 0,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    rowGap: '0.25rem',
                    columnGap: '1rem',
                    maxWidth: legendMaxWidth,
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
                                  UNDPColorModule[mode].categoricalColors
                                    .colors)[
                                  (
                                    colorDomain ||
                                    sortedData.map(el => el.label)
                                  ).indexOf(d.label) %
                                    (
                                      colors ||
                                      UNDPColorModule[mode].categoricalColors
                                        .colors
                                    ).length
                                ]
                              : UNDPColorModule[mode].graphGray,
                        }}
                      />
                      <p
                        className={`${
                          rtl ? `undp-viz-typography-${language} ` : ''
                        }undp-viz-typography`}
                        style={{
                          marginBottom: 0,
                          fontSize: '0.875rem',
                          color: UNDPColorModule[mode].grays.black,
                        }}
                      >
                        {d.label}:{' '}
                        <span
                          style={{ fontWeight: 'bold', fontSize: 'inherit' }}
                        >
                          {numberFormattingFunction(d.size, prefix, suffix)}
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
                flexGrow: width ? 0 : 1,
                width: width ? `${width}px` : '100%',
                height: height
                  ? `${Math.max(
                      minHeight,
                      height ||
                        (relativeHeight
                          ? minHeight
                            ? (width || svgWidth) * relativeHeight > minHeight
                              ? (width || svgWidth) * relativeHeight
                              : minHeight
                            : (width || svgWidth) * relativeHeight
                          : svgHeight),
                    )}px`
                  : 'auto',
                lineHeight: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              ref={graphDiv}
              aria-label='Graph area'
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
                    colors={colors}
                    radius={radius || donutRadius}
                    subNote={subNote}
                    strokeWidth={strokeWidth}
                    tooltip={tooltip}
                    colorDomain={colorDomain || sortedData.map(d => d.label)}
                    onSeriesMouseOver={onSeriesMouseOver}
                    onSeriesMouseClick={onSeriesMouseClick}
                    rtl={rtl}
                    language={language}
                    mode={mode}
                    resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                    tooltipBackgroundStyle={tooltipBackgroundStyle}
                    detailsOnClick={detailsOnClick}
                  />
                ) : null}
              </div>
            </div>
          </div>
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
