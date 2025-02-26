import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { GraphHeader } from '../../Elements/GraphHeader';
import {
  BackgroundStyleDataType,
  CSSObject,
  HeatMapDataType,
  ScaleDataType,
  SourcesDataType,
} from '../../../Types';
import { GraphFooter } from '../../Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '../../Elements/ColorLegendWithMouseOver';
import { LinearColorLegend } from '../../Elements/LinearColorLegend';
import { ThresholdColorLegendWithMouseOver } from '../../Elements/ThresholdColorLegendWithMouseOver';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: HeatMapDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  scaleType?: ScaleDataType;
  domain: number[] | string[];
  showColumnLabels?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  showRowLabels?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  noDataColor?: string;
  showColorScale?: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  fillContainer?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function HeatMap(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    showColumnLabels = true,
    leftMargin = 100,
    rightMargin = 10,
    truncateBy = 999,
    height,
    width,
    scaleType,
    domain,
    footNote,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    topMargin = 30,
    bottomMargin = 10,
    tooltip,
    onSeriesMouseOver,
    suffix = '',
    prefix = '',
    showRowLabels = true,
    relativeHeight,
    showValues,
    graphID,
    noDataColor = UNDPColorModule.light.graphGray,
    showColorScale = true,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    fillContainer = true,
    rtl = false,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
    detailsOnClick,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);
  const scale =
    scaleType ||
    (typeof domain[0] === 'string'
      ? 'categorical'
      : domain.length === 2
      ? 'linear'
      : 'threshold');

  return (
    <div
      className={`ml-auto mr-auto flex flex-col ${width ? 'grow-0' : 'grow'} ${
        !fillContainer ? 'w-fit' : 'w-full'
      } h-inherit`}
      style={{
        ...backgroundStyle,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a heatmap. ${graphDescription ? ` ${graphDescription}` : ''}`
      }
    >
      <div
        className='flex grow'
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
        }}
      >
        <div className='flex flex-col gap-4 w-full grow justify-between'>
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
          <div className='grow flex flex-col justify-center gap-3 w-full'>
            {showColorScale ? (
              scale === 'categorical' ? (
                <div style={{ marginBottom: '-12px' }}>
                  <ColorLegendWithMouseOver
                    rtl={rtl}
                    language={language}
                    width={fillContainer ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors ||
                      (typeof domain[0] === 'string'
                        ? UNDPColorModule[mode].categoricalColors.colors
                        : domain.length === 2
                        ? [
                            UNDPColorModule[mode].sequentialColors
                              .neutralColorsx09[0],
                            UNDPColorModule[mode].sequentialColors
                              .neutralColorsx09[8],
                          ]
                        : UNDPColorModule[mode].sequentialColors[
                            `neutralColorsx0${
                              (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                            }`
                          ])
                    }
                    colorDomain={domain.map(d => `${d}`)}
                    setSelectedColor={setSelectedColor}
                    showNAColor={showNAColor}
                    mode={mode}
                  />
                </div>
              ) : scale === 'threshold' ? (
                <div style={{ marginBottom: '-12px' }}>
                  <ThresholdColorLegendWithMouseOver
                    width={fillContainer ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors ||
                      (typeof domain[0] === 'string'
                        ? UNDPColorModule[mode].categoricalColors.colors
                        : domain.length === 2
                        ? [
                            UNDPColorModule[mode].sequentialColors
                              .neutralColorsx09[0],
                            UNDPColorModule[mode].sequentialColors
                              .neutralColorsx09[8],
                          ]
                        : UNDPColorModule[mode].sequentialColors[
                            `neutralColorsx0${
                              (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                            }`
                          ])
                    }
                    colorDomain={domain as number[]}
                    setSelectedColor={setSelectedColor}
                    naColor={noDataColor}
                    rtl={rtl}
                    language={language}
                    mode={mode}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '-12px' }}>
                  <LinearColorLegend
                    width={fillContainer ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors || [
                        UNDPColorModule[mode].sequentialColors
                          .neutralColorsx09[0],
                        UNDPColorModule[mode].sequentialColors
                          .neutralColorsx09[8],
                      ]
                    }
                    colorDomain={domain as number[]}
                    mode={mode}
                    rtl={rtl}
                    language={language}
                  />
                </div>
              )
            ) : null}
            <div
              className='flex flex-col grow justify-center gap-3 w-full leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  domain={domain}
                  width={width || svgWidth}
                  colors={
                    colors ||
                    (typeof domain[0] === 'string'
                      ? UNDPColorModule[mode].categoricalColors.colors
                      : domain.length === 2
                      ? [
                          UNDPColorModule[mode].sequentialColors
                            .neutralColorsx09[0],
                          UNDPColorModule[mode].sequentialColors
                            .neutralColorsx09[8],
                        ]
                      : UNDPColorModule[mode].sequentialColors[
                          `neutralColorsx0${
                            (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                          }`
                        ])
                  }
                  noDataColor={noDataColor}
                  scaleType={scale}
                  height={Math.max(
                    minHeight,
                    height ||
                      (relativeHeight
                        ? minHeight
                          ? (width || svgWidth) * relativeHeight > minHeight
                            ? (width || svgWidth) * relativeHeight
                            : minHeight
                          : (width || svgWidth) * relativeHeight
                        : svgHeight),
                  )}
                  showColumnLabels={showColumnLabels}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  selectedColor={selectedColor}
                  truncateBy={truncateBy}
                  showRowLabels={showRowLabels}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showValues={showValues}
                  suffix={suffix}
                  prefix={prefix}
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
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
