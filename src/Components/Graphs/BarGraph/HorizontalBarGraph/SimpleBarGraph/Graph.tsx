import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import { useState } from 'react';
import styled from 'styled-components';
import { HorizontalBarGraphDataType } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';

interface Props {
  data: HorizontalBarGraphDataType[];
  barColor: string[];
  colorDomain: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showBarValue: boolean;
  showXTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  colorLegendTitle?: string;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

const G = styled.g`
  opacity: 0.85;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;

export function Graph(props: Props) {
  const {
    data,
    barColor,
    suffix,
    prefix,
    barPadding,
    showBarValue,
    showXTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    colorDomain,
    colorLegendTitle,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data.map(d => d.width));

  const x = scaleLinear().domain([0, xMaxValue]).range([0, graphWidth]).nice();
  const y = scaleBand()
    .domain(data.map(d => `${d.label}`))
    .range([0, graphHeight])
    .paddingInner(barPadding);
  const xTicks = x.ticks(5);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        {data.filter(el => el.color).length !== 0 ? (
          <g transform={`translate(${margin.left},0)`}>
            {colorLegendTitle ? (
              <text
                x={0}
                y={10}
                fontSize={14}
                style={{
                  fill: 'var(--gray-700)',
                  fontFamily: 'var(--fontFamily)',
                }}
              >
                {colorLegendTitle}
              </text>
            ) : null}
            {colorDomain.map((d, i) => (
              <g
                transform='translate(0,20)'
                key={i}
                onMouseOver={() => {
                  setSelectedColor(barColor[i]);
                }}
                onMouseLeave={() => {
                  setSelectedColor(undefined);
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={(i * (graphWidth - 50)) / colorDomain.length + 1}
                  y={1}
                  width={(graphWidth - 50) / colorDomain.length - 2}
                  height={8}
                  fill={barColor[i]}
                  stroke={
                    selectedColor === barColor[i] ? '#212121' : barColor[i]
                  }
                />
                <text
                  x={
                    (i * (graphWidth - 50)) / colorDomain.length +
                    (graphWidth - 50) / 2 / colorDomain.length
                  }
                  y={25}
                  textAnchor='middle'
                  fontSize={12}
                  fill='#212121'
                  style={{
                    fontFamily: 'var(--fontFamily)',
                  }}
                >
                  {d}
                </text>
              </g>
            ))}
            <g transform='translate(0,20)'>
              <rect
                x={graphWidth - 40}
                y={1}
                width={40}
                height={8}
                fill={UNDPColorModule.graphGray}
                stroke={UNDPColorModule.graphGray}
              />
              <text
                x={graphWidth - 20}
                y={25}
                textAnchor='middle'
                fontSize={12}
                fill={UNDPColorModule.graphGray}
                style={{
                  fontFamily: 'var(--fontFamily)',
                }}
              >
                NA
              </text>
            </g>
          </g>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {showXTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <text
                    x={x(d)}
                    y={-12.5}
                    style={{
                      fill: 'var(--gray-500)',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    textAnchor='middle'
                    fontSize={12}
                  >
                    {numberFormattingFunction(d)}
                  </text>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={-2.5}
                    y2={graphHeight + margin.bottom}
                    style={{
                      stroke: 'var(--gray-400)',
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                </g>
              ))
            : null}
          {data.map((d, i) => {
            return (
              <G
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? barColor[colorDomain.indexOf(d.color)] === selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : 1
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onMouseLeave={() => {
                  setMouseOverData(undefined);
                  setEventX(undefined);
                  setEventY(undefined);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(undefined);
                  }
                }}
              >
                <rect
                  x={0}
                  y={y(`${d.label}`)}
                  width={x(d.width)}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? barColor[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : barColor[colorDomain.indexOf(d.color)],
                  }}
                  height={y.bandwidth()}
                />
                <text
                  style={{
                    fill: 'var(--gray-700)',
                    fontSize: '0.75rem',
                    textAnchor: 'end',
                    fontFamily: 'var(--fontFamily)',
                  }}
                  x={x(0)}
                  y={(y(`${d.label}`) as number) + y.bandwidth() / 2}
                  dx={-10}
                  dy={8}
                >
                  {d.label.length < truncateBy
                    ? d.label
                    : `${d.label.substring(0, truncateBy)}...`}
                </text>
                {showBarValue ? (
                  <text
                    x={x(d.width)}
                    y={(y(`${d.label}`) as number) + y.bandwidth() / 2}
                    style={{
                      fill: barColor[0],
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      textAnchor: 'middle',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    dx={10}
                    dy={8}
                  >
                    {prefix}
                    {numberFormattingFunction(d.width)}
                    {suffix}
                  </text>
                ) : null}
              </G>
            );
          })}
          <line
            x1={x(0)}
            x2={x(0)}
            y1={-2.5}
            y2={graphHeight + margin.bottom}
            stroke='#212121'
            strokeWidth={1}
          />
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
