import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import { Graph } from './Graph';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import {
  BackgroundStyleDataType,
  CSSObject,
  DotDensityMapDataType,
  SourcesDataType,
} from '../../../../../Types';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '../../../../ColorPalette';
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
  data: DotDensityMapDataType[];
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
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function DotDensityMap(props: Props) {
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
      className={`${
        !backgroundColor
          ? 'bg-transparent '
          : backgroundColor === true
          ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
          : ''
      }ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
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
        }This is a dot density map showing the distribution of a variable across a region or world, with each dot representing a data point.${
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
                mode={mode}
                resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                tooltipBackgroundStyle={tooltipBackgroundStyle}
                detailsOnClick={detailsOnClick}
              />
            ) : null}
          </div>
          {sources || footNote ? (
            <GraphFooter sources={sources} footNote={footNote} width={width} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
