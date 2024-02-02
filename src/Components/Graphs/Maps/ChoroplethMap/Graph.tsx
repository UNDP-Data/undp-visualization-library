import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import World from '../MapData/worldMap.json';
import { ChoroplethMapDataType } from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';

interface Props {
  domain: number[];
  width: number;
  height: number;
  colors: string[];
  colorLegendTitle?: string;
  categorical?: boolean;
  data: ChoroplethMapDataType[];
  scale: number;
  centerPoint: [number, number];
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    data,
    domain,
    colors,
    colorLegendTitle,
    categorical,
    height,
    width,
    scale,
    centerPoint,
    tooltip,
    onSeriesMouseOver,
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
  const colorScale = categorical
    ? scaleOrdinal<number, string>().domain(domain).range(colors)
    : scaleThreshold<number, string>().domain(domain).range(colors);

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 6])
      .translateExtent([
        [-20, 0],
        [svgWidth + 20, svgHeight],
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
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
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
            const color =
              d.x !== undefined ? colorScale(d.x) : UNDPColorModule.graphNoData;
            return (
              <g
                key={i}
                opacity={
                  selectedColor ? (selectedColor === color ? 1 : 0.3) : 1
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d.data);
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
                            stroke='#AAA'
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
                            stroke='#AAA'
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
      <div
        style={{ position: 'sticky', bottom: '0px' }}
        className='bivariate-legend-container'
      >
        <div className='univariate-legend-el'>
          <div className='univariate-map-color-legend-element'>
            <div>
              {colorLegendTitle ? (
                <div className='univariate-map-legend-text'>
                  {colorLegendTitle}
                </div>
              ) : null}
              <svg width='100%' viewBox='0 0 320 30'>
                <g>
                  {domain.map((d, i) => (
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
                        x={
                          categorical
                            ? (i * 320) / domain.length + 1
                            : (i * 320) / colors.length + 1
                        }
                        y={1}
                        width={
                          categorical
                            ? 320 / domain.length - 2
                            : 320 / colors.length - 2
                        }
                        height={8}
                        fill={colors[i]}
                        stroke={
                          selectedColor === colors[i] ? '#212121' : colors[i]
                        }
                      />
                      <text
                        x={
                          categorical
                            ? (i * 320) / domain.length + 160 / domain.length
                            : ((i + 1) * 320) / colors.length
                        }
                        y={25}
                        textAnchor='middle'
                        fontSize={12}
                        fill='#212121'
                      >
                        {numberFormattingFunction(d)}
                      </text>
                    </g>
                  ))}
                  {categorical ? null : (
                    <g>
                      <rect
                        onMouseOver={() => {
                          setSelectedColor(colors[domain.length]);
                        }}
                        onMouseLeave={() => {
                          setSelectedColor(undefined);
                        }}
                        x={(domain.length * 320) / colors.length + 1}
                        y={1}
                        width={320 / colors.length - 2}
                        height={8}
                        fill={colors[domain.length]}
                        stroke={
                          selectedColor === colors[domain.length]
                            ? '#212121'
                            : colors[domain.length]
                        }
                        strokeWidth={1}
                        style={{ cursor: 'pointer' }}
                      />
                    </g>
                  )}
                </g>
              </svg>
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
