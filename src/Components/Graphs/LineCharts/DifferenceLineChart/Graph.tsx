import { useEffect, useRef, useState } from 'react';
import { line, curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { useAnimate, useInView } from 'framer-motion';
import {
  AnnotationSettingsDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  DifferenceLineChartDataType,
  ReferenceDataType,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';

interface Props {
  data: DifferenceLineChartDataType[];
  lineColors: [string, string];
  diffAreaColors: [string, string];
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  dateFormat: string;
  showValues: boolean;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  highlightAreaSettings: [number | string | null, number | string | null];
  highlightAreaColor: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  animateLine: boolean | number;
  rtl: boolean;
  colorDomain: [string, string];
  showColorLegendAtTop?: boolean;
  idSuffix: string;
  strokeWidth: number;
  showDots: boolean;
  refValues: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  tooltipBackgroundStyle?: CSSObject;
  yAxisTitle?: string;
  noOfYTicks: number;
  minDate?: string | number;
  maxDate?: string | number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    lineColors,
    suffix,
    prefix,
    dateFormat,
    showValues,
    noOfXTicks,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    highlightAreaSettings,
    highlightAreaColor,
    onSeriesMouseOver,
    animateLine,
    rtl,
    showColorLegendAtTop,
    colorDomain,
    diffAreaColors,
    idSuffix,
    strokeWidth,
    showDots,
    refValues,
    minValue,
    maxValue,
    annotations,
    customHighlightAreaSettings,
    tooltipBackgroundStyle,
    yAxisTitle,
    noOfYTicks,
    minDate,
    maxDate,
  } = props;
  const [scope, animate] = useAnimate();
  const [areaScope, areaAnimate] = useAnimate();
  const [annotationsScope, annotationsAnimate] = useAnimate();
  const isInView = useInView(scope);
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const MouseoverRectRef = useRef(null);
  const dataFormatted = sortBy(
    data.map(d => ({
      date: parse(`${d.date}`, dateFormat, new Date()),
      y1: d.y1,
      y2: d.y2,
      data: d.data,
    })),
    'date',
  );
  const highlightAreaSettingsFormatted = [
    highlightAreaSettings[0] === null
      ? null
      : parse(`${highlightAreaSettings[0]}`, dateFormat, new Date()),
    highlightAreaSettings[1] === null
      ? null
      : parse(`${highlightAreaSettings[1]}`, dateFormat, new Date()),
  ];
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = minDate
    ? parse(`${minDate}`, dateFormat, new Date())
    : dataFormatted[0].date;
  const maxYear = maxDate
    ? parse(`${maxDate}`, dateFormat, new Date())
    : dataFormatted[dataFormatted.length - 1].date;
  const minParam1: number = minBy(dataFormatted, d => d.y1)?.y1
    ? (minBy(dataFormatted, d => d.y1)?.y1 as number) > 0
      ? 0
      : (minBy(dataFormatted, d => d.y1)?.y1 as number)
    : 0;
  const minParam2: number = minBy(dataFormatted, d => d.y2)?.y2
    ? (minBy(dataFormatted, d => d.y2)?.y2 as number) > 0
      ? 0
      : (minBy(dataFormatted, d => d.y2)?.y2 as number)
    : 0;
  const maxParam1: number = maxBy(dataFormatted, d => d.y1)?.y1
    ? (maxBy(dataFormatted, d => d.y1)?.y1 as number)
    : 0;
  const maxParam2: number = maxBy(dataFormatted, d => d.y2)?.y2
    ? (maxBy(dataFormatted, d => d.y2)?.y2 as number)
    : 0;

  const minParam = checkIfNullOrUndefined(minValue)
    ? minParam1 < minParam2
      ? minParam1
      : minParam2
    : (minValue as number);
  const maxParam = maxParam1 > maxParam2 ? maxParam1 : maxParam2;
  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);

  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue) ? minParam : (minValue as number),
      checkIfNullOrUndefined(maxValue)
        ? maxParam > 0
          ? maxParam
          : 0
        : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape1 = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.y1))
    .curve(curveMonotoneX);

  const lineShape2 = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.y2))
    .curve(curveMonotoneX);

  const mainGraphArea = area()
    .x((d: any) => x(d.date))
    .y1((d: any) => y(d.y1))
    .y0((d: any) => y(d.y2))
    .curve(curveMonotoneX);
  const mainGraphArea1 = area()
    .x((d: any) => x(d.date))
    .y1((d: any) => y(d.y1))
    .y0(0)
    .curve(curveMonotoneX);
  const mainGraphArea2 = area()
    .x((d: any) => x(d.date))
    .y1((d: any) => y(d.y2))
    .y0(0)
    .curve(curveMonotoneX);
  const yTicks = y.ticks(noOfYTicks);
  const xTicks = x.ticks(noOfXTicks);
  useEffect(() => {
    const mousemove = (event: any) => {
      const selectedData =
        dataFormatted[
          bisectCenter(
            dataFormatted.map(d => d.date),
            x.invert(pointer(event)[0]),
            1,
          )
        ];
      setMouseOverData(selectedData || dataFormatted[dataFormatted.length - 1]);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(
          selectedData || dataFormatted[dataFormatted.length - 1],
        );
      }
      setEventY(event.clientY);
      setEventX(event.clientX);
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(undefined);
      }
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
  }, [x, dataFormatted]);

  useEffect(() => {
    if (isInView && data.length > 0) {
      animate(
        'path',
        { pathLength: [0, 1] },
        {
          duration: animateLine === true ? 5 : animateLine || 0,
        },
      );
      if (showDots) {
        animate(
          'circle',
          { opacity: [0, 1] },
          {
            delay: animateLine === true ? 5 : animateLine || 0,
            duration: animateLine === true ? 0.5 : animateLine || 0,
          },
        );
      }
      if (!showColorLegendAtTop) {
        animate(
          'text',
          { opacity: [0, 1] },
          {
            delay: animateLine === true ? 5 : animateLine || 0,
            duration: animateLine === true ? 0.5 : animateLine || 0,
          },
        );
      }
      areaAnimate(
        areaScope.current,
        { opacity: [0, 1] },
        {
          delay: animateLine === true ? 5 : animateLine || 0,
          duration: animateLine === true ? 0.5 : animateLine || 0,
        },
      );
      annotationsAnimate(
        annotationsScope.current,
        { opacity: [0, 1] },
        {
          delay: animateLine === true ? 5 : animateLine || 0,
          duration: animateLine === true ? 0.5 : animateLine || 0,
        },
      );
    }
  }, [isInView, showColorLegendAtTop, data]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <clipPath id={`above${idSuffix}`}>
            <path
              d={mainGraphArea2(dataFormatted as any) as string}
              style={{
                fill: 'none',
              }}
            />
          </clipPath>
          <clipPath id={`below${idSuffix}`}>
            <path
              d={mainGraphArea1(dataFormatted as any) as string}
              style={{
                fill: 'none',
              }}
            />
          </clipPath>
          {highlightAreaSettingsFormatted[0] === null &&
          highlightAreaSettingsFormatted[1] === null ? null : (
            <g>
              <rect
                style={{
                  fill: highlightAreaColor,
                }}
                x={
                  highlightAreaSettingsFormatted[0]
                    ? x(highlightAreaSettingsFormatted[0])
                    : 0
                }
                width={
                  highlightAreaSettingsFormatted[1]
                    ? x(highlightAreaSettingsFormatted[1]) -
                      (highlightAreaSettingsFormatted[0]
                        ? x(highlightAreaSettingsFormatted[0])
                        : 0)
                    : graphWidth -
                      (highlightAreaSettingsFormatted[0]
                        ? x(highlightAreaSettingsFormatted[0])
                        : 0)
                }
                y={0}
                height={graphHeight}
              />
            </g>
          )}
          {customHighlightAreaSettings.map((d, i) => (
            <g key={i}>
              {d.coordinates.length !== 4 ? (
                <path
                  d={getPathFromPoints(
                    d.coordinates.map((el, j) =>
                      j % 2 === 0
                        ? x(parse(`${el}`, dateFormat, new Date()))
                        : y(el as number),
                    ),
                  )}
                  style={{
                    strokeWidth: d.strokeWidth || 0,
                    ...(d.coordinates.length > 4
                      ? d.color && { fill: d.color }
                      : { fill: 'none' }),
                    ...(d.color && { stroke: d.color }),
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                  }}
                  className={
                    !d.color
                      ? 'stroke-primary-gray-300 dark:stroke-primary-gray-550 fill-primary-gray-300 dark:fill-primary-gray-550'
                      : ''
                  }
                />
              ) : (
                <line
                  x1={x(parse(`${d.coordinates[0]}`, dateFormat, new Date()))}
                  y1={y(d.coordinates[1] as number)}
                  x2={x(parse(`${d.coordinates[2]}`, dateFormat, new Date()))}
                  y2={y(d.coordinates[3] as number)}
                  className={
                    !d.color
                      ? 'stroke-primary-gray-300 dark:stroke-primary-gray-550'
                      : ''
                  }
                  style={{
                    fill: 'none',
                    strokeWidth: d.strokeWidth || 1,
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                    ...(d.color ? { stroke: d.color } : {}),
                  }}
                />
              )}
            </g>
          ))}
          <g>
            <g>
              {yTicks.map((d, i) =>
                d !== 0 ? (
                  <g key={i}>
                    <line
                      y1={y(d)}
                      y2={y(d)}
                      x1={width}
                      x2={-20}
                      className='undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550'
                    />
                    <text
                      x={-25}
                      y={y(d)}
                      style={{
                        textAnchor: 'end',
                      }}
                      className='text-xs fill-primary-gray-500 dark:fill-primary-gray-550'
                      dy={3}
                    >
                      {numberFormattingFunction(d, prefix, suffix)}
                    </text>
                  </g>
                ) : null,
              )}
              <line
                y1={y(minParam < 0 ? 0 : minParam)}
                y2={y(minParam < 0 ? 0 : minParam)}
                x1={-20}
                x2={width}
                className='stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
              />
              {yAxisTitle ? (
                <text
                  transform={`translate(${20 - leftMargin}, ${
                    graphHeight / 2
                  }) rotate(-90)`}
                  style={{
                    textAnchor: 'middle',
                  }}
                  className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                >
                  {yAxisTitle}
                </text>
              ) : null}
              <text
                x={-25}
                y={y(minParam < 0 ? 0 : minParam)}
                style={{
                  textAnchor: 'end',
                }}
                className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                dy={3}
              >
                {numberFormattingFunction(
                  minParam < 0 ? 0 : minParam,
                  prefix,
                  suffix,
                )}
              </text>
            </g>
          </g>
          <g>
            <line
              y1={y(0)}
              y2={y(0)}
              x1={-15}
              x2={graphWidth + 15}
              className='stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-400'
            />
            {xTicks.map((d, i) => (
              <g key={i}>
                <text
                  y={y(0)}
                  x={x(d)}
                  style={{
                    textAnchor: 'middle',
                  }}
                  className='fill-primary-gray-700 dark:fill-primary-gray-300 xs:max-[360px]:hidden text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs'
                  dy={15}
                >
                  {format(d, dateFormat)}
                </text>
              </g>
            ))}
          </g>
          <g ref={areaScope}>
            <path
              d={mainGraphArea(dataFormatted as any) as string}
              clipPath={`url(#below${idSuffix})`}
              style={{
                fill: diffAreaColors[1],
              }}
            />
            <path
              d={mainGraphArea(dataFormatted as any) as string}
              clipPath={`url(#above${idSuffix})`}
              style={{
                fill: diffAreaColors[0],
              }}
            />
          </g>
          <g ref={scope}>
            <path
              d={lineShape1(dataFormatted as any) as string}
              style={{
                fill: 'none',
                stroke: lineColors[0],
                strokeWidth,
              }}
            />
            <path
              d={lineShape2(dataFormatted as any) as string}
              style={{
                fill: 'none',
                stroke: lineColors[1],
                strokeWidth,
              }}
            />
            {showColorLegendAtTop ? null : (
              <g>
                <text
                  style={{
                    fill: lineColors[0],
                  }}
                  className='text-xs'
                  x={x(dataFormatted[dataFormatted.length - 1].date)}
                  y={y(dataFormatted[dataFormatted.length - 1].y1 as number)}
                  dx={5}
                  dy={4}
                >
                  {colorDomain[0]}
                </text>
                <text
                  style={{
                    fill: lineColors[1],
                  }}
                  className='text-xs'
                  x={x(dataFormatted[dataFormatted.length - 1].date)}
                  y={y(dataFormatted[dataFormatted.length - 1].y2 as number)}
                  dx={5}
                  dy={4}
                >
                  {colorDomain[1]}
                </text>
              </g>
            )}
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                className='undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550'
              />
            ) : null}
            {dataFormatted.map((d, i) => (
              <g key={i}>
                {!checkIfNullOrUndefined(d.y1) ? (
                  <g>
                    {showDots ? (
                      <circle
                        cx={x(d.date)}
                        cy={y(d.y1)}
                        r={
                          graphWidth / dataFormatted.length < 5
                            ? 0
                            : graphWidth / dataFormatted.length < 20
                            ? 2
                            : 4
                        }
                        style={{
                          fill: lineColors[0],
                        }}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(d.date)}
                        y={y(d.y1)}
                        dy={d.y2 < d.y1 ? -8 : 15}
                        style={{
                          fill: lineColors[0],
                          textAnchor: 'middle',
                        }}
                        className='text-xs font-bold'
                      >
                        {numberFormattingFunction(d.y1, prefix, suffix)}
                      </text>
                    ) : null}
                  </g>
                ) : null}
                {d.y2 !== undefined ? (
                  <g>
                    {showDots ? (
                      <circle
                        cx={x(d.date)}
                        cy={y(d.y2)}
                        r={
                          graphWidth / dataFormatted.length < 5
                            ? 0
                            : graphWidth / dataFormatted.length < 20
                            ? 2
                            : 4
                        }
                        style={{
                          fill: lineColors[1],
                        }}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(d.date)}
                        y={y(d.y2)}
                        dy={d.y2 > d.y1 ? -8 : 15}
                        style={{
                          fill: lineColors[1],
                          textAnchor: 'middle',
                        }}
                        className='text-xs font-bold'
                      >
                        {numberFormattingFunction(d.y2, prefix, suffix)}
                      </text>
                    ) : null}
                  </g>
                ) : null}
              </g>
            ))}
          </g>
          {refValues.map((el, i) => (
            <g key={i}>
              <line
                className={`undp-ref-line ${
                  !el.color
                    ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                    : ''
                }`}
                style={{
                  ...(el.color && { stroke: el.color }),
                }}
                y1={y(el.value as number)}
                y2={y(el.value as number)}
                x1={0 - 20}
                x2={graphWidth + margin.right}
              />
              <text
                x={graphWidth + margin.right}
                y={y(el.value as number)}
                style={{
                  ...(el.color && { fill: el.color }),
                  textAnchor: 'end',
                }}
                className={`text-xs font-bold${
                  !el.color
                    ? ' fill-primary-gray-700 dark:fill-primary-gray-300'
                    : ''
                }`}
                dy={-5}
              >
                {el.text}
              </text>
            </g>
          ))}
          <g ref={annotationsScope}>
            {annotations.map((d, i) => {
              const endPoints = getLineEndPoint(
                {
                  x: d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                      (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                  y: d.yCoordinate
                    ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                    : 0 + (d.yOffset || 0) - 8,
                },
                {
                  x: d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date()))
                    : 0,
                  y: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                },
                checkIfNullOrUndefined(d.connectorRadius)
                  ? 3.5
                  : (d.connectorRadius as number),
              );
              return (
                <g key={i}>
                  {d.showConnector ? (
                    <>
                      <circle
                        cy={d.yCoordinate ? y(d.yCoordinate as number) : 0}
                        cx={
                          d.xCoordinate
                            ? x(
                                parse(
                                  `${d.xCoordinate}`,
                                  dateFormat,
                                  new Date(),
                                ),
                              )
                            : 0
                        }
                        r={
                          checkIfNullOrUndefined(d.connectorRadius)
                            ? 3.5
                            : (d.connectorRadius as number)
                        }
                        className={
                          !d.color
                            ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                            : ''
                        }
                        style={{
                          fill: 'none',
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          ...(d.color ? { stroke: d.color } : {}),
                        }}
                      />
                      <line
                        y1={endPoints.y}
                        x1={endPoints.x}
                        y2={
                          d.yCoordinate
                            ? y(d.yCoordinate as number) + (d.yOffset || 0)
                            : 0 + (d.yOffset || 0)
                        }
                        x2={
                          d.xCoordinate
                            ? x(
                                parse(
                                  `${d.xCoordinate}`,
                                  dateFormat,
                                  new Date(),
                                ),
                              ) + (d.xOffset || 0)
                            : 0 + (d.xOffset || 0)
                        }
                        className={
                          !d.color
                            ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                            : ''
                        }
                        style={{
                          fill: 'none',
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          ...(d.color ? { stroke: d.color } : {}),
                        }}
                      />
                    </>
                  ) : null}
                  <foreignObject
                    key={i}
                    y={
                      d.yCoordinate
                        ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                        : 0 + (d.yOffset || 0) - 8
                    }
                    x={
                      rtl
                        ? 0
                        : d.xCoordinate
                        ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                          (d.xOffset || 0)
                        : 0 + (d.xOffset || 0)
                    }
                    width={
                      rtl
                        ? d.xCoordinate
                          ? x(
                              parse(`${d.xCoordinate}`, dateFormat, new Date()),
                            ) + (d.xOffset || 0)
                          : 0 + (d.xOffset || 0)
                        : graphWidth -
                          (d.xCoordinate
                            ? x(
                                parse(
                                  `${d.xCoordinate}`,
                                  dateFormat,
                                  new Date(),
                                ),
                              ) + (d.xOffset || 0)
                            : 0 + (d.xOffset || 0))
                    }
                    height={1}
                    style={{
                      overflow: 'visible',
                    }}
                  >
                    <p
                      className={`text-sm font-${
                        d.fontWeight || 'normal'
                      } leading-tight m-0 whitespace-normal ${
                        !d.color
                          ? 'text-primary-gray-700 dark:text-primary-gray-300'
                          : ''
                      }`}
                      style={{
                        maxWidth: d.maxWidth || 'auto',
                        ...(d.color ? { color: d.color } : {}),
                      }}
                    >
                      {d.text}
                    </p>
                  </foreignObject>
                </g>
              );
            })}
          </g>
          <rect
            ref={MouseoverRectRef}
            style={{
              fill: 'none',
              pointerEvents: 'all',
            }}
            width={graphWidth}
            height={graphHeight}
          />
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
    </>
  );
}
