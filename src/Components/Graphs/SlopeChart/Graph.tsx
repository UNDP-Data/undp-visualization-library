import { useState } from 'react';
import maxBy from 'lodash.maxby';
import { scaleLinear } from 'd3-scale';
import minBy from 'lodash.minby';
import UNDPColorModule from 'undp-viz-colors';
import { SlopeChartDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';

interface Props {
  data: SlopeChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  pointRadius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  axisTitle: [string, string];
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    showLabels,
    colors,
    colorDomain,
    pointRadius,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    axisTitle,
    highlightedDataPoints,
    selectedColor,
  } = props;
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
  const minY = Math.min(
    minBy(data, 'y1')?.y1 as number,
    minBy(data, 'y2')?.y2 as number,
  );
  const maxY = Math.max(
    maxBy(data, 'y1')?.y1 as number,
    maxBy(data, 'y2')?.y2 as number,
  );
  const y = scaleLinear()
    .domain([minY > 0 ? 0 : minY, maxY > 0 ? maxY : 0])
    .range([graphHeight, 0])
    .nice();
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            <line
              y1={0}
              y2={graphHeight}
              x1={pointRadius + 5}
              x2={pointRadius + 5}
              style={{
                stroke: 'var(--gray-500)',
              }}
              strokeWidth={1}
            />
            <text
              x={pointRadius + 5}
              y={graphHeight}
              style={{
                fill: 'var(--gray-700)',
                fontFamily: 'var(--fontFamily)',
              }}
              textAnchor='middle'
              fontSize={12}
              dy={15}
            >
              {axisTitle[0]}
            </text>
          </g>
          <g>
            <line
              y1={0}
              y2={graphHeight}
              x1={graphWidth - (pointRadius + 5)}
              x2={graphWidth - (pointRadius + 5)}
              style={{
                stroke: 'var(--gray-500)',
              }}
              strokeWidth={1}
            />
            <text
              x={graphWidth - (pointRadius + 5)}
              y={graphHeight}
              style={{
                fill: 'var(--gray-700)',
                fontFamily: 'var(--fontFamily)',
              }}
              textAnchor='middle'
              fontSize={12}
              dy={15}
            >
              {axisTitle[1]}
            </text>
          </g>
          {data.map((d, i) => {
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? colors[colorDomain.indexOf(`${d.color}`)] ===
                        selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : mouseOverData
                    ? mouseOverData.label === d.label
                      ? 1
                      : 0.3
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf(d.label) !== -1
                      ? 1
                      : 0.3
                    : 1
                }
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
              >
                <circle
                  cx={pointRadius + 5}
                  cy={y(d.y1)}
                  r={pointRadius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
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
                          : colors[colorDomain.indexOf(`${d.color}`)],
                      fontFamily: 'var(--fontFamily)',
                      textAnchor: 'end',
                    }}
                    y={y(d.y1)}
                    x={5}
                    dy={4}
                    dx={-3}
                  >
                    {d.label}
                  </text>
                ) : highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      fontSize={10}
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        fontFamily: 'var(--fontFamily)',
                        textAnchor: 'end',
                      }}
                      y={y(d.y1)}
                      x={5}
                      dy={4}
                      dx={-3}
                    >
                      {d.label}
                    </text>
                  ) : null
                ) : null}
                <circle
                  cx={graphWidth - (pointRadius + 5)}
                  cy={y(d.y2)}
                  r={pointRadius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
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
                          : colors[colorDomain.indexOf(`${d.color}`)],
                      fontFamily: 'var(--fontFamily)',
                      textAnchor: 'start',
                    }}
                    y={y(d.y2)}
                    x={graphWidth - 5}
                    dy={4}
                    dx={3}
                  >
                    {d.label}
                  </text>
                ) : highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      fontSize={10}
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        fontFamily: 'var(--fontFamily)',
                        textAnchor: 'start',
                      }}
                      y={y(d.y2)}
                      x={graphWidth - 5}
                      dy={4}
                      dx={3}
                    >
                      {d.label}
                    </text>
                  ) : null
                ) : null}
                <line
                  x1={pointRadius + 5}
                  x2={graphWidth - (pointRadius + 5)}
                  y1={y(d.y1)}
                  y2={y(d.y2)}
                  style={{
                    fill: 'none',
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    strokeWidth: 1,
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
