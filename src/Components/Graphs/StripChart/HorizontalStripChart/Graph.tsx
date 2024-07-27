import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import isEqual from 'lodash.isequal';
import { StripChartDataType } from '../../../../Types';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: StripChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  colors: string[];
  colorDomain: string[];
  pointRadius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  showAxis: boolean;
  prefix: string;
  suffix: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    colorDomain,
    pointRadius,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    highlightedDataPoints,
    selectedColor,
    minValue,
    maxValue,
    onSeriesMouseClick,
    showAxis,
    prefix,
    suffix,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
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

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) < 0
    ? 0
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) >= 0
    ? 0
    : Math.min(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {dataWithId.map((d, i) => {
            return (
              <g
                className='g-with-hover'
                key={i}
                transform={`translate(${x(d.position)},${graphHeight / 2})`}
                opacity={
                  selectedColor
                    ? d.color
                      ? colors[colorDomain.indexOf(d.color)] === selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf(d.label) !== -1
                      ? 0.85
                      : 0.3
                    : 0.85
                }
                onMouseEnter={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onClick={() => {
                  if (onSeriesMouseClick) {
                    if (isEqual(mouseClickData, d)) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData(d);
                      onSeriesMouseClick(d);
                    }
                  }
                }}
                onMouseMove={(event: any) => {
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
                  cy={0}
                  cx={0}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : colors[colorDomain.indexOf(d.color)],
                  }}
                  r={pointRadius}
                />
                {highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      x={0}
                      y={0 - pointRadius - 3}
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(d.color)],
                        fontFamily: 'var(--fontFamily)',
                      }}
                      textAnchor='middle'
                      fontSize={12}
                    >
                      {numberFormattingFunction(d.position, prefix, suffix)}
                    </text>
                  ) : null
                ) : null}
              </g>
            );
          })}
          {showAxis ? (
            <>
              <text
                x={0}
                y={graphHeight / 2 + pointRadius + 14}
                style={{
                  fill: 'var(--gray-500)',
                  fontFamily: 'var(--fontFamily)',
                }}
                textAnchor='start'
                fontSize={12}
              >
                {numberFormattingFunction(x.invert(0), '', '')}
              </text>
              <text
                x={graphWidth}
                y={graphHeight / 2 + pointRadius + 14}
                style={{
                  fill: 'var(--gray-500)',
                  fontFamily: 'var(--fontFamily)',
                }}
                textAnchor='end'
                fontSize={12}
              >
                {numberFormattingFunction(x.invert(graphWidth), '', '')}
              </text>
            </>
          ) : null}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
