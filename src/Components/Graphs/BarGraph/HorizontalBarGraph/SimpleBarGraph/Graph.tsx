import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { BarGraphDataType, ReferenceDataType } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: BarGraphDataType[];
  barColor: string[];
  colorDomain: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showValues: boolean;
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabels: boolean;
  truncateBy: number;
  width: number;
  height: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  labelOrder?: string[];
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
}

export function Graph(props: Props) {
  const {
    data,
    barColor,
    suffix,
    prefix,
    barPadding,
    showValues,
    showTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    colorDomain,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
    highlightedDataPoints,
    maxValue,
    minValue,
    onSeriesMouseClick,
    labelOrder,
    rtl,
    language,
    mode,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
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

  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      ) < 0
    ? 0
    : Math.max(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      );

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const allLabelInData = data.map(d => `${d.label}`);
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const y = scaleBand()
    .domain(barOrder)
    .range([
      0,
      minBarThickness
        ? Math.max(graphHeight, minBarThickness * barOrder.length)
        : maxBarThickness
        ? Math.min(graphHeight, maxBarThickness * barOrder.length)
        : graphHeight,
    ])
    .paddingInner(barPadding);
  const xTicks = x.ticks(5);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {showTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom + margin.top}
                    style={{
                      stroke:
                        UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                  <text
                    x={x(d)}
                    y={0 - margin.top}
                    textAnchor='start'
                    fontSize={12}
                    dy={10}
                    dx={3}
                    opacity={d === 0 ? 0 : 1}
                    style={{
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      fill: UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                  >
                    {numberFormattingFunction(d, '', '')}
                  </text>
                </g>
              ))
            : null}
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(y(d.id)) ? (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? barColor[colorDomain.indexOf(d.color)] === selectedColor
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
                    if (
                      isEqual(mouseClickData, d) &&
                      resetSelectionOnDoubleClick
                    ) {
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
                {d.size ? (
                  <rect
                    x={d.size >= 0 ? x(0) : x(d.size)}
                    y={y(d.id)}
                    width={d.size >= 0 ? x(d.size) - x(0) : x(0) - x(d.size)}
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? barColor[0]
                          : !d.color
                          ? UNDPColorModule[mode || 'light'].graphGray
                          : barColor[colorDomain.indexOf(d.color)],
                    }}
                    height={y.bandwidth()}
                  />
                ) : null}
                {showLabels ? (
                  <text
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      fontSize: '0.75rem',
                      textAnchor: d.size
                        ? d.size < 0
                          ? 'start'
                          : 'end'
                        : 'end',
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    x={x(0)}
                    y={(y(d.id) as number) + y.bandwidth() / 2}
                    dx={d.size ? (d.size < 0 ? 10 : -10) : -10}
                    dy={5}
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
                {showValues ? (
                  <text
                    x={d.size ? x(d.size) : x(0)}
                    y={(y(d.id) as number) + y.bandwidth() / 2}
                    style={{
                      fill:
                        barColor.length > 1
                          ? UNDPColorModule[mode || 'light'].grays['gray-600']
                          : barColor[0],
                      fontSize: '1rem',
                      textAnchor: d.size
                        ? d.size < 0
                          ? 'end'
                          : 'start'
                        : 'start',
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    dx={d.size ? (d.size < 0 ? -5 : 5) : 5}
                    dy={5}
                  >
                    {numberFormattingFunction(
                      d.size,
                      prefix || '',
                      suffix || '',
                    )}
                  </text>
                ) : null}
              </g>
            ) : null,
          )}
          {labelOrder && (showLabels || showValues)
            ? labelOrder
                .filter(d => allLabelInData.indexOf(d) === -1)
                .map((d, i) =>
                  !checkIfNullOrUndefined(y(d)) ? (
                    <g className='undp-viz-g-with-hover' key={i}>
                      {showLabels ? (
                        <text
                          style={{
                            fill: UNDPColorModule[mode || 'light'].grays[
                              'gray-700'
                            ],
                            fontSize: '0.75rem',
                            textAnchor: 'end',
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
                          x={x(0)}
                          y={(y(d) as number) + y.bandwidth() / 2}
                          dx={-10}
                          dy={5}
                        >
                          {`${d}`.length < truncateBy
                            ? `${d}`
                            : `${`${d}`.substring(0, truncateBy)}...`}
                        </text>
                      ) : null}
                      {showValues ? (
                        <text
                          x={x(xMinValue < 0 ? 0 : xMinValue)}
                          y={(y(d) as number) + y.bandwidth() / 2}
                          style={{
                            fill:
                              barColor.length > 1
                                ? UNDPColorModule[mode || 'light'].grays[
                                    'gray-600'
                                  ]
                                : barColor[0],
                            fontSize: '1rem',
                            textAnchor: 'start',
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
                          dx={5}
                          dy={5}
                        >
                          {numberFormattingFunction(
                            0,
                            prefix || '',
                            suffix || '',
                          )}
                        </text>
                      ) : null}
                    </g>
                  ) : null,
                )
            : null}
          <line
            x1={xMinValue < 0 ? 0 : xMinValue}
            x2={xMinValue < 0 ? 0 : xMinValue}
            y1={-2.5}
            y2={graphHeight + margin.bottom}
            style={{
              stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
            }}
            strokeWidth={1}
          />
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <g key={i}>
                  <line
                    style={{
                      stroke:
                        el.color ||
                        UNDPColorModule[mode || 'light'].grays['gray-700'],
                      strokeWidth: 1.5,
                    }}
                    strokeDasharray='4,4'
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    x1={x(el.value as number)}
                    x2={x(el.value as number)}
                  />
                  <text
                    y={0 - margin.top}
                    fontWeight='bold'
                    x={x(el.value as number) as number}
                    style={{
                      fill:
                        el.color ||
                        UNDPColorModule[mode || 'light'].grays['gray-700'],
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      textAnchor:
                        x(el.value as number) > graphWidth * 0.75 || rtl
                          ? 'end'
                          : 'start',
                    }}
                    fontSize={12}
                    dy={12.5}
                    dx={
                      x(el.value as number) > graphWidth * 0.75 || rtl ? -5 : 5
                    }
                  >
                    {el.text}
                  </text>
                </g>
              ))}
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
          mode={mode}
        />
      ) : null}
    </>
  );
}
