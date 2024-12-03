import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoMercator } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import maxBy from 'lodash.maxby';
import isEqual from 'lodash.isequal';
import { DotDensityMapDataType } from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: DotDensityMapDataType[];
  mapData: any;
  colorDomain: string[];
  width: number;
  height: number;
  scale: number;
  centerPoint: [number, number];
  colors: string[];
  colorLegendTitle?: string;
  radius: number;
  mapBorderWidth: number;
  mapNoDataColor: string;
  showLabels?: boolean;
  mapBorderColor: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  showColorScale: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  showAntarctica: boolean;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    mapData,
    colorLegendTitle,
    colorDomain,
    radius,
    height,
    width,
    scale,
    centerPoint,
    tooltip,
    showLabels,
    mapBorderWidth,
    mapBorderColor,
    mapNoDataColor,
    onSeriesMouseOver,
    isWorldMap,
    showColorScale,
    zoomScaleExtend,
    zoomTranslateExtend,
    highlightedDataPoints,
    onSeriesMouseClick,
    showAntarctica,
    rtl,
    language,
    mode,
    resetSelectionOnDoubleClick,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const svgWidth = 960;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = isWorldMap
    ? geoEqualEarth().rotate([0, 0]).scale(scale).center(centerPoint)
    : geoMercator().rotate([0, 0]).scale(scale).center(centerPoint);
  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([0, maxBy(data, 'radius')?.radius as number])
          .range([0.25, radius])
          .nice()
      : undefined;

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent(zoomScaleExtend || [0.8, 6])
      .translateExtent(
        zoomTranslateExtend || [
          [-20, -20],
          [svgWidth + 20, svgHeight + 20],
        ],
      )
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [svgHeight, svgWidth]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={mapSvg}
      >
        <g ref={mapG}>
          {mapData.features.map((d: any, i: number) => {
            if (d.properties.NAME === 'Antarctica' && !showAntarctica)
              return null;
            return (
              <g key={i}>
                {d.geometry.type === 'MultiPolygon'
                  ? d.geometry.coordinates.map((el: any, j: any) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [
                            number,
                            number,
                          ];
                          if (k !== geo.length - 1)
                            path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          style={{
                            stroke: mapBorderColor,
                          }}
                          strokeWidth={mapBorderWidth}
                          fill={mapNoDataColor}
                        />
                      );
                    })
                  : d.geometry.coordinates.map((el: any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [
                          number,
                          number,
                        ];
                        if (k !== el.length - 1)
                          path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          style={{
                            stroke: mapBorderColor,
                          }}
                          strokeWidth={mapBorderWidth}
                          fill={mapNoDataColor}
                        />
                      );
                    })}
              </g>
            );
          })}
          {data.map((d, i) => {
            const color =
              data.filter(el => el.color).length === 0
                ? colors[0]
                : !d.color
                ? UNDPColorModule[mode || 'light'].graphGray
                : colors[colorDomain.indexOf(`${d.color}`)];
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? selectedColor === color
                      ? 1
                      : 0.3
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf((d.data as any).id) !== -1
                      ? 1
                      : 0.3
                    : 1
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onMouseLeave={() => {
                  setMouseOverData(undefined);
                  setEventX(undefined);
                  setEventY(undefined);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(undefined);
                  }
                }}
                onClick={() => {
                  if (onSeriesMouseClick) {
                    if (
                      isEqual(mouseClickData, d) &&
                      resetSelectionOnDoubleClick
                    ) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData(d);
                      onSeriesMouseClick(d);
                    }
                  }
                }}
                transform={`translate(${
                  (projection([d.long, d.lat]) as [number, number])[0]
                },${(projection([d.long, d.lat]) as [number, number])[1]})`}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={!radiusScale ? radius : radiusScale(d.radius || 0)}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode || 'light'].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode || 'light'].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                  }}
                  fillOpacity={0.8}
                />
                {showLabels && d.label ? (
                  <text
                    x={!radiusScale ? radius : radiusScale(d.radius || 0)}
                    y={0}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-600'],
                      fontSize: '1rem',
                      textAnchor: 'start',
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    dx={4}
                    dy={5}
                  >
                    {d.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
      {data.filter(el => el.color).length === 0 ||
      showColorScale === false ? null : (
        <div
          style={{ position: 'sticky', bottom: '0px' }}
          className='undp-viz-bivariate-legend-container'
        >
          <div
            style={{
              backgroundColor:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.75)',
              marginBottom: '0.75rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-end',
              alignSelf: rtl ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                position: 'relative',
                zIndex: '5',
                padding: 0,
              }}
            >
              <div>
                {colorLegendTitle ? (
                  <div
                    style={{
                      lineHeight: 'normal',
                      fontSize: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {colorLegendTitle}
                  </div>
                ) : null}
                <svg width='100%' viewBox='0 0 320 30'>
                  <g>
                    {colorDomain.map((d, i) => (
                      <g
                        key={i}
                        onMouseOver={() => {
                          setSelectedColor(colors[i]);
                        }}
                        onMouseLeave={() => {
                          setSelectedColor(undefined);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={(i * 320) / colorDomain.length + 1}
                          y={1}
                          width={320 / colorDomain.length - 2}
                          height={8}
                          fill={colors[i]}
                          stroke={
                            selectedColor === colors[i]
                              ? UNDPColorModule[mode || 'light'].grays[
                                  'gray-700'
                                ]
                              : colors[i]
                          }
                        />
                        <text
                          x={
                            (i * 320) / colorDomain.length +
                            160 / colorDomain.length
                          }
                          y={25}
                          textAnchor='middle'
                          fontSize={12}
                          style={{
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                            fill: UNDPColorModule[mode || 'light'].grays[
                              'gray-700'
                            ],
                          }}
                        >
                          {d}
                        </text>
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          mode={mode}
        />
      ) : null}
    </>
  );
}
