import { useEffect, useRef, useState } from 'react';
import min from 'lodash.min';
import { cn } from '@undp/design-system-react';
import uniqBy from 'lodash.uniqby';

import { Graph } from './Graph';

import {
  RadarChartDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';

interface Props {
  // Data
  /** Array of data objects */
  data: RadarChartDataType[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string;
  /** Description of the graph */
  graphDescription?: string;
  /** Footnote for the graph */
  footNote?: string;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Color or array of colors for each line */
  colors?: string | string[];
  /** Domain of colors for the graph */
  colorDomain?: string[];
  /** Title for the color legend */
  colorLegendTitle?: string;
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Height of the graph */
  height?: number;
  /** Minimum height of the graph */
  minHeight?: number;
  /** Relative height scaling factor. This overwrites the height props */
  relativeHeight?: number;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;
  /** Radius of the radar chart */
  radius?: number;
  /** Left margin of the graph */
  leftMargin?: number;
  /** Right margin of the graph */
  rightMargin?: number;
  /** Top margin of the graph */
  topMargin?: number;
  /** Bottom margin of the graph */
  bottomMargin?: number;

  // Values and Ticks
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;

  // Graph Parameters
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Toggle visibility of dots on the line */
  showDots?: boolean;
  /** Stroke width of the line */
  strokeWidth?: number;
  /** Toggle is the shape is filled or not */
  fillShape?: boolean;
  /** No. of ticks on the x-axis  */
  noOfTicks?: number;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedLines?: (string | number)[];
  /** Labels for the axes  */
  axisLabels: (string | number)[];
  /** Curve type for the line */
  curveType?: 'linear' | 'curve';
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. This uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  tooltip?: string;
  /** Details displayed on the modal when user clicks of a data point */
  detailsOnClick?: string;
  /** Callback for mouse over event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function RadarChart(props: Props) {
  const {
    graphTitle,
    colors,
    sources,
    graphDescription,
    footNote,
    radius,
    data,
    showColorScale = true,
    padding,
    backgroundColor = false,
    tooltip,
    onSeriesMouseOver,
    graphID,
    onSeriesMouseClick,
    topMargin = 75,
    bottomMargin = 75,
    leftMargin = 75,
    rightMargin = 75,
    graphDownload = false,
    dataDownload = false,
    colorDomain,
    language = 'en',
    theme = 'light',
    highlightedLines = [],
    width,
    height,
    minHeight = 0,
    strokeWidth = 2,
    relativeHeight,
    ariaLabel,
    colorLegendTitle,
    detailsOnClick,
    styles,
    classNames,
    showNAColor = true,
    axisLabels,
    showDots = true,
    showValues = false,
    curveType = 'curve',
    noOfTicks = 5,
    minValue,
    maxValue,
    fillShape = false,
    resetSelectionOnDoubleClick = true,
  } = props;

  const [graphRadius, setGraphRadius] = useState(0);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 420);
      setSvgHeight(height || entries[0].target.clientHeight || 420);
      setGraphRadius(
        (min([
          width || entries[0].target.clientWidth || 620,
          height || entries[0].target.clientHeight || 480,
        ]) || 420) / 2,
      );
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 420);
      setSvgWidth(graphDiv.current.clientWidth || 420);
      setGraphRadius(
        (min([graphDiv.current.clientWidth, graphDiv.current.clientHeight]) || 420) / 2,
      );
      if (!width || !radius) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height, radius]);
  return (
    <div
      className={`${theme || 'light'} flex  ${width ? 'w-fit grow-0' : 'w-full grow'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !backgroundColor
              ? 'bg-transparent '
              : backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`,
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          minHeight: 'inherit',
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a donut or pie chart chart. ${graphDescription ? ` ${graphDescription}` : ''}`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col gap-2 w-full grow justify-between'>
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
                graphDownload={graphDownload ? graphParentDiv.current : undefined}
                dataDownload={
                  dataDownload
                    ? data.map(d => d.data).filter(d => d !== undefined).length > 0
                      ? data.map(d => d.data).filter(d => d !== undefined)
                      : data.filter(d => d !== undefined)
                    : null
                }
              />
            ) : null}
            <div
              className='flex grow flex-col justify-center items-stretch gap-8 flex-wrap'
              style={{
                width: width ? `${width}px` : '100%',
              }}
            >
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale && data.filter(el => el.color).length !== 0 ? (
                    <ColorLegendWithMouseOver
                      width={width}
                      colorLegendTitle={colorLegendTitle}
                      colors={
                        (colors as string[] | undefined) || Colors[theme].categoricalColors.colors
                      }
                      colorDomain={
                        colorDomain ||
                        (uniqBy(
                          data.filter(el => el.color),
                          'color',
                        ).map(d => d.color) as string[])
                      }
                      setSelectedColor={setSelectedColor}
                      showNAColor={showNAColor}
                    />
                  ) : null}
                  <div
                    className={`flex ${
                      width ? 'grow-0' : 'grow'
                    } items-center justify-center leading-0`}
                    style={{
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
                    }}
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    <div className='w-full flex justify-center leading-0'>
                      {radius || graphRadius ? (
                        <Graph
                          data={data}
                          lineColors={
                            data.filter(el => el.color).length === 0
                              ? colors
                                ? [colors as string]
                                : [Colors.primaryColors['blue-600']]
                              : (colors as string[] | undefined) ||
                                Colors[theme].categoricalColors.colors
                          }
                          radius={radius || graphRadius}
                          tooltip={tooltip}
                          colorDomain={
                            colorDomain ||
                            (uniqBy(
                              data.filter(el => el.color),
                              'color',
                            ).map(d => d.color) as string[])
                          }
                          onSeriesMouseOver={onSeriesMouseOver}
                          onSeriesMouseClick={onSeriesMouseClick}
                          styles={styles}
                          detailsOnClick={detailsOnClick}
                          selectedColor={selectedColor}
                          axisLabels={axisLabels}
                          strokeWidth={strokeWidth}
                          showValues={showValues}
                          showDots={showDots}
                          topMargin={topMargin}
                          bottomMargin={bottomMargin}
                          leftMargin={leftMargin}
                          rightMargin={rightMargin}
                          curveType={curveType}
                          noOfTicks={noOfTicks}
                          minValue={minValue}
                          maxValue={maxValue}
                          fillShape={fillShape}
                          highlightedLines={highlightedLines}
                          resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                        />
                      ) : null}
                    </div>
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
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
