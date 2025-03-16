import { useState } from 'react';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { Delaunay } from 'd3-delaunay';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import minBy from 'lodash.minby';
import isEqual from 'lodash.isequal';
import { linearRegression } from 'simple-statistics';
import { Modal } from '@undp-data/undp-design-system-react';
import {
  ScatterPlotDataType,
  ReferenceDataType,
  AnnotationSettingsDataType,
  CustomHighlightAreaSettingsDataType,
  CSSObject,
} from '../../../../Types';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { getLineEndPoint } from '../../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../../Utils/getPathFromPoints';
import { string2HTML } from '../../../../Utils/string2HTML';

interface Props {
  data: ScatterPlotDataType[];
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
  rtl: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  regressionLine: boolean | string;
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  noOfXTicks: number;
  noOfYTicks: number;
  labelColor?: string;
  xSuffix: string;
  ySuffix: string;
  xPrefix: string;
  yPrefix: string;
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
    rtl,
    annotations,
    customHighlightAreaSettings,
    regressionLine,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    noOfXTicks,
    noOfYTicks,
    labelColor,
    xSuffix,
    ySuffix,
    xPrefix,
    yPrefix,
  } = props;
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
  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
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
  const dataOrdered =
    dataWithId.filter(d => !checkIfNullOrUndefined(d.radius)).length === 0
      ? dataWithId
      : orderBy(
          dataWithId.filter(d => !checkIfNullOrUndefined(d.radius)),
          'radius',
          'desc',
        );
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
    dataOrdered,
    d => x(d.x as number),
    d => y(d.y as number),
  ).voronoi([
    0,
    0,
    graphWidth < 0 ? 0 : graphWidth,
    graphHeight < 0 ? 0 : graphHeight,
  ]);
  const regressionLineParam = linearRegression(
    data
      .filter(d => !checkIfNullOrUndefined(d.x) && !checkIfNullOrUndefined(d.y))
      .map(d => [x(d.x as number), y(d.y as number)]),
  );
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
            {yTicks.map((d, i) => (
              <g key={i} className={`opacity-${d === 0 ? 0 : 100}`}>
                <line
                  x1={0}
                  x2={graphWidth}
                  y1={y(d)}
                  y2={y(d)}
                  className='undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550'
                />
                <text
                  x={0}
                  y={y(d)}
                  style={{
                    textAnchor: 'end',
                  }}
                  className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                  dy={3}
                  dx={-4}
                >
                  {numberFormattingFunction(d, yPrefix, ySuffix)}
                </text>
              </g>
            ))}
            <line
              x1={0}
              x2={graphWidth}
              y1={y(yMinVal < 0 ? 0 : yMinVal)}
              y2={y(yMinVal < 0 ? 0 : yMinVal)}
              className='stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
            />
            <text
              x={0}
              y={y(yMinVal < 0 ? 0 : yMinVal)}
              style={{
                textAnchor: 'end',
              }}
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
              dy={4}
              dx={-3}
            >
              {numberFormattingFunction(yMinVal < 0 ? 0 : yMinVal)}
            </text>
            {yAxisTitle ? (
              <text
                transform={`translate(${20 - leftMargin}, ${
                  graphHeight / 2
                }) rotate(-90)`}
                style={{
                  textAnchor: 'middle',
                }}
                className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
              >
                {yAxisTitle}
              </text>
            ) : null}
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i} className={`opacity-${d === 0 ? 0 : 100}`}>
                <line
                  y1={0}
                  y2={graphHeight}
                  x1={x(d)}
                  x2={x(d)}
                  className='undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550'
                />
                <text
                  x={x(d)}
                  y={graphHeight}
                  style={{
                    textAnchor: 'middle',
                  }}
                  className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                  dy={12}
                >
                  {numberFormattingFunction(d, xPrefix, xSuffix)}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={x(xMinVal < 0 ? 0 : xMinVal)}
              x2={x(xMinVal < 0 ? 0 : xMinVal)}
              className='stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
            />
            <text
              x={x(xMinVal < 0 ? 0 : xMinVal)}
              y={graphHeight}
              style={{
                textAnchor: 'middle',
              }}
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
              dy={15}
            >
              {numberFormattingFunction(xMinVal < 0 ? 0 : xMinVal)}
            </text>
            {xAxisTitle ? (
              <text
                transform={`translate(${graphWidth / 2}, ${graphHeight})`}
                style={{
                  textAnchor: 'middle',
                }}
                className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                dy={30}
              >
                {xAxisTitle}
              </text>
            ) : null}
          </g>
          {dataOrdered
            .filter(
              d => !checkIfNullOrUndefined(d.x) && !checkIfNullOrUndefined(d.y),
            )
            .map((d, i) => {
              return (
                <g key={i}>
                  <g
                    opacity={
                      selectedColor
                        ? d.color
                          ? colors[colorDomain.indexOf(`${d.color}`)] ===
                            selectedColor
                            ? 1
                            : 0.3
                          : 0.3
                        : mouseOverData
                        ? mouseOverData.id === d.id
                          ? 1
                          : 0.3
                        : highlightedDataPoints.length !== 0
                        ? highlightedDataPoints.indexOf(d.label || '') !== -1
                          ? 1
                          : 0.3
                        : 1
                    }
                    transform={`translate(${x(d.x as number)},${y(
                      d.y as number,
                    )})`}
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={!radiusScale ? radius : radiusScale(d.radius || 0)}
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
                    />
                    {showLabels && !checkIfNullOrUndefined(d.label) ? (
                      <text
                        style={{
                          fill:
                            labelColor ||
                            (data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                              ? UNDPColorModule.gray
                              : colors[colorDomain.indexOf(`${d.color}`)]),
                        }}
                        className='text-[10px]'
                        y={0}
                        x={!radiusScale ? radius : radiusScale(d.radius || 0)}
                        dy={4}
                        dx={3}
                      >
                        {d.label}
                      </text>
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
                          }}
                          className='text-[10px]'
                          y={0}
                          x={!radiusScale ? radius : radiusScale(d.radius || 0)}
                          dy={4}
                          dx={3}
                        >
                          {d.label}
                        </text>
                      ) : null
                    ) : null}
                  </g>
                  <path
                    d={voronoiDiagram.renderCell(i)}
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
          {refXValues.map((el, i) => (
            <g key={i}>
              <line
                className={`undp-ref-line ${
                  !el.color
                    ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                    : ''
                }`}
                style={{
                  ...(el.color && { stroke: el.color }),
                }}
                x1={x(el.value as number)}
                x2={x(el.value as number)}
                y1={0}
                y2={graphHeight}
              />
              <text
                x={x(el.value as number)}
                y={0}
                style={{
                  ...(el.color && { fill: el.color }),
                  textAnchor:
                    x(el.value as number) > graphWidth * 0.75 || rtl
                      ? 'end'
                      : 'start',
                }}
                className={`text-xs font-bold${
                  !el.color
                    ? ' fill-primary-gray-700 dark:fill-primary-gray-300'
                    : ''
                }`}
                dy={12.5}
                dx={x(el.value as number) > graphWidth * 0.75 || rtl ? -5 : 5}
              >
                {el.text}
              </text>
            </g>
          ))}
          {refYValues.map((el, i) => (
            <g key={i}>
              <line
                className={`undp-ref-line ${
                  !el.color
                    ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                    : ''
                }`}
                style={{
                  ...(el.color && { stroke: el.color }),
                }}
                y1={y(el.value as number)}
                y2={y(el.value as number)}
                x1={0}
                x2={graphWidth}
              />
              <text
                x={graphWidth}
                y={y(el.value as number)}
                style={{
                  ...(el.color && { fill: el.color }),
                  textAnchor: 'end',
                }}
                className={`text-xs font-bold${
                  !el.color
                    ? ' fill-primary-gray-700 dark:fill-primary-gray-300'
                    : ''
                }`}
                dy={-5}
              >
                {el.text}
              </text>
            </g>
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
              return (
                <g key={i}>
                  {d.showConnector ? (
                    <>
                      <circle
                        cy={d.yCoordinate ? y(d.yCoordinate as number) : 0}
                        cx={d.xCoordinate ? x(d.xCoordinate as number) : 0}
                        r={
                          checkIfNullOrUndefined(d.connectorRadius)
                            ? 3.5
                            : (d.connectorRadius as number)
                        }
                        style={{
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          fill: 'none',
                          ...(d.color && { stroke: d.color }),
                        }}
                        className={
                          !d.color
                            ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                            : ''
                        }
                      />
                      <line
                        y1={endPoints.y}
                        x1={endPoints.x}
                        y2={
                          d.yCoordinate
                            ? y(d.yCoordinate as number) + (d.yOffset || 0)
                            : 0 + (d.yOffset || 0)
                        }
                        x2={
                          d.xCoordinate
                            ? x(d.xCoordinate as number) + (d.xOffset || 0)
                            : 0 + (d.xOffset || 0)
                        }
                        style={{
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          fill: 'none',
                          ...(d.color && { stroke: d.color }),
                        }}
                        className={
                          !d.color
                            ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                            : ''
                        }
                      />
                    </>
                  ) : null}
                  <foreignObject
                    key={i}
                    y={
                      d.yCoordinate
                        ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                        : 0 + (d.yOffset || 0) - 8
                    }
                    x={
                      rtl
                        ? 0
                        : d.xCoordinate
                        ? x(d.xCoordinate as number) + (d.xOffset || 0)
                        : 0 + (d.xOffset || 0)
                    }
                    width={
                      rtl
                        ? d.xCoordinate
                          ? x(d.xCoordinate as number) + (d.xOffset || 0)
                          : 0 + (d.xOffset || 0)
                        : graphWidth -
                          (d.xCoordinate
                            ? x(d.xCoordinate as number) + (d.xOffset || 0)
                            : 0 + (d.xOffset || 0))
                    }
                    height={1}
                    style={{
                      overflow: 'visible',
                    }}
                  >
                    <p
                      className={`text-sm font-${
                        d.fontWeight || 'normal'
                      } leading-tight m-0 whitespace-normal${
                        !d.color
                          ? 'text-primary-gray-700 dark:text-primary-gray-300'
                          : ''
                      }`}
                      style={{
                        ...(d.color && { color: d.color }),
                        maxWidth: d.maxWidth || 'auto',
                      }}
                    >
                      {d.text}
                    </p>
                  </foreignObject>
                </g>
              );
            })}
          </g>
          {regressionLine ? (
            <line
              x1={
                regressionLineParam.b > graphHeight
                  ? (graphHeight - regressionLineParam.b) /
                    regressionLineParam.m
                  : 0
              }
              x2={graphWidth}
              y1={
                regressionLineParam.b > graphHeight
                  ? graphHeight
                  : regressionLineParam.b
              }
              y2={regressionLineParam.m * graphWidth + regressionLineParam.b}
              className={`undp-ref-line ${
                typeof regressionLine !== 'string'
                  ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
                  : ''
              }`}
              style={{
                ...(typeof regressionLine === 'string' && {
                  stroke: regressionLine,
                }),
                fill: 'none',
              }}
            />
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
