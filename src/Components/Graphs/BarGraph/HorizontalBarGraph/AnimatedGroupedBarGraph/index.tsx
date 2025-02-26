import { useState, useRef, useEffect } from 'react';
import { ascending, sort } from 'd3-array';
import uniqBy from 'lodash.uniqby';
import { format, parse } from 'date-fns';
import Slider from 'rc-slider';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  CSSObject,
  GroupedBarGraphWithDateDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Pause, Play } from '../../../../Icons/Icons';
import 'rc-slider/assets/index.css';

interface Props {
  data: GroupedBarGraphWithDateDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  showLabels?: boolean;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
}

export function AnimatedHorizontalGroupedBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    suffix = '',
    prefix = '',
    showValues = true,
    padding,
    backgroundColor = false,
    leftMargin = 100,
    rightMargin = 40,
    topMargin = 25,
    showLabels = true,
    bottomMargin = 10,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    rtl = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    maxBarThickness,
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    valueColor,
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

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
    uniqBy(data, d => d.date).map(d =>
      parse(`${d.date}`, dateFormat, new Date()).getTime(),
    ),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(autoPlay ? 0 : uniqDatesSorted.length - 1);

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
      className={`ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit`}
      style={{
        ...backgroundStyle,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a animated grouped bar chart showing data changes over time. ${
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
        <div className='flex flex-col gap-4 w-full grow justify-between'>
          {graphTitle || graphDescription || graphDownload || dataDownload ? (
            <GraphHeader
              mode={mode}
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
                  : null
              }
            />
          ) : null}
          <div className='flex gap-6 items-center'>
            <button
              type='button'
              onClick={() => {
                setPlay(!play);
              }}
              style={{
                padding: 0,
                border: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
              aria-label={
                play ? 'Click to pause animation' : 'Click to play animation'
              }
            >
              {play ? <Pause mode={mode} /> : <Play mode={mode} />}
            </button>
            <Slider
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
              className='undp-viz-slider'
              aria-label='Time slider. Use arrow keys to adjust selected time period.'
            />
          </div>
          <div className='grow flex flex-col justify-center gap-3 w-full'>
            <ColorLegendWithMouseOver
              rtl={rtl}
              language={language}
              width={width}
              colorDomain={colorDomain}
              colors={colors}
              colorLegendTitle={colorLegendTitle}
              setSelectedColor={setSelectedColor}
              showNAColor={false}
              mode={mode}
            />
            <div
              className='w-full grow leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  barColors={colors}
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
                  showValues={showValues}
                  barPadding={barPadding}
                  showTicks={showTicks}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  truncateBy={truncateBy}
                  showLabels={showLabels}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  refValues={refValues}
                  maxValue={maxValue}
                  minValue={minValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  selectedColor={selectedColor}
                  dateFormat={dateFormat}
                  indx={index}
                  rtl={rtl}
                  language={language}
                  mode={mode}
                  maxBarThickness={maxBarThickness}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  detailsOnClick={detailsOnClick}
                  barAxisTitle={barAxisTitle}
                  noOfTicks={noOfTicks}
                  valueColor={valueColor}
                />
              ) : null}
            </div>
          </div>
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
