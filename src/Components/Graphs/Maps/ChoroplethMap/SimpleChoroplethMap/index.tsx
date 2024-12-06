import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  ChoroplethMapDataType,
  SourcesDataType,
} from '../../../../../Types';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '../../../../ColorPalette';
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
  data: ChoroplethMapDataType[];
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
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
}

export function ChoroplethMap(props: Props) {
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
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
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
        }This is a choropleth map where geographic areas are colored in proportion to a specific variable.${
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
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              lineHeight: 0,
            }}
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
                showAntarctica={showAntarctica}
                highlightedCountryCodes={highlightedCountryCodes}
                rtl={rtl}
                language={language}
                mode={mode}
                resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
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
