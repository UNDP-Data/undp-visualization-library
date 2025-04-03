import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import uniqBy from 'lodash.uniqby';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { group } from 'd3-array';
import { AnimatePresence, motion } from 'framer-motion';
import { cn, Modal } from '@undp-data/undp-design-system-react';
import {
  ClassNameObject,
  DumbbellChartWithDateDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForDumbbellChart } from '@/Utils/ensureCompleteData';
import { string2HTML } from '@/Utils/string2HTML';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';

interface Props {
  data: DumbbellChartWithDateDataType[];
  dotColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  radius: number;
  showLabels: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxPositionValue?: number;
  minPositionValue?: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  selectedColor?: string;
  onSeriesMouseClick?: (_d: any) => void;
  dateFormat: string;
  indx: number;
  sortParameter?: number | 'diff';
  arrowConnector: boolean;
  connectorStrokeWidth: number;
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function Graph(props: Props) {
  const {
    data,
    dotColors,
    barPadding,
    showTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    rightMargin,
    topMargin,
    bottomMargin,
    radius,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    showValues,
    suffix,
    prefix,
    selectedColor,
    dateFormat,
    indx,
    sortParameter,
    arrowConnector,
    connectorStrokeWidth,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    valueColor,
    styles,
    classNames,
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
      ensureCompleteDataForDumbbellChart(data, dateFormat || 'yyyy'),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values:
        sortParameter !== undefined
          ? sortParameter === 'diff'
            ? sortBy(values, d =>
                checkIfNullOrUndefined(d.x[d.x.length - 1]) ||
                checkIfNullOrUndefined(d.x[0])
                  ? -Infinity
                  : (d.x[d.x.length - 1] as number) - (d.x[0] as number),
              ).map((el, i) => ({
                ...el,
                id: `${i}`,
              }))
            : sortBy(values, d =>
                checkIfNullOrUndefined(d.x[sortParameter])
                  ? -Infinity
                  : d.x[sortParameter],
              ).map((el, i) => ({
                ...el,
                id: `${i}`,
              }))
          : (
              uniqLabels.map(label =>
                values.find(o => o.label === label),
              ) as DumbbellChartWithDateDataType[]
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
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);

  const yMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(...data.map(d => max(d.x) || 0)) < 0
    ? 0
    : Math.max(...data.map(d => max(d.x) || 0));
  const yMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(...data.map(d => min(d.x) || 0)) > 0
    ? 0
    : Math.min(...data.map(d => min(d.x) || 0));

  const y = scaleLinear()
    .domain([yMinValue, yMaxValue])
    .range([graphHeight, 0])
    .nice();
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
        {arrowConnector ? (
          <defs>
            <marker
              id='arrow'
              viewBox='0 0 10 10'
              refX='10'
              refY='5'
              markerWidth='6'
              markerHeight='6'
              orient='auto-start-reverse'
            >
              <path
                d='M 0 0 L 10 5 L 0 10 z'
                className='fill-primary-gray-600 dark:fill-primary-gray-300'
              />
            </marker>
          </defs>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Axis
            y1={y(yMinValue < 0 ? 0 : yMinValue)}
            y2={y(yMinValue < 0 ? 0 : yMinValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              yMinValue < 0 ? 0 : yMinValue,
              prefix,
              suffix,
            )}
            labelPos={{
              x: 0 - leftMargin,
              y: yMaxValue < 0 ? -15 : y(yMinValue < 0 ? 0 : yMinValue) - 5,
            }}
            classNames={{
              axis: classNames?.xAxis?.axis,
              label: classNames?.yAxis?.labels,
            }}
            styles={{ axis: styles?.xAxis?.axis, label: styles?.yAxis?.labels }}
          />
          {showTicks ? (
            <YTicksAndGridLines
              values={yTicks.filter(d => d !== 0)}
              y={yTicks.filter(d => d !== 0).map(d => y(d))}
              x1={0 - leftMargin}
              x2={graphWidth + margin.right}
              styles={{
                gridLines: styles?.yAxis?.gridLines,
                labels: styles?.yAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.yAxis?.gridLines,
                labels: classNames?.yAxis?.labels,
              }}
              suffix={suffix}
              prefix={prefix}
              labelType='secondary'
              showGridLines
              labelPos='vertical'
            />
          ) : null}
          <AxisTitle
            x={0 - leftMargin - 15}
            y={graphHeight / 2}
            style={styles?.yAxis?.title}
            className={classNames?.yAxis?.title}
            text={barAxisTitle}
            rotate90
          />
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => (
              <motion.g
                className='undp-viz-low-opacity undp-viz-g-with-hover'
                key={d.label}
              >
                {showLabels ? (
                  <motion.text
                    style={{
                      textAnchor: 'middle',
                      ...(styles?.xAxis?.labels || {}),
                    }}
                    y={graphHeight}
                    dy='15px'
                    animate={{
                      x: (x(`${i}`) as number) + x.bandwidth() / 2,
                    }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
                      classNames?.xAxis?.labels,
                    )}
                  >
                    {`${d.label}`.length < truncateBy
                      ? d.label
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </motion.text>
                ) : null}
                <motion.line
                  style={{
                    strokeWidth: connectorStrokeWidth,
                    ...(styles?.dataConnectors || {}),
                    opacity: selectedColor ? 0.3 : 1,
                  }}
                  className={cn(
                    'stroke-primary-gray-600 dark:stroke-primary-gray-300',
                    classNames?.dataConnectors,
                  )}
                  markerEnd={
                    arrowConnector && d.x.indexOf(min(d.x) as number) === 0
                      ? 'url(#arrow)'
                      : ''
                  }
                  markerStart={
                    arrowConnector &&
                    d.x.indexOf(min(d.x) as number) === d.x.length - 1
                      ? 'url(#arrow)'
                      : ''
                  }
                  animate={{
                    x1: (x(`${i}`) as number) + x.bandwidth() / 2,
                    y1: y(min(d.x) as number) - radius,
                    x2: (x(`${i}`) as number) + x.bandwidth() / 2,
                    y2: y(max(d.x) as number) + radius,
                  }}
                  transition={{ duration: 0.5 }}
                />
                {d.x.map((el, j) => (
                  <g
                    key={j}
                    opacity={
                      selectedColor
                        ? dotColors[j] === selectedColor
                          ? 1
                          : 0.3
                        : 1
                    }
                    onMouseEnter={(event: any) => {
                      setMouseOverData({ ...d, xIndex: j });
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      if (onSeriesMouseOver) {
                        onSeriesMouseOver({ ...d, xIndex: j });
                      }
                    }}
                    onClick={() => {
                      if (onSeriesMouseClick || detailsOnClick) {
                        if (
                          isEqual(mouseClickData, { ...d, xIndex: j }) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick?.(undefined);
                        } else {
                          setMouseClickData({ ...d, xIndex: j });
                          if (onSeriesMouseClick)
                            onSeriesMouseClick({ ...d, xIndex: j });
                        }
                      }
                    }}
                    onMouseMove={(event: any) => {
                      setMouseOverData({ ...d, xIndex: j });
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
                    <motion.circle
                      r={radius}
                      style={{
                        fill: dotColors[j],
                        fillOpacity: 0.85,
                        stroke: dotColors[j],
                        strokeWidth: 1,
                      }}
                      animate={{
                        cx: (x(`${i}`) as number) + x.bandwidth() / 2,
                        cy: y(el || 0),
                        opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showValues ? (
                      <motion.text
                        style={{
                          fill: valueColor || dotColors[j],
                          textAnchor: 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-sm font-bold',
                          classNames?.graphObjectValues,
                        )}
                        dx={radius + 3}
                        dy={4.5}
                        animate={{
                          x: (x(`${i}`) as number) + x.bandwidth() / 2,
                          y: y(el || 0),
                          opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {numberFormattingFunction(el, prefix, suffix)}
                      </motion.text>
                    ) : null}
                  </g>
                ))}
              </motion.g>
            ))}
          </AnimatePresence>
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          backgroundStyle={styles?.tooltip}
          className={classNames?.tooltip}
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
