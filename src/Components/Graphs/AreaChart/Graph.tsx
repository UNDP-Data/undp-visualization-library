import { useEffect, useRef, useState } from 'react';
import { curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import styled from 'styled-components';
import { bisect } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import { MultiLineChartDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

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
}

interface MouseOverDataType {
  date: Date;
  y: (number | undefined)[];
}

const XTickText = styled.text`
  font-size: 12px;
  @media (max-width: 980px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    font-size: 9px;
  }
  @media (max-width: 420px) {
    display: none;
  }
`;

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
  } = props;
  const [mouseOverData, setMouseOverData] = useState<
    MouseOverDataType | undefined
  >(undefined);
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
  const minParam = 0;
  const maxParam: number = Math.max(...data.map(d => sum(d.y) || 0));

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
          bisect(
            dataFormatted.map(d => d.date),
            x.invert(pointer(event)[0]),
            1,
          )
        ];
      setMouseOverData(selectedData || dataFormatted[dataFormatted.length - 1]);
    };
    const mouseout = () => {
      setMouseOverData(undefined);
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
  }, [x, dataFormatted]);
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g>
          {yTicks.map((d, i) =>
            d !== 0 ? (
              <g key={i}>
                <line
                  y1={y(d)}
                  y2={y(d)}
                  x1={width}
                  x2={0}
                  stroke='#AAA'
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={-5}
                  y={y(d)}
                  fill='#AAA'
                  textAnchor='end'
                  fontSize={12}
                  dy={3}
                >
                  {numberFormattingFunction(d)}
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
              stroke: 'var(--gray-700)',
            }}
            strokeWidth={1}
          />
          {yAxisTitle ? (
            <text
              transform={`translate(-40, ${graphHeight / 2}) rotate(-90)`}
              style={{
                fill: 'var(--gray-700)',
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
              <XTickText
                y={graphHeight}
                x={x(d)}
                style={{
                  fill: 'var(--gray-700)',
                }}
                textAnchor='middle'
                fontSize={12}
                dy={15}
              >
                {format(d, dateFormat)}
              </XTickText>
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
        <rect
          ref={MouseoverRectRef}
          fill='none'
          pointerEvents='all'
          width={graphWidth}
          height={graphHeight}
        />
      </g>
    </svg>
  );
}
