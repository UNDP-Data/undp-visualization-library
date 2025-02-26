import { useState, useRef, useEffect } from 'react';
import { format, parse } from 'date-fns';
import uniqBy from 'lodash.uniqby';
import { ascending, sort } from 'd3-array';
import Slider from 'rc-slider';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  ChoroplethMapWithDateDataType,
  CSSObject,
  SourcesDataType,
} from '../../../../../Types';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Pause, Play } from '../../../../Icons/Icons';
import 'rc-slider/assets/index.css';
import { fetchAndParseJSON } from '../../../../../Utils/fetchAndParseData';

interface Props {
  graphTitle?: string;
  mapData?: any;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  domain: number[] | string[];
  colors?: string[];
  colorLegendTitle?: string;
  categorical?: boolean;
  data: ChoroplethMapWithDateDataType[];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  mapBorderWidth?: number;
  mapNoDataColor?: string;
  mapBorderColor?: string;
  relativeHeight?: number;
  padding?: string;
  isWorldMap?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  showColorScale?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  graphID?: string;
  highlightedCountryCodes?: string[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  mapProperty?: string;
  showAntarctica?: boolean;
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function AnimatedChoroplethMap(props: Props) {
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
    domain,
    colorLegendTitle,
    categorical = false,
    scale = 190,
    centerPoint = [10, 10],
    padding,
    mapBorderWidth = 0.5,
    mapNoDataColor = UNDPColorModule.light.graphNoData,
    backgroundColor = false,
    mapBorderColor = UNDPColorModule.light.grays['gray-500'],
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    isWorldMap = true,
    showColorScale = true,
    zoomScaleExtend = [0.8, 6],
    zoomTranslateExtend,
    graphID,
    highlightedCountryCodes = [],
    onSeriesMouseClick,
    mapProperty = 'ISO3',
    graphDownload = false,
    dataDownload = false,
    showAntarctica = false,
    rtl = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    dateFormat = 'yyyy',
    showOnlyActiveDate = false,
    autoPlay = false,
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
        }This is a choropleth map where geographic areas are colored in proportion to a specific variable showing data changes over time.${
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
          <div
            className='flex flex-col grow justify-center leading-0'
            ref={graphDiv}
            aria-label='Map area'
          >
            {(width || svgWidth) && (height || svgHeight) && mapShape ? (
              <Graph
                data={data}
                mapData={mapShape}
                domain={domain}
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
                  colors ||
                  (categorical
                    ? UNDPColorModule[mode].sequentialColors[
                        `neutralColorsx0${
                          domain.length as 4 | 5 | 6 | 7 | 8 | 9
                        }`
                      ]
                    : UNDPColorModule[mode].sequentialColors[
                        `neutralColorsx0${
                          (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                        }`
                      ])
                }
                colorLegendTitle={colorLegendTitle}
                mapBorderWidth={mapBorderWidth}
                mapNoDataColor={mapNoDataColor}
                categorical={categorical}
                mapBorderColor={mapBorderColor}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                isWorldMap={isWorldMap}
                showColorScale={showColorScale}
                zoomScaleExtend={zoomScaleExtend}
                zoomTranslateExtend={zoomTranslateExtend}
                onSeriesMouseClick={onSeriesMouseClick}
                mapProperty={mapProperty}
                showAntarctica={
                  showAntarctica === undefined ? false : showAntarctica
                }
                highlightedCountryCodes={highlightedCountryCodes}
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
