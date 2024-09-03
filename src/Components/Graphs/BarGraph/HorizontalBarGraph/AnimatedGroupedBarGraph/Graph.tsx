import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { useState } from 'react';
import min from 'lodash.min';
import isEqual from 'lodash.isequal';
import { group } from 'd3-array';
import uniqBy from 'lodash.uniqby';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GroupedBarGraphWithDateDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { ensureCompleteDataForStackedBarChart } from '../../../../../Utils/ensureCompleteData';

interface Props {
  data: GroupedBarGraphWithDateDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
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
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  indx: number;
  dateFormat: string;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
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
    selectedColor,
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

  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
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
          {showTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <text
                    x={x(d)}
                    y={-12.5}
                    style={{
                      fill: UNDPColorModule.grays['gray-500'],
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
                      stroke: UNDPColorModule.grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                </g>
              ))
            : null}
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => {
              return (
                <motion.g key={i} transform={`translate(${0},${y(`${i}`)})`}>
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
                      <motion.rect
                        key={j}
                        y={subBarScale(`${j}`)}
                        style={{
                          fill: barColors[j],
                        }}
                        height={subBarScale.bandwidth()}
                        animate={{
                          width: !checkIfNullOrUndefined(el)
                            ? (el as number) >= 0
                              ? x(el as number) - x(0)
                              : x(0) - x(el as number)
                            : 0,
                          x: (el as number) >= 0 ? x(0) : x(el as number),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {showBarValue ? (
                        <motion.text
                          y={
                            (subBarScale(`${j}`) as number) +
                            subBarScale.bandwidth() / 2
                          }
                          style={{
                            fill: barColors[j],
                            fontSize: '1rem',
                            textAnchor: el
                              ? el < 0
                                ? 'end'
                                : 'start'
                              : 'start',
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
                          dx={el ? (el < 0 ? -5 : 5) : 5}
                          dy={6}
                          animate={{
                            x: x(el || 0),
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {numberFormattingFunction(
                            el,
                            prefix || '',
                            suffix || '',
                          )}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showBarLabel ? (
                    <text
                      style={{
                        fill: UNDPColorModule.grays['gray-700'],
                        fontSize: '0.75rem',
                        textAnchor: 'end',
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
                </motion.g>
              );
            })}
          </AnimatePresence>
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
                      stroke: el.color || UNDPColorModule.grays['gray-700'],
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
                      fill: el.color || UNDPColorModule.grays['gray-700'],
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
        />
      ) : null}
    </>
  );
}