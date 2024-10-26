import { useRef, useEffect, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import { fetchAndParseJSON } from '../../../../Utils/fetchAndParseData';
import { filterData } from '../../../../Utils/transformData/filterData';

interface Props {
  mapStyle: string;
  center?: [number, number];
  zoomLevel?: number;
  width?: number;
  height?: number;
  relativeHeight?: number;
  minHeight?: number;
  includeLayers?: string[];
  excludeLayers?: string[];
}

export function GeoHubSingleMap(props: Props) {
  const {
    mapStyle,
    height,
    width,
    relativeHeight,
    center,
    zoomLevel,
    minHeight,
    includeLayers,
    excludeLayers,
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, width]);
  useEffect(() => {
    if (mapContainer.current && svgWidth) {
      fetchAndParseJSON(mapStyle).then(d => {
        const mapDiv = select(mapContainer.current);
        mapDiv.selectAll('div').remove();
        const protocol = new pmtiles.Protocol();
        maplibreGl.addProtocol('pmtiles', protocol.tile);
        const mapObj: any = {
          container: mapContainer.current as any,
          style:
            !includeLayers && !excludeLayers
              ? d
              : {
                  ...d,
                  layers: filterData(d.layers, [
                    {
                      column: 'id',
                      includeValues: includeLayers,
                      excludeValues: excludeLayers,
                    },
                  ]),
                },
        };
        if (center) {
          mapObj.center = center;
        }
        if (zoomLevel) {
          mapObj.zoom = zoomLevel;
        }
        const map = new maplibreGl.Map(mapObj);
        map.addControl(
          new maplibreGl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true,
          }),
          'bottom-right',
        );
        map.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      });
    }
  }, [
    mapContainer.current,
    svgWidth,
    mapStyle,
    center,
    zoomLevel,
    includeLayers,
    excludeLayers,
  ]);
  return (
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
                ? minHeight
                  ? (width || svgWidth) * relativeHeight > minHeight
                    ? (width || svgWidth) * relativeHeight
                    : minHeight
                  : (width || svgWidth) * relativeHeight
                : svgHeight),
          }}
        >
          <div
            ref={mapContainer}
            className='map maplibre-show-control'
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : null}
    </div>
  );
}
