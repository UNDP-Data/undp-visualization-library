import { useEffect, useRef, useState } from 'react';
import {
  line,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import min from 'lodash.min';
import max from 'lodash.max';
import { useAnimate, useInView } from 'framer-motion';
import { cn } from '@undp-data/undp-design-system-react';
import {
  AnnotationSettingsDataType,
  ClassNameObject,
  CustomHighlightAreaSettingsDataType,
  MultiLineChartDataType,
  ReferenceDataType,
  StyleObject,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';
import { AxisTitle } from '../../../Elements/Axes/AxisTitle';
import { Axis } from '../../../Elements/Axes/Axis';
import { YTicksAndGridLines } from '../../../Elements/Axes/yTicksAndGridLines';
import { XTicksAndGridLines } from '../../../Elements/Axes/XTicksAndGridLines';
import { RefLineY } from '../../../Elements/ReferenceLine';
import { Annotation } from '../../../Elements/Annotations';

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
  yAxisTitle?: string;
  noOfYTicks: number;
  minDate?: string | number;
  maxDate?: string | number;
  curveType: 'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore';
  styles?: StyleObject;
  classNames?: ClassNameObject;
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
    yAxisTitle,
    noOfYTicks,
    minDate,
    maxDate,
    curveType,
    styles,
    classNames,
  } = props;
  const curve =
    curveType === 'linear'
      ? curveLinear
      : curveType === 'step'
      ? curveStep
      : curveType === 'stepAfter'
      ? curveStepAfter
      : curveType === 'stepBefore'
      ? curveStepBefore
      : curveMonotoneX;
  const [scope, animate] = useAnimate();
  const [annotationsScope, annotationsAnimate] = useAnimate();
  const isInView = useInView(scope);
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: yAxisTitle ? leftMargin + 30 : leftMargin,
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
    .curve(curve);
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
            <YTicksAndGridLines
              values={yTicks.filter(d => d !== 0)}
              y={yTicks.filter(d => d !== 0).map(d => y(d))}
              x1={0 - leftMargin}
              x2={graphWidth + margin.right}
              styles={{
                gridLines: styles?.yAxis?.gridLines,
                labels: styles?.yAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.yAxis?.gridLines,
                labels: classNames?.yAxis?.labels,
              }}
              suffix={suffix}
              prefix={prefix}
              labelType='secondary'
              showGridLines
              labelPos='vertical'
            />
            <Axis
              y1={y(minParam < 0 ? 0 : minParam)}
              y2={y(minParam < 0 ? 0 : minParam)}
              x1={0 - leftMargin}
              x2={graphWidth + margin.right}
              label={numberFormattingFunction(
                minParam < 0 ? 0 : minParam,
                prefix,
                suffix,
              )}
              labelPos={{
                x: 0 - leftMargin,
                y: y(minParam < 0 ? 0 : minParam) - 5,
              }}
              classNames={{
                axis: classNames?.xAxis?.axis,
                label: classNames?.yAxis?.labels,
              }}
              styles={{
                axis: styles?.xAxis?.axis,
                label: styles?.yAxis?.labels,
              }}
            />
            <AxisTitle
              x={0 - leftMargin - 15}
              y={graphHeight / 2}
              style={styles?.yAxis?.title}
              className={classNames?.yAxis?.title}
              text={yAxisTitle}
              rotate90
            />
          </g>
          <g>
            <XTicksAndGridLines
              values={xTicks.map(d => format(d, dateFormat))}
              x={xTicks.map(d => x(d))}
              y1={0}
              y2={graphHeight}
              styles={{
                gridLines: styles?.xAxis?.gridLines,
                labels: styles?.xAxis?.labels,
              }}
              classNames={{
                gridLines: cn('opacity-0', classNames?.xAxis?.gridLines),
                labels: cn(
                  'fill-primary-gray-700 dark:fill-primary-gray-300 xs:max-[360px]:hidden text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs',
                  classNames?.xAxis?.labels,
                ),
              }}
              suffix={suffix}
              prefix={prefix}
              labelType='primary'
              showGridLines
            />
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
                  style={{
                    stroke: colors[i],
                    fill: 'none',
                    strokeWidth,
                  }}
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
                                ...(styles?.graphObjectValues || {}),
                              }}
                              className={cn(
                                'graph-value text-xs font-bold',
                                classNames?.graphObjectValues,
                              )}
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
                className={cn(
                  'undp-tick-line stroke-primary-gray-700 dark:stroke-primary-gray-100',
                  classNames?.mouseOverLine,
                )}
                style={styles?.mouseOverLine}
              />
            ) : null}
          </g>
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <RefLineY
                  key={i}
                  text={el.text}
                  color={el.color}
                  y={y(el.value as number)}
                  x1={0 - leftMargin}
                  x2={graphWidth + margin.right}
                  classNames={el.classNames}
                  styles={el.styles}
                />
              ))}
            </>
          ) : null}
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
              const connectorSettings = d.showConnector
                ? {
                    y1: endPoints.y,
                    x1: endPoints.x,
                    y2: d.yCoordinate
                      ? y(d.yCoordinate as number) + (d.yOffset || 0)
                      : 0 + (d.yOffset || 0),
                    x2: d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                        (d.xOffset || 0)
                      : 0 + (d.xOffset || 0),
                    cy: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                    cx: d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date()))
                      : 0,
                    circleRadius: checkIfNullOrUndefined(d.connectorRadius)
                      ? 3.5
                      : (d.connectorRadius as number),
                    strokeWidth:
                      d.showConnector === true
                        ? 2
                        : Math.min(d.showConnector || 0, 1),
                  }
                : undefined;
              const labelSettings = {
                y: d.yCoordinate
                  ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                  : 0 + (d.yOffset || 0) - 8,
                x: rtl
                  ? 0
                  : d.xCoordinate
                  ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                    (d.xOffset || 0)
                  : 0 + (d.xOffset || 0),
                width: rtl
                  ? d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                      (d.xOffset || 0)
                    : 0 + (d.xOffset || 0)
                  : graphWidth -
                    (d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                        (d.xOffset || 0)
                      : 0 + (d.xOffset || 0)),
                maxWidth: d.maxWidth,
                fontWeight: d.fontWeight,
                align: d.align,
              };
              return (
                <Annotation
                  key={i}
                  color={d.color}
                  connectorsSettings={connectorSettings}
                  labelSettings={labelSettings}
                  text={d.text}
                  classNames={d.classNames}
                  styles={d.styles}
                />
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
          backgroundStyle={styles?.tooltip}
          className={classNames?.tooltip}
        />
      ) : null}
    </>
  );
}
