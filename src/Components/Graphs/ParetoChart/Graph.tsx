import { useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleBand, scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import isEqual from 'lodash.isequal';
import { Modal } from '@undp-data/undp-design-system-react';
import { CSSObject, ParetoChartDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { string2HTML } from '../../../Utils/string2HTML';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: ParetoChartDataType[];
  barColor: string;
  lineColor: string;
  axisTitles: [string, string];
  width: number;
  height: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  sameAxes: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  barPadding: number;
  truncateBy: number;
  showLabels: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  noOfYTicks: number;
  lineSuffix: string;
  barSuffix: string;
  linePrefix: string;
  barPrefix: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColor,
    lineColor,
    axisTitles,
    sameAxes,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    barPadding,
    truncateBy,
    showLabels,
    onSeriesMouseClick,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    noOfYTicks,
    lineSuffix,
    barSuffix,
    linePrefix,
    barPrefix,
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
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const x = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([0, graphWidth])
    .paddingInner(barPadding);
  const minParam1: number = minBy(dataWithId, d => d.bar)?.bar
    ? (minBy(dataWithId, d => d.bar)?.bar as number) > 0
      ? 0
      : (minBy(dataWithId, d => d.bar)?.bar as number)
    : 0;
  const minParam2: number = minBy(dataWithId, d => d.line)?.line
    ? (minBy(dataWithId, d => d.line)?.line as number) > 0
      ? 0
      : (minBy(dataWithId, d => d.line)?.line as number)
    : 0;
  const maxParam1: number = maxBy(dataWithId, d => d.bar)?.bar
    ? (maxBy(dataWithId, d => d.bar)?.bar as number)
    : 0;
  const maxParam2: number = maxBy(dataWithId, d => d.line)?.line
    ? (maxBy(dataWithId, d => d.line)?.line as number)
    : 0;

  const minParam = minParam1 < minParam2 ? minParam1 : minParam2;
  const maxParam = maxParam1 > maxParam2 ? maxParam1 : maxParam2;

  const y1 = scaleLinear()
    .domain([
      sameAxes ? minParam : minParam1,
      sameAxes ? (maxParam > 0 ? maxParam : 0) : maxParam1 > 0 ? maxParam1 : 0,
    ])
    .range([graphHeight, 0])
    .nice();
  const y2 = scaleLinear()
    .domain([
      sameAxes ? minParam : minParam2,
      sameAxes ? (maxParam > 0 ? maxParam : 0) : maxParam2 > 0 ? maxParam2 : 0,
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape = line()
    .defined((d: any) => !checkIfNullOrUndefined(d.line))
    .x((d: any) => (x(d.id) as number) + x.bandwidth() / 2)
    .y((d: any) => y2(d.line))
    .curve(curveMonotoneX);
  const y1Ticks = y1.ticks(noOfYTicks);
  const y2Ticks = y2.ticks(noOfYTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {y1Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y1(d)}
                  y2={y1(d)}
                  x1={-15}
                  x2={-20}
                  style={{
                    stroke: barColor,
                    strokeWidth: 1,
                  }}
                />
                <text
                  x={-25}
                  y={y1(d)}
                  dy={3}
                  className='text-xs'
                  style={{
                    textAnchor: 'end',
                    fill: barColor,
                  }}
                >
                  {numberFormattingFunction(d, barPrefix, barSuffix)}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={-15}
              x2={-15}
              style={{
                stroke: barColor,
                strokeWidth: 1,
              }}
            />
            <text
              transform={`translate(${20 - leftMargin}, ${
                graphHeight / 2
              }) rotate(-90)`}
              style={{
                textAnchor: 'middle',
                fill: barColor,
              }}
              className='text-xs'
            >
              {axisTitles[0].length > 100
                ? `${axisTitles[0].substring(0, 100)}...`
                : axisTitles[0]}
            </text>
          </g>
          <g>
            {y2Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y2(d)}
                  y2={y2(d)}
                  x1={graphWidth + 15}
                  x2={graphWidth + 20}
                  style={{
                    stroke: lineColor,
                    strokeWidth: 1,
                  }}
                />
                <text
                  x={graphWidth + 25}
                  y={y2(d)}
                  dy={3}
                  dx={-2}
                  className='text-xs'
                  style={{
                    textAnchor: 'start',
                    fill: lineColor,
                  }}
                >
                  {numberFormattingFunction(d, linePrefix, lineSuffix)}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={graphWidth + 15}
              x2={graphWidth + 15}
              style={{
                stroke: lineColor,
                strokeWidth: 1,
              }}
            />
            <text
              transform={`translate(${graphWidth + rightMargin - 15}, ${
                graphHeight / 2
              }) rotate(-90)`}
              style={{
                textAnchor: 'middle',
                fill: lineColor,
              }}
              className='text-xs'
            >
              {axisTitles[1].length > 100
                ? `${axisTitles[1].substring(0, 100)}...`
                : axisTitles[1]}
            </text>
          </g>
          <g>
            <line
              y1={graphHeight}
              y2={graphHeight}
              x1={-15}
              x2={graphWidth + 15}
              className='stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-550'
            />
          </g>
          {dataWithId.map((d, i) => {
            return (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={0.85}
                onMouseEnter={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
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
                onMouseMove={(event: any) => {
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
              >
                <rect
                  x={x(`${i}`)}
                  y={d.bar ? y1(d.bar) : 0}
                  width={x.bandwidth()}
                  style={{
                    fill: barColor,
                  }}
                  height={d.bar ? Math.abs(y1(d.bar) - graphHeight) : 0}
                />
                {showLabels ? (
                  <text
                    x={(x(`${i}`) as number) + x.bandwidth() / 2}
                    y={y1(0)}
                    style={{
                      textAnchor: 'middle',
                    }}
                    dy='15px'
                    className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
              </g>
            );
          })}
          <path
            d={lineShape(dataWithId as any) as string}
            style={{
              stroke: lineColor,
              fill: 'none',
              strokeWidth: 2,
            }}
          />
          {dataWithId.map((d, i) => (
            <g key={i}>
              {!checkIfNullOrUndefined(d.line) ? (
                <g
                  onMouseEnter={(event: any) => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(d);
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
                  onMouseMove={(event: any) => {
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
                >
                  <circle
                    cx={(x(d.id) as number) + x.bandwidth() / 2}
                    cy={y2(d.line as number)}
                    r={
                      graphWidth / dataWithId.length < 5
                        ? 0
                        : graphWidth / dataWithId.length < 20
                        ? 2
                        : 4
                    }
                    style={{
                      fill: lineColor,
                    }}
                  />
                </g>
              ) : null}
            </g>
          ))}
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
