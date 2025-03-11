import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import { ascending, sort } from 'd3-array';
import { format, parse } from 'date-fns';
import { SliderUI } from '@undp-data/undp-design-system-react';
import { Graph } from './Graph';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import {
  BackgroundStyleDataType,
  CSSObject,
  DotDensityMapWithDateDataType,
  SourcesDataType,
} from '../../../../../Types';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Pause, Play } from '../../../../Icons/Icons';
import { fetchAndParseJSON } from '../../../../../Utils/fetchAndParseData';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';

interface Props {
  graphTitle?: string;
  mapData?: any;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  radius?: number;
  sources?: SourcesDataType[];
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  data: DotDensityMapWithDateDataType[];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  mapBorderWidth?: number;
  mapNoDataColor?: string;
  mapBorderColor?: string;
  padding?: string;
  showLabels?: boolean;
  relativeHeight?: number;
  isWorldMap?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  showColorScale?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  showAntarctica?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function AnimatedDotDensityMap(props: Props) {
  const {
    data,
    mapData,
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorLegendTitle,
    colorDomain,
    radius = 5,
    scale = 190,
    centerPoint = [10, 10],
    padding,
    mapBorderWidth = 0.5,
    mapNoDataColor = UNDPColorModule.light.graphNoData,
    backgroundColor = false,
    showLabels = false,
    mapBorderColor = UNDPColorModule.light.grays['gray-500'],
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap = true,
    showColorScale = true,
    zoomScaleExtend = [0.8, 6],
    zoomTranslateExtend,
    graphID,
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
    highlightedDataPoints = [],
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    showAntarctica = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle,
    detailsOnClick,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 760);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 760);
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
  useEffect(() => {
    if (typeof mapData === 'string') {
      const fetchData = fetchAndParseJSON(mapData);
      fetchData.then(d => {
        setMapShape(d);
      });
    } else {
      setMapShape(mapData || WorldMapData);
    }
  }, [mapData]);

  return (
    <div
      className={mode || 'light'}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col ${
          width ? 'w-fit grow-0' : 'w-full grow'
        } h-inherit ${language || 'en'}`}
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
          }This is an animated dot density map showing the distribution of a variable across a region or world, with each dot representing a data point and changes over time.${
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
            <div
              className='flex flex-col grow justify-center leading-0'
              ref={graphDiv}
              aria-label='Map area'
            >
              {(width || svgWidth) && (height || svgHeight) && mapShape ? (
                <Graph
                  data={data}
                  mapData={mapShape}
                  colorDomain={
                    data.filter(el => el.color).length === 0
                      ? []
                      : colorDomain ||
                        (uniqBy(
                          data.filter(el => !checkIfNullOrUndefined(el.color)),
                          'color',
                        ).map(d => `${d.color}`) as string[])
                  }
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
                  scale={scale}
                  centerPoint={centerPoint}
                  colors={
                    data.filter(el => el.color).length === 0
                      ? colors
                        ? [colors as string]
                        : [UNDPColorModule[mode].primaryColors['blue-600']]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule[mode].categoricalColors.colors
                  }
                  colorLegendTitle={colorLegendTitle}
                  radius={radius}
                  mapBorderWidth={mapBorderWidth}
                  mapNoDataColor={mapNoDataColor}
                  mapBorderColor={mapBorderColor}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showLabels={showLabels}
                  isWorldMap={isWorldMap}
                  showColorScale={showColorScale}
                  zoomScaleExtend={zoomScaleExtend}
                  zoomTranslateExtend={zoomTranslateExtend}
                  onSeriesMouseClick={onSeriesMouseClick}
                  highlightedDataPoints={highlightedDataPoints}
                  showAntarctica={showAntarctica}
                  dateFormat={dateFormat}
                  indx={index}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  detailsOnClick={detailsOnClick}
                />
              ) : null}
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
