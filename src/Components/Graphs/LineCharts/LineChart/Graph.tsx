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
import { LineChartDataType, ReferenceDataType } from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: LineChartDataType[];
  color: string;
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
  refValues?: ReferenceDataType[];
  highlightAreaSettings: [number | null, number | null];
  highlightAreaColor: string;
  maxValue?: number;
  minValue?: number;
  animateLine?: boolean | number;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  strokeWidth: number;
  showDots: boolean;
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
    language,
    strokeWidth,
    showDots,
  } = props;
  const [scope, animate] = useAnimate();
  const [labelScope, labelAnimate] = useAnimate();
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
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = dataFormatted[0].date;
  const maxYear = dataFormatted[dataFormatted.length - 1].date;
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
  const yTicks = y.ticks(5);
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
    }
  }, [isInView, data]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {highlightAreaSettings[0] === null &&
          highlightAreaSettings[1] === null ? null : (
            <g>
              <rect
                style={{
                  fill: highlightAreaColor,
                }}
                x={
                  highlightAreaSettings[0]
                    ? (highlightAreaSettings[0] as number) * graphWidth
                    : 0
                }
                width={
                  highlightAreaSettings[1]
                    ? (highlightAreaSettings[1] as number) * graphWidth -
                      (highlightAreaSettings[0]
                        ? (highlightAreaSettings[0] as number) * graphWidth
                        : 0)
                    : graphWidth -
                      (highlightAreaSettings[0]
                        ? (highlightAreaSettings[0] as number) * graphWidth
                        : 0)
                }
                y={0}
                height={graphHeight}
              />
            </g>
          )}
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
                      stroke: UNDPColorModule.grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                  />
                  <text
                    x={-25}
                    y={y(d)}
                    style={{
                      fill: UNDPColorModule.grays['gray-500'],
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
                    {numberFormattingFunction(d, '', '')}
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
                stroke: UNDPColorModule.grays['gray-700'],
              }}
              strokeWidth={1}
            />
            <text
              x={-25}
              y={y(minParam < 0 ? 0 : minParam)}
              style={{
                fill: UNDPColorModule.grays['gray-700'],
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
              {numberFormattingFunction(minParam < 0 ? 0 : minParam, '', '')}
            </text>
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i}>
                <text
                  className='undp-viz-x-axis-text'
                  y={graphHeight}
                  x={x(d)}
                  style={{
                    fill: UNDPColorModule.grays['gray-700'],
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
            <path
              d={lineShape(dataFormatted as any) as string}
              fill='none'
              style={{
                stroke: color,
              }}
              strokeWidth={strokeWidth}
              ref={scope}
            />
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                stroke='#212121'
                strokeDasharray='4 8'
                strokeWidth={1}
              />
            ) : null}
          </g>
          <g ref={labelScope}>
            {dataFormatted.map((d, i) => (
              <g key={i}>
                {d.y !== undefined ? (
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
                          fill: color,
                        }}
                      />
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
                          fill: UNDPColorModule.grays['gray-700'],
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                      >
                        {numberFormattingFunction(
                          d.y,
                          prefix || '',
                          suffix || '',
                        )}
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
                <g key={i}>
                  <line
                    style={{
                      stroke: el.color || UNDPColorModule.grays['gray-700'],
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
                      fill: el.color || UNDPColorModule.grays['gray-700'],
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
            </>
          ) : null}
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
        />
      ) : null}
    </>
  );
}
