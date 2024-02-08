import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { useState } from 'react';
import { HorizontalGroupedBarGraphDataType } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';

interface Props {
  data: HorizontalGroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showXTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  width: number;
  suffix: string;
  prefix: string;
  showBarValue: boolean;
  height: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showXTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    suffix,
    prefix,
    showBarValue,
    rightMargin,
    topMargin,
    bottomMargin,
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

  const xMaxValue = Math.max(...data.map(d => max(d.width) || 0));

  const x = scaleLinear().domain([0, xMaxValue]).range([0, graphWidth]).nice();
  const y = scaleBand()
    .domain(data.map(d => `${d.label}`))
    .range([0, graphHeight])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].width.map((_d, i) => `${i}`))
    .range([0, y.bandwidth()])
    .paddingInner(0.01);
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
                    fill='#AAA'
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
                    stroke='#AAA'
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                </g>
              ))
            : null}
          {data.map((d, i) => {
            return (
              <g key={i} transform={`translate(${0},${y(`${d.label}`)})`}>
                {d.width.map((el, j) => (
                  <g key={j}>
                    <rect
                      key={j}
                      x={0}
                      y={subBarScale(`${j}`)}
                      width={x(el)}
                      style={{
                        fill: barColors[j],
                      }}
                      height={subBarScale.bandwidth()}
                      onMouseEnter={event => {
                        setMouseOverData(d);
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                        if (onSeriesMouseOver) {
                          onSeriesMouseOver(d.data);
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
                    />
                    {showBarValue ? (
                      <text
                        x={x(el)}
                        y={
                          (subBarScale(`${j}`) as number) +
                          subBarScale.bandwidth() / 2
                        }
                        style={{
                          fill: barColors[j],
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          textAnchor: 'middle',
                        }}
                        dx={7}
                        dy={6}
                      >
                        {prefix}
                        {numberFormattingFunction(el)}
                        {suffix}
                      </text>
                    ) : null}
                  </g>
                ))}
                <text
                  style={{
                    fill: 'var(--gray-700)',
                    fontSize: '0.75rem',
                    textAnchor: 'end',
                  }}
                  x={x(0)}
                  y={y.bandwidth() / 2}
                  dx={-10}
                  dy={8}
                >
                  {d.label.length < truncateBy
                    ? d.label
                    : `${d.label.substring(0, truncateBy)}...`}
                </text>
              </g>
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
      {mouseOverData?.data && tooltip && eventX && eventY ? (
        <Tooltip
          body={tooltip(mouseOverData.data)}
          xPos={eventX}
          yPos={eventY}
        />
      ) : null}
    </>
  );
}
