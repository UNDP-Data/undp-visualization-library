/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import isEqual from 'lodash.isequal';
import { group } from 'd3-array';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ButterflyChartWithDateDataType,
  ReferenceDataType,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { ensureCompleteDataForButterFlyChart } from '../../../../Utils/ensureCompleteData';

interface Props {
  data: ButterflyChartWithDateDataType[];
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
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  barPadding: number;
  truncateBy: number;
  showValues: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  showTicks: boolean;
  suffix: string;
  prefix: string;
  indx: number;
  dateFormat: string;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
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
    showValues,
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
    dateFormat,
    indx,
    rtl,
    language,
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
      ensureCompleteDataForButterFlyChart(data, dateFormat || 'yyyy'),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values: (
        uniqLabels.map(label =>
          values.find(o => o.label === label),
        ) as ButterflyChartWithDateDataType[]
      ).map(el => ({
        ...el,
        id: el.label,
      })),
    }),
  );

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
  const y = scaleBand()
    .domain(uniqLabels.map(d => `${d}`))
    .range([graphHeight, 0])
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
    xMaxValueLeftBar > xMaxValueRightBar ? xMaxValueLeftBar : xMaxValueRightBar;
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
                        stroke: UNDPColorModule.grays['gray-500'],
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
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        fill: UNDPColorModule.grays['gray-500'],
                      }}
                    >
                      {numberFormattingFunction(d, '', '')}
                    </text>
                  </g>
                ))
              : null}
            <AnimatePresence>
              {groupedData[indx].values.map((d, i) => {
                return (
                  <motion.g
                    className='undp-viz-g-with-hover'
                    key={d.label}
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
                    <motion.rect
                      style={{
                        fill: barColors[0],
                      }}
                      height={y.bandwidth()}
                      animate={{
                        width: d.leftBar
                          ? d.leftBar < 0
                            ? xLeftBar(d.leftBar) - xLeftBar(0)
                            : xLeftBar(0) - xLeftBar(d.leftBar)
                          : 0,
                        y: y(`${d.label}`),
                        x: d.leftBar
                          ? d.leftBar < 0
                            ? xLeftBar(0)
                            : xLeftBar(d.leftBar)
                          : xLeftBar(0),
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showValues ? (
                      <motion.text
                        style={{
                          fill: barColors[0],
                          fontSize: '1rem',
                          textAnchor: d.rightBar
                            ? d.rightBar > 0
                              ? 'end'
                              : 'start'
                            : 'start',
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                        dx={d.leftBar ? (d.leftBar > 0 ? -5 : 5) : 5}
                        dy={5}
                        animate={{
                          x: d.leftBar
                            ? xLeftBar(d.leftBar)
                            : xLeftBar(
                                xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar,
                              ),
                          y: (y(`${d.label}`) as number) + y.bandwidth() / 2,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {numberFormattingFunction(
                          d.leftBar,
                          prefix || '',
                          suffix || '',
                        )}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
            </AnimatePresence>
            <line
              x1={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              x2={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
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
                        stroke: el.color || UNDPColorModule.grays['gray-700'],
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
                        fill: el.color || UNDPColorModule.grays['gray-700'],
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
                        stroke: UNDPColorModule.grays['gray-500'],
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
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        fill: UNDPColorModule.grays['gray-500'],
                      }}
                    >
                      {numberFormattingFunction(d, '', '')}
                    </text>
                  </g>
                ))
              : null}
            <AnimatePresence>
              {groupedData[indx].values.map((d, i) => {
                return (
                  <motion.g
                    className='undp-viz-g-with-hover'
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
                    <motion.rect
                      style={{
                        fill: barColors[1],
                      }}
                      height={y.bandwidth()}
                      animate={{
                        width: d.rightBar
                          ? d.rightBar >= 0
                            ? xRightBar(d.rightBar) - xRightBar(0)
                            : xRightBar(0) - xRightBar(d.rightBar)
                          : 0,
                        y: y(`${d.label}`),
                        x: d.rightBar
                          ? d.rightBar >= 0
                            ? xRightBar(0)
                            : xRightBar(d.rightBar)
                          : xRightBar(0),
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showValues ? (
                      <motion.text
                        style={{
                          fill: barColors[1],
                          fontSize: '1rem',
                          textAnchor: d.rightBar
                            ? d.rightBar < 0
                              ? 'end'
                              : 'start'
                            : 'start',
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                        dx={d.rightBar ? (d.rightBar < 0 ? -5 : 5) : 5}
                        dy={5}
                        animate={{
                          x: d.rightBar
                            ? xRightBar(d.rightBar)
                            : xRightBar(
                                xMinValueRightBar < 0 ? 0 : xMinValueRightBar,
                              ),
                          y: (y(`${d.label}`) as number) + y.bandwidth() / 2,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {numberFormattingFunction(
                          d.rightBar,
                          prefix || '',
                          suffix || '',
                        )}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
            </AnimatePresence>
            <line
              x1={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              x2={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
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
                        stroke: el.color || UNDPColorModule.grays['gray-700'],
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
                        fill: el.color || UNDPColorModule.grays['gray-700'],
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
            {groupedData[indx].values.map((d, i) => {
              return (
                <text
                  style={{
                    fill: UNDPColorModule.grays['gray-700'],
                    fontSize: '0.75rem',
                    textAnchor: 'middle',
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                  key={i}
                  x={0}
                  y={(y(`${d.label}`) as number) + y.bandwidth() / 2}
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
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
        <Tooltip
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
        />
      ) : null}
    </>
  );
}
