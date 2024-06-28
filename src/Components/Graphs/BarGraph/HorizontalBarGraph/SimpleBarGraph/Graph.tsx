import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState } from 'react';
import styled from 'styled-components';
import {
  HorizontalBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
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
  showBarLabel: boolean;
  truncateBy: number;
  width: number;
  height: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
}

const G = styled.g`
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
    rightMargin,
    topMargin,
    bottomMargin,
    showBarLabel,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
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
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue =
    Math.max(...data.filter(d => d.size !== undefined).map(d => d.size)) < 0
      ? 0
      : Math.max(...data.filter(d => d.size !== undefined).map(d => d.size));
  const xMinValue =
    Math.min(...data.filter(d => d.size !== undefined).map(d => d.size)) >= 0
      ? 0
      : Math.min(...data.filter(d => d.size !== undefined).map(d => d.size));

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
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
                    {numberFormattingFunction(d, '', '')}
                  </text>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={-2.5}
                    y2={graphHeight + margin.bottom}
                    style={{
                      stroke: 'var(--gray-500)',
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
                    : 0.85
                }
                onMouseEnter={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={(event: any) => {
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
                  x={d.size >= 0 ? x(0) : x(d.size)}
                  y={y(`${i}`)}
                  width={d.size >= 0 ? x(d.size) - x(0) : x(0) - x(d.size)}
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
                {showBarLabel ? (
                  <text
                    style={{
                      fill: 'var(--gray-700)',
                      fontSize: '0.75rem',
                      textAnchor: d.size < 0 ? 'start' : 'end',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    x={x(0)}
                    y={(y(`${i}`) as number) + y.bandwidth() / 2}
                    dx={d.size < 0 ? 10 : -10}
                    dy={5}
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
                {showBarValue ? (
                  <text
                    x={x(d.size)}
                    y={(y(`${i}`) as number) + y.bandwidth() / 2}
                    style={{
                      fill:
                        barColor.length > 1 ? 'var(--gray-600)' : barColor[0],
                      fontSize: '1rem',
                      textAnchor: d.size < 0 ? 'end' : 'start',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    dx={d.size < 0 ? -5 : 5}
                    dy={5}
                  >
                    {numberFormattingFunction(
                      d.size,
                      prefix || '',
                      suffix || '',
                    )}
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
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <g key={i}>
                  <line
                    style={{
                      stroke: 'var(--gray-700)',
                      strokeWidth: 1.5,
                    }}
                    strokeDasharray='4,4'
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    x1={x(el.value as number)}
                    x2={x(el.value as number)}
                  />
                  <text
                    y={0 - margin.top}
                    fontWeight='bold'
                    x={x(el.value as number) as number}
                    style={{
                      fill: 'var(--gray-700)',
                      fontFamily: 'var(--fontFamily)',
                      textAnchor:
                        x(el.value as number) > graphWidth * 0.75
                          ? 'end'
                          : 'start',
                    }}
                    fontSize={12}
                    dy={12.5}
                    dx={x(el.value as number) > graphWidth * 0.75 ? -5 : 5}
                  >
                    {el.text}
                  </text>
                </g>
              ))}
            </>
          ) : null}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
