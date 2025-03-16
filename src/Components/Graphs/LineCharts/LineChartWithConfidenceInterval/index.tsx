import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import {
  AnnotationSettingsDataType,
  BackgroundStyleDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  Languages,
  LineChartWithConfidenceIntervalDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';
import { ColorLegend } from '../../../Elements/ColorLegend';

interface Props {
  data: LineChartWithConfidenceIntervalDataType[];
  graphID?: string;
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  noOfXTicks?: number;
  dateFormat?: string;
  showValues?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | string | null, number | string | null];
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  language?: Languages;
  minHeight?: number;
  strokeWidth?: number;
  showDots?: boolean;
  annotations?: AnnotationSettingsDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  mode?: 'light' | 'dark';
  regressionLine?: boolean | string;
  ariaLabel?: string;
  showIntervalDots?: boolean;
  showIntervalValues?: boolean;
  intervalLineStrokeWidth?: number;
  intervalLineColors?: [string, string];
  intervalAreaColor?: string;
  intervalAreaOpacity?: number;
  lineColor?: string;
  backgroundStyle?: BackgroundStyleDataType;
  tooltipBackgroundStyle?: CSSObject;
  yAxisTitle?: string;
  noOfYTicks?: number;
  minDate?: string | number;
  maxDate?: string | number;
  colorLegendTitle?: string;
  colorLegendColors?: string[];
  colorLegendDomains?: string[];
}

export function LineChartWithConfidenceInterval(props: Props) {
  const {
    data,
    graphTitle,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    height,
    width,
    footNote,
    noOfXTicks = 10,
    dateFormat = 'yyyy',
    showValues = false,
    backgroundColor = false,
    padding,
    lineColor,
    leftMargin = 70,
    rightMargin = 30,
    topMargin = 20,
    bottomMargin = 25,
    tooltip,
    refValues = [],
    highlightAreaSettings = [null, null],
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    minValue,
    maxValue,
    regressionLine = false,
    showIntervalDots = false,
    showIntervalValues = false,
    intervalLineStrokeWidth = 0,
    intervalLineColors = [
      UNDPColorModule.light.grays['gray-500'],
      UNDPColorModule.light.grays['gray-500'],
    ],
    intervalAreaColor = UNDPColorModule.light.primaryColors['blue-100'],
    intervalAreaOpacity = 0.4,
    graphDownload = false,
    dataDownload = false,
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    animateLine = false,
    language = 'en',
    minHeight = 0,
    strokeWidth = 2,
    showDots = true,
    annotations = [],
    customHighlightAreaSettings = [],
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    tooltipBackgroundStyle,
    yAxisTitle,
    noOfYTicks = 5,
    minDate,
    maxDate,
    colorLegendTitle,
    colorLegendColors,
    colorLegendDomains,
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
      className={`${mode || 'light'} flex  ${
        width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`}
        style={{
          ...backgroundStyle,
          ...(backgroundColor && backgroundColor !== true
            ? { backgroundColor }
            : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a line chart that highlights the difference between two datasets over time.${
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
                graphDownload={
                  graphDownload ? graphParentDiv.current : undefined
                }
                dataDownload={
                  dataDownload &&
                  data.map(d => d.data).filter(d => d !== undefined).length > 0
                    ? data.map(d => d.data).filter(d => d !== undefined)
                    : null
                }
              />
            ) : null}
            <div className='grow flex flex-col justify-center gap-3 w-full'>
              {colorLegendColors && colorLegendDomains ? (
                <ColorLegend
                  width={width}
                  colorLegendTitle={colorLegendTitle}
                  colors={colorLegendColors}
                  colorDomain={colorLegendDomains}
                  showNAColor={false}
                  mode={mode}
                />
              ) : null}
              <div
                className='flex flex-col grow justify-center leading-0'
                ref={graphDiv}
                aria-label='Graph area'
              >
                {(width || svgWidth) && (height || svgHeight) ? (
                  <Graph
                    data={data}
                    lineColor={
                      lineColor ||
                      UNDPColorModule[mode].primaryColors['blue-600']
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
                    suffix={suffix}
                    prefix={prefix}
                    dateFormat={dateFormat}
                    showValues={showValues}
                    noOfXTicks={noOfXTicks}
                    leftMargin={leftMargin}
                    rightMargin={rightMargin}
                    topMargin={topMargin}
                    bottomMargin={bottomMargin}
                    tooltip={tooltip}
                    highlightAreaSettings={highlightAreaSettings}
                    onSeriesMouseOver={onSeriesMouseOver}
                    refValues={refValues}
                    minValue={minValue}
                    maxValue={maxValue}
                    highlightAreaColor={highlightAreaColor}
                    animateLine={animateLine}
                    rtl={language === 'he' || language === 'ar'}
                    strokeWidth={strokeWidth}
                    showDots={showDots}
                    annotations={annotations}
                    customHighlightAreaSettings={customHighlightAreaSettings}
                    regressionLine={regressionLine}
                    showIntervalDots={showIntervalDots}
                    showIntervalValues={showIntervalValues}
                    intervalLineStrokeWidth={intervalLineStrokeWidth}
                    intervalLineColors={intervalLineColors}
                    intervalAreaColor={intervalAreaColor}
                    intervalAreaOpacity={intervalAreaOpacity}
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
              <GraphFooter
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
