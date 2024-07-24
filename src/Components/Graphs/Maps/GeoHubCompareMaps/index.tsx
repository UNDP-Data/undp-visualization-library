import { useRef, useEffect, useState } from 'react';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { Graph } from './Graph';

interface Props {
  graphTitle?: string;
  source?: string;
  graphDescription?: string;
  sourceLink?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  width?: number;
  height?: number;
  relativeHeight?: number;
  graphID?: string;
  mapStyles: [string, string];
  center?: [number, number];
  zoomLevel?: number;
}

export function GeoHubCompareMaps(props: Props) {
  const {
    sourceLink,
    graphTitle,
    height,
    width,
    relativeHeight,
    source,
    graphDescription,
    footNote,
    padding,
    backgroundColor,
    graphID,
    mapStyles,
    center,
    zoomLevel,
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
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
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          padding: backgroundColor
            ? padding || 'var(--spacing-05)'
            : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
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
                width={width || svgWidth}
                height={
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                mapStyles={mapStyles}
                center={center || [0, 0]}
                zoomLevel={zoomLevel || 3}
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
