import { useEffect, useRef, useState } from 'react';
import {
  line,
  curveMonotoneX,
  area,
  curveLinear,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { useAnimate, useInView } from 'framer-motion';
import { linearRegression } from 'simple-statistics';
import { cn } from '@undp-data/undp-design-system-react';
import {
  AnnotationSettingsDataType,
  ClassNameObject,
  CustomHighlightAreaSettingsDataType,
  HighlightAreaSettingsDataType,
  LineChartWithConfidenceIntervalDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '@/Utils/getLineEndPoint';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { RegressionLine } from '@/Components/Elements/RegressionLine';
import { Annotation } from '@/Components/Elements/Annotations';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { CustomArea } from '@/Components/Elements/HighlightArea/customArea';
import { HighlightArea } from '@/Components/Elements/HighlightArea';

interface Props {
  data: LineChartWithConfidenceIntervalDataType[];
  lineColor: string;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  dateFormat: string;
  showValues?: boolean;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues: ReferenceDataType[];
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  maxValue?: number;
  minValue?: number;
  animateLine: boolean | number;
  rtl: boolean;
  strokeWidth: number;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  regressionLine: boolean | string;
  showIntervalDots: boolean;
  showIntervalValues: boolean;
  intervalLineStrokeWidth: number;
  intervalLineColors: [string, string];
  intervalAreaColor: string;
  intervalAreaOpacity: number;
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
    lineColor,
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
    maxValue,
    animateLine,
    rtl,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    regressionLine,
    showIntervalDots,
    showIntervalValues,
    intervalLineStrokeWidth,
    intervalLineColors,
    intervalAreaColor,
    intervalAreaOpacity,
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
  const [intervalAreaScope, intervalAreaAnimate] = useAnimate();
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
    left: yAxisTitle ? leftMargin + 30 : leftMargin,
    right: rightMargin,
  };
  const MouseoverRectRef = useRef(null);
  const dataFormatted: {
    date: Date;
    y: number;
    yMin: number;
    yMax: number;
    data?: object;
  }[] = sortBy(
    data
      .filter(d => !checkIfNullOrUndefined(d.y))
      .map(d => ({
        date: parse(`${d.date}`, dateFormat, new Date()),
        y: d.y as number,
        yMin: checkIfNullOrUndefined(d.yMin)
          ? (d.y as number)
          : (d.yMin as number),
        yMax: checkIfNullOrUndefined(d.yMax)
          ? (d.y as number)
          : (d.yMax as number),
        data: d.data,
      })),
    'date',
  );
  const highlightAreaSettingsFormatted = highlightAreaSettings.map(d => ({
    ...d,
    coordinates: [
      d.coordinates[0] === null
        ? null
        : parse(`${d.coordinates[0]}`, dateFormat, new Date()),
      d.coordinates[1] === null
        ? null
        : parse(`${d.coordinates[1]}`, dateFormat, new Date()),
    ],
  }));
  const customHighlightAreaSettingsFormatted = customHighlightAreaSettings.map(
    d => ({
      ...d,
      coordinates: d.coordinates.map((el, j) =>
        j % 2 === 0 ? parse(`${el}`, dateFormat, new Date()) : (el as number),
      ),
    }),
  );
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
    : Math.min(...dataFormatted.map(d => Math.min(d.y, d.yMax, d.yMin)))
    ? Math.min(...dataFormatted.map(d => Math.min(d.y, d.yMax, d.yMin))) > 0
      ? 0
      : Math.min(...dataFormatted.map(d => Math.min(d.y, d.yMax, d.yMin)))
    : 0;
  const maxParam: number = Math.max(
    ...dataFormatted.map(d => Math.max(d.y, d.yMax, d.yMin)),
  )
    ? Math.max(...dataFormatted.map(d => Math.max(d.y, d.yMax, d.yMin)))
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
    .curve(curve);

  const lineShapeMin = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.yMin))
    .curve(curve);

  const lineShapeMax = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.yMax))
    .curve(curve);

  const areaShape = area()
    .x((d: any) => x(d.date))
    .y0((d: any) => y(d.yMin))
    .y1((d: any) => y(d.yMax))
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
      intervalAreaAnimate(
        intervalAreaScope.current,
        { opacity: [0, 1] },
        {
          delay: animateLine === true ? 5 : animateLine || 0,
          duration: animateLine === true ? 0.5 : animateLine || 0,
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
          <HighlightArea
            areaSettings={highlightAreaSettingsFormatted}
            width={graphWidth}
            height={graphHeight}
            scale={x}
          />
          <CustomArea
            areaSettings={customHighlightAreaSettingsFormatted}
            scaleX={x}
            scaleY={y}
          />
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
              x={0 - leftMargin + 15}
              y={graphHeight / 2}
              style={styles?.yAxis?.title}
              className={classNames?.yAxis?.title}
              text={yAxisTitle}
              rotate90
            />
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
            <g ref={scope}>
              <path
                d={areaShape(dataFormatted as any) as string}
                style={{
                  fill: intervalAreaColor,
                  opacity: intervalAreaOpacity,
                }}
                ref={intervalAreaScope}
              />
              {intervalLineStrokeWidth ? (
                <g>
                  <path
                    d={lineShapeMin(dataFormatted as any) as string}
                    style={{
                      stroke: intervalLineColors[0],
                      fill: 'none',
                      strokeWidth: intervalLineStrokeWidth,
                    }}
                  />
                  <path
                    d={lineShapeMax(dataFormatted as any) as string}
                    style={{
                      stroke: intervalLineColors[1],
                      fill: 'none',
                      strokeWidth: intervalLineStrokeWidth,
                    }}
                  />
                </g>
              ) : null}
              <path
                d={lineShape(dataFormatted as any) as string}
                style={{
                  stroke: lineColor,
                  fill: 'none',
                  strokeWidth,
                }}
              />
            </g>
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
          <g ref={labelScope}>
            {dataFormatted.map((d, i) => (
              <g key={i}>
                {!checkIfNullOrUndefined(d.y) ? (
                  <g>
                    {showDots ? (
                      <circle
                        cx={x(d.date)}
                        cy={y(d.y)}
                        r={
                          graphWidth / dataFormatted.length < 5
                            ? 0
                            : graphWidth / dataFormatted.length < 20
                            ? 2
                            : 4
                        }
                        style={{
                          fill: lineColor,
                        }}
                      />
                    ) : null}
                    {showIntervalDots ? (
                      <g>
                        <circle
                          cx={x(d.date)}
                          cy={y(d.yMin)}
                          r={
                            graphWidth / dataFormatted.length < 5
                              ? 0
                              : graphWidth / dataFormatted.length < 20
                              ? 2
                              : 4
                          }
                          style={{
                            fill: intervalLineColors[0],
                          }}
                        />
                        <circle
                          cx={x(d.date)}
                          cy={y(d.yMax)}
                          r={
                            graphWidth / dataFormatted.length < 5
                              ? 0
                              : graphWidth / dataFormatted.length < 20
                              ? 2
                              : 4
                          }
                          style={{
                            fill: intervalLineColors[1],
                          }}
                        />
                      </g>
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(d.date)}
                        y={y(d.y)}
                        dy={-8}
                        style={{
                          fill: lineColor,
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                      >
                        {numberFormattingFunction(d.y, prefix, suffix)}
                      </text>
                    ) : null}
                    {showIntervalValues ? (
                      <g>
                        <text
                          x={x(d.date)}
                          y={y(d.yMin)}
                          dy={16}
                          style={{
                            fill: intervalLineColors[0],
                            textAnchor: 'middle',
                          }}
                          className='text-xs font-bold'
                        >
                          {numberFormattingFunction(d.yMin, prefix, suffix)}
                        </text>
                        <text
                          x={x(d.date)}
                          y={y(d.yMax)}
                          dy={-8}
                          style={{
                            fill: intervalLineColors[1],
                            textAnchor: 'middle',
                          }}
                          className='text-xs font-bold'
                        >
                          {numberFormattingFunction(d.yMax, prefix, suffix)}
                        </text>
                      </g>
                    ) : null}
                  </g>
                ) : null}
              </g>
            ))}
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
          <g ref={regLineScope}>
            {regressionLine ? (
              <RegressionLine
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
                className={classNames?.regLine}
                style={styles?.regLine}
                color={
                  typeof regressionLine === 'string'
                    ? regressionLine
                    : undefined
                }
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
          backgroundStyle={styles?.tooltip}
          className={classNames?.tooltip}
        />
      ) : null}
    </>
  );
}
