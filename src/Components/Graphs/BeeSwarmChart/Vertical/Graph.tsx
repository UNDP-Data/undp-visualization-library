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
import { cn, Modal, Spinner } from '@undp-data/undp-design-system-react';
import {
  BeeSwarmChartDataType,
  ClassNameObject,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';

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
  showLabels: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
  startFromZero: boolean;
  radius: number;
  maxRadiusValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  noOfTicks: number;
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
    suffix,
    prefix,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
    startFromZero,
    radius,
    maxRadiusValue,
    maxPositionValue,
    minPositionValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    noOfTicks,
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
    data.filter(d => !checkIfNullOrUndefined(d.radius)).length === 0
      ? data
      : orderBy(
          data.filter(d => !checkIfNullOrUndefined(d.radius)),
          'radius',
          'desc',
        );
  const yMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.position))
          .map(d => d.position),
      ) < 0 && !startFromZero
    ? 0
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.position))
          .map(d => d.position),
      );
  const yMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.position))
          .map(d => d.position),
      ) >= 0 && !startFromZero
    ? 0
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.position))
          .map(d => d.position),
      );

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
  const y = scaleLinear()
    .domain([yMinValue, yMaxValue])
    .range([graphHeight, 0])
    .nice();
  const yTicks = y.ticks(noOfTicks);

  useEffect(() => {
    setFinalData(null);
    const dataTemp = (dataOrdered as BeeSwarmChartDataType[]).filter(
      d => d.position,
    );
    forceSimulation(dataTemp as any)
      .force('y', forceY((d: any) => y(d.position as number)).strength(5))
      .force('x', forceX(_d => graphWidth / 2).strength(1))
      .force(
        'collide',
        forceCollide((d: any) =>
          radiusScale ? radiusScale(d.radius || 0) + 1 : radius + 1,
        ),
      )
      .force('charge', forceManyBody().strength(-15))
      .alphaDecay(0.05)
      .tick(10000)
      .on('tick', () => {
        setFinalData(dataTemp as BeeSwarmChartDataTypeForBubbleChart[]);
      })
      .on('end', () => {
        setFinalData(dataTemp as BeeSwarmChartDataTypeForBubbleChart[]);
      });
  }, [data, radius, graphHeight, graphWidth, yMinValue, yMaxValue]);

  return (
    <>
      {finalData ? (
        <svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
          direction='ltr'
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {showTicks ? (
              <>
                <Axis
                  y1={y(yMinValue < 0 ? 0 : yMinValue)}
                  y2={y(yMinValue < 0 ? 0 : yMinValue)}
                  x1={0 - margin.left}
                  x2={graphWidth + margin.right}
                  label={numberFormattingFunction(
                    yMinValue < 0 ? 0 : yMinValue,
                    prefix,
                    suffix,
                  )}
                  labelPos={{
                    x: 0 - margin.left,
                    y:
                      yMaxValue < 0
                        ? -15
                        : y(yMinValue < 0 ? 0 : yMinValue) - 5,
                  }}
                  classNames={{
                    axis: classNames?.xAxis?.axis,
                    label: classNames?.yAxis?.labels,
                  }}
                  styles={{
                    axis: styles?.xAxis?.axis,
                    label: styles?.yAxis?.labels,
                  }}
                />
                <YTicksAndGridLines
                  values={yTicks.filter(d => d !== 0)}
                  y={yTicks.filter(d => d !== 0).map(d => y(d))}
                  x1={0 - margin.left}
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
              </>
            ) : null}
            {finalData.map((d, i) => (
              <g
                className='undp-viz-g-with-hover'
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
                  r={radiusScale ? radiusScale(d.radius || 0) : radius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? circleColors[0]
                        : !d.color
                        ? UNDPColorModule.gray
                        : circleColors[colorDomain.indexOf(d.color)],
                  }}
                />
                {(radiusScale ? radiusScale(d.radius || 0) : radius) > 10 &&
                showLabels ? (
                  <foreignObject
                    y={0 - (radiusScale ? radiusScale(d.radius || 0) : radius)}
                    x={0 - (radiusScale ? radiusScale(d.radius || 0) : radius)}
                    width={
                      2 * (radiusScale ? radiusScale(d.radius || 0) : radius)
                    }
                    height={
                      2 * (radiusScale ? radiusScale(d.radius || 0) : radius)
                    }
                  >
                    <div className='flex flex-col justify-center items-center h-inherit py-0 px-1.5'>
                      {showLabels ? (
                        <p
                          className={cn(
                            'text-center leading-none m-0',
                            classNames?.graphObjectValues,
                          )}
                          style={{
                            fontSize: `${Math.min(
                              Math.max(
                                Math.round(
                                  (radiusScale
                                    ? radiusScale(d.radius || 0)
                                    : radius) / 4,
                                ),
                                10,
                              ),
                              Math.max(
                                Math.round(
                                  ((radiusScale
                                    ? radiusScale(d.radius || 0)
                                    : radius) *
                                    12) /
                                    `${d.label}`.length,
                                ),
                                10,
                              ),
                              20,
                            )}px`,
                            hyphens: 'auto',
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? circleColors[0]
                                : !d.color
                                ? UNDPColorModule.gray
                                : circleColors[colorDomain.indexOf(d.color)],
                            ),
                            ...(styles?.graphObjectValues || {}),
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
                  <RefLineY
                    key={i}
                    text={el.text}
                    color={el.color}
                    y={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                    classNames={el.classNames}
                    styles={el.styles}
                  />
                ))}
              </>
            ) : null}
          </g>
        </svg>
      ) : (
        <div style={{ width: `${width}px`, height: `${height}px` }}>
          <div className='flex m-auto items-center justify-center p-0 leading-none text-base h-40'>
            <Spinner />
          </div>
        </div>
      )}
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
