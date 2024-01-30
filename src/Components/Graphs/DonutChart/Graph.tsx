import { pie, arc } from 'd3-shape';
import { DonutChartDataType } from '../../../Types';

interface Props {
  mainText?: string;
  radius: number;
  colors: string[];
  subNote?: string;
  strokeWidth: number;
  data: DonutChartDataType[];
}

export function Graph(props: Props) {
  const { mainText, data, radius, colors, subNote, strokeWidth } = props;
  const pieData = pie()
    .startAngle(0)
    .value((d: any) => d.value);
  return (
    <svg
      width={`${radius * 2}px`}
      height={`${radius * 2}px`}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
    >
      <g transform={`translate(${radius} ${radius})`}>
        <circle
          style={{
            fillOpacity: 0,
            stroke: 'var(--gray-400)',
            strokeWidth,
          }}
          cx={0}
          cy={0}
          r={radius - (strokeWidth + 2) / 2}
        />
        {pieData(data as any).map((d, i) => (
          <path
            key={i}
            d={
              arc()({
                innerRadius: radius - strokeWidth,
                outerRadius: radius,
                startAngle: d.startAngle,
                endAngle: d.endAngle,
              }) as string
            }
            style={{
              fill: colors[d.index],
            }}
          />
        ))}
        {mainText ? (
          <text
            x={0}
            y={0}
            textAnchor='middle'
            fontSize='2.813rem'
            fontWeight='bold'
            style={{ fill: 'var(--black)' }}
          >
            {mainText}
          </text>
        ) : null}
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
