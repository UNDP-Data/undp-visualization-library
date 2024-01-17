import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { SlopeChartProps } from '../../../types';

interface Props {
  data: SlopeChartProps[];
  svgWidth: number;
  svgHeight: number;
  labelFormat?: string;
  suffix?: string;
  prefix?: string;
}

export function Graph(props: Props) {
  const { data, svgWidth, svgHeight, suffix, prefix, labelFormat } = props;
  const margin = {
    top: 10,
    bottom: 10,
    left: 40,
    right: 150,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const xMaxValue =
    Math.max(...data.map(d => d.values[0].value)) >
    Math.max(...data.map(d => d.values[1].value))
      ? Math.max(...data.map(d => d.values[0].value))
      : Math.max(...data.map(d => d.values[1].value));

  const heightScale = scaleLinear()
    .domain([0, xMaxValue])
    .range([graphHeight, 0])
    .nice();
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={graphHeight}
          style={{
            stroke: 'var(--gray-300)',
            strokeWidth: 1,
            fill: 'none',
          }}
        />
        <text
          x={0}
          y={heightScale(0)}
          fontSize='14px'
          fontWeight='bold'
          textAnchor='middle'
          fill='#110848'
          dy='15px'
        >
          {data[0].values[0].category}
        </text>
        <line
          x1={graphWidth}
          y1={0}
          x2={graphWidth}
          y2={graphHeight}
          style={{
            stroke: 'var(--gray-300)',
            strokeWidth: 1,
            fill: 'none',
          }}
        />
        <text
          x={graphWidth}
          y={heightScale(0)}
          fontSize='14px'
          fontWeight='bold'
          textAnchor='middle'
          fill='#110848'
          dy='15px'
        >
          {data[0].values[1].category}
        </text>
        {data.map((d, i) => {
          return (
            <g key={i}>
              <circle
                cx={0}
                cy={heightScale(d.values[0].value)}
                r={4.5}
                fill={d.color}
              />
              <text
                x={0}
                y={heightScale(d.values[0].value)}
                fontSize='12px'
                fontWeight='bold'
                textAnchor='end'
                fill={d.color}
                dy='5px'
              >
                {prefix || ''}{' '}
                {Math.abs(d.values[0].value) < 1
                  ? d.values[0].value
                  : format(labelFormat || '.3s')(d.values[0].value).replace(
                      'G',
                      'B',
                    )}
                {suffix || ''}
              </text>
              <circle
                cx={graphWidth}
                cy={heightScale(d.values[1].value)}
                r={4.5}
                fill={d.color}
              />
              <text
                x={graphWidth}
                y={heightScale(d.values[1].value)}
                fontSize='12px'
                fontWeight='bold'
                textAnchor='start'
                fill={d.color}
                dy='5px'
              >
                {prefix || ''}{' '}
                {Math.abs(d.values[1].value) < 1
                  ? d.values[1].value
                  : format(labelFormat || '.3s')(d.values[1].value).replace(
                      'G',
                      'B',
                    )}
                {suffix || ''} ({d.category})
              </text>
              <line
                x1={0}
                x2={graphWidth}
                y1={heightScale(d.values[0].value)}
                y2={heightScale(d.values[1].value)}
                strokeWidth={1.5}
                fill='none'
                stroke={d.color}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
