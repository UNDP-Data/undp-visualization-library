import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { BivariateMapDataType } from '../../../../Types';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: BivariateMapDataType[];
  mapData: any;
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
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  graphID?: string;
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
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 570);
      setSvgWidth(graphDiv.current.clientWidth || 760);
    }
  }, [graphDiv?.current, width]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        margin: 'auto',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
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
              mapData={mapData}
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
              mapBorderColor={mapBorderColor || 'var(--gray-500)'}
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
              isWorldMap={isWorldMap === undefined ? true : isWorldMap}
              zoomScaleExtend={zoomScaleExtend}
              zoomTranslateExtend={zoomTranslateExtend}
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
  );
}
