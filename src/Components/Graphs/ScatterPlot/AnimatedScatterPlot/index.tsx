import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import { ascending, sort } from 'd3-array';
import { format, parse } from 'date-fns';
import Slider from 'rc-slider';
import {
  AnnotationSettingsDataType,
  BackgroundStyleDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  ReferenceDataType,
  ScatterPlotWithDateDataType,
  SourcesDataType,
} from '../../../../Types';
import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../ColorPalette';
import { Pause, Play } from '../../../Icons/Icons';
import 'rc-slider/assets/index.css';

interface Props {
  data: ScatterPlotWithDateDataType[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  showLabels?: boolean;
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  radius?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refXValues?: ReferenceDataType[];
  refYValues?: ReferenceDataType[];
  highlightedDataPoints?: (string | number)[];
  highlightAreaSettings?: [
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  highlightAreaColor?: string;
  showColorScale?: boolean;
  graphID?: string;
  maxRadiusValue?: number;
  maxXValue?: number;
  minXValue?: number;
  maxYValue?: number;
  minYValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
  minHeight?: number;
  annotations?: AnnotationSettingsDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
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
    highlightAreaSettings = [null, null, null, null],
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
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    rtl = false,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
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
        height: 'inherit',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
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
        }This is an animated scatter plot that shows correlation between two variables showing data changes over time.${
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
            {showColorScale && data.filter(el => el.color).length !== 0 ? (
              <ColorLegendWithMouseOver
                rtl={rtl}
                language={language}
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
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                lineHeight: 0,
                width: '100%',
              }}
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
                        : [UNDPColorModule[mode].primaryColors['blue-600']]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule[mode].categoricalColors.colors
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
                    data.filter(el => el.label).length === 0
                      ? []
                      : highlightedDataPoints
                  }
                  highlightAreaColor={highlightAreaColor}
                  selectedColor={selectedColor}
                  maxRadiusValue={maxRadiusValue}
                  maxXValue={maxXValue}
                  minXValue={minXValue}
                  maxYValue={maxYValue}
                  minYValue={minYValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  dateFormat={dateFormat}
                  indx={index}
                  rtl={rtl}
                  language={language}
                  annotations={annotations}
                  customHighlightAreaSettings={customHighlightAreaSettings}
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
