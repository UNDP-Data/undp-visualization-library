import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  AnnotationSettingsDataType,
  BackgroundStyleDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  MultiLineChartDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegend } from '../../../Elements/ColorLegend';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: MultiLineChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  noOfXTicks?: number;
  dateFormat?: string;
  suffix?: string;
  prefix?: string;
  labels: string[];
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  showValues?: boolean;
  relativeHeight?: number;
  showColorLegendAtTop?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | string | null, number | string | null];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  highlightedLines?: string[];
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  colorLegendTitle?: string;
  minHeight?: number;
  strokeWidth?: number;
  showDots?: boolean;
  annotations?: AnnotationSettingsDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  tooltipBackgroundStyle?: CSSObject;
  yAxisTitle?: string;
  noOfYTicks?: number;
  minDate?: string | number;
  maxDate?: string | number;
}

export function MultiLineChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    height,
    width,
    footNote,
    noOfXTicks = 10,
    dateFormat = 'yyyy',
    labels,
    padding,
    showValues = false,
    backgroundColor = false,
    leftMargin = 70,
    rightMargin = 50,
    topMargin = 20,
    bottomMargin = 25,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorLegendAtTop = false,
    refValues = [],
    highlightAreaSettings = [null, null],
    graphID,
    minValue,
    maxValue,
    highlightedLines = [],
    graphDownload = false,
    dataDownload = false,
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    animateLine = false,
    rtl = false,
    language = 'en',
    colorLegendTitle,
    minHeight = 0,
    strokeWidth = 2,
    showDots = true,
    annotations = [],
    customHighlightAreaSettings = [],
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    tooltipBackgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
    yAxisTitle,
    noOfYTicks = 5,
    minDate,
    maxDate,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

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

  return (
    <div
      className={`ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={rtl ? 'rtl' : undefined}
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
        }This is a multi-line chart that shows trends over time.${
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
        <div className='flex flex-col w-full gap-4 grow justify-between'>
          {graphTitle || graphDescription || graphDownload || dataDownload ? (
            <GraphHeader
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
            />
          ) : null}
          <div className='grow flex flex-col justify-center gap-3 w-full'>
            {showColorLegendAtTop ? (
              <ColorLegend
                colorDomain={labels}
                colorLegendTitle={colorLegendTitle}
                colors={colors}
                showNAColor={false}
                mode={mode}
              />
            ) : null}
            <div
              className='w-full grow leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  colors={
                    colors || UNDPColorModule[mode].categoricalColors.colors
                  }
                  width={width || svgWidth}
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
                  dateFormat={dateFormat}
                  noOfXTicks={noOfXTicks}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  labels={labels}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showColorLegendAtTop={showColorLegendAtTop}
                  showValues={showValues}
                  suffix={suffix}
                  prefix={prefix}
                  highlightAreaSettings={highlightAreaSettings}
                  refValues={refValues}
                  minValue={minValue}
                  maxValue={maxValue}
                  highlightedLines={highlightedLines}
                  highlightAreaColor={highlightAreaColor}
                  animateLine={animateLine}
                  rtl={rtl}
                  strokeWidth={strokeWidth}
                  showDots={showDots}
                  annotations={annotations}
                  customHighlightAreaSettings={customHighlightAreaSettings}
                  mode={mode}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  yAxisTitle={yAxisTitle}
                  noOfYTicks={noOfYTicks}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              ) : null}
            </div>
          </div>
          {sources || footNote ? (
            <GraphFooter sources={sources} footNote={footNote} width={width} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
