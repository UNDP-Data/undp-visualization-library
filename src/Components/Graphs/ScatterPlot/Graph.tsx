import { useState } from 'react';
import { format } from 'd3-format';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { Delaunay } from 'd3-delaunay';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import minBy from 'lodash.minby';
import UNDPColorModule from 'undp-viz-colors';
import { ScatterPlotDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';

interface Props {
  data: ScatterPlotDataType[];
  width: number;
  height: number;
  colorLegendTitle: string;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  pointRadius: number;
  xAxisTitle: string;
  yAxisTitle: string;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colorLegendTitle,
    showLabels,
    colors,
    colorDomain,
    pointRadius,
    xAxisTitle,
    yAxisTitle,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([0, maxBy(data, 'radius')?.radius as number])
          .range([0.25, pointRadius])
          .nice()
      : undefined;
  const dataOrdered =
    data.filter(d => d.radius !== undefined).length === 0
      ? data
      : orderBy(
          data.filter(d => d.radius !== undefined),
          'radius',
          'desc',
        );

  const x = scaleLinear()
    .domain([
      (minBy(data, 'x')?.x as number) > 0 ? 0 : (minBy(data, 'x')?.x as number),
      maxBy(data, 'x')?.x as number,
    ])
    .range([0, graphWidth])
    .nice();
  const y = scaleLinear()
    .domain([
      (minBy(data, 'y')?.y as number) > 0 ? 0 : (minBy(data, 'y')?.y as number),
      maxBy(data, 'y')?.y as number,
    ])
    .range([graphHeight, 0])
    .nice();
  const xTicks = x.ticks(5);
  const yTicks = y.ticks(5);

  const voronoiDiagram = Delaunay.from(
    data,
    d => x(d.x as number),
    d => y(d.y as number),
  ).voronoi([0, 0, graphWidth, graphHeight]);

  return (
    <>
      {data.filter(el => el.color).length !== 0 ? (
        <svg width={`${width}px`} height='60px' viewBox={`0 0 ${width} 60`}>
          <g transform={`translate(${margin.left},0)`}>
            <text
              x={0}
              y={10}
              fontSize={14}
              style={{ fill: 'var(--gray-700)' }}
            >
              {colorLegendTitle}
            </text>
            {colorDomain.map((d, i) => (
              <g
                transform='translate(0,20)'
                key={i}
                onMouseOver={() => {
                  setSelectedColor(colors[i]);
                }}
                onMouseLeave={() => {
                  setSelectedColor(undefined);
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={(i * (graphWidth - 50)) / colorDomain.length + 1}
                  y={1}
                  width={(graphWidth - 50) / colorDomain.length - 2}
                  height={8}
                  fill={colors[i]}
                  stroke={selectedColor === colors[i] ? '#212121' : colors[i]}
                />
                <text
                  x={
                    (i * (graphWidth - 50)) / colorDomain.length +
                    (graphWidth - 50) / 2 / colorDomain.length
                  }
                  y={25}
                  textAnchor='middle'
                  fontSize={12}
                  fill='#212121'
                >
                  {d}
                </text>
              </g>
            ))}
            <g transform='translate(0,20)'>
              <rect
                x={graphWidth - 40}
                y={1}
                width={40}
                height={8}
                fill={UNDPColorModule.graphGray}
                stroke={UNDPColorModule.graphGray}
              />
              <text
                x={graphWidth - 20}
                y={25}
                textAnchor='middle'
                fontSize={12}
                fill={UNDPColorModule.graphGray}
              >
                NA
              </text>
            </g>
          </g>
        </svg>
      ) : null}
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {yTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  x1={0}
                  x2={graphWidth}
                  y1={y(d)}
                  y2={y(d)}
                  stroke='#AAA'
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={0}
                  y={y(d)}
                  style={{
                    fill: 'var(--gray-700)',
                  }}
                  textAnchor='end'
                  fontSize={12}
                  dy={4}
                  dx={-3}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              x1={0}
              x2={graphWidth}
              y1={y(0)}
              y2={y(0)}
              style={{
                stroke: 'var(--gray-700)',
              }}
              strokeWidth={1}
            />
            <text
              x={0}
              y={y(0)}
              style={{
                fill: 'var(--gray-700)',
              }}
              textAnchor='end'
              fontSize={12}
              dy={4}
              dx={-3}
            >
              0
            </text>
            {yAxisTitle ? (
              <text
                transform={`translate(-30, ${graphHeight / 2}) rotate(-90)`}
                style={{
                  fill: 'var(--gray-700)',
                  fontWeight: 'bold',
                }}
                textAnchor='middle'
                fontSize={12}
              >
                {yAxisTitle}
              </text>
            ) : null}
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  y1={0}
                  y2={graphHeight}
                  x1={x(d)}
                  x2={x(d)}
                  stroke='#AAA'
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={x(d)}
                  y={graphHeight}
                  style={{
                    fill: 'var(--gray-700)',
                  }}
                  textAnchor='middle'
                  fontSize={12}
                  dy={12}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={x(0)}
              x2={x(0)}
              style={{
                stroke: 'var(--gray-700)',
              }}
              strokeWidth={1}
            />
            <text
              x={x(0)}
              y={graphHeight}
              style={{
                fill: 'var(--gray-700)',
              }}
              textAnchor='middle'
              fontSize={12}
              dy={15}
            >
              {0}
            </text>
            {xAxisTitle ? (
              <text
                transform={`translate(${graphWidth / 2}, ${graphHeight})`}
                style={{
                  fill: 'var(--gray-700)',
                  fontWeight: 'bold',
                }}
                textAnchor='middle'
                fontSize={12}
                dy={30}
              >
                {xAxisTitle}
              </text>
            ) : null}
          </g>

          {dataOrdered.map((d, i) => {
            return (
              <g key={i}>
                <g
                  opacity={
                    selectedColor
                      ? d.color
                        ? colors[colorDomain.indexOf(d.color)] === selectedColor
                          ? 1
                          : 0.3
                        : 0.3
                      : mouseOverData
                      ? mouseOverData.label === d.label
                        ? 1
                        : 0.3
                      : 1
                  }
                  transform={`translate(${x(d.x)},${y(d.y)})`}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={!radiusScale ? pointRadius : radiusScale(d.radius || 0)}
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : colors[colorDomain.indexOf(d.color)],
                      stroke:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : colors[colorDomain.indexOf(d.color)],
                    }}
                    fillOpacity={0.6}
                  />
                  {showLabels ? (
                    <text
                      fontSize={10}
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(d.color)],
                      }}
                      y={0}
                      x={!radiusScale ? 5 : radiusScale(d.radius || 0)}
                      dy={4}
                      dx={3}
                    >
                      {d.label}
                    </text>
                  ) : null}
                </g>
                <path
                  d={voronoiDiagram.renderCell(i)}
                  fill='#fff'
                  opacity={0}
                  onMouseEnter={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(d);
                    }
                  }}
                  onMouseMove={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                  }}
                  onMouseLeave={() => {
                    setMouseOverData(undefined);
                    setEventX(undefined);
                    setEventY(undefined);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(undefined);
                    }
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
