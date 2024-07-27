import { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import isEqual from 'lodash.isequal';
import { ButterflyChartDataType, ReferenceDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: ButterflyChartDataType[];
  barColors: [string, string];
  centerGap: number;
  refValues: ReferenceDataType[];
  axisTitles: [string, string];
  width: number;
  height: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  barPadding: number;
  truncateBy: number;
  showBarValue: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  showTicks: boolean;
  suffix: string;
  prefix: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    centerGap,
    refValues,
    maxValue,
    minValue,
    showBarValue,
    axisTitles,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    barPadding,
    truncateBy,
    onSeriesMouseClick,
    showTicks,
    suffix,
    prefix,
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
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([0, graphHeight])
    .paddingInner(barPadding);

  const xMaxValueLeftBar = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data
          .filter(d => d.leftBar !== undefined)
          .map(d => d.leftBar as number),
      ) < 0
    ? 0
    : Math.max(
        ...data
          .filter(d => d.leftBar !== undefined)
          .map(d => d.leftBar as number),
      );
  const xMinValueLeftBar = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data
          .filter(d => d.leftBar !== undefined)
          .map(d => d.leftBar as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data
          .filter(d => d.leftBar !== undefined)
          .map(d => d.leftBar as number),
      );

  const xMaxValueRightBar = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data
          .filter(d => d.rightBar !== undefined)
          .map(d => d.rightBar as number),
      ) < 0
    ? 0
    : Math.max(
        ...data
          .filter(d => d.rightBar !== undefined)
          .map(d => d.rightBar as number),
      );
  const xMinValueRightBar = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data
          .filter(d => d.rightBar !== undefined)
          .map(d => d.rightBar as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data
          .filter(d => d.rightBar !== undefined)
          .map(d => d.rightBar as number),
      );
  const minParam =
    xMinValueLeftBar < xMinValueRightBar ? xMinValueLeftBar : xMinValueRightBar;
  const maxParam =
    xMaxValueLeftBar < xMaxValueRightBar ? xMaxValueLeftBar : xMaxValueRightBar;
  const xRightBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([0, (graphWidth - centerGap) / 2])
    .nice();
  const xRightTicks = xRightBar.ticks(5);
  const xLeftBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([(graphWidth - centerGap) / 2, 0])
    .nice();
  const xLeftTicks = xLeftBar.ticks(5);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g transform={`translate(${0},${0})`}>
            {showTicks
              ? xLeftTicks.map((d, i) => (
                  <g key={i}>
                    <line
                      x1={xLeftBar(d)}
                      x2={xLeftBar(d)}
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom + topMargin}
                      style={{
                        stroke: 'var(--gray-500)',
                      }}
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      opacity={d === 0 ? 0 : 1}
                    />
                    <text
                      x={xLeftBar(d)}
                      y={0 - margin.top}
                      textAnchor='end'
                      fontSize={12}
                      dy={10}
                      dx={-3}
                      opacity={d === 0 ? 0 : 1}
                      style={{
                        fontFamily: 'var(--fontFamily)',
                        fill: 'var(--gray-500)',
                      }}
                    >
                      {numberFormattingFunction(d, '', '')}
                    </text>
                  </g>
                ))
              : null}
            {dataWithId.map((d, i) => {
              return (
                <g
                  className='g-with-hover'
                  key={i}
                  opacity={0.85}
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
                  {d.leftBar ? (
                    <rect
                      x={d.leftBar < 0 ? xLeftBar(0) : xLeftBar(d.leftBar)}
                      y={y(`${i}`)}
                      width={
                        d.leftBar < 0
                          ? xLeftBar(d.leftBar) - xLeftBar(0)
                          : xLeftBar(0) - xLeftBar(d.leftBar)
                      }
                      style={{
                        fill: barColors[0],
                      }}
                      height={y.bandwidth()}
                    />
                  ) : null}
                  {showBarValue ? (
                    <text
                      x={d.leftBar ? xLeftBar(d.leftBar) : xLeftBar(0)}
                      y={(y(`${i}`) as number) + y.bandwidth() / 2}
                      style={{
                        fill: barColors[0],
                        fontSize: '1rem',
                        textAnchor: d.rightBar
                          ? d.rightBar > 0
                            ? 'end'
                            : 'start'
                          : 'start',
                        fontFamily: 'var(--fontFamily)',
                      }}
                      dx={d.rightBar ? (d.rightBar > 0 ? -5 : 5) : 5}
                      dy={5}
                    >
                      {numberFormattingFunction(
                        d.rightBar,
                        prefix || '',
                        suffix || '',
                      )}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <line
              x1={xLeftBar(0)}
              x2={xLeftBar(0)}
              y1={-2.5}
              y2={graphHeight + 2.5}
              stroke='#212121'
              strokeWidth={1}
            />
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <g key={i}>
                    <line
                      style={{
                        stroke: el.color || 'var(--gray-700)',
                        strokeWidth: 1.5,
                      }}
                      strokeDasharray='4,4'
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom}
                      x1={xLeftBar(el.value as number)}
                      x2={xLeftBar(el.value as number)}
                    />
                    <text
                      y={0 - margin.top}
                      fontWeight='bold'
                      x={xLeftBar(el.value as number) as number}
                      style={{
                        fill: el.color || 'var(--gray-700)',
                        fontFamily: 'var(--fontFamily)',
                        textAnchor: 'end',
                      }}
                      fontSize={12}
                      dy={12.5}
                      dx={-5}
                    >
                      {el.text}
                    </text>
                  </g>
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${(graphWidth + centerGap) / 2},${0})`}>
            {showTicks
              ? xRightTicks.map((d, i) => (
                  <g key={i}>
                    <line
                      x1={xRightBar(d)}
                      x2={xRightBar(d)}
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom + topMargin}
                      style={{
                        stroke: 'var(--gray-500)',
                      }}
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      opacity={d === 0 ? 0 : 1}
                    />
                    <text
                      x={xRightBar(d)}
                      y={0 - margin.top}
                      textAnchor='start'
                      fontSize={12}
                      dy={10}
                      dx={3}
                      opacity={d === 0 ? 0 : 1}
                      style={{
                        fontFamily: 'var(--fontFamily)',
                        fill: 'var(--gray-500)',
                      }}
                    >
                      {numberFormattingFunction(d, '', '')}
                    </text>
                  </g>
                ))
              : null}
            {dataWithId.map((d, i) => {
              return (
                <g
                  className='g-with-hover'
                  key={i}
                  opacity={0.85}
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
                  {d.rightBar ? (
                    <rect
                      x={d.rightBar >= 0 ? xRightBar(0) : xRightBar(d.rightBar)}
                      y={y(`${i}`)}
                      width={
                        d.rightBar >= 0
                          ? xRightBar(d.rightBar) - xRightBar(0)
                          : xRightBar(0) - xRightBar(d.rightBar)
                      }
                      style={{
                        fill: barColors[1],
                      }}
                      height={y.bandwidth()}
                    />
                  ) : null}
                  {showBarValue ? (
                    <text
                      x={d.rightBar ? xRightBar(d.rightBar) : xRightBar(0)}
                      y={(y(`${i}`) as number) + y.bandwidth() / 2}
                      style={{
                        fill: barColors[1],
                        fontSize: '1rem',
                        textAnchor: d.rightBar
                          ? d.rightBar < 0
                            ? 'end'
                            : 'start'
                          : 'start',
                        fontFamily: 'var(--fontFamily)',
                      }}
                      dx={d.rightBar ? (d.rightBar < 0 ? -5 : 5) : 5}
                      dy={5}
                    >
                      {numberFormattingFunction(
                        d.rightBar,
                        prefix || '',
                        suffix || '',
                      )}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <line
              x1={xRightBar(0)}
              x2={xRightBar(0)}
              y1={-2.5}
              y2={graphHeight + 2.5}
              stroke='#212121'
              strokeWidth={1}
            />
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <g key={i}>
                    <line
                      style={{
                        stroke: el.color || 'var(--gray-700)',
                        strokeWidth: 1.5,
                      }}
                      strokeDasharray='4,4'
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom}
                      x1={xRightBar(el.value as number)}
                      x2={xRightBar(el.value as number)}
                    />
                    <text
                      y={0 - margin.top}
                      fontWeight='bold'
                      x={xRightBar(el.value as number) as number}
                      style={{
                        fill: el.color || 'var(--gray-700)',
                        fontFamily: 'var(--fontFamily)',
                        textAnchor: 'start',
                      }}
                      fontSize={12}
                      dy={12.5}
                      dx={5}
                    >
                      {el.text}
                    </text>
                  </g>
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${graphWidth / 2},${0})`}>
            {dataWithId.map((d, i) => {
              return (
                <text
                  style={{
                    fill: 'var(--gray-700)',
                    fontSize: '0.75rem',
                    textAnchor: 'middle',
                    fontFamily: 'var(--fontFamily)',
                  }}
                  key={i}
                  x={0}
                  y={(y(`${i}`) as number) + y.bandwidth() / 2}
                  dy={5}
                >
                  {`${d.label}`.length < truncateBy
                    ? `${d.label}`
                    : `${`${d.label}`.substring(0, truncateBy)}...`}
                </text>
              );
            })}
          </g>

          <g transform={`translate(${0},${graphHeight})`}>
            <text
              style={{
                fill: barColors[0],
                fontSize: '1rem',
                fontWeight: 'bold',
                textAnchor: 'end',
                fontFamily: 'var(--fontFamily)',
              }}
              x={graphWidth / 2 - centerGap / 2}
              y={0}
              dx={-5}
              dy={20}
            >
              {axisTitles[0]}
            </text>
            <text
              style={{
                fill: barColors[1],
                fontSize: '1rem',
                fontWeight: 'bold',
                textAnchor: 'start',
                fontFamily: 'var(--fontFamily)',
              }}
              x={graphWidth / 2 + centerGap / 2}
              y={0}
              dx={5}
              dy={20}
            >
              {axisTitles[1]}
            </text>
          </g>
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
