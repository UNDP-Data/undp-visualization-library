import { useState, useRef, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { ascending, sort } from 'd3-array';
import uniqBy from 'lodash.uniqby';
import Slider from 'rc-slider';
import { Graph } from './Graph';
import {
  ReferenceDataType,
  GroupedBarGraphWithDateDataType,
  SourcesDataType,
  BackgroundStyleDataType,
  CSSObject,
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
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  barPadding?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showTicks?: boolean;
  colorDomain: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
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
  yAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
}

export function AnimatedVerticalGroupedBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
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
    padding,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    graphDownload = false,
    dataDownload = false,
    rtl = false,
    language = 'en',
    mode = 'light',
    minHeight = 0,
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
    yAxisTitle,
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
      style={{
        ...backgroundStyle,
        display: 'flex',
        flexDirection: 'column',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
        height: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: backgroundColor ? padding || '1rem' : padding || 0,
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
        }This is an animated grouped bar chart showing data changes over time. ${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
    >
      <div
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '1rem',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {graphTitle || graphDescription || graphDownload || dataDownload ? (
            <GraphHeader
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
              mode={mode}
            />
          ) : null}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
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
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
            }}
          >
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
              style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
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
                  barPadding={barPadding}
                  showLabels={showLabels}
                  showValues={showValues}
                  showTicks={showTicks}
                  truncateBy={truncateBy}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
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
                  yAxisTitle={yAxisTitle}
                  noOfTicks={noOfTicks}
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
