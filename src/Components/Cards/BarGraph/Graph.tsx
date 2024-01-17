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
    top: 90,
    bottom: 25,
    left: 20,
    right: 20,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data.map(d => d.value));

  const heightScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([graphHeight, 0])
    .nice();
  const xScale = scaleBand()
    .domain(data.map(d => `${d.barTitle}`))
    .range([0, graphWidth])
    .paddingInner(0.25);
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => {
          return (
            <g key={i}>
              <rect
                x={xScale(`${d.barTitle}`)}
                y={heightScale(d.value)}
                width={xScale.bandwidth()}
                fill={barColor}
                height={Math.abs(heightScale(d.value) - heightScale(0))}
              />
              <text
                x={(xScale(`${d.barTitle}`) as number) + xScale.bandwidth() / 2}
                y={heightScale(0)}
                fontSize='14px'
                fontWeight='bold'
                textAnchor='middle'
                fill='#110848'
                dy='15px'
              >
                {d.barTitle}
              </text>
              <text
                x={(xScale(`${d.barTitle}`) as number) + xScale.bandwidth() / 2}
                y={heightScale(d.value)}
                fontSize='18px'
                fontWeight='bold'
                textAnchor='middle'
                fill={barColor}
                dy='-5px'
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
