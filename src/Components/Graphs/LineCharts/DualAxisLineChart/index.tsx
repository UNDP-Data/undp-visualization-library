import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  DualAxisLineChartDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';
import { EmptyState } from '../../../Elements/EmptyState';

interface Props {
  data: DualAxisLineChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  lineTitles?: [string, string];
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
  sameAxes?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightAreaSettings?: [number | string | null, number | string | null];
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  showColorScale?: boolean;
  language?: Languages;
  minHeight?: number;
  strokeWidth?: number;
  showDots?: boolean;
  colorLegendTitle?: string;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  noOfYTicks?: number;
  lineSuffixes?: [string, string];
  linePrefixes?: [string, string];
  minDate?: string | number;
  maxDate?: string | number;
  curveType?: 'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore';
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function DualAxisLineChart(props: Props) {
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
    sameAxes = false,
    backgroundColor = false,
    leftMargin = 80,
    rightMargin = 80,
    topMargin = 20,
    bottomMargin = 25,
    lineTitles = ['Line 1', 'Line 2'],
    lineSuffixes = ['', ''],
    linePrefixes = ['', ''],
    tooltip,
    highlightAreaSettings = [null, null],
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    graphDownload = false,
    dataDownload = false,
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    animateLine = false,
    strokeWidth = 2,
    showDots = true,
    language = 'en',
    showColorScale = true,
    minHeight = 0,
    colorLegendTitle,
    mode = 'light',
    ariaLabel,
    noOfYTicks = 5,
    maxDate,
    minDate,
    curveType = 'curve',
    styles,
    classNames,
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
          ...(styles?.graphBackground || {}),
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
          }This is a line chart that show trends for two datasets over time.${
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
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
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
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale ? null : (
                    <ColorLegend
                      colorDomain={lineTitles}
                      colorLegendTitle={colorLegendTitle}
                      colors={lineColors}
                      showNAColor={false}
                      mode={mode}
                    />
                  )}
                  <div
                    className='flex flex-col grow justify-center leading-0'
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={data}
                        sameAxes={sameAxes}
                        lineColors={lineColors}
                        width={width || svgWidth}
                        height={Math.max(
                          minHeight,
                          height ||
                            (relativeHeight
                              ? minHeight
                                ? (width || svgWidth) * relativeHeight >
                                  minHeight
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
                        lineTitles={lineTitles}
                        highlightAreaSettings={highlightAreaSettings}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        highlightAreaColor={highlightAreaColor}
                        animateLine={animateLine}
                        strokeWidth={strokeWidth}
                        showDots={showDots}
                        noOfYTicks={noOfYTicks}
                        lineSuffixes={lineSuffixes}
                        linePrefixes={linePrefixes}
                        minDate={minDate}
                        maxDate={maxDate}
                        curveType={curveType}
                        styles={styles}
                        classNames={classNames}
                      />
                    ) : null}
                  </div>
                </>
              )}
            </div>
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
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
