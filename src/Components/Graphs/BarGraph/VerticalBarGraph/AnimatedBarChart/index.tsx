import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import { format, parse } from 'date-fns';
import { ascending, sort } from 'd3-array';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  BarGraphWithDateDataType,
  CSSObject,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../../Types';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';
import 'rc-slider/assets/index.css';
import { Pause, Play } from '../../../../Icons/Icons';

interface Props {
  data: BarGraphWithDateDataType[];
  colors?: string | string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  showColorScale?: boolean;
  maxValue?: number;
  minValue?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  autoSort?: boolean;
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  minBarThickness?: number;
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
}

export function AnimatedVerticalBarChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    truncateBy = 999,
    showLabels = true,
    showValues = true,
    backgroundColor = false,
    suffix = '',
    prefix = '',
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    highlightedDataPoints = [],
    padding,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    autoSort = true,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    mode = 'light',
    showNAColor = true,
    minHeight = 0,
    maxBarThickness,
    minBarThickness,
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
  const [play, setPlay] = useState(autoPlay);

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
      } h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
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
        }This is an animated bar chart showing data changes over time. ${
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
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
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
              aria-label={
                play ? 'Click to pause animation' : 'Click to play animation'
              }
            >
              {play ? <Pause /> : <Play />}
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
            {showColorScale !== false &&
            data.filter(el => el.color).length !== 0 ? (
              <ColorLegendWithMouseOver
                width={width}
                colorLegendTitle={colorLegendTitle}
                colors={
                  (colors as string[] | undefined) ||
                  UNDPColorModule[mode].categoricalColors.colors
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
                mode={mode}
              />
            ) : null}
            <div
              className='flex grow flex-col justify-center w-full leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  barColor={
                    data.filter(el => el.color).length === 0
                      ? colors
                        ? [colors as string]
                        : [UNDPColorModule[mode].primaryColors['blue-600']]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule[mode].categoricalColors.colors
                  }
                  colorDomain={
                    data.filter(el => el.color).length === 0
                      ? []
                      : colorDomain ||
                        (uniqBy(
                          data.filter(el => el.color),
                          'color',
                        ).map(d => d.color) as string[])
                  }
                  width={width || svgWidth}
                  selectedColor={selectedColor}
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
                  barPadding={barPadding}
                  showValues={showValues}
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
                  highlightedDataPoints={highlightedDataPoints}
                  onSeriesMouseClick={onSeriesMouseClick}
                  dateFormat={dateFormat}
                  indx={index}
                  autoSort={autoSort}
                  mode={mode}
                  maxBarThickness={maxBarThickness}
                  minBarThickness={minBarThickness}
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
            <GraphFooter sources={sources} footNote={footNote} width={width} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
