import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  AnnotationSettingsDataType,
  AreaChartDataType,
  CustomHighlightAreaSettingsDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  HighlightAreaSettingsDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  // Data
  /** Array of data objects */
  data: AreaChartDataType[];

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
  /** array of colors for different lines and areas */
  colors?: string[];
  /** Domain of colors for the graph */
  colorDomain: string[];
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
  /** Padding around the graph */
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
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** No. of ticks on the x-axis  */
  noOfXTicks?: number;
  /** No. of ticks on the y-axis  */
  noOfYTicks?: number;

  // Graph Parameters
  /** Format of the date in the data object  */
  dateFormat?: string;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Title for the Y-axis */
  yAxisTitle?: string;
  /** Annotations on the chart */
  annotations?: AnnotationSettingsDataType[];
  /** Highlighted area(square) on the chart  */
  highlightAreaSettings?: HighlightAreaSettingsDataType[];
  /** Highlighted area(custom shape) on the chart  */
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  /** Curve type for the line */
  curveType?: 'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore';
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. This uses the handlebar template to display the data */
  tooltip?: string;
  /** Callback for mouse over event */
  onSeriesMouseOver?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Theme mode */
  mode?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function AreaChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
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
    highlightAreaSettings = [],
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refValues = [],
    graphID,
    minValue,
    maxValue,
    graphDownload = false,
    dataDownload = false,
    showColorScale = true,
    language = 'en',
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    mode = 'light',
    ariaLabel,
    yAxisTitle,
    noOfYTicks = 5,
    prefix = '',
    suffix = '',
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
                                ? (width || svgWidth) * relativeHeight >
                                  minHeight
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
                        rtl={language === 'he' || language === 'ar'}
                        annotations={annotations}
                        customHighlightAreaSettings={
                          customHighlightAreaSettings
                        }
                        yAxisTitle={yAxisTitle}
                        noOfYTicks={noOfYTicks}
                        prefix={prefix}
                        suffix={suffix}
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
