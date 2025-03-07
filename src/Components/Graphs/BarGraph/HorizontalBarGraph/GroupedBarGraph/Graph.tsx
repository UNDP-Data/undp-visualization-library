import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { useState } from 'react';
import min from 'lodash.min';
import isEqual from 'lodash.isequal';
import { Modal } from '@undp-data/undp-design-system-react';
import {
  CSSObject,
  GroupedBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { string2HTML } from '../../../../../Utils/string2HTML';

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
  mode: 'light' | 'dark';
  maxBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
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
    mode,
    maxBarThickness,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
  } = props;
  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
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
        ...data.map(
          d => max(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      ) < 0
    ? 0
    : Math.max(
        ...data.map(
          d => max(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.map(
          d => min(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      ) >= 0
    ? 0
    : Math.min(
        ...data.map(
          d => min(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      );

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
  const xTicks = x.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {showTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={0 - topMargin}
                    y2={graphHeight + margin.bottom + margin.top}
                    className={`undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550 opacity-${
                      d === 0 ? 0 : 100
                    }`}
                  />
                  <text
                    x={x(d)}
                    y={0 - topMargin}
                    dy={10}
                    dx={3}
                    style={{
                      textAnchor: 'start',
                    }}
                    className={`fill-primary-gray-550 dark:fill-primary-gray-500 text-xs opacity-${
                      d === 0 ? 0 : 100
                    }`}
                  >
                    {numberFormattingFunction(d, prefix, suffix)}
                  </text>
                </g>
              ))
            : null}
          {barAxisTitle ? (
            <text
              transform={`translate(${graphWidth / 2}, ${0 - margin.top})`}
              style={{
                textAnchor: 'middle',
              }}
              dy={15}
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
            >
              {barAxisTitle}
            </text>
          ) : null}
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
                      if (onSeriesMouseClick || detailsOnClick) {
                        if (
                          isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
                          if (onSeriesMouseClick)
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
                          fill: valueColor || barColors[j],
                          textAnchor: el ? (el < 0 ? 'end' : 'start') : 'start',
                        }}
                        className='text-sm'
                        dx={el ? (el < 0 ? -5 : 5) : 5}
                        dy={6}
                      >
                        {numberFormattingFunction(el, prefix, suffix)}
                      </text>
                    ) : null}
                  </g>
                ))}
                {showLabels ? (
                  <text
                    style={{
                      textAnchor: 'end',
                    }}
                    className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
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
                            textAnchor: 'end',
                          }}
                          className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
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
            className='stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
          />
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <g key={i}>
                  <line
                    className='undp-ref-line'
                    style={{
                      stroke:
                        el.color || UNDPColorModule[mode].grays['gray-700'],
                    }}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    x1={x(el.value as number)}
                    x2={x(el.value as number)}
                  />
                  <text
                    y={0 - margin.top}
                    x={x(el.value as number) as number}
                    style={{
                      fill: el.color || UNDPColorModule[mode].grays['gray-700'],
                      textAnchor:
                        x(el.value as number) > graphWidth * 0.75 || rtl
                          ? 'end'
                          : 'start',
                    }}
                    className='text-xs font-bold'
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
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          open={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='m-0'
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: string2HTML(detailsOnClick, mouseClickData),
            }}
          />
        </Modal>
      ) : null}
    </>
  );
}
