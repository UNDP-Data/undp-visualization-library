import { useState } from 'react';
import { format } from 'd3-format';
import maxBy from 'lodash.maxby';
import { Delaunay } from 'd3-delaunay';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import minBy from 'lodash.minby';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import { parse } from 'date-fns';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ScatterPlotWithDateDataType,
  ReferenceDataType,
} from '../../../../Types';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { ensureCompleteDataForScatterPlot } from '../../../../Utils/ensureCompleteData';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';

interface Props {
  data: ScatterPlotWithDateDataType[];
  width: number;
  height: number;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  radius: number;
  xAxisTitle: string;
  yAxisTitle: string;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refXValues?: ReferenceDataType[];
  refYValues?: ReferenceDataType[];
  highlightAreaSettings: [
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  selectedColor?: string;
  highlightedDataPoints: (string | number)[];
  maxRadiusValue?: number;
  maxXValue?: number;
  minXValue?: number;
  maxYValue?: number;
  minYValue?: number;
  highlightAreaColor: string;
  onSeriesMouseClick?: (_d: any) => void;
  dateFormat: string;
  indx: number;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    showLabels,
    colors,
    colorDomain,
    radius,
    xAxisTitle,
    yAxisTitle,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refXValues,
    refYValues,
    highlightAreaSettings,
    selectedColor,
    highlightedDataPoints,
    maxRadiusValue,
    maxXValue,
    minXValue,
    maxYValue,
    minYValue,
    onSeriesMouseClick,
    highlightAreaColor,
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
      ensureCompleteDataForScatterPlot(data, dateFormat || 'yyyy'),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values: (
        uniqLabels.map(label =>
          values.find(o => o.label === label),
        ) as ScatterPlotWithDateDataType[]
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
  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(maxRadiusValue)
              ? (maxBy(data, 'radius')?.radius as number)
              : (maxRadiusValue as number),
          ])
          .range([0.25, radius])
          .nice()
      : undefined;

