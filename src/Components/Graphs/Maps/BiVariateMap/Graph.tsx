import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import World from '../MapData/worldMap.json';
import { BivariateMapDataType } from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';

interface Props {
  data: BivariateMapDataType[];
  xDomain: [number, number, number, number];
  yDomain: [number, number, number, number];
  width: number;
  height: number;
  colors: string[][];
  xColorLegendTitle: string;
  yColorLegendTitle: string;
  categorical?: boolean;
  scale: number;
  centerPoint: [number, number];
  tooltip?: (_d: any) => JSX.Element;
  hoveredDataPoint?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    data,
    xDomain,
    xColorLegendTitle,
    yDomain,
    yColorLegendTitle,
    width,
    height,
    colors,
    categorical,
    scale,
    centerPoint,
    tooltip,
    hoveredDataPoint,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const svgWidth = 960;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(scale)
    .translate(centerPoint);

  const xRange = [0, 1, 2, 3, 4];

  const yRange = [0, 1, 2, 3, 4];

  const xScale = categorical
    ? scaleOrdinal<number, number>().domain(xDomain).range(xRange)
    : scaleThreshold<number, number>().domain(xDomain).range(xRange);
  const yScale = categorical
    ? scaleOrdinal<number, number>().domain(yDomain).range(yRange)
    : scaleThreshold<number, number>().domain(yDomain).range(yRange);
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 6])
      .translateExtent([
        [-20, -50],
        [svgWidth + 20, svgHeight + 50],
      ])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, [svgHeight, svgWidth]);
  return (
    <>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={`${width}px`}
        height={`${height}px`}
        ref={mapSvg}
      >
        <g ref={mapG}>
          {(World as any).features.map((d: any, i: number) => {
            const index = data.findIndex(
              el => el.countryCode === d.properties.ISO3,
            );
            if (index !== -1 || d.properties.NAME === 'Antarctica') return null;
            return (
              <g key={i} opacity={!selectedColor ? 1 : 0.3}>
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
                          stroke='#AAA'
                          strokeWidth={0.25}
                          fill={UNDPColorModule.graphNoData}
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
                          stroke='#AAA'
                          strokeWidth={0.25}
                          fill={UNDPColorModule.graphNoData}
                        />
                      );
                    })}
              </g>
            );
          })}
          {data.map((d, i) => {
            const index = (World as any).features.findIndex(
              (el: any) => d.countryCode === el.properties.ISO3,
            );
            const xColorCoord = d.x !== undefined ? xScale(d.x) : undefined;
            const yColorCoord = d.y !== undefined ? yScale(d.y) : undefined;
            const color =
              xColorCoord !== undefined && yColorCoord !== undefined
                ? colors[yColorCoord][xColorCoord]
                : UNDPColorModule.graphNoData;

            return (
              <g
                key={i}
                opacity={
                  selectedColor ? (selectedColor === color ? 1 : 0.1) : 1
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (hoveredDataPoint) {
                    hoveredDataPoint(d.data);
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
                  if (hoveredDataPoint) {
                    hoveredDataPoint(undefined);
                  }
                }}
              >
                {index === -1 || d.countryCode === 'ATA'
                  ? null
                  : (World as any).features[index].geometry.type ===
                    'MultiPolygon'
                  ? (World as any).features[index].geometry.coordinates.map(
                      (el: any, j: any) => {
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
                            stroke={
                              color === UNDPColorModule.graphNoData
                                ? '#AAA'
                                : '#fff'
                            }
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      },
                    )
                  : (World as any).features[index].geometry.coordinates.map(
                      (el: any, j: number) => {
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
                            stroke={
                              color === UNDPColorModule.graphNoData
                                ? '#AAA'
                                : '#fff'
                            }
                            strokeWidth={0.25}
                            fill={color}
                          />
                        );
                      },
                    )}
              </g>
            );
          })}
          {mouseOverData
            ? (World as any).features
                .filter(
                  (d: { properties: { ISO3: any } }) =>
                    d.properties.ISO3 === mouseOverData.countryCode,
                )
                .map((d: any, i: number) => {
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
                                  stroke: 'var(--gray-700)',
                                  fill: 'none',
                                  fillOpacity: 0,
                                  strokeWidth: '0.5',
                                }}
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
                                  stroke: 'var(--gray-700)',
                                  fill: 'none',
                                  fillOpacity: 0,
                                  strokeWidth: '0.5',
                                }}
                              />
                            );
                          })}
                    </g>
                  );
                })
            : null}
        </g>
      </svg>
      <div className='bivariate-legend-container'>
        <div className='bivariate-legend-el'>
          <div className='bivariate-map-color-legend-element'>
            <div
              style={{
                display: 'flex',
                pointerEvents: 'auto',
              }}
            >
              <div>
                <svg width='135px' viewBox='0 0 135 135'>
                  <g>
                    {colors.map((d, i) => (
                      <g key={i} transform={`translate(0,${100 - i * 25})`}>
                        {d.map((el, j) => (
                          <rect
                            key={j}
                            y={1}
                            x={j * 25 + 1}
                            fill={el}
                            width={23}
                            height={23}
                            strokeWidth={selectedColor === el ? 2 : 0.25}
                            stroke={selectedColor === el ? '#212121' : '#fff'}
                            style={{ cursor: 'pointer' }}
                            onMouseOver={() => {
                              setSelectedColor(el);
                            }}
                            onMouseLeave={() => {
                              setSelectedColor(undefined);
                            }}
                          />
                        ))}
                      </g>
                    ))}
                    <g transform='translate(0,125)'>
                      {xDomain.map((el, j) => (
                        <text
                          key={j}
                          y={10}
                          x={(j + 1) * 25}
                          fill='#212121'
                          fontSize={10}
                          textAnchor='middle'
                        >
                          {numberFormattingFunction(el)}
                        </text>
                      ))}
                    </g>
                    {yDomain.map((el, j) => (
                      <g
                        key={j}
                        transform={`translate(${xDomain.length * 25 + 10},${
                          100 - j * 25
                        })`}
                      >
                        <text
                          x={0}
                          transform='rotate(-90)'
                          y={0}
                          fill='#212121'
                          fontSize={10}
                          textAnchor='middle'
                        >
                          {numberFormattingFunction(el)}
                        </text>
                      </g>
                    ))}
                  </g>
                </svg>
                <div className='bivariant-map-primary-legend-text'>
                  {xColorLegendTitle}
                </div>
              </div>
              <div className='bivariate-map-secondary-legend-text'>
                {yColorLegendTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
      {mouseOverData?.data && tooltip && eventX && eventY ? (
        <Tooltip
          body={tooltip(mouseOverData.data)}
          xPos={eventX}
          yPos={eventY}
        />
      ) : null}
    </>
  );
}
