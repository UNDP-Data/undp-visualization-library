import { scaleLinear, scaleBand } from 'd3-scale';
import sum from 'lodash.sum';
import { useState } from 'react';
import styled from 'styled-components';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { VerticalGroupedBarGraphDataType } from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';

interface Props {
  data: VerticalGroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  barPadding: number;
  showBarLabel: boolean;
  showYTicks: boolean;
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
    barColors,
    barPadding,
    showBarLabel,
    showYTicks,
    truncateBy,
    leftMargin,
    topMargin,
    bottomMargin,
    rightMargin,
    tooltip,
    onSeriesMouseOver,
  } = props;
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

  const xMaxValue = Math.max(...data.map(d => sum(d.height) || 0));

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
                      stroke: 'var(--gray-400)',
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
                      fill: 'var(--gray-400)',
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
                transform={`translate(${x(`${d.label}`)},0)`}
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
                {d.height.map((_el, j) => (
                  <g key={j}>
                    <rect
                      x={0}
                      y={y(sum(d.height.filter((_element, k) => k <= j)))}
                      width={x.bandwidth()}
                      style={{
                        fill: barColors[j],
                      }}
                      height={Math.abs(
                        y(sum(d.height.filter((_element, k) => k <= j))) -
                          y(sum(d.height.filter((_element, k) => k < j))),
                      )}
                    />
                  </g>
                ))}
                {showBarLabel ? (
                  <text
                    x={x.bandwidth() / 2}
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