  const xMinVal = checkIfNullOrUndefined(minXValue)
    ? (minBy(data, 'x')?.x as number) > 0
      ? 0
      : (minBy(data, 'x')?.x as number)
    : (minXValue as number);
  const xMaxVal = checkIfNullOrUndefined(maxXValue)
    ? (maxBy(data, 'x')?.x as number) > 0
      ? (maxBy(data, 'x')?.x as number)
      : 0
    : (maxXValue as number);
  const x = scaleLinear()
    .domain([xMinVal, xMaxVal])
    .range([0, graphWidth])
    .nice();
  const yMinVal = checkIfNullOrUndefined(minYValue)
    ? (minBy(data, 'y')?.y as number) > 0
      ? 0
      : (minBy(data, 'y')?.y as number)
    : (minYValue as number);
  const yMaxVal = checkIfNullOrUndefined(maxYValue)
    ? (maxBy(data, 'y')?.y as number) > 0
      ? (maxBy(data, 'y')?.y as number)
      : 0
    : (maxYValue as number);
  const y = scaleLinear()
    .domain([yMinVal, yMaxVal])
    .range([graphHeight, 0])
    .nice();
  const xTicks = x.ticks(5);
  const yTicks = y.ticks(5);
  const voronoiDiagram = Delaunay.from(
    groupedData[indx].values.filter(
      d => d.x !== undefined && d.y !== undefined,
    ),
    d => x(d.x as number),
    d => y(d.y as number),
  ).voronoi([
    0,
    0,
    graphWidth < 0 ? 0 : graphWidth,
    graphHeight < 0 ? 0 : graphHeight,
  ]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {highlightAreaSettings.filter(d => d === null).length === 4 ? null : (
            <g>
              <rect
                style={{
                  fill: highlightAreaColor,
                }}
                x={
                  highlightAreaSettings[0]
                    ? x(highlightAreaSettings[0] as number)
                    : 0
                }
                width={
                  highlightAreaSettings[1]
                    ? x(highlightAreaSettings[1] as number) -
                      (highlightAreaSettings[0]
                        ? x(highlightAreaSettings[0] as number)
                        : 0)
                    : graphWidth -
                      (highlightAreaSettings[0]
                        ? x(highlightAreaSettings[0] as number)
                        : 0)
                }
                y={
                  highlightAreaSettings[3]
                    ? y(highlightAreaSettings[3] as number)
                    : 0
                }
                height={
                  highlightAreaSettings[2] !== null
                    ? y(highlightAreaSettings[2] as number) -
                      (highlightAreaSettings[3]
                        ? y(highlightAreaSettings[3] as number)
                        : 0)
                    : graphHeight -
                      (highlightAreaSettings[3]
                        ? graphHeight - y(highlightAreaSettings[3] as number)
                        : 0)
                }
              />
            </g>
          )}
          <g>
            {yTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  x1={0}
                  x2={graphWidth}
                  y1={y(d)}
                  y2={y(d)}
                  style={{
                    stroke: UNDPColorModule.grays['gray-500'],
                  }}
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={0}
                  y={y(d)}
                  style={{
                    fill: UNDPColorModule.grays['gray-700'],
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                  textAnchor='end'
                  fontSize={12}
                  dy={4}
                  dx={-3}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              x1={0}
              x2={graphWidth}
              y1={y(yMinVal < 0 ? 0 : yMinVal)}
              y2={y(yMinVal < 0 ? 0 : yMinVal)}
              style={{
                stroke: UNDPColorModule.grays['gray-700'],
              }}
              strokeWidth={1}
            />
            <text
              x={0}
              y={y(yMinVal < 0 ? 0 : yMinVal)}
              style={{
                fill: UNDPColorModule.grays['gray-700'],
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
              textAnchor='end'
              fontSize={12}
              dy={4}
              dx={-3}
            >
              {numberFormattingFunction(yMinVal < 0 ? 0 : yMinVal)}
            </text>
            {yAxisTitle ? (
              <text
                transform={`translate(-30, ${graphHeight / 2}) rotate(-90)`}
                style={{
                  fill: UNDPColorModule.grays['gray-700'],
                  fontWeight: 'bold',
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                textAnchor='middle'
                fontSize={12}
              >
                {yAxisTitle}
              </text>
            ) : null}
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i} opacity={d === 0 ? 0 : 1}>
                <line
                  y1={0}
                  y2={graphHeight}
                  x1={x(d)}
                  x2={x(d)}
                  style={{
                    stroke: UNDPColorModule.grays['gray-500'],
                  }}
                  strokeWidth={1}
                  strokeDasharray='4,8'
                />
                <text
                  x={x(d)}
                  y={graphHeight}
                  style={{
                    fill: UNDPColorModule.grays['gray-700'],
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                  textAnchor='middle'
                  fontSize={12}
                  dy={12}
                >
                  {Math.abs(d) < 1 ? d : format('~s')(d).replace('G', 'B')}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={x(xMinVal < 0 ? 0 : xMinVal)}
              x2={x(xMinVal < 0 ? 0 : xMinVal)}
              style={{
                stroke: UNDPColorModule.grays['gray-700'],
              }}
              strokeWidth={1}
            />
            <text
              x={x(xMinVal < 0 ? 0 : xMinVal)}
              y={graphHeight}
              style={{
                fill: UNDPColorModule.grays['gray-700'],
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
              textAnchor='middle'
              fontSize={12}
              dy={15}
            >
              {numberFormattingFunction(xMinVal < 0 ? 0 : xMinVal)}
            </text>
            {xAxisTitle ? (
              <text
                transform={`translate(${graphWidth / 2}, ${graphHeight})`}
                style={{
                  fill: UNDPColorModule.grays['gray-700'],
                  fontWeight: 'bold',
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                }}
                textAnchor='middle'
                fontSize={12}
                dy={30}
              >
                {xAxisTitle}
              </text>
            ) : null}
          </g>
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => {
              return (
                <g key={i}>
                  <motion.g
                    opacity={
                      selectedColor
                        ? d.color
                          ? colors[colorDomain.indexOf(`${d.color}`)] ===
                            selectedColor
                            ? 1
                            : 0.3
                          : 0.3
                        : mouseOverData
                        ? mouseOverData.label === d.label
                          ? 1
                          : 0.3
                        : highlightedDataPoints.length !== 0
                        ? highlightedDataPoints.indexOf(d.label || '') !== -1
                          ? 1
                          : 0.3
                        : 1
                    }
                  >
                    <motion.circle
                      cx={0}
                      cy={0}
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        stroke:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                      }}
                      fillOpacity={0.6}
                      animate={{
                        cx: x(d.x || 0),
                        cy: y(d.y || 0),
                        r:
                          checkIfNullOrUndefined(d.x) ||
                          checkIfNullOrUndefined(d.y)
                            ? 0
                            : !radiusScale
                            ? radius
                            : radiusScale(d.radius || 0),
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showLabels && !checkIfNullOrUndefined(d.label) ? (
                      <motion.text
                        fontSize={10}
                        style={{
                          fill:
                            data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                              ? UNDPColorModule.graphGray
                              : colors[colorDomain.indexOf(`${d.color}`)],
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                        dy={4}
                        dx={3}
                        animate={{
                          y: y(d.y || 0),
                          x: !radiusScale
                            ? x(d.x || 0) + radius
                            : x(d.x || 0) + radiusScale(d.radius || 0),
                          opacity:
                            checkIfNullOrUndefined(d.x) ||
                            checkIfNullOrUndefined(d.y)
                              ? 0
                              : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {d.label}
                      </motion.text>
                    ) : highlightedDataPoints.length !== 0 &&
                      !checkIfNullOrUndefined(d.label) ? (
                      highlightedDataPoints.indexOf(
                        d.label as string | number,
                      ) !== -1 ? (
                        <text
                          fontSize={10}
                          style={{
                            fill:
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                ? UNDPColorModule.graphGray
                                : colors[colorDomain.indexOf(`${d.color}`)],
                            fontFamily: rtl
                              ? language === 'he'
                                ? 'Noto Sans Hebrew, sans-serif'
                                : 'Noto Sans Arabic, sans-serif'
                              : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          }}
                          y={0}
                          x={!radiusScale ? radius : radiusScale(d.radius || 0)}
                          dy={4}
                          dx={3}
                        >
                          {d.label}
                        </text>
                      ) : null
                    ) : null}
                  </motion.g>
                  <path
                    d={voronoiDiagram.renderCell(i)}
                    fill='#fff'
                    opacity={0}
                    onMouseEnter={event => {
                      setMouseOverData(d);
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      if (onSeriesMouseOver) {
                        onSeriesMouseOver(d);
                      }
                    }}
                    onMouseMove={event => {
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
                  />
                </g>
              );
            })}
          </AnimatePresence>
          {refXValues ? (
            <>
              {refXValues.map((el, i) => (
                <g key={i}>
                  <line
                    style={{
                      stroke: el.color || UNDPColorModule.grays['gray-700'],
                      strokeWidth: 1.5,
                    }}
                    strokeDasharray='4,4'
                    x1={x(el.value as number)}
                    x2={x(el.value as number)}
                    y1={0}
                    y2={graphHeight}
                  />
                  <text
                    x={x(el.value as number)}
                    fontWeight='bold'
                    y={0}
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
          {refYValues ? (
            <>
              {refYValues.map((el, i) => (
                <g key={i}>
                  <line
                    style={{
                      stroke: el.color || UNDPColorModule.grays['gray-700'],
                      strokeWidth: 1.5,
                    }}
                    strokeDasharray='4,4'
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0}
                    x2={graphWidth}
                  />
                  <text
                    x={graphWidth}
                    fontWeight='bold'
                    y={y(el.value as number)}
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
