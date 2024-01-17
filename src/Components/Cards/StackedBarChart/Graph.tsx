import { scaleBand, scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import { format } from 'd3-format';
import sumBy from 'lodash.sumby';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { StackedBarGraphProps } from '../../../types';

interface Props {
  data: StackedBarGraphProps[];
  barColors: string[];
  svgWidth: number;
  svgHeight: number;
  labelFormat?: string;
  suffix?: string;
  prefix?: string;
}

export function StackedBarChartGraph(props: Props) {
  const { data, barColors, svgWidth, svgHeight, suffix, prefix, labelFormat } =
    props;
  const margin = {
    top: 5,
    bottom: 20,
    left: 0,
    right: 5,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const maxParam: number = maxBy(data, d => d.total)?.total
    ? (maxBy(data, d => d.total)?.total as number)
    : 0;

  const xScale = scaleBand()
    .domain(data.map(d => `${d.barTitle}`))
    .range([0, graphWidth])
    .paddingInner(0.25);
  const heightScale = scaleLinear()
    .domain([0, maxParam])
    .range([graphHeight, 0])
    .nice();
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight - 10}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((d, i) => {
          return (
            <g key={i}>
              {d.values.map((el, j) => (
                <g
                  key={j}
                  transform={`translate(${xScale(
                    `${d.barTitle}`,
                  )},${heightScale(
                    sumBy(
                      d.values.filter(
                        (val, k) => !checkIfNullOrUndefined(val) && k < j,
                      ),
                      val => val.value,
                    ),
                  )})`}
                >
                  <rect
                    x={0}
                    y={heightScale(el.value)}
                    width={xScale.bandwidth()}
                    fill={barColors[j]}
                    height={Math.abs(heightScale(el.value) - heightScale(0))}
                  />
                  {heightScale(el.value) > 20 ? (
                    <text
                      x={xScale.bandwidth() / 2}
                      y={
                        heightScale(el.value) +
                        Math.abs(heightScale(el.value) - heightScale(0)) / 2
                      }
                      fontSize='12px'
                      fontWeight='bold'
                      textAnchor='middle'
                      fill='#FFF'
                      dy='-5px'
                    >
                      {prefix || ''}{' '}
                      {Math.abs(el.value) < 1
                        ? el.value
                        : format(labelFormat || '.3s')(el.value).replace(
                            'G',
                            'B',
                          )}
                      {suffix || ''}
                    </text>
                  ) : null}
                </g>
              ))}
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
                y={heightScale(d.total)}
                fontSize='18px'
                fontWeight='bold'
                textAnchor='middle'
                style={{ fill: 'var(--gray-700)' }}
                dy='-5px'
              >
                {prefix || ''}{' '}
                {Math.abs(d.total) < 1
                  ? d.total
                  : format(labelFormat || '.3s')(d.total).replace('G', 'B')}
                {suffix || ''}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
