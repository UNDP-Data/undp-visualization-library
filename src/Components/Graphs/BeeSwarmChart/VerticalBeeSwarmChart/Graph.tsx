import { scaleLinear, scaleSqrt } from 'd3-scale';
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
import { getTextColorBasedOnBgColor } from '../../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../../ColorPalette';

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
  const yMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      ) < 0 && !startFromZero
    ? 0
    : Math.max(
        ...data.filter(d => d.position !== undefined).map(d => d.position),
      );
  const yMinValue = !checkIfNullOrUndefined(minPositionValue)
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
  const y = scaleLinear()
    .domain([yMinValue, yMaxValue])
    .range([graphHeight, 0])
    .nice();
  const yTicks = y.ticks(5);

  useEffect(() => {
    const dataTemp = (dataOrdered as BeeSwarmChartDataType[]).filter(
      d => d.position,
    );
    forceSimulation(dataTemp as any)
      .force('y', forceY((d: any) => y(d.position as number)).strength(5))
      .force('x', forceX(_d => graphWidth / 2).strength(1))
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
            {showTicks ? (
              <g>
                <line
                  y1={y(0)}
                  y2={y(0)}
                  x1={0 - margin.left}
                  x2={graphWidth + margin.right}
                  style={{
                    stroke: 'var(--gray-700)',
                  }}
                  strokeWidth={1}
                />
                <text
                  x={0 - margin.left + 2}
                  y={y(0)}
                  style={{
                    fill: 'var(--gray-700)',
                    fontFamily: 'var(--fontFamily)',
                  }}
                  textAnchor='start'
                  fontSize={12}
                  dy={-3}
                >
                  0
                </text>
                {yTicks.map((d, i) => (
                  <g key={i}>
                    <line
                      key={i}
                      y1={y(d)}
                      y2={y(d)}
                      x1={0 - margin.left}
                      x2={graphWidth + margin.right}
                      style={{
                        stroke: 'var(--gray-500)',
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
                        fontFamily: 'var(--fontFamily)',
                        fill: 'var(--gray-500)',
                      }}
                    >
                      {numberFormattingFunction(d, '', '')}
                    </text>
                  </g>
                ))}
              </g>
            ) : null}
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
                        color: getTextColorBasedOnBgColor(
                          data.filter(el => el.color).length === 0
                            ? circleColors[0]
                            : !d.color
                            ? UNDPColorModule.graphGray
                            : circleColors[colorDomain.indexOf(d.color)],
                        ),
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
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? circleColors[0]
                                : !d.color
                                ? UNDPColorModule.graphGray
                                : circleColors[colorDomain.indexOf(d.color)],
                            ),
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
                        stroke: el.color || 'var(--gray-700)',
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
                        fill: el.color || 'var(--gray-700)',
                        fontFamily: 'var(--fontFamily)',
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
