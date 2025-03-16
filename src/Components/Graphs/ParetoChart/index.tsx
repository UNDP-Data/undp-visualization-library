import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { ColorLegend } from '../../Elements/ColorLegend';
import {
  BackgroundStyleDataType,
  CSSObject,
  Languages,
  ParetoChartDataType,
  SourcesDataType,
} from '../../../Types';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: ParetoChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  barTitle?: string;
  lineTitle?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  barColor?: string;
  lineColor?: string;
  sameAxes?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  barPadding?: number;
  truncateBy?: number;
  showLabels?: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  language?: Languages;
  colorLegendTitle?: string;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  noOfYTicks?: number;
  lineSuffix?: string;
  barSuffix?: string;
  linePrefix?: string;
  barPrefix?: string;
}

export function ParetoChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    padding,
    lineColor = UNDPColorModule.light.categoricalColors.colors[1],
    barColor = UNDPColorModule.light.categoricalColors.colors[0],
    sameAxes = false,
    backgroundColor = false,
    leftMargin = 80,
    rightMargin = 80,
    topMargin = 20,
    bottomMargin = 25,
    lineTitle = 'Line chart',
    barTitle = 'Bar graph',
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    graphDownload = false,
    dataDownload = false,
    barPadding = 0.25,
    truncateBy = 999,
    showLabels = true,
    onSeriesMouseClick,
    language = 'en',
    colorLegendTitle,
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle,
    detailsOnClick,
    noOfYTicks = 5,
    lineSuffix = '',
    barSuffix = '',
    linePrefix = '',
    barPrefix = '',
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
          }This is a pareto chart that shows a variable as bars and another as line chart.${
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
              <ColorLegend
                colorDomain={[barTitle, lineTitle]}
                colors={[
                  barColor || UNDPColorModule[mode].categoricalColors.colors[0],
                  lineColor ||
                    UNDPColorModule[mode].categoricalColors.colors[1],
                ]}
                colorLegendTitle={colorLegendTitle}
                showNAColor={false}
                mode={mode}
              />
              <div
                className='flex flex-col grow justify-center leading-0'
                ref={graphDiv}
                aria-label='Graph area'
              >
                {(width || svgWidth) && (height || svgHeight) ? (
                  <Graph
                    data={data}
                    sameAxes={sameAxes}
                    lineColor={lineColor}
                    barColor={barColor}
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
                    truncateBy={truncateBy}
                    leftMargin={leftMargin}
                    rightMargin={rightMargin}
                    topMargin={topMargin}
                    bottomMargin={bottomMargin}
                    axisTitles={[barTitle, lineTitle]}
                    tooltip={tooltip}
                    onSeriesMouseOver={onSeriesMouseOver}
                    barPadding={barPadding}
                    showLabels={showLabels}
                    onSeriesMouseClick={onSeriesMouseClick}
                    resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                    tooltipBackgroundStyle={tooltipBackgroundStyle}
                    detailsOnClick={detailsOnClick}
                    noOfYTicks={noOfYTicks}
                    lineSuffix={lineSuffix}
                    barSuffix={barSuffix}
                    linePrefix={linePrefix}
                    barPrefix={barPrefix}
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
