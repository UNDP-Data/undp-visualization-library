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
  minHeight: number;
  selectedLayer: string[];
  layerIdList: string[];
  excludeLayers: string[];
}

export function MapEl(props: Props) {
  const {
    mapStyle,
    height,
    width,
    relativeHeight,
    center,
    zoomLevel,
    minHeight,
    selectedLayer,
    layerIdList,
    excludeLayers,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [mapStyleData, setMapStyleData] = useState<any>(undefined);
  const graphDiv = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);
  useEffect(() => {
    if (mapContainer.current && svgWidth && !mapRef.current) {
      fetchAndParseJSON(mapStyle).then(d => {
        setMapStyleData(d);
        const mapDiv = select(mapContainer.current);
        mapDiv.selectAll('div').remove();
        const protocol = new pmtiles.Protocol();
        maplibreGl.addProtocol('pmtiles', protocol.tile);
        const mapObj: any = {
          container: mapContainer.current as any,
          style: {
            ...d,
            layers: filterData(d.layers, [
              {
                column: 'id',
                excludeValues: [
                  ...excludeLayers,
                  ...layerIdList.filter(el => selectedLayer.indexOf(el) === -1),
                ],
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
        mapRef.current = new maplibreGl.Map(mapObj);
        mapRef.current.addControl(
          new maplibreGl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true,
          }),
          'bottom-right',
        );
        mapRef.current.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      });
    }
  }, [mapContainer.current, svgWidth, center, zoomLevel, layerIdList]);
  useEffect(() => {
    if (mapRef.current) {
      if (mapStyleData) {
        const mapStyleObj: any = {
          ...mapStyleData,
          layers: filterData(mapStyleData.layers, [
            {
              column: 'id',
              excludeValues: [
                ...excludeLayers,
                ...layerIdList.filter(el => selectedLayer.indexOf(el) === -1),
              ],
            },
          ]),
        };
        mapRef.current.setStyle(mapStyleObj);
      } else
        fetchAndParseJSON(mapStyle).then(d => {
          const mapStyleObj: any = {
            ...d,
            layers: filterData(d.layers, [
              {
                column: 'id',
                excludeValues: [
                  ...excludeLayers,
                  ...layerIdList.filter(el => selectedLayer.indexOf(el) === -1),
                ],
              },
            ]),
          };
          mapRef.current.setStyle(mapStyleObj);
        });
    }
  }, [selectedLayer]);
  return (
    <div
      className='flex flex-col grow justify-center leading-0'
      ref={graphDiv}
      aria-label='Map area'
    >
      {(width || svgWidth) && (height || svgHeight) ? (
        <div
          style={{
            width: width || svgWidth,
            height: Math.max(
              minHeight,
              height ||
                (relativeHeight
                  ? minHeight
                    ? (width || svgWidth) * relativeHeight > minHeight
                      ? (width || svgWidth) * relativeHeight
                      : minHeight
                    : (width || svgWidth) * relativeHeight
                  : svgHeight),
            ),
          }}
        >
          <div
            ref={mapContainer}
            className='map maplibre-show-control w-full h-full'
          />
        </div>
      ) : null}
    </div>
  );
}
