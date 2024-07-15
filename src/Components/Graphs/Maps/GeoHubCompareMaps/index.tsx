import { useRef, useEffect, useState } from 'react';
import * as maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import * as MaplibreglCompare from '@maplibre/maplibre-gl-compare';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';
import { select } from 'd3-selection';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';

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
  const leftMapRef = useRef<HTMLDivElement>(null);
  const rightMapRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);
  useEffect(() => {
    if (
      mapContainer.current &&
      leftMapRef.current &&
      rightMapRef.current &&
      svgWidth
    ) {
      const mapDiv = select(mapContainer.current);
      mapDiv.selectAll('.maplibregl-compare').remove();
      const leftMapDiv = select(leftMapRef.current);
      leftMapDiv.selectAll('div').remove();
      const rightMapDiv = select(rightMapRef.current);
      rightMapDiv.selectAll('div').remove();
      const protocol = new pmtiles.Protocol();
      maplibreGl.addProtocol('pmtiles', protocol.tile);
      const leftMap = new maplibreGl.Map({
        container: leftMapRef.current,
        style: mapStyles[0],
        center: center || [0, 0],
        zoom: zoomLevel || 4,
      });

      const rightMap = new maplibreGl.Map({
        container: rightMapRef.current,
        style: mapStyles[1],
        center: center || [0, 0],
        zoom: zoomLevel || 4,
      });
      rightMap.addControl(
        new maplibreGl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        'bottom-right',
      );
      leftMap.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      leftMap.addControl(
        new maplibreGl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        'bottom-right',
      );
      rightMap.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const compare = new MaplibreglCompare(
        leftMap,
        rightMap,
        mapContainer.current,
        {},
      );
    }
  }, [mapContainer.current, leftMapRef.current, rightMapRef.current, svgWidth]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
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
            <div
              style={{
                width: width || svgWidth,
                height:
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight),
              }}
            >
              <div
                ref={mapContainer}
                className='map maplibre-show-control'
                style={{
                  position: 'relative',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <div
                  ref={leftMapRef}
                  className='leftMap'
                  style={{
                    position: 'absolute',
                    inset: 0,
                  }}
                />
                <div
                  ref={rightMapRef}
                  className='rightMap'
                  style={{
                    position: 'absolute',
                    inset: 0,
                  }}
                />
              </div>
            </div>
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
