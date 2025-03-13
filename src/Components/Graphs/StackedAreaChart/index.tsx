import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  AnnotationSettingsDataType,
  AreaChartDataType,
  BackgroundStyleDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../Types';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { ColorLegend } from '../../Elements/ColorLegend';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: AreaChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  noOfXTicks?: number;
  dateFormat?: string;
  colorDomain: string[];
  backgroundColor?: string | boolean;
  padding?: string;
  colorLegendTitle?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  relativeHeight?: number;
  bottomMargin?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | string | null, number | string | null];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  showColorScale?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  annotations?: AnnotationSettingsDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  tooltipBackgroundStyle?: CSSObject;
  yAxisTitle?: string;
  noOfYTicks?: number;
  prefix?: string;
  suffix?: string;
}

export function AreaChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    noOfXTicks = 10,
    dateFormat = 'yyyy',
    colorDomain,
    padding,
    backgroundColor = false,
    colorLegendTitle,
    leftMargin = 50,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    highlightAreaSettings = [null, null],
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refValues = [],
    graphID,
    minValue,
    maxValue,
    graphDownload = false,
    dataDownload = false,
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    showColorScale = true,
    language = 'en',
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    tooltipBackgroundStyle,
    yAxisTitle,
    noOfYTicks = 5,
    prefix = '',
    suffix = '',
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
          }This is a stacked area chart that shows trends over time.${
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
              {showColorScale !== false ? (
                <ColorLegend
                  colorDomain={colorDomain}
                  colors={colors}
                  colorLegendTitle={colorLegendTitle}
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
                    colors={colors}
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
                    tooltip={tooltip}
                    onSeriesMouseOver={onSeriesMouseOver}
                    highlightAreaSettings={highlightAreaSettings}
                    refValues={refValues}
                    minValue={minValue}
                    maxValue={maxValue}
                    highlightAreaColor={highlightAreaColor}
                    rtl={language === 'he' || language === 'ar'}
                    annotations={annotations}
                    customHighlightAreaSettings={customHighlightAreaSettings}
                    tooltipBackgroundStyle={tooltipBackgroundStyle}
                    yAxisTitle={yAxisTitle}
                    noOfYTicks={noOfYTicks}
                    prefix={prefix}
                    suffix={suffix}
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
