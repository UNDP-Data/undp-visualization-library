import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import { ascending, sort } from 'd3-array';
import { format, parse } from 'date-fns';
import { SliderUI } from '@undp/design-system-react';

import { Graph } from './Graph';

import {
  AnnotationSettingsDataType,
  Languages,
  ReferenceDataType,
  ScatterPlotWithDateDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  HighlightAreaSettingsForScatterPlotDataType,
  CustomHighlightAreaSettingsForScatterPlotDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { Pause, Play } from '@/Components/Icons';

interface Props {
  // Data
  /** Array of data objects */
  data: ScatterPlotWithDateDataType[];

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
  /** Color or array of colors for circle */
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
  /** Left margin of the graph */
  leftMargin?: number;
  /** Right margin of the graph */
  rightMargin?: number;
  /** Top margin of the graph */
  topMargin?: number;
  /** Bottom margin of the graph */
  bottomMargin?: number;

  // Values and Ticks
  /** Prefix for values on x-axis */
  xPrefix?: string;
  /** Suffix for values on x-axis */
  xSuffix?: string;
  /** Prefix for values on y-axis */
  yPrefix?: string;
  /** Suffix for values on y-axis */
  ySuffix?: string;
  /** Maximum value for the x-axis */
  maxXValue?: number;
  /** Minimum value for the x-axis */
  minXValue?: number;
  /** Maximum value for the y-axis */
  maxYValue?: number;
  /** Minimum value for the y-axis */
  minYValue?: number;
  /** Maximum value mapped to the radius chart */
  maxRadiusValue?: number;
  /** Reference values for comparison on x-axis */
  refXValues?: ReferenceDataType[];
  /** Reference values for comparison on y-axis */
  refYValues?: ReferenceDataType[];
  /** Number of ticks on the x-axis */
  noOfXTicks?: number;
  /** Number of ticks on the y-axis */
  noOfYTicks?: number;

  // Graph Parameters
  /** Maximum radius of the circle */
  radius?: number;
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Title for the x-axis */
  xAxisTitle?: string;
  /** Title for the y-axis */
  yAxisTitle?: string;
  /** Annotations on the chart */
  annotations?: AnnotationSettingsDataType[];
  /** Highlighted area(square) on the chart  */
  highlightAreaSettings?: HighlightAreaSettingsForScatterPlotDataType[];
  /** Highlighted area(custom shape) on the chart  */
  customHighlightAreaSettings?: CustomHighlightAreaSettingsForScatterPlotDataType[];
  /** Color of the labels */
  labelColor?: string;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

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

  // Slider features
  /** Format of the date in the data object  */
  dateFormat?: string;
  /** Toggles if only the currently active date should be shown on the timeline. */
  showOnlyActiveDate?: boolean;
  /** Toggles if the animation should start automatically. */
  autoPlay?: boolean;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function AnimatedScatterPlot(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    showLabels = false,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius = 5,
    xAxisTitle = 'X Axis',
    yAxisTitle = 'Y Axis',
    padding,
    backgroundColor = false,
    leftMargin = 50,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 50,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refXValues = [],
    refYValues = [],
    highlightAreaSettings = [],
    showColorScale = true,
    highlightedDataPoints = [],
    graphID,
    maxRadiusValue,
    maxXValue,
    minXValue,
    maxYValue,
    minYValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    theme = 'light',
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    detailsOnClick,
    noOfXTicks = 5,
    noOfYTicks = 5,
    labelColor,
    xSuffix = '',
    ySuffix = '',
    xPrefix = '',
    yPrefix = '',
    styles,
    classNames,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

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

  const [play, setPlay] = useState(autoPlay);
  const uniqDatesSorted = sort(
    uniqBy(data, d => d.date).map(d => parse(`${d.date}`, dateFormat, new Date()).getTime()),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(autoPlay ? 0 : uniqDatesSorted.length - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markObj: any = {};

  uniqDatesSorted.forEach((d, i) => {
    markObj[`${d}`] = {
      style: {
        color: i === index ? '#232E3D' : '#A9B1B7', // Active text color vs. inactive
        fontWeight: i === index ? 'bold' : 'normal', // Active font weight vs. inactive
        display: i === index || !showOnlyActiveDate ? 'inline' : 'none', // Active font weight vs. inactive
      },
      label: format(new Date(d), dateFormat),
    };
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i < uniqDatesSorted.length - 1 ? i + 1 : 0));
    }, 2000);
    if (!play) clearInterval(interval);
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play]);

  return (
    <div
      className={`${theme || 'light'} flex  ${width ? 'w-fit grow-0' : 'w-full grow'}`}
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
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is an animated scatter plot that shows correlation between two variables showing data changes over time.${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
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
            <div className='flex gap-6 items-center' dir='ltr'>
              <button
                type='button'
                onClick={() => {
                  setPlay(!play);
                }}
                className='p-0 border-0 cursor-pointer bg-transparent'
                aria-label={play ? 'Click to pause animation' : 'Click to play animation'}
              >
                {play ? <Pause /> : <Play />}
              </button>
              <SliderUI
                min={uniqDatesSorted[0]}
                max={uniqDatesSorted[uniqDatesSorted.length - 1]}
                marks={markObj}
                step={null}
                defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
                value={uniqDatesSorted[index]}
                onChangeComplete={nextValue => {
                  setIndex(uniqDatesSorted.indexOf(nextValue as number));
                }}
                onChange={nextValue => {
                  setIndex(uniqDatesSorted.indexOf(nextValue as number));
                }}
                aria-label='Time slider. Use arrow keys to adjust selected time period.'
              />
            </div>
            <div className='grow flex flex-col justify-center gap-3 w-full'>
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
                className='flex flex-col grow justify-center w-full leading-0'
                ref={graphDiv}
                aria-label='Graph area'
              >
                {(width || svgWidth) && (height || svgHeight) ? (
                  <Graph
                    data={data}
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
                    colorDomain={
                      data.filter(el => el.color).length === 0
                        ? []
                        : colorDomain ||
                          (uniqBy(
                            data.filter(el => el.color),
                            'color',
                          ).map(d => d.color) as string[])
                    }
                    colors={
                      data.filter(el => el.color).length === 0
                        ? colors
                          ? [colors as string]
                          : [Colors.primaryColors['blue-600']]
                        : (colors as string[] | undefined) || Colors[theme].categoricalColors.colors
                    }
                    xAxisTitle={xAxisTitle}
                    yAxisTitle={yAxisTitle}
                    refXValues={refXValues}
                    refYValues={refYValues}
                    showLabels={showLabels}
                    radius={radius}
                    leftMargin={leftMargin}
                    rightMargin={rightMargin}
                    topMargin={topMargin}
                    bottomMargin={bottomMargin}
                    tooltip={tooltip}
                    onSeriesMouseOver={onSeriesMouseOver}
                    highlightAreaSettings={highlightAreaSettings}
                    highlightedDataPoints={
                      data.filter(el => el.label).length === 0 ? [] : highlightedDataPoints
                    }
                    selectedColor={selectedColor}
                    maxRadiusValue={maxRadiusValue}
                    maxXValue={maxXValue}
                    minXValue={minXValue}
                    maxYValue={maxYValue}
                    minYValue={minYValue}
                    onSeriesMouseClick={onSeriesMouseClick}
                    dateFormat={dateFormat}
                    indx={index}
                    rtl={language === 'he' || language === 'ar'}
                    annotations={annotations}
                    customHighlightAreaSettings={customHighlightAreaSettings}
                    resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                    detailsOnClick={detailsOnClick}
                    noOfXTicks={noOfXTicks}
                    noOfYTicks={noOfYTicks}
                    labelColor={labelColor}
                    xSuffix={xSuffix}
                    ySuffix={ySuffix}
                    xPrefix={xPrefix}
                    yPrefix={yPrefix}
                    styles={styles}
                    classNames={classNames}
                  />
                ) : null}
              </div>
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
