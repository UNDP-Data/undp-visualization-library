import { scaleLinear, scaleBand } from 'd3-scale';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { VerticalBarGraphDataType } from '../../../../types';

interface Props {
  data: VerticalBarGraphDataType[];
  width: number;
  height: number;
  barColor: string;
  suffix?: string;
  prefix?: string;
  barPadding: number;
  showBarLabel: boolean;
  showBarValue: boolean;
  showTicks: boolean;
}

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
    showTicks,
  } = props;
  const margin = {
    top: 90,
    bottom: 25,
    left: 20,
    right: 20,
  };
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
          stroke='#55606E'
          strokeWidth={1}
        />
        <text
          x={0 - margin.left + 2}
          y={y(0)}
          fill='#A9B1B7'
          textAnchor='start'
          fontSize={12}
          dy={-3}
        >
          0
        </text>
        {showTicks
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
            <g key={i}>
              <rect
                x={x(`${d.label}`)}
                y={y(d.height)}
                width={x.bandwidth()}
                style={{
                  fill: barColor || 'var(--blue-600)',
                }}
                height={Math.abs(y(d.height) - y(0))}
              />
              {showBarLabel ? (
                <text
                  x={(x(`${d.label}`) as number) + x.bandwidth() / 2}
                  y={y(0)}
                  style={{
                    fill: 'var(--gray-700)',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    textAnchor: 'middle',
                  }}
                  dy='15px'
                >
                  {d.label}
                </text>
              ) : null}
              {showBarValue ? (
                <text
                  x={(x(`${d.label}`) as number) + x.bandwidth() / 2}
                  y={y(d.height)}
                  style={{
                    fill: barColor || 'var(--blue-600)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAnchor: 'middle',
                  }}
                  dy='-5px'
                >
                  {prefix || ''} {numberFormattingFunction(d.height)}
                  {suffix || ''}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
