import { area, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { bisector } from 'd3-array';
import { useEffect, useRef } from 'react';
import { pointer, select } from 'd3-selection';
import sum from 'lodash.sum';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';

interface DataFormattedType {
  year: number;
  parameters: (number | undefined)[];
  total?: number;
}

interface Props {
  data: DataFormattedType[];
  keys: string[];
  lineColors: string[];
  svgWidth: number;
  svgHeight: number;
  setMouseOverData: (_d: DataFormattedType) => void;
  mouseOverData: DataFormattedType;
}

export function StackedAreaChartGraph(props: Props) {
  const {
    data,
    lineColors,
    svgWidth,
    svgHeight,
    setMouseOverData,
    mouseOverData,
    keys,
  } = props;
  const MouseoverRectRef = useRef(null);
  const margin = {
    top: 5,
    bottom: 20,
    left: 0,
    right: 5,
  };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  const minYear = data[0].year;
  const maxYear = data[data.length - 1].year;

  const minParam = 0;
  const maxParam: number = maxBy(data, (d: any) => d.total)?.total
    ? (maxBy(data, (d: any) => d.total)?.total as number)
    : 0;

  const dataFiltered = data.filter((d: any) => d.total !== undefined);
  const bisect = bisector((d: any) => d.year).left;
  const minYearFiltered = minBy(dataFiltered, (d: any) => d.year)?.year
    ? minBy(dataFiltered, (d: any) => d.year)?.year
    : minYear;
  const maxYearFiltered = maxBy(dataFiltered, (d: any) => d.year)?.year
    ? maxBy(dataFiltered, (d: any) => d.year)?.year
    : maxYear;

  const x = scaleLinear()
    .domain([minYearFiltered as number, maxYearFiltered as number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();
  const mainGraphArea = keys.map((_key, i) =>
    area<DataFormattedType>()
      .x((d: DataFormattedType) => x(d.year))
      .y1((d: DataFormattedType) =>
        y(
          sum(
            d.parameters.filter(
              (el, j) => !checkIfNullOrUndefined(el) && j <= i,
            ),
          ),
        ),
      )
      .y0(y(0))
      .curve(curveMonotoneX),
  );

  useEffect(() => {
    const mousemove = (event: any) => {
      const selectedData = data[bisect(data, x.invert(pointer(event)[0]), 1)];
      setMouseOverData(selectedData || data[data.length - 1]);
    };
    const mouseout = () => {
      setMouseOverData(data[data.length - 1]);
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
  }, [x, data]);
  return (
    <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
      {data.length === 0 ? (
        <text
          x={svgWidth / 2}
          y={svgHeight / 2}
          textAnchor='middle'
          fontSize='2rem'
          fontWeight='bold'
          style={{ fill: 'var(--gray-600)' }}
        >
          No data available
        </text>
      ) : (
        <g transform={`translate(${margin.left},${margin.top})`}>
          {keys.map((_d, i) => (
            <path
              key={i}
              clipPath='url(#clip)'
              d={
                mainGraphArea[keys.length - i - 1](
                  dataFiltered as any,
                ) as string
              }
              fill={lineColors[keys.length - i - 1]}
              opacity={1}
            />
          ))}
          <g>
            {minYearFiltered === maxYearFiltered ? (
              <text
                y={graphHeight}
                x={x(minYearFiltered as number)}
                style={{ fill: 'var(--gray-600)' }}
                textAnchor='middle'
                fontSize={14}
                dy={15}
              >
                {minYearFiltered}
              </text>
            ) : (
              <g>
                <text
                  y={graphHeight}
                  x={x(minYearFiltered as number)}
                  style={{ fill: 'var(--gray-600)' }}
                  textAnchor='start'
                  fontSize={14}
                  dy={15}
                >
                  {minYearFiltered}
                </text>
                <text
                  y={graphHeight}
                  x={x(maxYearFiltered as number)}
                  style={{ fill: 'var(--gray-600)' }}
                  textAnchor='end'
                  fontSize={14}
                  dy={15}
                >
                  {maxYearFiltered}
                </text>
              </g>
            )}
          </g>
          <g>
            {mouseOverData ? (
              <>
                {keys.map((_key, i) => (
                  <g key={i}>
                    {!checkIfNullOrUndefined(mouseOverData.parameters[i]) ? (
                      <circle
                        cx={x(mouseOverData.year)}
                        cy={y(mouseOverData.parameters[i] as number)}
                        r={5}
                        style={{ fill: 'var(--gray-700)' }}
                      />
                    ) : null}
                  </g>
                ))}
              </>
            ) : null}
          </g>
        </g>
      )}
      <rect
        ref={MouseoverRectRef}
        fill='none'
        pointerEvents='all'
        width={graphWidth}
        height={graphHeight}
      />
    </svg>
  );
}
