import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import sum from 'lodash.sum';
import { AnimatePresence, motion } from 'framer-motion';
import isEqual from 'lodash.isequal';
import { Modal } from '@undp-data/undp-design-system-react';
import {
  CSSObject,
  GroupedBarGraphWithDateDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForStackedBarChart } from '../../../../../Utils/ensureCompleteData';
import { getTextColorBasedOnBgColor } from '../../../../../Utils/getTextColorBasedOnBgColor';
import { string2HTML } from '../../../../../Utils/string2HTML';

interface Props {
  data: GroupedBarGraphWithDateDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin: number;
  topMargin: number;
  showLabels: boolean;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  indx: number;
  dateFormat: string;
  autoSort: boolean;
  rtl: boolean;
  sortParameter?: number | 'total';
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
    showLabels,
    suffix,
    prefix,
    showValues,
    refValues,
    maxValue,
    onSeriesMouseClick,
    selectedColor,
    dateFormat,
    indx,
    autoSort,
    rtl,
    sortParameter,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
  } = props;

  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
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
      ensureCompleteDataForStackedBarChart(data, dateFormat || 'yyyy'),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values:
        sortParameter !== undefined || autoSort
          ? sortParameter === 'total' || sortParameter === undefined
            ? sortBy(data, d =>
                sum(d.size.filter(el => !checkIfNullOrUndefined(el))),
              )
                .reverse()
                .map((el, i) => ({
                  ...el,
                  id: `${i}`,
                }))
            : sortBy(data, d =>
                checkIfNullOrUndefined(d.size[sortParameter])
                  ? -Infinity
                  : d.size[sortParameter],
              )
                .reverse()
                .map((el, i) => ({
                  ...el,
                  id: `${i}`,
                }))
          : (
              uniqLabels.map(label =>
                values.find(o => o.label === label),
              ) as GroupedBarGraphWithDateDataType[]
            ).map((el, i) => ({
              ...el,
              id: `${i}`,
            })),
    }),
  );

  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data.map(
          d => sum(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      );

  const x = scaleLinear().domain([0, xMaxValue]).range([0, graphWidth]).nice();
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
                    dy={10}
                    dx={3}
                    className={`fill-primary-gray-550 dark:fill-primary-gray-500 text-xs opacity-${
                      d === 0 ? 0 : 100
                    }`}
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
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
              dy={15}
            >
              {barAxisTitle}
            </text>
          ) : null}
          <AnimatePresence>
            {groupedData[indx].values.map(d => {
              return (
                <g
                  className='undp-viz-low-opacity undp-viz-g-with-hover'
                  key={d.label}
                >
                  {d.size.map((el, j) => (
                    <motion.g
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
                        if (onSeriesMouseClick || detailsOnClick) {
                          if (
                            isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                            resetSelectionOnDoubleClick
                          ) {
                            setMouseClickData(undefined);
                            if (onSeriesMouseClick)
                              onSeriesMouseClick(undefined);
                          } else {
                            setMouseClickData({ ...d, sizeIndex: j });
                            if (onSeriesMouseClick)
                              onSeriesMouseClick({ ...d, sizeIndex: j });
                          }
                        }
                      }}
                    >
                      <motion.rect
                        key={j}
                        style={{
                          fill: barColors[j],
                        }}
                        height={y.bandwidth()}
                        animate={{
                          width: x(el || 0),
                          x: x(
                            j === 0
                              ? 0
                              : sum(
                                  d.size.filter(
                                    (element, k) => k < j && element,
                                  ),
                                ),
                          ),
                          y: y(d.id),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {showValues ? (
                        <motion.text
                          style={{
                            fill: getTextColorBasedOnBgColor(barColors[j]),
                            textAnchor: 'middle',
                          }}
                          className='text-sm'
                          dy={5}
                          animate={{
                            x:
                              x(
                                j === 0
                                  ? 0
                                  : sum(
                                      d.size.filter(
                                        (element, k) => k < j && element,
                                      ),
                                    ),
                              ) +
                              x(el || 0) / 2,
                            y: (y(d.id) || 0) + y.bandwidth() / 2,
                            opacity:
                              el &&
                              x(el) /
                                numberFormattingFunction(el, prefix, suffix)
                                  .length >
                                12
                                ? 1
                                : 0,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {numberFormattingFunction(el, prefix, suffix)}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showLabels ? (
                    <motion.text
                      style={{
                        textAnchor: 'end',
                      }}
                      className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                      dx={-10}
                      dy={5}
                      animate={{
                        x: x(0),
                        y: (y(d.id) || 0) + y.bandwidth() / 2,
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
                      style={{
                        ...(valueColor && { fill: valueColor }),
                        textAnchor: 'start',
                      }}
                      className={`text-sm${
                        !valueColor
                          ? ' fill-primary-gray-700 dark:fill-primary-gray-300'
                          : ''
                      }`}
                      dx={5}
                      dy={5}
                      animate={{
                        x: x(sum(d.size.map(el => el || 0))),
                        y: (y(d.id) || 0) + y.bandwidth() / 2,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {numberFormattingFunction(
                        sum(d.size.filter(element => element)),
                        prefix,
                        suffix,
                      )}
                    </motion.text>
                  ) : null}
                </g>
              );
            })}
          </AnimatePresence>
          <line
            x1={x(0)}
            x2={x(0)}
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
