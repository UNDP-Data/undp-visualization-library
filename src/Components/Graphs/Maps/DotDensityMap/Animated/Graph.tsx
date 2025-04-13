import { useEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoMercator } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import maxBy from 'lodash.maxby';
import isEqual from 'lodash.isequal';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { group } from 'd3-array';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from '@undp-data/undp-design-system-react';
import {
  ClassNameObject,
  DotDensityMapWithDateDataType,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  data: DotDensityMapWithDateDataType[];
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
  showLabels: boolean;
  mapBorderColor: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  showColorScale: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
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
        direction='ltr'
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
                            strokeWidth: mapBorderWidth,
                            fill: mapNoDataColor,
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
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => {
              const color =
                data.filter(el => el.color).length === 0
                  ? colors[0]
                  : !d.color
                  ? Colors.gray
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
                  <motion.circle
                    cx={(projection([d.long, d.lat]) as [number, number])[0]}
                    cy={(projection([d.long, d.lat]) as [number, number])[1]}
                    style={{
                      fillOpacity: 0.8,
                    }}
                    animate={{
                      r: !radiusScale ? radius : radiusScale(d.radius || 0),
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                      stroke:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  {showLabels && d.label ? (
                    <motion.text
                      x={
                        !radiusScale
                          ? (
                              projection([d.long, d.lat]) as [number, number]
                            )[0] + radius
                          : (
                              projection([d.long, d.lat]) as [number, number]
                            )[0] + radiusScale(d.radius || 0)
                      }
                      y={(projection([d.long, d.lat]) as [number, number])[1]}
                      className='fill-primary-gray-600 dark:fill-primary-gray-300 text-sm'
                      style={{
                        textAnchor: 'start',
                      }}
                      dx={4}
                      dy={5}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {d.label}
                    </motion.text>
                  ) : null}
                </g>
              );
            })}
          </AnimatePresence>
        </g>
      </svg>
      {data.filter(el => el.color).length === 0 ||
      showColorScale === false ? null : (
        <div className='undp-viz-bivariate-legend-container sticky bottom-0'>
          <div className='flex items-end mb-3 p-4 undp-viz-bivariate-legend'>
            <div className='relative z-10 p-0'>
              <div>
                {colorLegendTitle ? (
                  <div
                    className='leading-normal text-sm overflow-hidden mb-2'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {colorLegendTitle}
                  </div>
                ) : null}
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
                          x={(i * 320) / colorDomain.length + 1}
                          y={1}
                          width={320 / colorDomain.length - 2}
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
                          x={
                            (i * 320) / colorDomain.length +
                            160 / colorDomain.length
                          }
                          y={25}
                          className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                          style={{
                            textAnchor: 'middle',
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
