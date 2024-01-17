import { line, area, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { useEffect, useRef } from 'react';
import { bisector } from 'd3-array';
import { pointer, select } from 'd3-selection';
import { TimeSeriesProps } from '../../../types';

interface Props {
  data: TimeSeriesProps[];
  lineColor: string;
  svgWidth: number;
  svgHeight: number;
  strokeWidth: number;
  setMouseOverData: (_d: TimeSeriesProps) => void;
  mouseOverData: TimeSeriesProps;
}

interface DataFormattedType {
  year: number;
  param?: number;
}

export function LineChartGraph(props: Props) {
  const {
    data,
    lineColor,
    svgWidth,
    svgHeight,
    strokeWidth,
    setMouseOverData,
    mouseOverData,
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

  const dataFormatted: DataFormattedType[] = [];
  const bisect = bisector((d: any) => d.year).left;
  for (let i = minYear; i < maxYear + 1; i += 1) {
    dataFormatted.push({
      year: i,
      param:
        data.findIndex(d => d.year === i) !== -1
          ? +data[data.findIndex(d => d.year === i)].value
          : undefined,
    });
  }
  const minParam: number = minBy(dataFormatted, d => d.param)?.param
    ? (minBy(dataFormatted, d => d.param)?.param as number) > 0
      ? 0
      : (minBy(dataFormatted, d => d.param)?.param as number)
    : 0;
  const maxParam: number = maxBy(dataFormatted, d => d.param)?.param
    ? (maxBy(dataFormatted, d => d.param)?.param as number)
    : 0;

  const dataFiltered = dataFormatted.filter(d => d.param !== undefined);
  const minYearFiltered = minBy(dataFiltered, d => d.year)?.year
    ? minBy(dataFiltered, d => d.year)?.year
    : minYear;
  const maxYearFiltered = maxBy(dataFiltered, d => d.year)?.year
    ? maxBy(dataFiltered, d => d.year)?.year
    : maxYear;

  const x = scaleLinear()
    .domain([minYearFiltered as number, maxYearFiltered as number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const lineShape = line()
    .defined((d: any) => d.param !== undefined)
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.param))
    .curve(curveMonotoneX);

  const mainGraphArea = area()
    .x((d: any) => x(d.year))
    .y1((d: any) => y(d.param))
    .y0(graphHeight)
    .curve(curveMonotoneX);

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
      <defs>
        <linearGradient id='Gradient2' x1='0' x2='0' y1='0' y2='1'>
          <stop stopColor='##232E3D' stopOpacity='0.1' offset='0%' />
          <stop stopColor='##232E3D' stopOpacity='0' offset='100%' />
        </linearGradient>
      </defs>
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
          <path
            clipPath='url(#clip)'
            d={mainGraphArea(dataFiltered as any) as string}
            fill='url(#Gradient2)'
          />
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
            <path
              d={lineShape(dataFormatted as any) as string}
              fill='none'
              stroke={lineColor}
              shapeRendering='geometricPrecision'
              strokeWidth={strokeWidth}
            />
            <path
              d={lineShape(dataFiltered as any) as string}
              fill='none'
              stroke={lineColor}
              strokeWidth={strokeWidth}
              shapeRendering='geometricPrecision'
              strokeDasharray='4 8'
            />
          </g>
          <circle
            cx={x(mouseOverData.year)}
            cy={y(mouseOverData.value)}
            r={5}
            fill={lineColor}
          />
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
