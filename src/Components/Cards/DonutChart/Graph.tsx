import { format } from 'd3-format';
import { describeArc } from '../../../Utils/getArc';

interface Props {
  value: number;
  totalValue: number;
  svgWidth: number;
  svgHeight: number;
  color: string;
  subNote?: string;
  labelFormat?: string;
  suffix?: string;
  prefix?: string;
}

export function Graph(props: Props) {
  const {
    value,
    totalValue,
    svgWidth,
    svgHeight,
    color,
    subNote,
    suffix,
    prefix,
    labelFormat,
  } = props;
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${svgWidth / 2} ${svgHeight / 2})`}>
        <circle
          style={{
            fillOpacity: 0,
            stroke: 'var(--gray-400)',
            strokeWidth: 20,
          }}
          cx={0}
          cy={0}
          r={svgWidth / 2 - 11}
        />
        <path
          d={describeArc(
            0,
            0,
            svgWidth / 2 - 11,
            0,
            (value * 360) / totalValue,
          )}
          style={{
            fillOpacity: 0,
            stroke: color,
            strokeWidth: 20,
          }}
        />
        <text
          x={0}
          y={0}
          textAnchor='middle'
          fontSize='2.813rem'
          fontWeight='bold'
          style={{ fill: 'var(--black)' }}
        >
          {prefix || ''}{' '}
          {Math.abs(value) < 1
            ? value
            : format(labelFormat || '.3s')(value).replace('G', 'B')}
          {suffix || ''}
        </text>
        {subNote ? (
          <text
            x={0}
            y={30}
            textAnchor='middle'
            fontSize='1.25rem'
            fontWeight='bold'
            style={{ fill: 'var(--black)' }}
          >
            {subNote}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
