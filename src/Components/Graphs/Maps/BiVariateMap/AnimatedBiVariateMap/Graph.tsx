import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoMercator } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleThreshold } from 'd3-scale';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import { parse } from 'date-fns';
import { group } from 'd3-array';
import { BivariateMapWithDateDataType, CSSObject } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { X } from '../../../../Icons/Icons';
import { UNDPColorModule } from '../../../../ColorPalette';
import { string2HTML } from '../../../../../Utils/string2HTML';
import { Modal } from '../../../../Elements/Modal';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: BivariateMapWithDateDataType[];
  mapData: any;
  xDomain: [number, number, number, number];
  yDomain: [number, number, number, number];
  width: number;
  height: number;
  colors: string[][];
  xColorLegendTitle: string;
  yColorLegendTitle: string;
  mapBorderWidth: number;
  mapNoDataColor: string;
  scale: number;
  centerPoint: [number, number];
  mapBorderColor: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedCountryCodes: string[];
  onSeriesMouseClick?: (_d: any) => void;
  mapProperty: string;
  showAntarctica: boolean;
  indx: number;
  dateFormat: string;
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
    xDomain,
    mapData,
    xColorLegendTitle,
    yDomain,
    yColorLegendTitle,
    width,
    height,
    colors,
    scale,
    centerPoint,
    mapBorderWidth,
    mapNoDataColor,
    mapBorderColor,
    tooltip,
    onSeriesMouseOver,
    isWorldMap,
    zoomScaleExtend,
    zoomTranslateExtend,
    highlightedCountryCodes,
    onSeriesMouseClick,
    mapProperty,
    showAntarctica,
    dateFormat,
    indx,
    rtl,
    language,
    mode,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
  } = props;
  const groupedData = Array.from(
    group(
      sortBy(data, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values,
    }),
  );
  const [showLegend, setShowLegend] = useState(!(width < 680));
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

  const xRange = [0, 1, 2, 3, 4];

  const yRange = [0, 1, 2, 3, 4];

  const xScale = scaleThreshold<number, number>().domain(xDomain).range(xRange);
  const yScale = scaleThreshold<number, number>().domain(yDomain).range(yRange);

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
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={`${width}px`}
        height={`${height}px`}
        ref={mapSvg}
      >
        <g ref={mapG}>
          {mapData.features.map((d: any, i: number) => {
            const index = groupedData[indx].values.findIndex(
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
          {groupedData[indx].values.map((d, i) => {
            const index = mapData.features.findIndex(
              (el: any) => d.countryCode === el.properties[mapProperty],
            );
            const xColorCoord = !checkIfNullOrUndefined(d.x)
              ? xScale(d.x as number)
              : undefined;
            const yColorCoord = !checkIfNullOrUndefined(d.y)
              ? yScale(d.y as number)
              : undefined;
            const color =
              xColorCoord !== undefined && yColorCoord !== undefined
                ? colors[yColorCoord][xColorCoord]
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
                              stroke:
                                color === mapNoDataColor
                                  ? UNDPColorModule[mode || 'light'].grays[
                                      'gray-400'
                                    ]
                                  : '#fff',
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
                              stroke:
                                color === mapNoDataColor
                                  ? UNDPColorModule[mode || 'light'].grays[
                                      'gray-400'
                                    ]
                                  : '#fff',
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
      {showLegend ? (
        <div
          className={`undp-viz-bivariate-legend-container relative ${
            rtl ? 'self-end' : 'self-start'
          }`}
        >
          <div
            className='self-start flex mb-3'
            style={{
              backgroundColor:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.75)',
            }}
          >
            <div className='items-end flex'>
              <div className='relative py-3 pb-3 pt-14 z-10'>
                <div className='flex pointer-events-auto'>
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
                                stroke={
                                  selectedColor === el
                                    ? UNDPColorModule[mode || 'light'].grays[
                                        'gray-700'
                                      ]
                                    : '#fff'
                                }
                                className='cursor-pointer'
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
                              textAnchor='middle'
                              className={`${
                                rtl
                                  ? `font-sans-${language || 'ar'}`
                                  : 'font-sans'
                              } text-[10px]`}
                              style={{
                                fill: UNDPColorModule[mode || 'light'].grays[
                                  'gray-700'
                                ],
                              }}
                            >
                              {typeof el === 'string' || el < 1
                                ? el
                                : numberFormattingFunction(el, '', '')}
                            </text>
                          ))}
                        </g>
                        {yDomain.map((el, j) => (
                          <g
                            key={j}
                            transform={`translate(${
                              Math.max(Math.min(xDomain.length + 1, 5), 4) *
                                25 +
                              10
                            },${100 - j * 25})`}
                          >
                            <text
                              x={0}
                              transform='rotate(-90)'
                              y={0}
                              textAnchor='middle'
                              className={`${
                                rtl
                                  ? `font-sans-${language || 'ar'}`
                                  : 'font-sans'
                              } text-[10px]`}
                              style={{
                                fill: UNDPColorModule[mode || 'light'].grays[
                                  'gray-700'
                                ],
                              }}
                            >
                              {typeof el === 'string' || el < 1
                                ? el
                                : numberFormattingFunction(el, '', '')}
                            </text>
                          </g>
                        ))}
                      </g>
                    </svg>
                    <div
                      className={`text-xs non-italic text-center mt-2 ${
                        rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                      }`}
                      style={{
                        lineHeight: 'normal',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        width: '8.125rem',
                        color:
                          UNDPColorModule[mode || 'light'].grays['gray-700'],
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {xColorLegendTitle}
                    </div>
                  </div>
                  <div
                    className={`text-xs non-italic text-center mt-2 absolute ${
                      rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                    }`}
                    style={{
                      lineHeight: 'normal',
                      width: '8.125rem',
                      color: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      display: '-webkit-box',
                      top: '80px',
                      translate: '75% -50%',
                      rotate: '90deg',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {yColorLegendTitle}
                  </div>
                </div>
              </div>
            </div>
            <button
              type='button'
              className='cursor-pointer mt-2 mr-2 ml-0 mb-0 border-0 h-6 p-0'
              onClick={() => {
                setShowLegend(false);
              }}
            >
              <X />
            </button>
          </div>
        </div>
      ) : (
        <button
          type='button'
          className={`undp-viz-bivariate-legend-container border-0 bg-transparent p-0 ${
            rtl ? 'self-end' : 'self-start'
          }`}
          onClick={() => {
            setShowLegend(true);
          }}
        >
          <div
            className={`flex items-start text-sm font-bold cursor-pointer uppercase p-2 mb-3 ${
              rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
            }`}
            style={{
              border: `1px solid ${
                UNDPColorModule[mode || 'light'].grays['gray-400']
              }`,
              color: UNDPColorModule[mode || 'light'].grays['gray-600'],
              backgroundColor:
                UNDPColorModule[mode || 'light'].grays['gray-300'],
            }}
          >
            Show Legend
          </div>
        </button>
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
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          isOpen={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='m-0'
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: string2HTML(detailsOnClick, mouseClickData),
            }}
          />
        </Modal>
      ) : null}
    </>
  );
}
