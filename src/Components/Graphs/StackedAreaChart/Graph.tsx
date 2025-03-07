import { useEffect, useRef, useState } from 'react';
import { curveMonotoneX, area } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import {
  AnnotationSettingsDataType,
  CSSObject,
  CustomHighlightAreaSettingsDataType,
  MultiLineChartDataType,
  ReferenceDataType,
} from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../ColorPalette';
import { getLineEndPoint } from '../../../Utils/getLineEndPoint';
import { getPathFromPoints } from '../../../Utils/getPathFromPoints';

interface Props {
  data: MultiLineChartDataType[];
  colors: string[];
  width: number;
  height: number;
  dateFormat: string;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  yAxisTitle?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings: [number | string | null, number | string | null];
  maxValue?: number;
  minValue?: number;
  highlightAreaColor: string;
  rtl: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  mode: 'light' | 'dark';
  tooltipBackgroundStyle?: CSSObject;
  noOfYTicks: number;
  prefix: string;
  suffix: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    dateFormat,
    noOfXTicks,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    yAxisTitle,
    tooltip,
    onSeriesMouseOver,
    highlightAreaSettings,
    refValues,
    minValue,
    maxValue,
    highlightAreaColor,
    rtl,
    annotations,
    customHighlightAreaSettings,
    mode,
    tooltipBackgroundStyle,
    noOfYTicks,
    prefix,
    suffix,
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
  const MouseoverRectRef = useRef(null);
  const dataFormatted = sortBy(
    data.map(d => ({
      date: parse(`${d.date}`, dateFormat, new Date()),
      y: d.y,
      data: d.data,
    })),
    'date',
  );
  const highlightAreaSettingsFormatted = [
    highlightAreaSettings[0] === null
      ? null
      : parse(`${highlightAreaSettings[0]}`, dateFormat, new Date()),
    highlightAreaSettings[1] === null
      ? null
      : parse(`${highlightAreaSettings[1]}`, dateFormat, new Date()),
  ];
  const dataArray = dataFormatted[0].y.map((_d, i) => {
    return dataFormatted.map(el => ({
      date: el.date,
      y0: i === 0 ? 0 : sum(el.y.filter((_element, k) => k < i)),
      y1: sum(el.y.filter((_element, k) => k <= i)),
    }));
  });
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = dataFormatted[0].date;
  const maxYear = dataFormatted[dataFormatted.length - 1].date;
  const minParam = checkIfNullOrUndefined(minValue) ? 0 : (minValue as number);
  const maxParam: number = checkIfNullOrUndefined(maxValue)
    ? Math.max(...data.map(d => sum(d.y) || 0))
    : (maxValue as number);

  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam, maxParam])
    .range([graphHeight, 0])
    .nice();

  const areaShape = area()
    .x((d: any) => x(d.date))
    .y0((d: any) => y(d.y0))
    .y1((d: any) => y(d.y1))
    .curve(curveMonotoneX);
  const yTicks = y.ticks(noOfYTicks);
  const xTicks = x.ticks(noOfXTicks);
  useEffect(() => {
    const mousemove = (event: any) => {
      const selectedData =
        dataFormatted[
          bisectCenter(
            dataFormatted.map(d => d.date),
            x.invert(pointer(event)[0]),
            1,
          )
        ];
      setMouseOverData(selectedData || dataFormatted[dataFormatted.length - 1]);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(
          selectedData || dataFormatted[dataFormatted.length - 1],
        );
      }
      setEventY(event.clientY);
      setEventX(event.clientX);
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(undefined);
      }
    };
    select(MouseoverRectRef.current)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);
  }, [x, dataFormatted]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {highlightAreaSettingsFormatted[0] === null &&
          highlightAreaSettingsFormatted[1] === null ? null : (
            <g>
              <rect
                style={{
                  fill: highlightAreaColor,
                }}
                x={
                  highlightAreaSettingsFormatted[0]
                    ? x(highlightAreaSettingsFormatted[0])
                    : 0
                }
                width={
                  highlightAreaSettingsFormatted[1]
                    ? x(highlightAreaSettingsFormatted[1]) -
                      (highlightAreaSettingsFormatted[0]
                        ? x(highlightAreaSettingsFormatted[0])
                        : 0)
                    : graphWidth -
                      (highlightAreaSettingsFormatted[0]
                        ? x(highlightAreaSettingsFormatted[0])
                        : 0)
                }
                y={0}
                height={graphHeight}
              />
            </g>
          )}
          {customHighlightAreaSettings.map((d, i) => (
            <g key={i}>
              {d.coordinates.length !== 4 ? (
                <path
                  d={getPathFromPoints(
                    d.coordinates.map((el, j) =>
                      j % 2 === 0
                        ? x(parse(`${el}`, dateFormat, new Date()))
                        : y(el as number),
                    ),
                  )}
                  style={{
                    fill:
                      d.coordinates.length > 4
                        ? d.color || UNDPColorModule[mode].grays['gray-300']
                        : 'none',
                    strokeWidth: d.strokeWidth || 0,
                    stroke: d.color || UNDPColorModule[mode].grays['gray-300'],
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                  }}
                />
              ) : (
                <line
                  x1={x(parse(`${d.coordinates[0]}`, dateFormat, new Date()))}
                  y1={y(d.coordinates[1] as number)}
                  x2={x(parse(`${d.coordinates[2]}`, dateFormat, new Date()))}
                  y2={y(d.coordinates[3] as number)}
                  style={{
                    fill: 'none',
                    strokeWidth: d.strokeWidth || 1,
                    stroke: d.color || UNDPColorModule[mode].grays['gray-300'],
                    strokeDasharray: d.dashedStroke ? '4,4' : 'none',
                  }}
                />
              )}
            </g>
          ))}
          <g>
            {yTicks.map((d, i) =>
              d !== 0 ? (
                <g key={i}>
                  <line
                    y1={y(d)}
                    y2={y(d)}
                    x1={width}
                    x2={0}
                    className='undp-tick-line stroke-primary-gray-500 dark:stroke-primary-gray-550'
                  />
                  <text
                    x={0}
                    y={y(d)}
                    style={{
                      textAnchor: 'end',
                    }}
                    className='fill-primary-gray-550 dark:fill-primary-gray-500 text-xs'
                    dy={3}
                    dx={-4}
                  >
                    {numberFormattingFunction(d, prefix, suffix)}
                  </text>
                </g>
              ) : null,
            )}
            <line
              y1={graphHeight}
              y2={graphHeight}
              x1={0}
              x2={width}
              className='stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300'
            />
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
              <g key={i}>
                <text
                  y={graphHeight}
                  x={x(d)}
                  style={{
                    textAnchor: 'middle',
                  }}
                  className='xs:max-[360px]:hidden text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs fill-primary-gray-700 dark:fill-primary-gray-300'
                  dy={15}
                >
                  {format(d, dateFormat)}
                </text>
              </g>
            ))}
          </g>
          <g>
            {dataArray.map((d, i) => {
              return (
                <path
                  key={i}
                  d={areaShape(d as any) as string}
                  style={{
                    fill: colors[i],
                    opacity: 0.8,
                  }}
                />
              );
            })}
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                className='undp-tick-line stroke-primary-gray-700 dark:stroke-primary-gray-400'
              />
            ) : null}
          </g>
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <g key={i}>
                  <line
                    className='undp-ref-line'
                    style={{
                      stroke:
                        el.color || UNDPColorModule[mode].grays['gray-700'],
                    }}
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    y={y(el.value as number)}
                    style={{
                      fill: el.color || UNDPColorModule[mode].grays['gray-700'],
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
          <g>
            {annotations.map((d, i) => {
              const endPoints = getLineEndPoint(
                {
                  x: d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                      (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                  y: d.yCoordinate
                    ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                    : 0 + (d.yOffset || 0) - 8,
                },
                {
                  x: d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date()))
                    : 0,
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
                        cx={
                          d.xCoordinate
                            ? x(
                                parse(
                                  `${d.xCoordinate}`,
                                  dateFormat,
                                  new Date(),
                                ),
                              )
                            : 0
                        }
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
                          stroke:
                            d.color || UNDPColorModule[mode].grays['gray-700'],
                        }}
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
                            ? x(
                                parse(
                                  `${d.xCoordinate}`,
                                  dateFormat,
                                  new Date(),
                                ),
                              ) + (d.xOffset || 0)
                            : 0 + (d.xOffset || 0)
                        }
                        style={{
                          strokeWidth:
                            d.showConnector === true
                              ? 2
                              : Math.min(d.showConnector, 1),
                          fill: 'none',
                          stroke:
                            d.color || UNDPColorModule[mode].grays['gray-700'],
                        }}
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
                        ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) +
                          (d.xOffset || 0)
                        : 0 + (d.xOffset || 0)
                    }
                    width={
                      rtl
                        ? d.xCoordinate
                          ? x(
                              parse(`${d.xCoordinate}`, dateFormat, new Date()),
                            ) + (d.xOffset || 0)
                          : 0 + (d.xOffset || 0)
                        : graphWidth -
                          (d.xCoordinate
                            ? x(
                                parse(
                                  `${d.xCoordinate}`,
                                  dateFormat,
                                  new Date(),
                                ),
                              ) + (d.xOffset || 0)
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
                      } leading-tight m-0 whitespace-normal`}
                      style={{
                        color:
                          d.color || UNDPColorModule[mode].grays['gray-700'],
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
          <rect
            ref={MouseoverRectRef}
            style={{
              fill: 'none',
              pointerEvents: 'all',
            }}
            width={graphWidth}
            height={graphHeight}
          />
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
    </>
  );
}
