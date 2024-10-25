import { useRef, useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { UNDPColorModule } from '../../../ColorPalette';
import { fetchAndParseJSON } from '../../../../Utils/fetchAndParseData';
import { filterData } from '../../../../Utils/transformData/filterData';

interface Props {
  mapStyle: string | { style: string; name: string }[];
  center?: [number, number];
  zoomLevel?: number;
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
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  includeLayers?: string[];
  excludeLayers?: string[];
}

export function GeoHubMap(props: Props) {
  const {
    mapStyle,
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
    center,
    zoomLevel,
    graphID,
    rtl,
    language,
    minHeight,
    mode,
    includeLayers,
    excludeLayers,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [selectedMapStyle, setSelectedMapStyle] = useState(
    typeof mapStyle === 'string' ? mapStyle : mapStyle[0].style,
  );
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };
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
    if (mapContainer.current && svgWidth && !mapRef.current) {
      fetchAndParseJSON(selectedMapStyle).then(d => {
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
  }, [
    mapContainer.current,
    svgWidth,
    selectedMapStyle,
    center,
    zoomLevel,
    includeLayers,
    excludeLayers,
  ]);
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(selectedMapStyle);
    }
  }, [selectedMapStyle]);
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
          {graphTitle || graphDescription ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
              mode={mode || 'light'}
            />
          ) : null}
          {typeof mapStyle === 'string' ? null : (
            <Select
              className={
                rtl
                  ? `undp-viz-select-${language || 'ar'} undp-viz-select`
                  : 'undp-viz-select'
              }
              options={mapStyle.map(d => ({ label: d.name, value: d.style }))}
              isClearable={false}
              isRtl={rtl}
              isSearchable
              filterOption={createFilter(filterConfig)}
              defaultValue={{
                label: mapStyle[0].name,
                value: mapStyle[0].style,
              }}
              controlShouldRenderValue
              onChange={el => {
                if (el) setSelectedMapStyle(el.value);
              }}
              theme={theme => {
                return {
                  ...theme,
                  borderRadius: 0,
                  spacing: {
                    ...theme.spacing,
                    baseUnit: 4,
                    menuGutter: 2,
                    controlHeight: 48,
                  },
                  colors: {
                    ...theme.colors,
                    danger: UNDPColorModule[mode || 'light'].alerts.darkRed,
                    dangerLight:
                      UNDPColorModule[mode || 'light'].grays['gray-400'],
                    neutral10:
                      UNDPColorModule[mode || 'light'].grays['gray-400'],
                    primary50:
                      UNDPColorModule[mode || 'light'].primaryColors[
                        'blue-400'
                      ],
                    primary25:
                      UNDPColorModule[mode || 'light'].grays['gray-200'],
                    primary:
                      UNDPColorModule[mode || 'light'].primaryColors[
                        'blue-600'
                      ],
                  },
                };
              }}
            />
          )}
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
