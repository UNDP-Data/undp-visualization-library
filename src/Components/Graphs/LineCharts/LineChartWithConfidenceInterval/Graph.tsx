import { useEffect, useRef, useState } from 'react';
import { line, curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
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
  LineChartWithConfidenceIntervalDataType,
  ReferenceDataType,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';

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
  highlightAreaSettings: [number | string | null, number | string | null];
  highlightAreaColor: string;
  maxValue?: number;
  minValue?: number;
  animateLine: boolean | number;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  strokeWidth: number;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  mode: 'light' | 'dark';
  regressionLine: boolean | string;
  showIntervalDots: boolean;
  showIntervalValues: boolean;
  intervalLineStrokeWidth: number;
  intervalLineColors: [string, string];
  intervalAreaColor: string;
  intervalAreaOpacity: number;
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
    highlightAreaColor,
    maxValue,
    animateLine,
    rtl,
    language,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    mode,
    regressionLine,
    showIntervalDots,
    showIntervalValues,
    intervalLineStrokeWidth,
    intervalLineColors,
    intervalAreaColor,
    intervalAreaOpacity,
    tooltipBackgroundStyle,
    yAxisTitle,
    noOfYTicks,
    minDate,
    maxDate,
  } = props;
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
    left: leftMargin,
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
    .curve(curveMonotoneX);

  const lineShapeMin = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.yMin))
    .curve(curveMonotoneX);

  const lineShapeMax = line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.yMax))
    .curve(curveMonotoneX);

  const areaShape = area()
    .x((d: any) => x(d.date))
    .y0((d: any) => y(d.yMin))
    .y1((d: any) => y(d.yMax))
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
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    textAnchor='end'
                    fontSize={12}
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
            <text
              x={-25}
              y={y(minParam < 0 ? 0 : minParam)}
              style={{
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
              textAnchor='end'
              fontSize={12}
              dy={3}
            >
              {numberFormattingFunction(
                minParam < 0 ? 0 : minParam,
                prefix,
                suffix,
              )}
            </text>
            {yAxisTitle ? (
              <text
                transform={`translate(${20 - leftMargin}, ${
                  graphHeight / 2
                }) rotate(-90)`}
                style={{
                  fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                textAnchor='middle'
                fontSize={12}
              >
                {yAxisTitle}
              </text>
            ) : null}
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i}>
                <text
                  className='undp-viz-x-axis-text'
                  y={graphHeight}
                  x={x(d)}
                  style={{
                    fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                  textAnchor='middle'
                  fontSize={12}
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
                    fill='none'
                    style={{
                      stroke: intervalLineColors[0],
                    }}
                    strokeWidth={intervalLineStrokeWidth}
                  />
                  <path
                    d={lineShapeMax(dataFormatted as any) as string}
                    fill='none'
                    style={{
                      stroke: intervalLineColors[1],
                    }}
                    strokeWidth={intervalLineStrokeWidth}
                  />
                </g>
              ) : null}
              <path
                d={lineShape(dataFormatted as any) as string}
                fill='none'
                style={{
                  stroke: lineColor,
                }}
                strokeWidth={strokeWidth}
              />
            </g>
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
                        fontSize={12}
                        textAnchor='middle'
                        style={{
                          fontWeight: 'bold',
                          fill: lineColor,
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
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
                          fontSize={12}
                          textAnchor='middle'
                          style={{
                            fontWeight: 'bold',
                            fill: intervalLineColors[0],
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
                        >
                          {numberFormattingFunction(d.yMin, prefix, suffix)}
                        </text>
                        <text
                          x={x(d.date)}
                          y={y(d.yMax)}
                          dy={-8}
                          fontSize={12}
                          textAnchor='middle'
                          style={{
                            fontWeight: 'bold',
                            fill: intervalLineColors[1],
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
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
                fontWeight='bold'
                y={y(el.value as number)}
                style={{
                  fill:
                    el.color ||
                    UNDPColorModule[mode || 'light'].grays['gray-700'],
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  textAnchor: 'end',
                }}
                fontSize={12}
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
                      className={`${
                        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                      }undp-viz-typography`}
                      style={{
                        color:
                          d.color ||
                          UNDPColorModule[mode || 'light'].grays['gray-700'],
                        fontWeight: d.fontWeight || 'regular',
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        whiteSpace: 'normal',
                        fontSize: '14px',
                        textAlign: d.align || (rtl ? 'right' : 'left'),
                        maxWidth: d.maxWidth || 'auto',
                        lineHeight: 1.2,
                        margin: 0,
                        paddingLeft: rtl ? 0 : '4px',
                        paddingRight: !rtl ? 0 : '4px',
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
                style={{
                  fill: 'none',
                  strokeWidth: 1.5,
                  stroke:
                    typeof regressionLine === 'string'
                      ? regressionLine
                      : UNDPColorModule[mode || 'light'].grays['gray-700'],
                  strokeDasharray: '4,4',
                }}
              />
            ) : null}
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
