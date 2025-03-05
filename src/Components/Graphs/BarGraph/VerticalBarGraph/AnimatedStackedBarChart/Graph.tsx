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
            ? sortBy(data, d =>
                sum(d.size.filter(el => !checkIfNullOrUndefined(el))),
              ).map((el, i) => ({
                ...el,
                id: `${i}`,
              }))
            : sortBy(data, d =>
                checkIfNullOrUndefined(d.size[sortParameter])
                  ? -Infinity
                  : d.size[sortParameter],
              ).map((el, i) => ({
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
    top: topMargin,
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

  const y = scaleLinear().domain([0, xMaxValue]).range([graphHeight, 0]).nice();
  const x = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([
      0,
      minBarThickness
        ? Math.max(graphWidth, minBarThickness * uniqLabels.length)
        : maxBarThickness
        ? Math.min(graphWidth, maxBarThickness * uniqLabels.length)
        : graphWidth,
    ])
    .paddingInner(barPadding);
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
            y1={y(0)}
            y2={y(0)}
            x1={0 - margin.left}
            x2={graphWidth + margin.right}
            style={{
              stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
            }}
            strokeWidth={1}
          />
          <text
            x={0 - margin.left + 2}
            y={y(0)}
            style={{
              fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
              textAnchor: 'start',
            }}
            className='text-xs'
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
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                    style={{
                      stroke:
                        UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    className={`opacity-${d === 0 ? 0 : 100}`}
                  />
                  <text
                    x={0 - margin.left + 2}
                    y={y(d)}
                    dy={-3}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-550'],
                      textAnchor: 'start',
                    }}
                    className={`text-xs opacity-${d === 0 ? 0 : 100}`}
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
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                textAnchor: 'middle',
              }}
              className='text-xs'
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
                        width={x.bandwidth()}
                        animate={{
                          height: Math.abs(
                            y(
                              sum(
                                d.size.filter(
                                  (element, k) => k <= j && element,
                                ),
                              ),
                            ) -
                              y(
                                sum(
                                  d.size.filter(
                                    (element, k) => k < j && element,
                                  ),
                                ),
                              ),
                          ),
                          y: y(
                            sum(
                              d.size.filter((element, k) => k <= j && element),
                            ),
                          ),
                          x: x(d.id),
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
                            y:
                              y(
                                sum(
                                  d.size.filter(
                                    (element, k) => k <= j && element,
                                  ),
                                ),
                              ) +
                              Math.abs(
                                y(
                                  sum(
                                    d.size.filter(
                                      (element, k) => k <= j && element,
                                    ),
                                  ),
                                ) -
                                  y(
                                    sum(
                                      d.size.filter(
                                        (element, k) => k < j && element,
                                      ),
                                    ),
                                  ),
                              ) /
                                2,
                            x: (x(d.id) || 0) + x.bandwidth() / 2,
                            opacity:
                              el &&
                              Math.abs(
                                y(
                                  sum(
                                    d.size.filter(
                                      (element, k) => k <= j && element,
                                    ),
                                  ),
                                ) -
                                  y(
                                    sum(
                                      d.size.filter(
                                        (element, k) => k < j && element,
                                      ),
                                    ),
                                  ),
                              ) > 20
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
                        textAnchor: 'middle',
                      }}
                      className='text-xs'
                      dy='15px'
                      animate={{
                        y: y(0),
                        x: (x(d.id) || 0) + x.bandwidth() / 2,
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
                        textAnchor: 'middle',
                      }}
                      className='text-sm'
                      dy={-10}
                      animate={{
                        y: y(sum(d.size.map(el => el || 0))),
                        x: (x(d.id) || 0) + x.bandwidth() / 2,
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
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    y={y(el.value as number)}
                    style={{
                      fill:
                        el.color ||
                        UNDPColorModule[mode || 'light'].grays['gray-700'],
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
