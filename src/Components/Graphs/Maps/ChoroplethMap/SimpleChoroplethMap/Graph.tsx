import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoMercator } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import isEqual from 'lodash.isequal';
import { ChoroplethMapDataType, CSSObject } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Modal } from '../../../../Elements/Modal';
import { string2HTML } from '../../../../../Utils/string2HTML';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';

interface Props {
  domain: number[] | string[];
  mapData: any;
  width: number;
  height: number;
  colors: string[];
  colorLegendTitle?: string;
  categorical: boolean;
  data: ChoroplethMapDataType[];
  scale: number;
  centerPoint: [number, number];
  mapBorderWidth: number;
  mapNoDataColor: string;
  mapBorderColor: string;
  isWorldMap: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  showColorScale: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedCountryCodes: string[];
  onSeriesMouseClick?: (_d: any) => void;
  mapProperty: string;
  showAntarctica: boolean;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
}

export function Graph(props: Props) {
  const {
    data,
    domain,
    colors,
    mapData,
    colorLegendTitle,
    categorical,
    height,
    width,
    scale,
    centerPoint,
    tooltip,
    mapBorderWidth,
    mapBorderColor,
    mapNoDataColor,
    onSeriesMouseOver,
    isWorldMap,
    showColorScale,
    zoomScaleExtend,
    zoomTranslateExtend,
    highlightedCountryCodes,
    onSeriesMouseClick,
    mapProperty,
    showAntarctica,
    rtl,
    language,
    mode,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
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
  const colorScale = categorical
    ? scaleOrdinal<number | string, string>().domain(domain).range(colors)
    : scaleThreshold<number, string>()
        .domain(domain as number[])
        .range(colors);

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
            const index = data.findIndex(
              el => el.countryCode === d.properties[mapProperty],
            );
            if (!showAntarctica && d.properties.NAME === 'Antarctica')
              return null;
            if (index !== -1) return null;
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? 0.3
                    : highlightedCountryCodes.length !== 0
                    ? highlightedCountryCodes.indexOf(
                        d.properties[mapProperty],
                      ) !== -1
                      ? 1
                      : 0.3
                    : 1
                }
              >
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
            const index = mapData.features.findIndex(
              (el: any) => d.countryCode === el.properties[mapProperty],
            );
            const color = !checkIfNullOrUndefined(d.x)
              ? colorScale(d.x as any)
              : mapNoDataColor;
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? selectedColor === color
                      ? 1
                      : 0.3
                    : highlightedCountryCodes.length !== 0
                    ? highlightedCountryCodes.indexOf(d.countryCode) !== -1
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
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (
                      isEqual(mouseClickData, d) &&
                      resetSelectionOnDoubleClick
                    ) {
                      setMouseClickData(undefined);
                      if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData(d);
                      if (onSeriesMouseClick) onSeriesMouseClick(d);
                    }
                  }
                }}
              >
                {index === -1
                  ? null
                  : mapData.features[index].geometry.type === 'MultiPolygon'
                  ? mapData.features[index].geometry.coordinates.map(
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
                            style={{
                              stroke: mapBorderColor,
                            }}
                            strokeWidth={mapBorderWidth}
                            fill={color}
                          />
                        );
                      },
                    )
                  : mapData.features[index].geometry.coordinates.map(
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
                            style={{
                              stroke: mapBorderColor,
                            }}
                            strokeWidth={mapBorderWidth}
                            fill={color}
                          />
                        );
                      },
                    )}
              </g>
            );
          })}
          {mouseOverData
            ? mapData.features
                .filter(
                  (d: { properties: any }) =>
                    d.properties[mapProperty] === mouseOverData.countryCode,
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
                                  stroke:
                                    UNDPColorModule[mode || 'light'].grays[
                                      'gray-700'
                                    ],
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
                                  stroke:
                                    UNDPColorModule[mode || 'light'].grays[
                                      'gray-700'
                                    ],
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
      {showColorScale === false ? null : (
        <div
          className='undp-viz-bivariate-legend-container'
          style={{
            position: 'relative',
            alignSelf: rtl ? 'flex-end' : 'flex-start',
          }}
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
                {colorLegendTitle && colorLegendTitle !== '' ? (
                  <p
                    className={`${
                      rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                    }undp-viz-typography`}
                    style={{
                      lineHeight: 'normal',
                      fontSize: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      margin: '0 0 0.5rem 0',
                      padding: 0,
                      color: UNDPColorModule[mode || 'light'].grays['gray-700'],
                    }}
                  >
                    {colorLegendTitle}
                  </p>
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
                            selectedColor === colors[i]
                              ? UNDPColorModule[mode || 'light'].grays[
                                  'gray-700'
                                ]
                              : colors[i]
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
                          {categorical
                            ? d
                            : numberFormattingFunction(d as number, '', '')}
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
                              ? UNDPColorModule[mode || 'light'].grays[
                                  'gray-700'
                                ]
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
      )}
      {detailsOnClick ? (
        <Modal
          isOpen={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            style={{ margin: 0 }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: string2HTML(detailsOnClick, mouseClickData),
            }}
          />
        </Modal>
      ) : null}
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          mode={mode}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
    </>
  );
}
