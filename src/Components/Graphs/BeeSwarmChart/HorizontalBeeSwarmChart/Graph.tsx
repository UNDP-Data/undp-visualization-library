import { scaleLinear, scaleSqrt } from 'd3-scale';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import {
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { useEffect, useState } from 'react';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import isEqual from 'lodash.isequal';
import { BeeSwarmChartDataType, ReferenceDataType } from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface BeeSwarmChartDataTypeForBubbleChart extends BeeSwarmChartDataType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Props {
  data: BeeSwarmChartDataType[];
  circleColors: string[];
  colorDomain: string[];
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabel: boolean;
  width: number;
  height: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
  startFromZero: boolean;
  pointRadius: number;
  pointRadiusMaxValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    data,
    circleColors,
    showTicks,
    leftMargin,
    width,
    height,
    colorDomain,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabel,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
    startFromZero,
    pointRadius,
    pointRadiusMaxValue,
    maxPositionValue,
    minPositionValue,
    highlightedDataPoints,
    onSeriesMouseClick,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [finalData, setFinalData] = useState<
    BeeSwarmChartDataTypeForBubbleChart[] | null
  >(null);
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

  const dataOrdered =
    data.filter(d => d.radius !== undefined).length === 0
      ? data
      : orderBy(
          data.filter(d => d.radius !== undefined),
          'radius',
          'desc',
        );
  const xMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) < 0 && !startFromZero
    ? 0
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );
  const xMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) >= 0 && !startFromZero
    ? 0
    : Math.min(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );

  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(pointRadiusMaxValue)
              ? (maxBy(data, 'radius')?.radius as number)
              : (pointRadiusMaxValue as number),
          ])
          .range([0.25, pointRadius])
          .nice()
      : undefined;
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const xTicks = x.ticks(5);

  useEffect(() => {
    const dataTemp = (dataOrdered as BeeSwarmChartDataType[]).filter(
      d => d.position,
    );
    forceSimulation(dataTemp as any)
      .force('x', forceX((d: any) => x(d.position as number)).strength(5))
      .force('y', forceY(_d => graphHeight / 2).strength(1))
      .force(
        'collide',
        forceCollide((d: any) =>
          radiusScale ? radiusScale(d.radius || 0) + 1 : pointRadius + 1,
        ),
      )
      .force('charge', forceManyBody().strength(-15))
      .on('end ', () => {
        setFinalData(dataTemp as BeeSwarmChartDataTypeForBubbleChart[]);
      });
  }, []);

  return (
    <>
      {finalData ? (
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
                        fill: 'var(--gray-500)',
                        fontFamily: 'var(--fontFamily)',
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
                        stroke: 'var(--gray-500)',
                      }}
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      opacity={d === 0 ? 0 : 1}
                    />
                  </g>
                ))
              : null}
            {finalData.map((d, i) => (
              <g
                className='g-with-hover'
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? circleColors[colorDomain.indexOf(d.color)] ===
                        selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf(d.label) !== -1
                      ? 0.85
                      : 0.3
                    : 0.85
                }
                transform={`translate(${d.x},${d.y})`}
                onMouseEnter={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
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
                onMouseLeave={() => {
                  setMouseOverData(undefined);
                  setEventX(undefined);
                  setEventY(undefined);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(undefined);
                  }
                }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={radiusScale ? radiusScale(d.radius || 0) : pointRadius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? circleColors[0]
                        : !d.color
                        ? UNDPColorModule.graphGray
                        : circleColors[colorDomain.indexOf(d.color)],
                  }}
                />
                {(radiusScale ? radiusScale(d.radius || 0) : pointRadius) >
                  10 && showLabel ? (
                  <foreignObject
                    y={
                      0 -
                      (radiusScale ? radiusScale(d.radius || 0) : pointRadius)
                    }
                    x={
                      0 -
                      (radiusScale ? radiusScale(d.radius || 0) : pointRadius)
                    }
                    width={
                      2 *
                      (radiusScale ? radiusScale(d.radius || 0) : pointRadius)
                    }
                    height={
                      2 *
                      (radiusScale ? radiusScale(d.radius || 0) : pointRadius)
                    }
                  >
                    <div
                      style={{
                        fill: 'var(--white)',
                        fontFamily: 'var(--fontFamily)',
                        textAnchor: 'middle',
                        whiteSpace: 'normal',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 'inherit',
                        padding: '0 var(--spacing-02)',
                      }}
                    >
                      {showLabel ? (
                        <p
                          className='undp-typography margin-bottom-00'
                          style={{
                            fontSize: `${Math.min(
                              Math.max(
                                Math.round(
                                  (radiusScale
                                    ? radiusScale(d.radius || 0)
                                    : pointRadius) / 4,
                                ),
                                10,
                              ),
                              20,
                            )}px`,
                            textAlign: 'center',
                            lineHeight: '1',
                            color: 'var(--white)',
                          }}
                        >
                          {d.label}
                        </p>
                      ) : null}
                    </div>
                  </foreignObject>
                ) : null}
              </g>
            ))}
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <g key={i}>
                    <line
                      style={{
                        stroke: 'var(--gray-700)',
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
                        fill: 'var(--gray-700)',
                        fontFamily: 'var(--fontFamily)',
                        textAnchor:
                          x(el.value as number) > graphWidth * 0.75
                            ? 'end'
                            : 'start',
                      }}
                      fontSize={12}
                      dy={12.5}
                      dx={x(el.value as number) > graphWidth * 0.75 ? -5 : 5}
                    >
                      {el.text}
                    </text>
                  </g>
                ))}
              </>
            ) : null}
          </g>
        </svg>
      ) : (
        <div style={{ width: `${width}px`, height: `${height}px` }}>
          <div className='undp-loader-container undp-container'>
            <div className='undp-loader' />
          </div>
        </div>
      )}
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
