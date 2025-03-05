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
import { CSSObject, DualAxisLineChartDataType } from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { UNDPColorModule } from '../../../ColorPalette';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: DualAxisLineChartDataType[];
  lineColors: [string, string];
  lineTitles: [string, string];
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
  sameAxes: boolean;
  highlightAreaSettings: [number | string | null, number | string | null];
  highlightAreaColor: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  animateLine: boolean | number;
  strokeWidth: number;
  showDots: boolean;
  mode: 'light' | 'dark';
  tooltipBackgroundStyle: CSSObject;
  noOfYTicks: number;
  lineSuffixes: [string, string];
  linePrefixes: [string, string];
  minDate?: string | number;
  maxDate?: string | number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    lineColors,
    lineTitles,
    sameAxes,
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
    strokeWidth,
    showDots,
    mode,
    tooltipBackgroundStyle,
    noOfYTicks,
    lineSuffixes,
    linePrefixes,
    minDate,
    maxDate,
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

  const minParam = minParam1 < minParam2 ? minParam1 : minParam2;
  const maxParam = maxParam1 > maxParam2 ? maxParam1 : maxParam2;
  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);

  const y1 = scaleLinear()
    .domain([
      sameAxes ? minParam : minParam1,
      sameAxes ? (maxParam > 0 ? maxParam : 0) : maxParam1 > 0 ? maxParam1 : 0,
    ])
    .range([graphHeight, 0])
    .nice();
  const y2 = scaleLinear()
    .domain([
      sameAxes ? minParam : minParam2,
      sameAxes ? (maxParam > 0 ? maxParam : 0) : maxParam2 > 0 ? maxParam2 : 0,
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape1 = line()
    .defined((d: any) => !checkIfNullOrUndefined(d.y1))
    .x((d: any) => x(d.date))
    .y((d: any) => y1(d.y1))
    .curve(curveMonotoneX);

  const lineShape2 = line()
    .defined((d: any) => !checkIfNullOrUndefined(d.y2))
    .x((d: any) => x(d.date))
    .y((d: any) => y2(d.y2))
    .curve(curveMonotoneX);
  const y1Ticks = y1.ticks(noOfYTicks);
  const y2Ticks = y2.ticks(noOfYTicks);
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
          <g>
            {y1Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y1(d)}
                  y2={y1(d)}
                  x1={-15}
                  x2={-20}
                  stroke={lineColors[0]}
                  strokeWidth={1}
                />
                <text
                  x={-25}
                  y={y1(d)}
                  fill={lineColors[0]}
                  dy={3}
                  className='text-xs'
                  style={{
                    textAnchor: 'end',
                  }}
                >
                  {numberFormattingFunction(
                    d,
                    linePrefixes[0],
                    lineSuffixes[0],
                  )}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={-15}
              x2={-15}
              stroke={lineColors[0]}
              strokeWidth={1}
            />
            <text
              transform={`translate(${20 - leftMargin}, ${
                graphHeight / 2
              }) rotate(-90)`}
              fill={lineColors[0]}
              className='text-xs'
              style={{
                textAnchor: 'middle',
              }}
            >
              {lineTitles[0].length > 100
                ? `${lineTitles[0].substring(0, 100)}...`
                : lineTitles[0]}
            </text>
          </g>
          <g>
            {y2Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y2(d)}
                  y2={y2(d)}
                  x1={graphWidth + 15}
                  x2={graphWidth + 20}
                  stroke={lineColors[1]}
                  strokeWidth={1}
                />
                <text
                  x={graphWidth + 25}
                  y={y2(d)}
                  fill={lineColors[1]}
                  dy={3}
                  dx={-2}
                  className='text-xs'
                  style={{
                    textAnchor: 'start',
                  }}
                >
                  {numberFormattingFunction(
                    d,
                    linePrefixes[1],
                    lineSuffixes[1],
                  )}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={graphWidth + 15}
              x2={graphWidth + 15}
              stroke={lineColors[1]}
              strokeWidth={1}
            />
            <text
              transform={`translate(${graphWidth + rightMargin - 15}, ${
                graphHeight / 2
              }) rotate(-90)`}
              fill={lineColors[1]}
              className='text-xs'
              style={{
                textAnchor: 'middle',
              }}
            >
              {lineTitles[1].length > 100
                ? `${lineTitles[1].substring(0, 100)}...`
                : lineTitles[1]}
            </text>
          </g>
          <g>
            <line
              y1={graphHeight}
              y2={graphHeight}
              x1={-15}
              x2={graphWidth + 15}
              style={{
                stroke: UNDPColorModule[mode || 'light'].grays['gray-500'],
              }}
              strokeWidth={1}
            />
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
            <path
              d={lineShape1(dataFormatted as any) as string}
              fill='none'
              stroke={lineColors[0]}
              strokeWidth={strokeWidth}
            />
            <path
              d={lineShape2(dataFormatted as any) as string}
              fill='none'
              stroke={lineColors[1]}
              strokeWidth={strokeWidth}
            />
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
                {!checkIfNullOrUndefined(d.y1) ? (
                  <g>
                    {showDots ? (
                      <circle
                        cx={x(d.date)}
                        cy={y1(d.y1 as number)}
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
                        y={y1(d.y1 as number)}
                        dy={
                          checkIfNullOrUndefined(d.y2)
                            ? -8
                            : (d.y2 as number) < (d.y1 as number)
                            ? -8
                            : 15
                        }
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
                {!checkIfNullOrUndefined(d.y2) ? (
                  <g>
                    {showDots ? (
                      <circle
                        cx={x(d.date)}
                        cy={y2(d.y2 as number)}
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
                        y={y2(d.y2 as number)}
                        dy={
                          checkIfNullOrUndefined(d.y1)
                            ? -8
                            : (d.y1 as number) < (d.y2 as number)
                            ? -8
                            : 15
                        }
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
