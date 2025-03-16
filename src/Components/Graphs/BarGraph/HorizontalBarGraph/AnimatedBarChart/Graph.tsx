import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import orderBy from 'lodash.orderby';
import { AnimatePresence, motion } from 'framer-motion';
import isEqual from 'lodash.isequal';
import { Modal } from '@undp-data/undp-design-system-react';
import {
  BarGraphWithDateDataType,
  CSSObject,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { ensureCompleteDataForBarChart } from '../../../../../Utils/ensureCompleteData';
import { string2HTML } from '../../../../../Utils/string2HTML';

interface Props {
  data: BarGraphWithDateDataType[];
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
  dateFormat: string;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  indx: number;
  autoSort: boolean;
  rtl: boolean;
  maxBarThickness?: number;
  minBarThickness?: number;
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
    dateFormat,
    indx,
    autoSort,
    rtl,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const dataFormatted = sortBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    'date',
  );
  const uniqLabels = uniqBy(dataFormatted, d => d.label).map(d => d.label);
  const groupedData = Array.from(
    group(
      ensureCompleteDataForBarChart(data, dateFormat || 'yyyy'),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values: autoSort
        ? orderBy(
            values,
            [item => item.size === undefined, 'size'],
            ['asc', 'desc'],
          ).map((el, i) => ({
            ...el,
            id: `${i}`,
          }))
        : (
            uniqLabels.map(label =>
              values.find(o => o.label === label),
            ) as BarGraphWithDateDataType[]
          ).map((el, i) => ({
            ...el,
            id: `${i}`,
          })),
    }),
  );
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.size))
          .map(d => d.size as number),
      ) < 0
    ? 0
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.size))
          .map(d => d.size as number),
      );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.size))
          .map(d => d.size as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.size))
          .map(d => d.size as number),
      );
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([
      0,
      minBarThickness
        ? Math.max(graphHeight, minBarThickness * uniqLabels.length)
        : maxBarThickness
        ? Math.min(graphHeight, maxBarThickness * uniqLabels.length)
        : graphHeight,
    ])
    .paddingInner(barPadding);
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
                    className={`fill-primary-gray-550 dark:fill-primary-gray-500 text-xs opacity-${
                      d === 0 ? 0 : 100
                    }`}
                    dy={10}
                    dx={3}
                    style={{
                      textAnchor: 'start',
                    }}
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
          <AnimatePresence>
            {groupedData[indx].values.map(d => (
              <motion.g
                key={d.label}
                transition={{ duration: 0.5 }}
                className='undp-viz-g-with-hover'
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
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (
                      isEqual(mouseClickData, d) &&
                      resetSelectionOnDoubleClick
                    ) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick?.(undefined);
                    } else {
                      setMouseClickData(d);
                      onSeriesMouseClick?.(d);
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
                <motion.rect
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? barColor[0]
                        : !d.color
                        ? UNDPColorModule.gray
                        : barColor[colorDomain.indexOf(d.color)],
                  }}
                  height={y.bandwidth()}
                  animate={{
                    width: d.size
                      ? d.size >= 0
                        ? x(d.size) - x(0)
                        : x(0) - x(d.size)
                      : 0,
                    x: d.size ? (d.size >= 0 ? x(0) : x(d.size)) : 0,
                    y: y(d.id),
                    fill:
                      data.filter(el => el.color).length === 0
                        ? barColor[0]
                        : !d.color
                        ? UNDPColorModule.gray
                        : barColor[colorDomain.indexOf(d.color)],
                  }}
                  transition={{ duration: 0.5 }}
                />
                {showLabels ? (
                  <motion.text
                    style={{
                      textAnchor: d.size
                        ? d.size < 0
                          ? 'start'
                          : 'end'
                        : 'end',
                    }}
                    className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                    x={0}
                    y={0}
                    dx={d.size ? (d.size < 0 ? 10 : -10) : -10}
                    dy={5}
                    animate={{
                      x: x(xMinValue < 0 ? 0 : xMinValue),
                      y: (y(d.id) as number) + y.bandwidth() / 2,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </motion.text>
                ) : null}
                {showValues ? (
                  <motion.text
                    y={0}
                    style={{
                      ...(valueColor
                        ? { fill: valueColor }
                        : barColor.length > 1
                        ? {}
                        : { fill: barColor[0] }),
                      textAnchor: d.size
                        ? d.size < 0
                          ? 'end'
                          : 'start'
                        : 'start',
                    }}
                    className={`text-sm${
                      !valueColor && barColor.length > 1
                        ? ' fill-primary-gray-600 dark:fill-primary-gray-300'
                        : ''
                    }`}
                    dx={d.size ? (d.size < 0 ? -5 : 5) : 5}
                    animate={{
                      x: d.size ? x(d.size) : x(0),
                      y: (y(d.id) as number) + y.bandwidth() / 2,
                    }}
                    dy={5}
                    transition={{ duration: 0.5 }}
                  >
                    {numberFormattingFunction(d.size, prefix, suffix)}
                  </motion.text>
                ) : null}
              </motion.g>
            ))}
          </AnimatePresence>
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
                    className={`undp-ref-line ${
                      !el.color
                        ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                        : ''
                    }`}
                    style={{
                      ...(el.color && { stroke: el.color }),
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
                      ...(el.color && { fill: el.color }),
                      textAnchor:
                        x(el.value as number) > graphWidth * 0.75 || rtl
                          ? 'end'
                          : 'start',
                    }}
                    className={`text-xs font-bold${
                      !el.color
                        ? ' fill-primary-gray-700 dark:fill-primary-gray-300'
                        : ''
                    }`}
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
