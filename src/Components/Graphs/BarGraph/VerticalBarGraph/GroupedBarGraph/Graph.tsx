import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { VerticalGroupedBarGraphDataType } from '../../../../../Types';

interface Props {
  data: VerticalGroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showBarLabel: boolean;
  showBarValue: boolean;
  showYTicks: boolean;
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    suffix,
    prefix,
    barPadding,
    showBarLabel,
    showBarValue,
    showYTicks,
    truncateBy,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
  } = props;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data.map(d => max(d.height) || 0));

  const y = scaleLinear().domain([0, xMaxValue]).range([graphHeight, 0]).nice();
  const x = scaleBand()
    .domain(data.map(d => `${d.label}`))
    .range([0, graphWidth])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].height.map((_d, i) => `${i}`))
    .range([0, x.bandwidth()])
    .paddingInner(0.01);
  const yTicks = y.ticks(5);
  return (
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
                  stroke='#A9B1B7'
                  strokeWidth={1}
                  strokeDasharray='4,8'
                  opacity={d === 0 ? 0 : 1}
                />
                <text
                  x={0 - margin.left + 2}
                  y={y(d)}
                  fill='#A9B1B7'
                  textAnchor='start'
                  fontSize={12}
                  dy={-3}
                  opacity={d === 0 ? 0 : 1}
                >
                  {numberFormattingFunction(d)}
                </text>
              </g>
            ))
          : null}
        {data.map((d, i) => {
          return (
            <g key={i} transform={`translate(${x(`${d.label}`)},0)`}>
              {d.height.map((el, j) => (
                <g key={j}>
                  <rect
                    x={subBarScale(`${j}`)}
                    y={y(el)}
                    width={subBarScale.bandwidth()}
                    style={{
                      fill: barColors[j],
                    }}
                    height={Math.abs(y(el) - y(0))}
                  />
                  {showBarValue ? (
                    <text
                      x={
                        (subBarScale(`${j}`) as number) +
                        subBarScale.bandwidth() / 2
                      }
                      y={y(el)}
                      style={{
                        fill: barColors[j],
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textAnchor: 'middle',
                      }}
                      dy='-5px'
                    >
                      {prefix}
                      {numberFormattingFunction(el)}
                      {suffix}
                    </text>
                  ) : null}
                </g>
              ))}
              {showBarLabel ? (
                <text
                  x={x.bandwidth() / 2}
                  y={y(0)}
                  style={{
                    fill: 'var(--gray-700)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    textAnchor: 'middle',
                  }}
                  dy='15px'
                >
                  {d.label.length < truncateBy
                    ? d.label
                    : `${d.label.substring(0, truncateBy)}...`}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
