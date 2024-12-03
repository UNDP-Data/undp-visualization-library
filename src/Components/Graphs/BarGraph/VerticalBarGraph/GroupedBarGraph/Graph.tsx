import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import {
  ReferenceDataType,
  GroupedBarGraphDataType,
} from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: GroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showLabels: boolean;
  showValues: boolean;
  showTicks: boolean;
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  refValues?: ReferenceDataType[];
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  labelOrder?: string[];
  mode: 'light' | 'dark';
  maxBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    suffix,
    prefix,
    barPadding,
    showLabels,
    showValues,
    showTicks,
    truncateBy,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    onSeriesMouseClick,
    selectedColor,
    rtl,
    language,
    labelOrder,
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

  const y = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([graphHeight, 0])
    .nice();

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const allLabelInData = data.map(d => `${d.label}`);
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const x = scaleBand()
    .domain(barOrder)
    .range([
      0,
      maxBarThickness
        ? Math.min(graphWidth, maxBarThickness * barOrder.length)
        : graphWidth,
    ])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].size.map((_d, i) => `${i}`))
    .range([0, x.bandwidth()])
    .paddingInner(0.1);
  const yTicks = y.ticks(5);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line
            y1={y(xMinValue < 0 ? 0 : xMinValue)}
            y2={y(xMinValue < 0 ? 0 : xMinValue)}
            x1={0 - margin.left}
            x2={graphWidth + margin.right}
            style={{
              stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
            }}
            strokeWidth={1}
          />
          <text
            x={0 - margin.left + 2}
            y={y(xMinValue < 0 ? 0 : xMinValue)}
            style={{
              fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
              fontFamily: rtl
                ? language === 'he'
                  ? 'Noto Sans Hebrew, sans-serif'
                  : 'Noto Sans Arabic, sans-serif'
                : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
            }}
            textAnchor='start'
            fontSize={12}
            dy={-3}
          >
            0
          </text>
          {showTicks
            ? yTicks.map((d, i) => (
                <g key={i}>
                  <line
                    key={i}
                    y1={y(d)}
                    y2={y(d)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                    stroke='#A9B1B7'
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                  <text
                    x={0 - margin.left + 2}
                    y={y(d)}
                    fill='#A9B1B7'
                    textAnchor='start'
                    fontSize={12}
                    dy={-3}
                    opacity={d === 0 ? 0 : 1}
                    style={{
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                  >
                    {numberFormattingFunction(d, '', '')}
                  </text>
                </g>
              ))
            : null}
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(x(d.id)) ? (
              <g key={i} transform={`translate(${x(`${d.id}`)},0)`}>
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
                        x={subBarScale(`${j}`)}
                        y={(el as number) > 0 ? y(el as number) : y(0)}
                        width={subBarScale.bandwidth()}
                        style={{
                          fill: barColors[j],
                        }}
                        height={Math.abs(y(el as number) - y(0))}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={
                          (subBarScale(`${j}`) as number) +
                          subBarScale.bandwidth() / 2
                        }
                        y={y(el || 0)}
                        style={{
                          fill: barColors[j],
                          fontSize: '1rem',
                          textAnchor: 'middle',
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                        dy={el ? (el >= 0 ? '-5px' : '15px') : '-5px'}
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
                    x={x.bandwidth() / 2}
                    y={y(0)}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      fontSize: '0.75rem',
                      textAnchor: 'middle',
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    dy='15px'
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
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
                  !checkIfNullOrUndefined(x(d)) ? (
                    <g className='undp-viz-g-with-hover' key={i}>
                      {showLabels ? (
                        <text
                          x={(x(`${d}`) as number) + x.bandwidth() / 2}
                          y={y(0)}
                          style={{
                            fill: UNDPColorModule[mode || 'light'].grays[
                              'gray-700'
                            ],
                            fontSize: '0.75rem',
                            textAnchor: 'middle',
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
                          dy='15px'
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
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    fontWeight='bold'
                    y={y(el.value as number)}
                    style={{
                      fill:
                        el.color ||
                        UNDPColorModule[mode || 'light'].grays['gray-700'],
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      textAnchor: 'end',
                    }}
                    fontSize={12}
                    dy={-5}
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
