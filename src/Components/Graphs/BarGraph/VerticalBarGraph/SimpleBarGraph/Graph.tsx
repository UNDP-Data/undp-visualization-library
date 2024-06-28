import { scaleLinear, scaleBand } from 'd3-scale';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState } from 'react';
import styled from 'styled-components';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import {
  VerticalBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
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
  colorDomain: string[];
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  refValues?: ReferenceDataType[];
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
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
    truncateBy,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
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

  const xMaxValue =
    Math.max(...data.filter(d => d.size !== undefined).map(d => d.size)) < 0
      ? 0
      : Math.max(...data.filter(d => d.size !== undefined).map(d => d.size));
  const xMinValue =
    Math.min(...data.filter(d => d.size !== undefined).map(d => d.size)) >= 0
      ? 0
      : Math.min(...data.filter(d => d.size !== undefined).map(d => d.size));

  const y = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([graphHeight, 0])
    .nice();

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const x = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
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
                    {numberFormattingFunction(d, '', '')}
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
                  x={x(`${i}`)}
                  y={d.size > 0 ? y(d.size) : y(0)}
                  width={x.bandwidth()}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? barColor[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : barColor[colorDomain.indexOf(d.color)],
                  }}
                  height={Math.abs(y(d.size) - y(0))}
                />
                {showBarLabel ? (
                  <text
                    x={(x(`${i}`) as number) + x.bandwidth() / 2}
                    y={y(0)}
                    style={{
                      fill: 'var(--gray-700)',
                      fontSize: '0.75rem',
                      textAnchor: 'middle',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    dy={d.size > 0 ? '15px' : '-5px'}
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
                {showBarValue ? (
                  <text
                    x={(x(`${i}`) as number) + x.bandwidth() / 2}
                    y={y(d.size)}
                    style={{
                      fill:
                        barColor.length > 1 ? 'var(--gray-600)' : barColor[0],
                      fontSize: '1rem',
                      textAnchor: 'middle',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    dy={d.size > 0 ? '-5px' : '15px'}
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
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    fontWeight='bold'
                    y={y(el.value as number)}
                    style={{
                      fill: 'var(--gray-700)',
                      fontFamily: 'var(--fontFamily)',
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
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
