import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { BivariateMapDataType } from '../../../../Types';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import WorldMapData from '../WorldMapData/data.json';
import { UNDPColorModule } from '../../../ColorPalette';

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
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 760);
    }
  }, [graphDiv?.current, width]);

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
          ? UNDPColorModule.grays['gray-200']
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
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              lineHeight: 0,
            }}
            ref={graphDiv}
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                mapData={mapData || WorldMapData}
                xDomain={xDomain}
                yDomain={yDomain}
                width={width || svgWidth}
                height={
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                scale={scale || 190}
                centerPoint={centerPoint || [10, 10]}
                colors={colors || UNDPColorModule.bivariateColors.colors05x05}
                xColorLegendTitle={xColorLegendTitle || 'X Color key'}
                yColorLegendTitle={yColorLegendTitle || 'Y Color key'}
                mapBorderWidth={
                  checkIfNullOrUndefined(mapBorderWidth)
                    ? 0.5
                    : (mapBorderWidth as number)
                }
                mapNoDataColor={mapNoDataColor || UNDPColorModule.graphNoData}
                mapBorderColor={
                  mapBorderColor || UNDPColorModule.grays['gray-500']
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
              />
            ) : null}
          </div>
          {source || footNote ? (
            <GraphFooter
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
              width={width}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
