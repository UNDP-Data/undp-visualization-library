import { scaleLinear, scaleBand } from 'd3-scale';
import { format } from 'd3-format';
import { BarGraphProps } from '../../../types';

interface Props {
  data: BarGraphProps[];
  svgWidth: number;
  svgHeight: number;
  barColor: string;
  labelFormat?: string;
  suffix?: string;
  prefix?: string;
}

export function Graph(props: Props) {
  const { data, svgWidth, svgHeight, barColor, suffix, prefix, labelFormat } =
    props;
  const margin = {
    top: 10,
    bottom: 10,
    left: 100,
    right: 40,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data.map(d => d.value));

  const xScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const yScale = scaleBand()
    .domain(data.map(d => `${d.barTitle}`))
    .range([0, graphHeight])
    .paddingInner(0.25);
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => {
          return (
            <g key={i}>
              <rect
                x={0}
                y={yScale(`${d.barTitle}`)}
                width={xScale(d.value)}
                fill={barColor}
                height={yScale.bandwidth()}
              />
              <text
                x={0}
                y={(yScale(`${d.barTitle}`) as number) + yScale.bandwidth() / 2}
                fontSize='14px'
                fontWeight='bold'
                textAnchor='end'
                fill='#110848'
                dx='-5px'
                dy={5}
              >
                {d.barTitle}
              </text>
              <text
                x={xScale(d.value)}
                y={(yScale(`${d.barTitle}`) as number) + yScale.bandwidth() / 2}
                fontSize='18px'
                fontWeight='bold'
                textAnchor='start'
                fill={barColor}
                dx='5px'
                dy={5}
              >
                {prefix || ''}{' '}
                {Math.abs(d.value) < 1
                  ? d.value
                  : format(labelFormat || '.3s')(d.value).replace('G', 'B')}
                {suffix || ''}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
