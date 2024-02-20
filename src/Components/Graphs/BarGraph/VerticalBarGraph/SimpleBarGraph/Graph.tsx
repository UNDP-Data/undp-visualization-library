import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import { useState } from 'react';
import styled from 'styled-components';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { VerticalBarGraphDataType } from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';

interface Props {
  data: VerticalBarGraphDataType[];
  width: number;
  height: number;
  barColor: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showBarLabel: boolean;
  showBarValue: boolean;
  showYTicks: boolean;
  colorLegendTitle?: string;
  colorDomain: string[];
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
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
    width,
    height,
    barColor,
    suffix,
    prefix,
    barPadding,
    showBarLabel,
    showBarValue,
    showYTicks,
    colorDomain,
    colorLegendTitle,
    truncateBy,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data.map(d => d.height));

  const y = scaleLinear().domain([0, xMaxValue]).range([graphHeight, 0]).nice();
  const x = scaleBand()
    .domain(data.map(d => `${d.label}`))
    .range([0, graphWidth])
    .paddingInner(barPadding);
  const yTicks = y.ticks(5);
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
          <line
            y1={y(0)}
            y2={y(0)}
            x1={0 - margin.left}
            x2={graphWidth + margin.right}
            style={{
              stroke: 'var(--gray-700)',
            }}
            strokeWidth={1}
          />
          <text
            x={0 - margin.left + 2}
            y={y(0)}
            style={{
              fill: 'var(--gray-700)',
              fontFamily: 'var(--fontFamily)',
            }}
            textAnchor='start'
            fontSize={12}
            dy={-3}
          >
            0
          </text>
          {showYTicks
            ? yTicks.map((d, i) => (
                <g key={i}>
                  <line
                    key={i}
                    y1={y(d)}
                    y2={y(d)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                    style={{
                      stroke: 'var(--gray-500)',
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                  <text
                    x={0 - margin.left + 2}
                    y={y(d)}
                    textAnchor='start'
                    fontSize={12}
                    dy={-3}
                    opacity={d === 0 ? 0 : 1}
                    style={{
                      fontFamily: 'var(--fontFamily)',
                      fill: 'var(--gray-500)',
                    }}
                  >
                    {numberFormattingFunction(d)}
                  </text>
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
                  x={x(`${d.label}`)}
                  y={y(d.height)}
                  width={x.bandwidth()}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? barColor[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : barColor[colorDomain.indexOf(d.color)],
                  }}
                  height={Math.abs(y(d.height) - y(0))}
                />
                {showBarLabel ? (
                  <text
                    x={(x(`${d.label}`) as number) + x.bandwidth() / 2}
                    y={y(0)}
                    style={{
                      fill: 'var(--gray-700)',
                      fontSize: '0.75rem',
                      textAnchor: 'middle',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    dy='15px'
                  >
                    {d.label.length < truncateBy
                      ? d.label
                      : `${d.label.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
                {showBarValue ? (
                  <text
                    x={(x(`${d.label}`) as number) + x.bandwidth() / 2}
                    y={y(d.height)}
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? barColor[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : barColor[colorDomain.indexOf(d.color)],
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      textAnchor: 'middle',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    dy='-5px'
                  >
                    {prefix}
                    {numberFormattingFunction(d.height)}
                    {suffix}
                  </text>
                ) : null}
              </G>
            );
          })}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
