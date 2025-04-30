import { useState, useRef, useEffect } from 'react';
import { ascending, sort } from 'd3-array';
import uniqBy from 'lodash.uniqby';
import { format, parse } from 'date-fns';
import { SliderUI } from '@undp/design-system-react';

import { Graph } from './Graph';

import {
  DumbbellChartWithDateDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  ReferenceDataType,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { Pause, Play } from '@/Components/Icons';

interface Props {
  data: DumbbellChartWithDateDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  radius?: number;
  relativeHeight?: number;
  showValues?: boolean;
  showLabels?: boolean;
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxPositionValue?: number;
  minPositionValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  suffix?: string;
  prefix?: string;
  sortParameter?: number | 'diff';
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  language?: Languages;
  minHeight?: number;
  theme?: 'light' | 'dark';
  maxBarThickness?: number;
  minBarThickness?: number;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  detailsOnClick?: string;
  axisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  refValues?: ReferenceDataType[];
}

export function AnimatedVerticalDumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    radius = 3,
    tooltip,
    showLabels = true,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    suffix = '',
    prefix = '',
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    showValues = true,
    sortParameter,
    arrowConnector = false,
    connectorStrokeWidth = 2,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    showOnlyActiveDate = false,
    autoPlay = false,
    dateFormat = 'yyyy',
    maxBarThickness,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    axisTitle,
    noOfTicks = 5,
    valueColor,
    styles,
    classNames,
    refValues,
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
          }This is a dumbbell chart that shows comparisons between two or more data points across categories. ${
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
              <ColorLegendWithMouseOver
                width={width}
                colorDomain={colorDomain}
                colors={colors}
                colorLegendTitle={colorLegendTitle}
                setSelectedColor={setSelectedColor}
                showNAColor={false}
              />
              <div
                className='flex grow w-full justify-center leading-0'
                ref={graphDiv}
                aria-label='Graph area'
              >
                {(width || svgWidth) && (height || svgHeight) ? (
                  <Graph
                    data={data}
                    dotColors={colors}
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
                    radius={radius}
                    barPadding={barPadding}
                    showTicks={showTicks}
                    leftMargin={leftMargin}
                    rightMargin={rightMargin}
                    topMargin={topMargin}
                    bottomMargin={bottomMargin}
                    truncateBy={truncateBy}
                    showLabels={showLabels}
                    showValues={showValues}
                    tooltip={tooltip}
                    suffix={suffix}
                    prefix={prefix}
                    onSeriesMouseOver={onSeriesMouseOver}
                    maxPositionValue={maxPositionValue}
                    minPositionValue={minPositionValue}
                    onSeriesMouseClick={onSeriesMouseClick}
                    selectedColor={selectedColor}
                    dateFormat={dateFormat}
                    indx={index}
                    sortParameter={sortParameter}
                    arrowConnector={arrowConnector}
                    connectorStrokeWidth={connectorStrokeWidth}
                    maxBarThickness={maxBarThickness}
                    minBarThickness={minBarThickness}
                    resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                    detailsOnClick={detailsOnClick}
                    axisTitle={axisTitle}
                    noOfTicks={noOfTicks}
                    valueColor={valueColor}
                    styles={styles}
                    classNames={classNames}
                    refValues={refValues}
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
