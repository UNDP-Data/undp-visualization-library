import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoMercator } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import maxBy from 'lodash.maxby';
import isEqual from 'lodash.isequal';
import { DotDensityMapDataType } from '../../../../Types';
import { Tooltip } from '../../../Elements/Tooltip';

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
  pointRadius: number;
  mapBorderWidth: number;
  mapNoDataColor: string;
  showLabel?: boolean;
  mapBorderColor: string;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  showColorScale: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  showAntarctica: boolean;
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    mapData,
    colorLegendTitle,
    colorDomain,
    pointRadius,
    height,
    width,
    scale,
    centerPoint,
    tooltip,
    showLabel,
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
          .range([0.25, pointRadius])
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
                ? UNDPColorModule.graphGray
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
                    if (isEqual(mouseClickData, d)) {
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
                  r={!radiusScale ? pointRadius : radiusScale(d.radius || 0)}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                  }}
                  fillOpacity={0.8}
                />
                {showLabel && d.label ? (
                  <text
                    x={!radiusScale ? pointRadius : radiusScale(d.radius || 0)}
                    y={0}
                    style={{
                      fill: 'var(--gray-600)',
                      fontSize: '1rem',
                      textAnchor: 'start',
                      fontFamily: 'var(--fontFamily)',
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
          className='bivariate-legend-container'
        >
          <div className='univariate-legend-el'>
            <div className='univariate-map-color-legend-element padding-00'>
              <div>
                {colorLegendTitle ? (
                  <div
                    className='univariate-map-legend-text'
                    style={{ lineHeight: 'normal' }}
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
                            selectedColor === colors[i] ? '#212121' : colors[i]
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
                          fill='#212121'
                          style={{
                            fontFamily: 'var(--fontFamily)',
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
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
