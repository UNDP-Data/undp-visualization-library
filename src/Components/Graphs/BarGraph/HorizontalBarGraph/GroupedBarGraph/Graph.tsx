import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { useState } from 'react';
import min from 'lodash.min';
import isEqual from 'lodash.isequal';
import {
  HorizontalGroupedBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: HorizontalGroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showXTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  showBarLabel: boolean;
  width: number;
  suffix: string;
  prefix: string;
  showBarValue: boolean;
  height: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showXTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    suffix,
    prefix,
    showBarValue,
    rightMargin,
    topMargin,
    bottomMargin,
    showBarLabel,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    onSeriesMouseClick,
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

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));

  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([0, graphHeight])
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
          {showXTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <text
                    x={x(d)}
                    y={-12.5}
                    style={{
                      fill: 'var(--gray-500)',
                      fontFamily: 'var(--fontFamily)',
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
                      stroke: 'var(--gray-500)',
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                </g>
              ))
            : null}
          {data.map((d, i) => {
            return (
              <g key={i} transform={`translate(${0},${y(`${i}`)})`}>
                {d.size.map((el, j) => (
                  <g key={j}>
                    <rect
                      key={j}
                      x={el >= 0 ? x(0) : x(el)}
                      y={subBarScale(`${j}`)}
                      width={el >= 0 ? x(el) - x(0) : x(0) - x(el)}
                      style={{
                        fill: barColors[j],
                      }}
                      height={subBarScale.bandwidth()}
                      onMouseEnter={(event: any) => {
                        setMouseOverData(d);
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                        if (onSeriesMouseOver) {
                          onSeriesMouseOver(d);
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
                    />
                    {showBarValue ? (
                      <text
                        x={x(el)}
                        y={
                          (subBarScale(`${j}`) as number) +
                          subBarScale.bandwidth() / 2
                        }
                        style={{
                          fill: barColors[j],
                          fontSize: '1rem',
                          textAnchor: el < 0 ? 'end' : 'start',
                          fontFamily: 'var(--fontFamily)',
                        }}
                        dx={el < 0 ? -5 : 5}
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
                {showBarLabel ? (
                  <text
                    style={{
                      fill: 'var(--gray-700)',
                      fontSize: '0.75rem',
                      textAnchor: 'end',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    x={x(0)}
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
            );
          })}
          <line
            x1={x(0)}
            x2={x(0)}
            y1={-2.5}
            y2={graphHeight + margin.bottom}
            stroke='#212121'
            strokeWidth={1}
          />
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <g key={i}>
                  <line
                    style={{
                      stroke: 'var(--gray-700)',
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
                      fill: 'var(--gray-700)',
                      fontFamily: 'var(--fontFamily)',
                      textAnchor:
                        x(el.value as number) > graphWidth * 0.75
                          ? 'end'
                          : 'start',
                    }}
                    fontSize={12}
                    dy={12.5}
                    dx={x(el.value as number) > graphWidth * 0.75 ? -5 : 5}
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
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
