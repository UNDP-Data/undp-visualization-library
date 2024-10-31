import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { BivariateMapDataType } from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import WorldMapData from '../../WorldMapData/data.json';
import { UNDPColorModule } from '../../../../ColorPalette';
import { fetchAndParseJSON } from '../../../../../Utils/fetchAndParseData';

interface Props {
  data: BivariateMapDataType[];
  mapData?: any;
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  xColorLegendTitle?: string;
  yColorLegendTitle?: string;
  xDomain: [number, number, number, number];
  yDomain: [number, number, number, number];
  colors?: string[][];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  mapBorderWidth?: number;
  mapNoDataColor?: string;
  padding?: string;
  mapBorderColor?: string;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  graphID?: string;
  highlightedCountryCodes?: string[];
  onSeriesMouseClick?: (_d: any) => void;
  mapProperty?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  showAntarctica?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
}

export function BiVariantMap(props: Props) {
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
    xDomain,
    yDomain,
    xColorLegendTitle,
    yColorLegendTitle,
    scale,
    centerPoint,
    padding,
    backgroundColor,
    tooltip,
    mapBorderWidth,
    mapBorderColor,
    mapNoDataColor,
    relativeHeight,
    onSeriesMouseOver,
    isWorldMap,
    zoomScaleExtend,
    zoomTranslateExtend,
    graphID,
    highlightedCountryCodes,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    mapProperty,
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
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 760);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, width, height]);
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
                xDomain={xDomain}
                yDomain={yDomain}
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
                  colors ||
                  UNDPColorModule[mode || 'light'].bivariateColors.colors05x05
                }
                xColorLegendTitle={xColorLegendTitle || 'X Color key'}
                yColorLegendTitle={yColorLegendTitle || 'Y Color key'}
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
                isWorldMap={isWorldMap === undefined ? true : isWorldMap}
                zoomScaleExtend={zoomScaleExtend}
                zoomTranslateExtend={zoomTranslateExtend}
                onSeriesMouseClick={onSeriesMouseClick}
                mapProperty={mapProperty || 'ISO3'}
                showAntarctica={
                  showAntarctica === undefined ? false : showAntarctica
                }
                highlightedCountryCodes={highlightedCountryCodes || []}
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
