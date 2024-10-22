import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import orderBy from 'lodash.orderby';
import {
  BarGraphWithDateDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Bars } from './Bars';
import { ensureCompleteDataForBarChart } from '../../../../../Utils/ensureCompleteData';

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
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
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
    language,
    mode,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
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
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      ) < 0
    ? 0
    : Math.max(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data.filter(d => d.size !== undefined).map(d => d.size as number),
      );
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([0, graphHeight])
    .paddingInner(barPadding);
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
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={0 - margin.top}
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
                      fill: UNDPColorModule[mode || 'light'].grays['gray-500'],
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
            highlightedDataPoints={highlightedDataPoints}
            barColor={barColor}
            colorDomain={colorDomain}
            showLabels={showLabels}
            truncateBy={truncateBy}
            showValues={showValues}
            suffix={suffix}
            prefix={prefix}
            colorScale={data.filter(el => el.color).length === 0}
            setEventY={setEventY}
            setEventX={setEventX}
            setMouseOverData={setMouseOverData}
            onSeriesMouseOver={onSeriesMouseOver}
            onSeriesMouseClick={onSeriesMouseClick}
            selectedColor={selectedColor}
            indx={indx}
            rtl={rtl}
            language={language}
            xMinValue={xMinValue}
            mode={mode}
          />
          <line
            x1={x(xMinValue < 0 ? 0 : xMinValue)}
            x2={x(xMinValue < 0 ? 0 : xMinValue)}
            y1={-2.5}
            y2={graphHeight + margin.bottom}
            strokeWidth={1}
            style={{
              stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
            }}
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
        />
      ) : null}
    </>
  );
}
