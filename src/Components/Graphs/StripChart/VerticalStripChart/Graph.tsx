import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
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
  radius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showAxis: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  prefix: string;
  suffix: string;
  stripType: 'strip' | 'dot';
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  highlightColor?: string;
  dotOpacity: number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    colorDomain,
    radius,
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
    stripType,
    rtl,
    language,
    highlightColor,
    dotOpacity,
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

  const sortedData = sortBy(dataWithId, item => {
    const index = (highlightedDataPoints || []).indexOf(item.label);
    return index === -1 ? Infinity : index;
  }).reverse();
  const yMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) < 0
    ? 0
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );
  const yMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) >= 0
    ? 0
    : Math.min(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );
  const y = scaleLinear()
    .domain([yMinValue, yMaxValue])
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
          {sortedData.map((d, i) => {
            return (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                transform={`translate(${graphWidth / 2},${y(d.position)})`}
                opacity={
                  selectedColor
                    ? d.color
                      ? colors[colorDomain.indexOf(d.color)] === selectedColor
                        ? 1
                        : dotOpacity
                      : dotOpacity
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf(d.label) !== -1
                      ? 0.85
                      : dotOpacity
                    : dotOpacity
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
                {stripType === 'dot' ? (
                  <circle
                    cy={0}
                    cx={0}
                    style={{
                      fill:
                        highlightColor && highlightedDataPoints
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? highlightColor
                            : data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(d.color)]
                          : data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : colors[colorDomain.indexOf(d.color)],
                    }}
                    r={radius}
                  />
                ) : (
                  <rect
                    x={0 - radius}
                    y={-1}
                    width={radius * 2}
                    height={2}
                    style={{
                      fill:
                        highlightColor && highlightedDataPoints
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? highlightColor
                            : data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(d.color)]
                          : data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule.graphGray
                          : colors[colorDomain.indexOf(d.color)],
                    }}
                  />
                )}
                {highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      y={0 + 4}
                      x={0 + radius + 3}
                      style={{
                        fill:
                          highlightColor && highlightedDataPoints
                            ? highlightedDataPoints.indexOf(d.label) !== -1
                              ? highlightColor
                              : data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                              ? UNDPColorModule.graphGray
                              : colors[colorDomain.indexOf(d.color)]
                            : data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(d.color)],
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      }}
                      textAnchor='start'
                      fontSize={14}
                      fontWeight='bold'
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
                y={0}
                x={graphWidth / 2 + radius + 5}
                style={{
                  fill: UNDPColorModule.grays['gray-500'],
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                textAnchor='start'
                fontSize={12}
              >
                {numberFormattingFunction(y.invert(0), '', '')}
              </text>
              <text
                y={graphHeight}
                x={graphWidth / 2 + radius + 5}
                style={{
                  fill: UNDPColorModule.grays['gray-500'],
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                textAnchor='start'
                fontSize={12}
              >
                {numberFormattingFunction(y.invert(graphHeight), '', '')}
              </text>
            </>
          ) : null}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
        />
      ) : null}
    </>
  );
}
