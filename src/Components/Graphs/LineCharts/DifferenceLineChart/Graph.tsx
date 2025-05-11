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
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { useAnimate, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react';

import {
  AnnotationSettingsDataType,
  ClassNameObject,
  CustomHighlightAreaSettingsDataType,
  DifferenceLineChartDataType,
  HighlightAreaSettingsDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '@/Utils/getLineEndPoint';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { Annotation } from '@/Components/Elements/Annotations';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { HighlightArea } from '@/Components/Elements/HighlightArea';
import { CustomArea } from '@/Components/Elements/HighlightArea/customArea';

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
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  yAxisTitle?: string;
  noOfYTicks: number;
  minDate?: string | number;
  maxDate?: string | number;
  curveType: 'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore';
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

interface FormattedDataType {
  y1: number;
  y2: number;
  date: Date;
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
  const [areaScope, areaAnimate] = useAnimate();
  const [annotationsScope, annotationsAnimate] = useAnimate();
  const isInView = useInView(scope);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    'date',
  );
  const highlightAreaSettingsFormatted = highlightAreaSettings.map(d => ({
    ...d,
    coordinates: [
      d.coordinates[0] === null ? null : parse(`${d.coordinates[0]}`, dateFormat, new Date()),
      d.coordinates[1] === null ? null : parse(`${d.coordinates[1]}`, dateFormat, new Date()),
    ],
  }));
  const customHighlightAreaSettingsFormatted = customHighlightAreaSettings.map(d => ({
    ...d,
    coordinates: d.coordinates.map((el, j) =>
      j % 2 === 0 ? parse(`${el}`, dateFormat, new Date()) : (el as number),
    ),
  }));
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = minDate ? parse(`${minDate}`, dateFormat, new Date()) : dataFormatted[0].date;
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
      checkIfNullOrUndefined(maxValue) ? (maxParam > 0 ? maxParam : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape1 = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y1))
    .curve(curve);

  const lineShape2 = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y2))
    .curve(curve);

  const mainGraphArea = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y1))
    .y0(d => y(d.y2))
    .curve(curve);
  const mainGraphArea1 = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y1))
    .y0(0)
    .curve(curve);
  const mainGraphArea2 = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y2))
    .y0(0)
    .curve(curve);
  const yTicks = y.ticks(noOfYTicks);
  const xTicks = x.ticks(noOfXTicks);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        onSeriesMouseOver(selectedData || dataFormatted[dataFormatted.length - 1]);
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
    select(MouseoverRectRef.current).on('mousemove', mousemove).on('mouseout', mouseout);
  }, [x, dataFormatted, onSeriesMouseOver]);

  useEffect(() => {
    if (isInView && data.length > 0) {
      animate(
        'path',
        { pathLength: [0, 1] },
        { duration: animateLine === true ? 5 : animateLine || 0 },
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
  }, [
    isInView,
    showColorLegendAtTop,
    data,
    animate,
    animateLine,
    showDots,
    areaAnimate,
    areaScope,
    annotationsAnimate,
    annotationsScope,
  ]);
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              d={mainGraphArea2(dataFormatted as any) as string}
              style={{ fill: 'none' }}
            />
          </clipPath>
          <clipPath id={`below${idSuffix}`}>
            <path
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              d={mainGraphArea1(dataFormatted as any) as string}
              style={{ fill: 'none' }}
            />
          </clipPath>
          <HighlightArea
            areaSettings={highlightAreaSettingsFormatted}
            width={graphWidth}
            height={graphHeight}
            scale={x}
          />
          <CustomArea areaSettings={customHighlightAreaSettingsFormatted} scaleX={x} scaleY={y} />
          <g>
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
                label={numberFormattingFunction(minParam < 0 ? 0 : minParam, prefix, suffix)}
                labelPos={{
                  x: 0 - leftMargin,
                  y: y(minParam < 0 ? 0 : minParam),
                  dx: 0,
                  dy: maxParam < 0 ? '1rem' : -5,
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
          </g>
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
          <g ref={areaScope}>
            <path
              d={mainGraphArea(dataFormatted) || ''}
              clipPath={`url(#below${idSuffix})`}
              style={{ fill: diffAreaColors[1] }}
            />
            <path
              d={mainGraphArea(dataFormatted) || ''}
              clipPath={`url(#above${idSuffix})`}
              style={{ fill: diffAreaColors[0] }}
            />
          </g>
          <g ref={scope}>
            <path
              d={lineShape1(dataFormatted) || ''}
              style={{
                fill: 'none',
                stroke: lineColors[0],
                strokeWidth,
              }}
            />
            <path
              d={lineShape2(dataFormatted) || ''}
              style={{
                fill: 'none',
                stroke: lineColors[1],
                strokeWidth,
              }}
            />
            {showColorLegendAtTop ? null : (
              <g>
                <text
                  style={{ fill: lineColors[0] }}
                  className='text-xs'
                  x={x(dataFormatted[dataFormatted.length - 1].date)}
                  y={y(dataFormatted[dataFormatted.length - 1].y1 as number)}
                  dx={5}
                  dy={4}
                >
                  {colorDomain[0]}
                </text>
                <text
                  style={{ fill: lineColors[1] }}
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
                className={cn(
                  'undp-tick-line stroke-primary-gray-700 dark:stroke-primary-gray-100',
                  classNames?.mouseOverLine,
                )}
                style={styles?.mouseOverLine}
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
                        style={{ fill: lineColors[0] }}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(d.date)}
                        y={y(d.y1)}
                        dy={d.y2 < d.y1 ? -8 : '1em'}
                        style={{
                          fill: lineColors[0],
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value graph-value-line-1 text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
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
                        style={{ fill: lineColors[1] }}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(d.date)}
                        y={y(d.y2)}
                        dy={d.y2 > d.y1 ? -8 : '1em'}
                        style={{
                          fill: lineColors[1],
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value graph-value-line-2 text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                      >
                        {numberFormattingFunction(d.y2, prefix, suffix)}
                      </text>
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
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                  y: d.yCoordinate
                    ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                    : 0 + (d.yOffset || 0) - 8,
                },
                {
                  x: d.xCoordinate ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) : 0,
                  y: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                },
                checkIfNullOrUndefined(d.connectorRadius) ? 3.5 : (d.connectorRadius as number),
              );
              const connectorSettings = d.showConnector
                ? {
                    y1: endPoints.y,
                    x1: endPoints.x,
                    y2: d.yCoordinate
                      ? y(d.yCoordinate as number) + (d.yOffset || 0)
                      : 0 + (d.yOffset || 0),
                    x2: d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0),
                    cy: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                    cx: d.xCoordinate ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) : 0,
                    circleRadius: checkIfNullOrUndefined(d.connectorRadius)
                      ? 3.5
                      : (d.connectorRadius as number),
                    strokeWidth: d.showConnector === true ? 2 : Math.min(d.showConnector || 0, 1),
                  }
                : undefined;
              const labelSettings = {
                y: d.yCoordinate
                  ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                  : 0 + (d.yOffset || 0) - 8,
                x: rtl
                  ? 0
                  : d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                width: rtl
                  ? d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0)
                  : graphWidth -
                    (d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
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
