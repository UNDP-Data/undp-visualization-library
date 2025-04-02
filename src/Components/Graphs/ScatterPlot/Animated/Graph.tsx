import { useState } from 'react';
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
import { cn, Modal } from '@undp-data/undp-design-system-react';
import {
  ScatterPlotWithDateDataType,
  ReferenceDataType,
  AnnotationSettingsDataType,
  CustomHighlightAreaSettingsDataType,
  StyleObject,
  ClassNameObject,
} from '../../../../Types';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { ensureCompleteDataForScatterPlot } from '../../../../Utils/ensureCompleteData';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';
import { string2HTML } from '../../../../Utils/string2HTML';
import { Axis } from '../../../Elements/Axes/Axis';
import { AxisTitle } from '../../../Elements/Axes/AxisTitle';
import { XTicksAndGridLines } from '../../../Elements/Axes/XTicksAndGridLines';
import { RefLineX, RefLineY } from '../../../Elements/ReferenceLine';
import { Annotation } from '../../../Elements/Annotations';
import { YTicksAndGridLines } from '../../../Elements/Axes/YTicksAndGridLines';

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
  refXValues: ReferenceDataType[];
  refYValues: ReferenceDataType[];
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
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  noOfXTicks: number;
  noOfYTicks: number;
  labelColor?: string;
  xSuffix: string;
  ySuffix: string;
  xPrefix: string;
  yPrefix: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
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
    annotations,
    customHighlightAreaSettings,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    noOfXTicks,
    noOfYTicks,
    labelColor,
    xSuffix,
    ySuffix,
    xPrefix,
    yPrefix,
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
    left: yAxisTitle ? leftMargin + 40 : leftMargin,
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
  const xTicks = x.ticks(noOfXTicks);
  const yTicks = y.ticks(noOfYTicks);
  const voronoiDiagram = Delaunay.from(
    groupedData[indx].values.filter(
      d => !checkIfNullOrUndefined(d.x) && !checkIfNullOrUndefined(d.y),
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
        direction='ltr'
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
          {customHighlightAreaSettings.map((d, i) => (
            <g key={i}>
              {d.coordinates.length !== 4 ? (
                <path
                  d={getPathFromPoints(
                    d.coordinates.map((el, j) =>
                      j % 2 === 0 ? x(el as number) : y(el as number),
                    ),
                  )}
                  style={{
                    strokeWidth: d.strokeWidth || 0,
                    ...(d.coordinates.length > 4
                      ? d.color && { fill: d.color }
                      : { fill: 'none' }),
                    ...(d.color && { stroke: d.color }),
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                  }}
                  className={
                    !d.color
                      ? 'stroke-primary-gray-300 dark:stroke-primary-gray-550 fill-primary-gray-300 dark:fill-primary-gray-550'
                      : ''
                  }
                />
              ) : (
                <line
                  x1={x(d.coordinates[0] as number)}
                  y1={y(d.coordinates[1] as number)}
                  x2={x(d.coordinates[2] as number)}
                  y2={y(d.coordinates[3] as number)}
                  style={{
                    ...(d.color && { stroke: d.color }),
                    fill: 'none',
                    strokeWidth: d.strokeWidth || 1,
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                  }}
                  className={
                    !d.color
                      ? 'stroke-primary-gray-300 dark:stroke-primary-gray-550'
                      : ''
                  }
                />
              )}
            </g>
          ))}
          <g>
            <YTicksAndGridLines
              values={yTicks.filter(d => d !== 0)}
              y={yTicks.filter(d => d !== 0).map(d => y(d))}
              x1={0}
              x2={graphWidth + margin.right}
              styles={{
                gridLines: styles?.yAxis?.gridLines,
                labels: styles?.yAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.yAxis?.gridLines,
                labels: classNames?.yAxis?.labels,
              }}
              suffix={ySuffix}
              prefix={yPrefix}
              labelType='primary'
              showGridLines
              labelPos='side'
            />
            <Axis
              y1={y(yMinVal < 0 ? 0 : yMinVal)}
              y2={y(yMinVal < 0 ? 0 : yMinVal)}
              x1={0}
              x2={graphWidth}
              label={numberFormattingFunction(
                yMinVal < 0 ? 0 : yMinVal,
                yPrefix,
                ySuffix,
              )}
              labelPos={{
                x: -4,
                y: y(yMinVal < 0 ? 0 : yMinVal) + 3,
              }}
              classNames={{
                axis: classNames?.xAxis?.axis,
                label: classNames?.yAxis?.labels,
              }}
              styles={{
                axis: styles?.xAxis?.axis,
                label: { textAnchor: 'end', ...(styles?.yAxis?.labels || {}) },
              }}
            />
            <AxisTitle
              x={0 - margin.left + 15}
              y={graphHeight / 2}
              style={styles?.yAxis?.title}
              className={classNames?.yAxis?.title}
              text={yAxisTitle}
              rotate90
            />
          </g>
          <g>
            <XTicksAndGridLines
              values={xTicks.filter(d => d !== 0)}
              x={xTicks.filter(d => d !== 0).map(d => x(d))}
              y1={0}
              y2={graphHeight}
              styles={{
                gridLines: styles?.xAxis?.gridLines,
                labels: styles?.xAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.xAxis?.gridLines,
                labels: classNames?.xAxis?.labels,
              }}
              suffix={xSuffix}
              prefix={xPrefix}
              labelType='primary'
              showGridLines
            />
            <Axis
              x1={x(xMinVal < 0 ? 0 : xMinVal)}
              x2={x(xMinVal < 0 ? 0 : xMinVal)}
              y1={0}
              y2={graphHeight}
              label={numberFormattingFunction(
                xMinVal < 0 ? 0 : xMinVal,
                xPrefix,
                xSuffix,
              )}
              labelPos={{
                x: x(xMinVal < 0 ? 0 : xMinVal),
                y: graphHeight + 12,
              }}
              classNames={{
                axis: classNames?.xAxis?.axis,
                label: classNames?.yAxis?.labels,
              }}
              styles={{
                axis: styles?.xAxis?.axis,
                label: {
                  textAnchor: 'middle',
                  ...(styles?.yAxis?.labels || {}),
                },
              }}
            />
            <AxisTitle
              x={graphWidth / 2}
              y={graphHeight + 30}
              style={styles?.xAxis?.title}
              className={classNames?.xAxis?.title}
              text={xAxisTitle}
            />
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
                            ? UNDPColorModule.gray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        stroke:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule.gray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        fillOpacity: 0.6,
                      }}
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
                        className='text-[10px]'
                        style={{
                          fill:
                            labelColor ||
                            (data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                              ? UNDPColorModule.gray
                              : colors[colorDomain.indexOf(`${d.color}`)]),
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
                          style={{
                            fill:
                              labelColor ||
                              (data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                ? UNDPColorModule.gray
                                : colors[colorDomain.indexOf(`${d.color}`)]),
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn(
                            'graph-value text-[10px]',
                            classNames?.graphObjectValues,
                          )}
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
                    style={{
                      fill: '#fff',
                    }}
                    className='opacity-0'
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
                      if (onSeriesMouseClick || detailsOnClick) {
                        if (
                          isEqual(mouseClickData, d) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick?.(undefined);
                        } else {
                          setMouseClickData(d);
                          onSeriesMouseClick?.(d);
                        }
                      }
                    }}
                  />
                </g>
              );
            })}
          </AnimatePresence>
          {refXValues.map((el, i) => (
            <RefLineX
              key={i}
              text={el.text}
              color={el.color}
              x={x(el.value as number)}
              y1={0}
              y2={graphHeight}
              textSide={
                x(el.value as number) > graphWidth * 0.75 || rtl
                  ? 'left'
                  : 'right'
              }
              classNames={el.classNames}
              styles={el.styles}
            />
          ))}
          {refYValues.map((el, i) => (
            <RefLineY
              key={i}
              text={el.text}
              color={el.color}
              y={y(el.value as number)}
              x1={0}
              x2={graphWidth}
              classNames={el.classNames}
              styles={el.styles}
            />
          ))}
          <g>
            {annotations.map((d, i) => {
              const endPoints = getLineEndPoint(
                {
                  x: d.xCoordinate
                    ? x(d.xCoordinate as number) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                  y: d.yCoordinate
                    ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                    : 0 + (d.yOffset || 0) - 8,
                },
                {
                  x: d.xCoordinate ? x(d.xCoordinate as number) : 0,
                  y: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                },
                checkIfNullOrUndefined(d.connectorRadius)
                  ? 3.5
                  : (d.connectorRadius as number),
              );
              const connectorSettings = d.showConnector
                ? {
                    y1: endPoints.y,
                    x1: endPoints.x,
                    y2: d.yCoordinate
                      ? y(d.yCoordinate as number) + (d.yOffset || 0)
                      : 0 + (d.yOffset || 0),
                    x2: d.xCoordinate
                      ? x(d.xCoordinate as number) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0),
                    cy: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                    cx: d.xCoordinate ? x(d.xCoordinate as number) : 0,
                    circleRadius: checkIfNullOrUndefined(d.connectorRadius)
                      ? 3.5
                      : (d.connectorRadius as number),
                    strokeWidth:
                      d.showConnector === true
                        ? 2
                        : Math.min(d.showConnector || 0, 1),
                  }
                : undefined;
              const labelSettings = {
                y: d.yCoordinate
                  ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                  : 0 + (d.yOffset || 0) - 8,
                x: rtl
                  ? 0
                  : d.xCoordinate
                  ? x(d.xCoordinate as number) + (d.xOffset || 0)
                  : 0 + (d.xOffset || 0),
                width: rtl
                  ? d.xCoordinate
                    ? x(d.xCoordinate as number) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0)
                  : graphWidth -
                    (d.xCoordinate
                      ? x(d.xCoordinate as number) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0)),
                maxWidth: d.maxWidth,
                fontWeight: d.fontWeight,
                align: d.align,
              };
              return (
                <Annotation
                  key={i}
                  color={d.color}
                  connectorsSettings={connectorSettings}
                  labelSettings={labelSettings}
                  text={d.text}
                  classNames={d.classNames}
                  styles={d.styles}
                />
              );
            })}
          </g>
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
