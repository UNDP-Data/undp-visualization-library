import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import sum from 'lodash.sum';
import { AnimatePresence, motion } from 'framer-motion';
import isEqual from 'lodash.isequal';
import {
  CSSObject,
  GroupedBarGraphWithDateDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { ensureCompleteDataForStackedBarChart } from '../../../../../Utils/ensureCompleteData';
import { getTextColorBasedOnBgColor } from '../../../../../Utils/getTextColorBasedOnBgColor';
import { string2HTML } from '../../../../../Utils/string2HTML';
import { Modal } from '../../../../Elements/Modal';

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
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  sortParameter?: number | 'total';
  maxBarThickness?: number;
  minBarThickness?: number;
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
    language,
    mode,
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
            ? sortBy(data, d => sum(d.size.filter(el => el !== undefined)))
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
    : Math.max(...data.map(d => sum(d.size.filter(l => l !== undefined)) || 0));

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
                    y={0 - topMargin}
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
                      fill: UNDPColorModule[mode || 'light'].grays['gray-550'],
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
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
              textAnchor='middle'
              dy={15}
              fontSize={12}
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
                            fontSize: '0.875rem',
                            textAnchor: 'middle',
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
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
                        fill:
                          valueColor ||
                          UNDPColorModule[mode || 'light'].grays['gray-700'],
                        fontSize: '0.875rem',
                        textAnchor: 'start',
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      }}
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
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          isOpen={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            style={{ margin: 0 }}
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
