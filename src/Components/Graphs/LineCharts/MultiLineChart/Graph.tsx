import { useEffect, useRef, useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import min from 'lodash.min';
import max from 'lodash.max';
import { useAnimate, useInView } from 'framer-motion';
import {
  AnnotationSettingsDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  MultiLineChartDataType,
  ReferenceDataType,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';

interface Props {
  data: MultiLineChartDataType[];
  colors: string[];
  width: number;
  height: number;
  dateFormat: string;
  noOfXTicks: number;
  labels: string[];
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  showColorLegendAtTop: boolean;
  highlightAreaSettings: [number | string | null, number | string | null];
  refValues: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  highlightedLines: string[];
  highlightAreaColor: string;
  animateLine: boolean | number;
  rtl: boolean;
  strokeWidth: number;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  mode: 'light' | 'dark';
  tooltipBackgroundStyle: CSSObject;
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
    colors,
    dateFormat,
    noOfXTicks,
    labels,
    rightMargin,
    topMargin,
    bottomMargin,
    suffix,
    prefix,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
    showValues,
    showColorLegendAtTop,
    refValues,
    highlightAreaSettings,
    minValue,
    maxValue,
    highlightedLines,
    highlightAreaColor,
    animateLine,
    rtl,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    mode,
    tooltipBackgroundStyle,
    yAxisTitle,
    noOfYTicks,
    minDate,
    maxDate,
  } = props;
  const [scope, animate] = useAnimate();
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
      y: d.y,
      data: d.data,
    })),
    'date',
  );
  const dataArray = dataFormatted[0].y.map((_d, i) => {
    return dataFormatted
      .map(el => ({
        date: el.date,
        y: el.y[i],
      }))
      .filter(el => !checkIfNullOrUndefined(el.y));
  });
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
  const minParam: number = checkIfNullOrUndefined(minValue)
    ? min(dataFormatted.map(d => min(d.y)))
      ? (min(dataFormatted.map(d => min(d.y))) as number) > 0
        ? 0
        : (min(dataFormatted.map(d => min(d.y))) as number)
      : 0
    : (minValue as number);
  const maxParam: number = (max(dataFormatted.map(d => max(d.y))) as number)
    ? (max(dataFormatted.map(d => max(d.y))) as number)
    : 0;

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
      setEventY(event.clientY);
      setEventX(event.clientX);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(
          selectedData || dataFormatted[dataFormatted.length - 1],
        );
      }
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
    if (onSeriesMouseOver) {
      onSeriesMouseOver(undefined);
    }
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
                    fill:
                      d.coordinates.length > 4
                        ? d.color ||
                          UNDPColorModule[mode || 'light'].grays['gray-300']
                        : 'none',
                    strokeWidth: d.strokeWidth || 0,
                    stroke:
                      d.color ||
                      UNDPColorModule[mode || 'light'].grays['gray-300'],
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                  }}
                />
              ) : (
                <line
                  x1={x(parse(`${d.coordinates[0]}`, dateFormat, new Date()))}
                  y1={y(d.coordinates[1] as number)}
                  x2={x(parse(`${d.coordinates[2]}`, dateFormat, new Date()))}
                  y2={y(d.coordinates[3] as number)}
                  style={{
                    fill: 'none',
                    strokeWidth: d.strokeWidth || 1,
                    stroke:
                      d.color ||
                      UNDPColorModule[mode || 'light'].grays['gray-300'],
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
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
                    style={{
                      stroke:
                        UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                  />
                  <text
                    x={-25}
                    y={y(d)}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-550'],
                      textAnchor: 'end',
                    }}
                    className='text-xs'
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
              style={{
                stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
              }}
              strokeWidth={1}
            />
            {yAxisTitle ? (
              <text
                transform={`translate(${20 - leftMargin}, ${
                  graphHeight / 2
                }) rotate(-90)`}
                style={{
                  fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                  textAnchor: 'middle',
                }}
                className='text-xs'
              >
                {yAxisTitle}
              </text>
            ) : null}
            <text
              x={-25}
              y={y(0)}
              style={{
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                textAnchor: 'end',
              }}
              className='text-xs'
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
                    fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                    textAnchor: 'middle',
                  }}
                  className='xs:max-[360px]:hidden text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs'
                  dy={15}
                >
                  {format(d, dateFormat)}
                </text>
              </g>
            ))}
          </g>
          <g ref={scope}>
            {dataArray.map((d, i) => (
              <g
                key={i}
                opacity={
                  highlightedLines.length !== 0
                    ? highlightedLines.indexOf(labels[i]) !== -1
                      ? 1
                      : 0.3
                    : 1
                }
              >
                <path
                  key={i}
                  d={lineShape(d as any) as string}
                  fill='none'
                  style={{
                    stroke: colors[i],
                  }}
                  strokeWidth={strokeWidth}
                />
                <g>
                  {d.map((el, j) => (
                    <g key={j}>
                      {!checkIfNullOrUndefined(el.y) ? (
                        <g>
                          {showDots ? (
                            <circle
                              cx={x(el.date)}
                              cy={y(el.y as number)}
                              r={
                                graphWidth / dataFormatted.length < 5
                                  ? 0
                                  : graphWidth / dataFormatted.length < 20
                                  ? 2
                                  : 4
                              }
                              style={{
                                fill: colors[i],
                              }}
                            />
                          ) : null}
                          {showValues ? (
                            <text
                              x={x(el.date)}
                              y={y(el.y as number)}
                              dy={-8}
                              style={{
                                fill: colors[i],
                                textAnchor: 'middle',
                              }}
                              className='text-xs font-bold'
                            >
                              {numberFormattingFunction(el.y, prefix, suffix)}
                            </text>
                          ) : null}
                        </g>
                      ) : null}
                    </g>
                  ))}
                </g>
                {showColorLegendAtTop ? null : (
                  <text
                    style={{
                      fill: colors[i],
                    }}
                    className='text-xs'
                    x={x(d[d.length - 1].date)}
                    y={y(d[d.length - 1].y as number)}
                    dx={5}
                    dy={4}
                  >
                    {labels[i]}
                  </text>
                )}
              </g>
            ))}
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                style={{
                  stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
                }}
                strokeDasharray='4 8'
                strokeWidth={1}
              />
            ) : null}
          </g>
          {refValues.map((el, i) => (
            <g key={i}>
              <line
                style={{
                  stroke:
                    el.color ||
                    UNDPColorModule[mode || 'light'].grays['gray-700'],
                  strokeWidth: 1.5,
                }}
                strokeDasharray='4,4'
                y1={y(el.value as number)}
                y2={y(el.value as number)}
                x1={0 - 20}
                x2={graphWidth + margin.right}
              />
              <text
                x={graphWidth + margin.right}
                y={y(el.value as number)}
                style={{
                  fill:
                    el.color ||
                    UNDPColorModule[mode || 'light'].grays['gray-700'],
                  textAnchor: 'end',
                }}
                className='text-xs font-bold'
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
                        style={{
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          fill: 'none',
                          stroke:
                            d.color ||
                            UNDPColorModule[mode || 'light'].grays['gray-700'],
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
                        style={{
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          fill: 'none',
                          stroke:
                            d.color ||
                            UNDPColorModule[mode || 'light'].grays['gray-700'],
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
                      } leading-tight m-0 whitespace-normal`}
                      style={{
                        color:
                          d.color ||
                          UNDPColorModule[mode || 'light'].grays['gray-700'],
                        maxWidth: d.maxWidth || 'auto',
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
            fill='none'
            pointerEvents='all'
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
          mode={mode}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
    </>
  );
}
