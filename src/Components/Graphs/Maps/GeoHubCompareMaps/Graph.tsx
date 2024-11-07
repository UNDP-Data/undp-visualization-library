/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useRef, useEffect, useState } from 'react';
import * as maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import Draggable, { DraggableData } from 'react-draggable';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import { ChevronLeftRight } from '../../../Icons/Icons';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  width: number;
  height: number;
  mapStyles: [string, string];
  center: [number, number];
  zoomLevel: number;
  mode: 'light' | 'dark';
}

function synchronizeMap(map1: maplibreGl.Map, map2: maplibreGl.Map) {
  let isSyncing = false;
  function syncMap(sourceMap: maplibreGl.Map, targetMap: maplibreGl.Map) {
    if (!isSyncing) {
      isSyncing = true;
      const center = sourceMap.getCenter();
      const zoom = sourceMap.getZoom();
      const bearing = sourceMap.getBearing();
      const pitch = sourceMap.getPitch();
      targetMap.jumpTo({
        center,
        zoom,
        bearing,
        pitch,
      });
      isSyncing = false;
    }
  }

  // Event listeners for map1
  map1.on('move', () => {
    syncMap(map1, map2);
  });

  // Event listeners for map2
  map2.on('move', () => {
    syncMap(map2, map1);
  });
}

export function Graph(props: Props) {
  const { height, width, mapStyles, center, zoomLevel, mode } = props;
  const [sliderPosition, setSliderPosition] = useState(width / 2);
  const graphDiv = useRef<HTMLDivElement>(null);
  const leftMapRef = useRef<HTMLDivElement>(null);
  const rightMapRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      mapContainer.current &&
      leftMapRef.current &&
      rightMapRef.current &&
      width
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
      synchronizeMap(leftMap, rightMap);
    }
  }, [
    mapContainer.current,
    leftMapRef.current,
    rightMapRef.current,
    width,
    mapStyles,
    center,
    zoomLevel,
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
      aria-label='Map area'
    >
      <div
        style={{
          width,
          height,
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
              clipPath: `polygon(0% 0%, ${sliderPosition}px 0%, ${sliderPosition}px 100%, 0% 100%)`,
            }}
          />
          <div
            ref={rightMapRef}
            className='rightMap'
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `polygon(${sliderPosition}px 0%, ${sliderPosition}px 100%, 100% 100%, 100% 0%)`,
            }}
          />
          <Draggable
            axis='x'
            bounds='parent'
            offsetParent={mapContainer.current as HTMLElement}
            defaultPosition={{ x: (width || width) / 2 - 1, y: 0 }}
            onDrag={(_e: any, d: DraggableData) => {
              setSliderPosition(d.x);
            }}
          >
            <div
              style={{
                width: '2px',
                height: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'ew-resize',
              }}
            >
              <div
                style={{
                  backgroundColor:
                    UNDPColorModule[mode || 'light'].primaryColors['blue-600'],
                  boxShadow: 'inset 0 0 0 1px #fff',
                  display: 'flex',
                  borderRadius: '50%',
                  position: 'absolute',
                  width: '42px',
                  height: '42px',
                  top: '50%',
                  left: '-21px',
                  margin: '-21px 1px 0',
                  color: '#fff',
                  cursor: 'ew-resize',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeftRight />
              </div>
            </div>
          </Draggable>
        </div>
      </div>
    </div>
  );
}
