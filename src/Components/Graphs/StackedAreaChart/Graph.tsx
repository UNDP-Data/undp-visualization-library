import { useEffect, useRef, useState } from 'react';
import { curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import { MultiLineChartDataType, ReferenceDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: MultiLineChartDataType[];
  colors: string[];
  width: number;
  height: number;
  dateFormat: string;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  yAxisTitle?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings: [number | null, number | null];
  maxValue?: number;
  minValue?: number;
  highlightAreaColor: string;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    dateFormat,
    noOfXTicks,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    yAxisTitle,
    tooltip,
    onSeriesMouseOver,
    highlightAreaSettings,
    refValues,
    minValue,
    maxValue,
    highlightAreaColor,
    rtl,
    language,
  } = props;
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
    return dataFormatted.map(el => ({
      date: el.date,
      y0: i === 0 ? 0 : sum(el.y.filter((_element, k) => k < i)),
      y1: sum(el.y.filter((_element, k) => k <= i)),
    }));
  });
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = dataFormatted[0].date;
  const maxYear = dataFormatted[dataFormatted.length - 1].date;
  const minParam = checkIfNullOrUndefined(minValue) ? 0 : (minValue as number);
  const maxParam: number = checkIfNullOrUndefined(maxValue)
    ? Math.max(...data.map(d => sum(d.y) || 0))
    : (maxValue as number);

  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const areaShape = area()
    .x((d: any) => x(d.date))
    .y0((d: any) => y(d.y0))
    .y1((d: any) => y(d.y1))
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
                    x2={0}
                    style={{
                      stroke: UNDPColorModule.grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                  />
                  <text
                    x={-5}
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
              y1={graphHeight}
              y2={graphHeight}
              x1={0}
              x2={width}
              style={{
                stroke: UNDPColorModule.grays['gray-700'],
              }}
              strokeWidth={1}
            />
            {yAxisTitle ? (
              <text
                transform={`translate(-40, ${graphHeight / 2}) rotate(-90)`}
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
                    fill: UNDPColorModule.grays['gray-700'],
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
            {dataArray.map((d, i) => {
              return (
                <path
                  key={i}
                  d={areaShape(d as any) as string}
                  style={{
                    fill: colors[i],
                    opacity: 0.8,
                  }}
                />
              );
            })}
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
                    x1={0}
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
