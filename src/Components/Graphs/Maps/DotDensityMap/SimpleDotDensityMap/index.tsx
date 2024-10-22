import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import { Graph } from './Graph';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { DotDensityMapDataType } from '../../../../../Types';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '../../../../ColorPalette';
import { fetchAndParseJSON } from '../../../../../Utils/fetchAndParseData';

interface Props {
  graphTitle?: string;
  mapData?: any;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  radius?: number;
  source?: string;
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
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
}

export function DotDensityMap(props: Props) {
  const {
    data,
    mapData,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    colorLegendTitle,
    colorDomain,
    radius,
    scale,
    centerPoint,
    padding,
    mapBorderWidth,
    mapNoDataColor,
    backgroundColor,
    showLabels,
    mapBorderColor,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap,
    showColorScale,
    zoomScaleExtend,
    zoomTranslateExtend,
    graphID,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    showAntarctica,
    rtl,
    language,
    minHeight,
    mode,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [mapShape, setMapShape] = useState<any>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 760);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 760);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, width]);
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
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
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
              mode={mode || 'light'}
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
                        data.filter(
                          el => el.color !== undefined || el.color !== null,
                        ),
                        'color',
                      ).map(d => `${d.color}`) as string[])
                }
                width={width || svgWidth}
                height={
                  height ||
                  (relativeHeight
                    ? minHeight
                      ? (width || svgWidth) * relativeHeight > minHeight
                        ? (width || svgWidth) * relativeHeight
                        : minHeight
                      : (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                scale={scale || 190}
                centerPoint={centerPoint || [10, 10]}
                colors={
                  data.filter(el => el.color).length === 0
                    ? colors
                      ? [colors as string]
                      : [
                          UNDPColorModule[mode || 'light'].primaryColors[
                            'blue-600'
                          ],
                        ]
                    : (colors as string[] | undefined) ||
                      UNDPColorModule[mode || 'light'].categoricalColors.colors
                }
                colorLegendTitle={colorLegendTitle}
                radius={checkIfNullOrUndefined(radius) ? 5 : (radius as number)}
                mapBorderWidth={
                  checkIfNullOrUndefined(mapBorderWidth)
                    ? 0.5
                    : (mapBorderWidth as number)
                }
                mapNoDataColor={
                  mapNoDataColor || UNDPColorModule[mode || 'light'].graphNoData
                }
                mapBorderColor={
                  mapBorderColor ||
                  UNDPColorModule[mode || 'light'].grays['gray-500']
                }
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                showLabels={showLabels}
                isWorldMap={isWorldMap === undefined ? true : isWorldMap}
                showColorScale={
                  showColorScale === undefined ? true : showColorScale
                }
                zoomScaleExtend={zoomScaleExtend}
                zoomTranslateExtend={zoomTranslateExtend}
                onSeriesMouseClick={onSeriesMouseClick}
                highlightedDataPoints={highlightedDataPoints || []}
                showAntarctica={
                  showAntarctica === undefined ? false : showAntarctica
                }
                rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                language={language || (rtl ? 'ar' : 'en')}
                mode={mode || 'light'}
              />
            ) : null}
          </div>
          {source || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
              width={width}
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
