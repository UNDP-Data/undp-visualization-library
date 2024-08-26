import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import sum from 'lodash.sum';
import {
  GroupedBarGraphWithDateDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Bars } from './Bars';
import { ensureCompleteDataForStackedBarChart } from '../../../../../Utils/ensureCompleteData';

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
  showBarLabel: boolean;
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
    dateFormat,
    indx,
    autoSort,
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
      values: autoSort
        ? sortBy(values, d => sum(d.size.map(el => el || 0))).map((el, i) => ({
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
    : Math.max(...data.map(d => sum(d.size.filter(l => l !== undefined)) || 0));

  const y = scaleLinear().domain([0, xMaxValue]).range([graphHeight, 0]).nice();
  const x = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([0, graphWidth])
    .paddingInner(barPadding);
  const yTicks = y.ticks(5);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line
            y1={y(0)}
            y2={y(0)}
            x1={0 - margin.left}
            x2={graphWidth + margin.right}
            style={{
              stroke: UNDPColorModule.grays['gray-700'],
            }}
            strokeWidth={1}
          />
          <text
            x={0 - margin.left + 2}
            y={y(0)}
            style={{
              fill: UNDPColorModule.grays['gray-700'],
              fontFamily:
                'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
            }}
            textAnchor='start'
            fontSize={12}
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
                      stroke: UNDPColorModule.grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                  <text
                    x={0 - margin.left + 2}
                    y={y(d)}
                    textAnchor='start'
                    fontSize={12}
                    dy={-3}
                    opacity={d === 0 ? 0 : 1}
                    style={{
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      fill: UNDPColorModule.grays['gray-500'],
                    }}
                  >
                    {numberFormattingFunction(d, '', '')}
                  </text>
                </g>
              ))
            : null}
          <Bars
            data={groupedData}
            x={x}
            y={y}
            barColors={barColors}
            showBarLabel={showBarLabel}
            truncateBy={truncateBy}
            showValues={
              checkIfNullOrUndefined(showValues)
                ? true
                : (showValues as boolean)
            }
            suffix={suffix}
            prefix={prefix}
            setEventY={setEventY}
            setEventX={setEventX}
            setMouseOverData={setMouseOverData}
            onSeriesMouseOver={onSeriesMouseOver}
            onSeriesMouseClick={onSeriesMouseClick}
            selectedColor={selectedColor}
            indx={indx}
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
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    fontWeight='bold'
                    y={y(el.value as number)}
                    style={{
                      fill: el.color || UNDPColorModule.grays['gray-700'],
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      textAnchor: 'end',
                    }}
                    fontSize={12}
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
        />
      ) : null}
    </>
  );
}
