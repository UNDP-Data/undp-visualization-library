 
import isEqual from 'fast-deep-equal';
import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoMercator } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { group } from 'd3-array';
import { Modal, P } from '@undp/design-system-react';

import {
  ChoroplethMapWithDateDataType,
  ClassNameObject,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { string2HTML } from '@/Utils/string2HTML';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';

interface Props {
  colorDomain: number[] | string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapData: any;
  width: number;
  height: number;
  colors: string[];
  colorLegendTitle?: string;
  categorical: boolean;
  data: ChoroplethMapWithDateDataType[];
  scale: number;
  centerPoint: [number, number];
  mapBorderWidth: number;
  mapNoDataColor: string;
  mapBorderColor: string;
  isWorldMap: boolean;
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  showColorScale: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  mapProperty: string;
  showAntarctica: boolean;
  indx: number;
  dateFormat: string;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function Graph(props: Props) {
  const {
    data,
    colorDomain,
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
    highlightedIds,
    onSeriesMouseClick,
    mapProperty,
    showAntarctica,
    dateFormat,
    indx,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
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
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    ? scaleOrdinal<number | string, string>().domain(colorDomain).range(colors)
    : scaleThreshold<number, string>()
      .domain(colorDomain as number[])
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgHeight, svgWidth]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={mapSvg}
        direction='ltr'
      >
        <g ref={mapG}>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mapData.features.map((d: any, i: number) => {
              const index = groupedData[indx].values.findIndex(
                el => el.id === d.properties[mapProperty],
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
                      : highlightedIds.length !== 0
                        ? highlightedIds.indexOf(d.properties[mapProperty]) !== -1
                          ? 1
                          : 0.3
                        : 1
                  }
                >
                  {d.geometry.type === 'MultiPolygon'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            fill: mapNoDataColor,
                            strokeWidth: mapBorderWidth,
                          }}
                        />
                      );
                    })
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            strokeWidth: mapBorderWidth,
                            fill: mapNoDataColor,
                          }}
                        />
                      );
                    })}
                </g>
              );
            })}
          {groupedData[indx].values.map((d, i) => {
            const index = mapData.features.findIndex(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (el: any) => d.id === el.properties[mapProperty],
            );
            const color = !checkIfNullOrUndefined(d.x)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    : highlightedIds.length !== 0
                      ? highlightedIds.indexOf(d.id) !== -1
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
                      onSeriesMouseClick?.(undefined);
                    } else {
                      setMouseClickData(d);
                      onSeriesMouseClick?.(d);
                    }
                  }
                }}
              >
                {index === -1
                  ? null
                  : mapData.features[index].geometry.type === 'MultiPolygon'
                    ? mapData.features[index].geometry.coordinates.map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                              strokeWidth: mapBorderWidth,
                              fill: color,
                            }}
                          />
                        );
                      },
                    )
                    : mapData.features[index].geometry.coordinates.map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                              strokeWidth: mapBorderWidth,
                              fill: color,
                            }}
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (d: { properties: any }) =>
                  d.properties[mapProperty] === mouseOverData.id,
              )
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((d: any, i: number) => {
                return (
                  <g key={i}>
                    {d.geometry.type === 'MultiPolygon'
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            className='stroke-primary-gray-700 dark:stroke-primary-gray-300'
                            style={{
                              fill: 'none',
                              fillOpacity: 0,
                              strokeWidth: '0.5',
                            }}
                          />
                        );
                      })
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            className='stroke-primary-gray-700 dark:stroke-primary-gray-300'
                            style={{
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
        <div className='undp-viz-bivariate-legend-container relative'>
          <div className='undp-viz-bivariate-legend'>
            <div className='relative z-10 p-4'>
              <div>
                {colorLegendTitle && colorLegendTitle !== '' ? (
                  <P
                    size='xs'
                    marginBottom='xs'
                    className='p-0 leading-normal overflow-hidden text-primary-gray-700 dark:text-primary-gray-300'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {colorLegendTitle}
                  </P>
                ) : null}
                {!categorical ? (
                  <svg width='100%' viewBox='0 0 320 30' direction='ltr'>
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
                          className='cursor-pointer'
                        >
                          <rect
                            x={(i * 320) / colors.length + 1}
                            y={1}
                            width={320 / colors.length - 2}
                            height={8}
                            className={
                              selectedColor === colors[i]
                                ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                                : ''
                            }
                            style={{
                              fill: colors[i],
                              ...(selectedColor === colors[i]
                                ? {}
                                : { stroke: colors[i] }),
                            }}
                          />
                          <text
                            x={((i + 1) * 320) / colors.length}
                            y={25}
                            className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                            style={{ textAnchor: 'middle' }}
                          >
                            {numberFormattingFunction(d as number, '', '')}
                          </text>
                        </g>
                      ))}
                      <g>
                        <rect
                          onMouseOver={() => {
                            setSelectedColor(colors[colorDomain.length]);
                          }}
                          onMouseLeave={() => {
                            setSelectedColor(undefined);
                          }}
                          x={(colorDomain.length * 320) / colors.length + 1}
                          y={1}
                          width={320 / colors.length - 2}
                          height={8}
                          className={`cursor-pointer ${
                            selectedColor === colors[colorDomain.length]
                              ? 'stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
                              : ''
                          }`}
                          style={{
                            fill: colors[colorDomain.length],
                            ...(selectedColor === colors[colorDomain.length]
                              ? {}
                              : { stroke: colors[colorDomain.length] }),
                          }}
                        />
                      </g>
                    </g>
                  </svg>
                ) : (
                  <div className='flex flex-col gap-2'>
                    {colorDomain.map((d, i) => (
                      <div
                        key={i}
                        className='flex gap-1 items-center'
                        onMouseOver={() => {
                          setSelectedColor(colors[i % colors.length]);
                        }}
                        onMouseLeave={() => {
                          setSelectedColor(undefined);
                        }}
                      >
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        <P size='sm' marginBottom='none'>
                          {d}
                        </P>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          backgroundStyle={styles?.tooltip}
          className={classNames?.tooltip}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          open={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='graph-modal-content m-0'
            dangerouslySetInnerHTML={{ __html: string2HTML(detailsOnClick, mouseClickData) }}
          />
        </Modal>
      ) : null}
    </>
  );
}
