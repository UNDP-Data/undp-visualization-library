import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { useState } from 'react';
import min from 'lodash.min';
import isEqual from 'lodash.isequal';
import {
  GroupedBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: GroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  showLabels: boolean;
  width: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  height: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  rtl: boolean;
  labelOrder?: string[];
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  maxBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
}

export function Graph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    suffix,
    prefix,
    showValues,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    onSeriesMouseClick,
    selectedColor,
    rtl,
    labelOrder,
    language,
    mode,
    maxBarThickness,
    resetSelectionOnDoubleClick,
  } = props;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data.map(d => max(d.size.filter(l => l !== undefined)) || 0),
      ) < 0
    ? 0
    : Math.max(...data.map(d => max(d.size.filter(l => l !== undefined)) || 0));
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.map(d => min(d.size.filter(l => l !== undefined)) || 0),
      ) >= 0
    ? 0
    : Math.min(...data.map(d => min(d.size.filter(l => l !== undefined)) || 0));

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const allLabelInData = data.map(d => `${d.label}`);
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);

  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(barOrder)
    .range([
      0,
      maxBarThickness
        ? Math.min(graphHeight, maxBarThickness * barOrder.length)
        : graphHeight,
    ])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].size.map((_d, i) => `${i}`))
    .range([0, y.bandwidth()])
    .paddingInner(0.1);
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
                  <text
                    x={x(d)}
                    y={-12.5}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-500'],
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    textAnchor='middle'
                    fontSize={12}
                  >
                    {numberFormattingFunction(d, '', '')}
                  </text>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={-2.5}
                    y2={graphHeight + margin.bottom}
                    style={{
                      stroke:
                        UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                </g>
              ))
            : null}
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(y(d.id)) ? (
              <g key={i} transform={`translate(${0},${y(`${d.id}`)})`}>
                {d.size.map((el, j) => (
                  <g
                    className='undp-viz-g-with-hover'
                    key={j}
                    opacity={
                      selectedColor
                        ? barColors[j] === selectedColor
                          ? 1
                          : 0.3
                        : 0.85
                    }
                    onMouseEnter={(event: any) => {
                      setMouseOverData({ ...d, sizeIndex: j });
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      if (onSeriesMouseOver) {
                        onSeriesMouseOver({ ...d, sizeIndex: j });
                      }
                    }}
                    onMouseMove={(event: any) => {
                      setMouseOverData({ ...d, sizeIndex: j });
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
                    onClick={() => {
                      if (onSeriesMouseClick) {
                        if (
                          isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
                          onSeriesMouseClick({ ...d, sizeIndex: j });
                        }
                      }
                    }}
                  >
                    {!checkIfNullOrUndefined(el) ? (
                      <rect
                        key={j}
                        x={(el as number) >= 0 ? x(0) : x(el as number)}
                        y={subBarScale(`${j}`)}
                        width={
                          (el as number) >= 0
                            ? x(el as number) - x(0)
                            : x(0) - x(el as number)
                        }
                        style={{
                          fill: barColors[j],
                        }}
                        height={subBarScale.bandwidth()}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(el || 0)}
                        y={
                          (subBarScale(`${j}`) as number) +
                          subBarScale.bandwidth() / 2
                        }
                        style={{
                          fill: barColors[j],
                          fontSize: '0.875rem',
                          textAnchor: el ? (el < 0 ? 'end' : 'start') : 'start',
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                        dx={el ? (el < 0 ? -5 : 5) : 5}
                        dy={6}
                      >
                        {numberFormattingFunction(
                          el,
                          prefix || '',
                          suffix || '',
                        )}
                      </text>
                    ) : null}
                  </g>
                ))}
                {showLabels ? (
                  <text
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      fontSize: '0.75rem',
                      textAnchor: 'end',
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    x={x(xMinValue < 0 ? 0 : xMinValue)}
                    y={y.bandwidth() / 2}
                    dx={-10}
                    dy={5}
                  >
                    {`${d.label}`.length < truncateBy
                      ? d.label
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
              </g>
            ) : null,
          )}
          {labelOrder && showLabels
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
                          x={x(xMinValue < 0 ? 0 : xMinValue)}
                          y={(y(d) as number) + y.bandwidth() / 2}
                          dx={-10}
                          dy={5}
                        >
                          {`${d}`.length < truncateBy
                            ? `${d}`
                            : `${`${d}`.substring(0, truncateBy)}...`}
                        </text>
                      ) : null}
                    </g>
                  ) : null,
                )
            : null}
          <line
            x1={x(xMinValue < 0 ? 0 : xMinValue)}
            x2={x(xMinValue < 0 ? 0 : xMinValue)}
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
