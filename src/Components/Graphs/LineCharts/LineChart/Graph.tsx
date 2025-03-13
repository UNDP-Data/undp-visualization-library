import { useEffect, useRef, useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { useAnimate, useInView } from 'framer-motion';
import { linearRegression } from 'simple-statistics';
import {
  AnnotationSettingsDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  LineChartDataType,
  ReferenceDataType,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';

interface Props {
  data: LineChartDataType[];
  color: string;
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
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues: ReferenceDataType[];
  highlightAreaSettings: [number | string | null, number | string | null];
  highlightAreaColor: string;
  maxValue?: number;
  minValue?: number;
  animateLine: boolean | number;
  rtl: boolean;
  strokeWidth: number;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  regressionLine: boolean | string;
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
    color,
    suffix,
    prefix,
    dateFormat,
    highlightAreaSettings,
    showValues,
    noOfXTicks,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
    minValue,
    highlightAreaColor,
    maxValue,
    animateLine,
    rtl,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    regressionLine,
    tooltipBackgroundStyle,
    yAxisTitle,
    noOfYTicks,
    maxDate,
    minDate,
  } = props;
  const [scope, animate] = useAnimate();
  const [labelScope, labelAnimate] = useAnimate();
  const [annotationsScope, annotationsAnimate] = useAnimate();
  const [regLineScope, regLineAnimate] = useAnimate();
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
      y: d.y,
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
  const minParam: number = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : minBy(dataFormatted, d => d.y)?.y
    ? (minBy(dataFormatted, d => d.y)?.y as number) > 0
      ? 0
      : (minBy(dataFormatted, d => d.y)?.y as number)
    : 0;
  const maxParam: number = maxBy(dataFormatted, d => d.y)?.y
    ? (maxBy(dataFormatted, d => d.y)?.y as number)
    : 0;
  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([
      minParam,
      checkIfNullOrUndefined(maxValue)
        ? maxParam > 0
          ? maxParam
          : 0
        : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.y))
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
        scope.current,
        { pathLength: [0, 1] },
        {
          duration: animateLine === true ? 5 : animateLine || 0,
        },
      );
      labelAnimate(
        labelScope.current,
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
      regLineAnimate(
        regLineScope.current,
        { opacity: [0, 1] },
        {
          delay: animateLine === true ? 5 : animateLine || 0,
          duration: animateLine === true ? 0.5 : animateLine || 0,
        },
      );
    }
  }, [isInView, data]);
  const regressionLineParam = linearRegression(
    dataFormatted
      .filter(
        d => !checkIfNullOrUndefined(d.date) && !checkIfNullOrUndefined(d.y),
      )
      .map(d => [x(d.date), y(d.y as number)]),
  );
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
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
                    className='fill-primary-gray-550 dark:fill-primary-gray-500 text-xs'
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
              className='text-x fill-primary-gray-700 dark:fill-primary-gray-300s'
              dy={3}
            >
              {numberFormattingFunction(
                minParam < 0 ? 0 : minParam,
                prefix,
                suffix,
              )}
            </text>
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i}>
                <text
                  y={graphHeight}
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
          <g>
            <path
              d={lineShape(dataFormatted as any) as string}
              style={{
                stroke: color,
                fill: 'none',
                strokeWidth,
              }}
              ref={scope}
            />
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                className='undp-tick-line stroke-primary-gray-700 dark:stroke-primary-gray-100 '
              />
            ) : null}
          </g>
          <g ref={labelScope}>
            {dataFormatted.map((d, i) => (
              <g key={i}>
                {!checkIfNullOrUndefined(d.y) ? (
                  <g>
                    {showDots ? (
                      <circle
                        cx={x(d.date)}
                        cy={y(d.y as number)}
                        r={
                          graphWidth / dataFormatted.length < 5
                            ? 0
                            : graphWidth / dataFormatted.length < 20
                            ? 2
                            : 4
                        }
                        style={{
                          fill: color,
                        }}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(d.date)}
                        y={y(d.y)}
                        dy={-8}
                        style={{
                          textAnchor: 'middle',
                        }}
                        className='text-xs font-bold fill-primary-gray-700 dark:fill-primary-gray-300'
                      >
                        {numberFormattingFunction(d.y, prefix, suffix)}
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
          <g ref={regLineScope}>
            {regressionLine ? (
              <line
                className={`undp-ref-line ${
                  typeof regressionLine !== 'string'
                    ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                    : ''
                }`}
                style={{
                  ...(typeof regressionLine === 'string' && {
                    stroke: regressionLine,
                  }),
                  fill: 'none',
                }}
                x1={
                  regressionLineParam.b > graphHeight
                    ? (graphHeight - regressionLineParam.b) /
                      regressionLineParam.m
                    : 0
                }
                x2={graphWidth}
                y1={
                  regressionLineParam.b > graphHeight
                    ? graphHeight
                    : regressionLineParam.b
                }
                y2={regressionLineParam.m * graphWidth + regressionLineParam.b}
              />
            ) : null}
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
