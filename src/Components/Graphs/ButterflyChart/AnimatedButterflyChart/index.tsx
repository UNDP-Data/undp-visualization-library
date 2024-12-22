import { useState, useRef, useEffect } from 'react';

import uniqBy from 'lodash.uniqby';
import { ascending, sort } from 'd3-array';
import { format, parse } from 'date-fns';
import Slider from 'rc-slider';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  BackgroundStyleDataType,
  ButterflyChartWithDateDataType,
  CSSObject,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';
import { Pause, Play } from '../../../Icons/Icons';
import 'rc-slider/assets/index.css';
import { Graph } from './Graph';

interface Props {
  data: ButterflyChartWithDateDataType[];
  graphTitle?: string;
  graphDescription?: string;
  leftBarTitle?: string;
  rightBarTitle?: string;
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
  barColors?: [string, string];
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  barPadding?: number;
  truncateBy?: number;
  suffix?: string;
  prefix?: string;
  showTicks?: boolean;
  showValues?: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  centerGap?: number;
  maxValue?: number;
  minValue?: number;
  showColorScale?: boolean;
  refValues?: ReferenceDataType[];
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  colorLegendTitle?: string;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function AnimatedButterflyChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    padding,
    barColors = [
      UNDPColorModule.light.categoricalColors.colors[0],
      UNDPColorModule.light.categoricalColors.colors[1],
    ],
    backgroundColor = false,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 25,
    bottomMargin = 30,
    rightBarTitle = 'Right bar graph',
    leftBarTitle = 'Left bar graph',
    barPadding = 0.25,
    truncateBy = 999,
    onSeriesMouseClick,
    centerGap = 100,
    showValues = true,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    refValues = [],
    suffix = '',
    prefix = '',
    showTicks = true,
    showColorScale = false,
    graphDownload = false,
    dataDownload = false,
    rtl = false,
    language = 'en',
    maxValue,
    minValue,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    colorLegendTitle,
    minHeight = 0,
    mode = 'light',
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
        }This is an animated diverging bar chart showing data changes over time. ${
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
            {showColorScale ? (
              <ColorLegend
                rtl={rtl}
                language={language}
                colorLegendTitle={colorLegendTitle}
                colorDomain={[leftBarTitle, rightBarTitle]}
                colors={barColors}
                showNAColor={false}
                mode={mode}
              />
            ) : null}
            <div
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                lineHeight: 0,
              }}
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  barColors={barColors}
                  width={width || svgWidth}
                  centerGap={centerGap}
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
                  axisTitles={[leftBarTitle, rightBarTitle]}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  barPadding={barPadding}
                  refValues={refValues}
                  maxValue={maxValue}
                  minValue={minValue}
                  showValues={
                    checkIfNullOrUndefined(showValues)
                      ? true
                      : (showValues as boolean)
                  }
                  onSeriesMouseClick={onSeriesMouseClick}
                  showTicks={showTicks}
                  suffix={suffix}
                  prefix={prefix}
                  dateFormat={dateFormat}
                  indx={index}
                  rtl={rtl}
                  language={language}
                  mode={mode}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  detailsOnClick={detailsOnClick}
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
