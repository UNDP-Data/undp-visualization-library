import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import {
  ButterflyChartDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { UNDPColorModule } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  // Data
  data: ButterflyChartDataType[];

  // Titles, Labels, and Sources
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sources?: SourcesDataType[];
  ariaLabel?: string;
  leftBarTitle?: string;
  rightBarTitle?: string;

  // Colors and Styling
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  leftBarColor?: string;
  rightBarColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;

  // Size and Spacing
  width?: number;
  height?: number;
  minHeight?: number;
  relativeHeight?: number;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  barPadding?: number;
  centerGap?: number;

  // Values and Ticks
  prefix?: string;
  suffix?: string;
  maxValue?: number;
  minValue?: number;
  truncateBy?: number;
  refValues?: ReferenceDataType[];
  noOfTicks?: number;

  // Graph Parameters
  showValues?: boolean;
  showTicks?: boolean;
  showColorScale?: boolean;
  graphDownload?: boolean;
  dataDownload?: boolean;
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  tooltip?: string;
  detailsOnClick?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  language?: Languages;
  mode?: 'light' | 'dark';
  graphID?: string;
}

export function ButterflyChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    padding,
    leftBarColor = UNDPColorModule.light.categoricalColors.colors[0],
    rightBarColor = UNDPColorModule.light.categoricalColors.colors[1],
    backgroundColor = false,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 25,
    bottomMargin = 30,
    rightBarTitle = 'Right bar graph',
    leftBarTitle = 'Left bar graph',
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    barPadding = 0.25,
    truncateBy = 999,
    onSeriesMouseClick,
    centerGap = 100,
    showValues = true,
    maxValue,
    minValue,
    refValues = [],
    suffix = '',
    prefix = '',
    showTicks = true,
    showColorScale = false,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    colorLegendTitle,
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
    noOfTicks = 5,
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
          }This is a diverging bar chart. ${
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
                  {showColorScale ? (
                    <ColorLegend
                      colorLegendTitle={colorLegendTitle}
                      colorDomain={[leftBarTitle, rightBarTitle]}
                      colors={[leftBarColor, rightBarColor]}
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
                        barColors={[leftBarColor, rightBarColor]}
                        width={width || svgWidth}
                        centerGap={centerGap}
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
                        truncateBy={truncateBy}
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        axisTitles={[leftBarTitle, rightBarTitle]}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        barPadding={barPadding}
                        refValues={refValues}
                        maxValue={maxValue}
                        minValue={minValue}
                        showValues={showValues}
                        onSeriesMouseClick={onSeriesMouseClick}
                        showTicks={showTicks}
                        suffix={suffix}
                        prefix={prefix}
                        resetSelectionOnDoubleClick={
                          resetSelectionOnDoubleClick
                        }
                        detailsOnClick={detailsOnClick}
                        styles={styles}
                        classNames={classNames}
                        noOfTicks={noOfTicks}
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
