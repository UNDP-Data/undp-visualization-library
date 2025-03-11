import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  AnnotationSettingsDataType,
  BackgroundStyleDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  DifferenceLineChartDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';
import { generateRandomString } from '../../../../Utils/generateRandomString';

interface Props {
  data: DifferenceLineChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  diffAreaColors?: [string, string];
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
  lineColors?: [string, string];
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightAreaSettings?: [number | string | null, number | string | null];
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  showColorLegendAtTop?: boolean;
  labels: [string, string];
  colorLegendTitle?: string;
  strokeWidth?: number;
  showDots?: boolean;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
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

export function DifferenceLineChart(props: Props) {
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
    padding,
    lineColors = [
      UNDPColorModule.light.categoricalColors.colors[0],
      UNDPColorModule.light.categoricalColors.colors[1],
    ],
    backgroundColor = false,
    leftMargin = 70,
    rightMargin = 50,
    topMargin = 20,
    bottomMargin = 25,
    tooltip,
    highlightAreaSettings = [null, null],
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    graphDownload = false,
    dataDownload = false,
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    animateLine = false,
    language = 'en',
    minHeight = 0,
    labels,
    showColorLegendAtTop = false,
    colorLegendTitle,
    diffAreaColors = [
      UNDPColorModule.light.alerts.red,
      UNDPColorModule.light.alerts.darkGreen,
    ],
    strokeWidth = 2,
    showDots = true,
    refValues = [],
    minValue,
    maxValue,
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
      className={mode || 'light'}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col ${
          width ? 'grow-0 w-fit' : 'grow w-full'
        } h-inherit ${language || 'en'}`}
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
              {showColorLegendAtTop ? (
                <ColorLegend
                  colorDomain={labels}
                  colorLegendTitle={colorLegendTitle}
                  colors={lineColors}
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
                    lineColors={lineColors}
                    colorDomain={labels}
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
                    highlightAreaSettings={highlightAreaSettings}
                    tooltip={tooltip}
                    onSeriesMouseOver={onSeriesMouseOver}
                    showColorLegendAtTop={showColorLegendAtTop}
                    highlightAreaColor={highlightAreaColor}
                    animateLine={animateLine}
                    rtl={language === 'he' || language === 'ar'}
                    diffAreaColors={diffAreaColors}
                    idSuffix={generateRandomString(8)}
                    strokeWidth={strokeWidth}
                    showDots={showDots}
                    refValues={refValues}
                    minValue={minValue}
                    maxValue={maxValue}
                    annotations={annotations}
                    customHighlightAreaSettings={customHighlightAreaSettings}
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
