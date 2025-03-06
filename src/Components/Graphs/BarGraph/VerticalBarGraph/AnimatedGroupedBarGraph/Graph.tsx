import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from '@undp-data/undp-design-system-react';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import {
  ReferenceDataType,
  GroupedBarGraphWithDateDataType,
  CSSObject,
} from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { ensureCompleteDataForStackedBarChart } from '../../../../../Utils/ensureCompleteData';
import { string2HTML } from '../../../../../Utils/string2HTML';

interface Props {
  data: GroupedBarGraphWithDateDataType[];
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
  indx: number;
  dateFormat: string;
  mode: 'light' | 'dark';
  maxBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
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
    dateFormat,
    indx,
    mode,
    maxBarThickness,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
  } = props;

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
      values: (
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
    top: topMargin,
    bottom: bottomMargin,
    left: barAxisTitle ? leftMargin + 30 : leftMargin,
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

  const y = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([graphHeight, 0])
    .nice();
  const x = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([
      0,
      maxBarThickness
        ? Math.min(graphWidth, maxBarThickness * uniqLabels.length)
        : graphWidth,
    ])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].size.map((_d, i) => `${i}`))
    .range([0, x.bandwidth()])
    .paddingInner(0.1);
  const yTicks = y.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line
            y1={y(xMinValue < 0 ? 0 : xMinValue)}
            y2={y(xMinValue < 0 ? 0 : xMinValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            className='stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
          />
          <text
            x={0 - leftMargin + 2}
            y={y(0)}
            style={{
              textAnchor: 'start',
            }}
            className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
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
                    x1={0 - leftMargin}
                    x2={graphWidth + margin.right}
                    className={`undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550 opacity-${
                      d === 0 ? 0 : 100
                    }`}
                  />
                  <text
                    x={0 - leftMargin + 2}
                    y={y(d)}
                    dy={-3}
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
              transform={`translate(${0 - leftMargin - 15}, ${
                graphHeight / 2
              }) rotate(-90)`}
              style={{
                textAnchor: 'middle',
              }}
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
            >
              {barAxisTitle}
            </text>
          ) : null}
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => {
              return (
                <motion.g key={i} transform={`translate(${x(`${i}`)},0)`}>
                  {d.size.map((el, j) => (
                    <motion.g
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
                        x={subBarScale(`${j}`)}
                        width={subBarScale.bandwidth()}
                        style={{
                          fill: barColors[j],
                        }}
                        animate={{
                          height: !checkIfNullOrUndefined(el)
                            ? Math.abs(y(el as number) - y(0))
                            : 0,
                          y: !checkIfNullOrUndefined(el)
                            ? (el as number) > 0
                              ? y(el as number)
                              : y(0)
                            : y(0),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {showValues ? (
                        <motion.text
                          x={
                            (subBarScale(`${j}`) as number) +
                            subBarScale.bandwidth() / 2
                          }
                          style={{
                            fill: valueColor || barColors[j],
                            textAnchor: 'middle',
                          }}
                          dy={el ? (el >= 0 ? '-5px' : '15px') : '-5px'}
                          animate={{
                            y: y(el || 0),
                          }}
                          transition={{ duration: 0.5 }}
                          className='text-sm'
                        >
                          {numberFormattingFunction(el, prefix, suffix)}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showLabels ? (
                    <text
                      x={x.bandwidth() / 2}
                      y={y(0)}
                      style={{
                        textAnchor: 'middle',
                      }}
                      dy='15px'
                      className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                    >
                      {`${d.label}`.length < truncateBy
                        ? `${d.label}`
                        : `${`${d.label}`.substring(0, truncateBy)}...`}
                    </text>
                  ) : null}
                </motion.g>
              );
            })}
          </AnimatePresence>
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
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    y={y(el.value as number)}
                    style={{
                      fill: el.color || UNDPColorModule[mode].grays['gray-700'],
                      textAnchor: 'end',
                    }}
                    className='text-xs font-bold'
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
