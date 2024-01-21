import { scaleLinear, scaleBand } from 'd3-scale';
import { HorizontalBarGraphDataType } from '../../../../types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';

interface Props {
  data: HorizontalBarGraphDataType[];
  barColor: string;
  suffix?: string;
  prefix?: string;
  barPadding: number;
  showBarValue: boolean;
  showTicks: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
}

export function Graph(props: Props) {
  const {
    data,
    barColor,
    suffix,
    prefix,
    barPadding,
    showBarValue,
    showTicks,
    leftMargin,
    truncateBy,
    width,
    height,
  } = props;
  const margin = {
    top: 10,
    bottom: 10,
    left: leftMargin,
    right: 40,
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
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <line
          x1={x(0)}
          x2={x(0)}
          y1={-2.5}
          y2={graphHeight + margin.bottom}
          stroke='#55606E'
          strokeWidth={1}
        />
        <text
          x={0 - margin.left + 2}
          y={-12.5}
          fill='#A9B1B7'
          textAnchor='start'
          fontSize={12}
          dy={-3}
        >
          0
        </text>
        {showTicks
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
            <g key={i}>
              <rect
                x={0}
                y={y(`${d.label}`)}
                width={x(d.width)}
                fill={barColor}
                height={y.bandwidth()}
              />
              <text
                x={0}
                y={(y(`${d.label}`) as number) + y.bandwidth() / 2}
                style={{
                  fill: 'var(--gray-700)',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  textAnchor: 'middle',
                }}
                dx='-5px'
                dy={5}
              >
                {d.label}
              </text>
              <text
                style={{
                  fill: barColor || 'var(--blue-600)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textAnchor: 'end',
                }}
                x={x(0)}
                y={(y(`${d.label}`) as number) + y.bandwidth() / 2}
                dx={-15}
                dy={14}
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
                    fill: barColor || 'var(--blue-600)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAnchor: 'middle',
                  }}
                  dx='5px'
                  dy={5}
                >
                  {prefix || ''} {numberFormattingFunction(d.width)}
                  {suffix || ''}
                </text>
              ) : null}
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
  );
}
