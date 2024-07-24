import { scaleLinear, scaleBand } from 'd3-scale';
import sum from 'lodash.sum';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import {
  HorizontalGroupedBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '../../../../../Utils/getTextColorBasedOnBgColor';

interface Props {
  data: HorizontalGroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin: number;
  topMargin: number;
  showBarLabel: boolean;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
}

export function Graph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    truncateBy,
    width,
    height,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    showBarLabel,
    suffix,
    prefix,
    showValues,
    refValues,
    maxValue,
    onSeriesMouseClick,
    selectedColor,
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
    : Math.max(...data.map(d => sum(d.size.filter(l => l !== undefined)) || 0));

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));

  const x = scaleLinear().domain([0, xMaxValue]).range([0, graphWidth]).nice();
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([0, graphHeight])
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
              <g
                className='low-opacity g-with-hover'
                key={i}
                transform={`translate(${0},${y(`${i}`)})`}
              >
                {d.size.map((el, j) => (
                  <g
                    key={j}
                    opacity={
                      selectedColor
                        ? barColors[j] === selectedColor
                          ? 1
                          : 0.3
                        : 1
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
                        if (isEqual(mouseClickData, { ...d, sizeIndex: j })) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
                          onSeriesMouseClick({ ...d, sizeIndex: j });
                        }
                      }
                    }}
                  >
                    <rect
                      key={j}
                      x={x(
                        j === 0
                          ? 0
                          : sum(
                              d.size.filter((element, k) => k < j && element),
                            ),
                      )}
                      y={0}
                      width={x(el)}
                      style={{
                        fill: barColors[j],
                      }}
                      height={y.bandwidth()}
                    />
                    {showValues && x(el) > 20 ? (
                      <text
                        x={
                          x(
                            j === 0
                              ? 0
                              : sum(
                                  d.size.filter(
                                    (element, k) => k < j && element,
                                  ),
                                ),
                          ) +
                          x(el) / 2
                        }
                        y={y.bandwidth() / 2}
                        style={{
                          fill: getTextColorBasedOnBgColor(barColors[j]),
                          fontSize: '1rem',
                          textAnchor: 'middle',
                          fontFamily: 'var(--fontFamily)',
                        }}
                        dy={5}
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
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
                {showValues ? (
                  <text
                    style={{
                      fill: 'var(--gray-700)',
                      fontSize: '1rem',
                      textAnchor: 'start',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    x={x(sum(d.size))}
                    y={y.bandwidth() / 2}
                    dx={5}
                    dy={5}
                  >
                    {numberFormattingFunction(
                      sum(d.size.filter(element => element)),
                      prefix || '',
                      suffix || '',
                    )}
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
                      stroke: el.color || 'var(--gray-700)',
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
                      fill: el.color || 'var(--gray-700)',
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
