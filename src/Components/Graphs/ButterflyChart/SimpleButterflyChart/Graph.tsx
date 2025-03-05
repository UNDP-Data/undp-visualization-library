import { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import isEqual from 'lodash.isequal';
import {
  ButterflyChartDataType,
  CSSObject,
  ReferenceDataType,
} from '../../../../Types';
import { numberFormattingFunction } from '../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';
import { string2HTML } from '../../../../Utils/string2HTML';
import { Modal } from '../../../Elements/Modal';

interface Props {
  data: ButterflyChartDataType[];
  barColors: [string, string];
  centerGap: number;
  refValues: ReferenceDataType[];
  axisTitles: [string, string];
  width: number;
  height: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  barPadding: number;
  truncateBy: number;
  showValues: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  showTicks: boolean;
  suffix: string;
  prefix: string;
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    centerGap,
    refValues,
    maxValue,
    minValue,
    showValues,
    axisTitles,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    barPadding,
    truncateBy,
    onSeriesMouseClick,
    showTicks,
    suffix,
    prefix,
    mode,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
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
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([graphHeight, 0])
    .paddingInner(barPadding);

  const xMaxValueLeftBar = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.leftBar))
          .map(d => d.leftBar as number),
      ) < 0
    ? 0
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.leftBar))
          .map(d => d.leftBar as number),
      );
  const xMinValueLeftBar = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.leftBar))
          .map(d => d.leftBar as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.leftBar))
          .map(d => d.leftBar as number),
      );

  const xMaxValueRightBar = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.rightBar))
          .map(d => d.rightBar as number),
      ) < 0
    ? 0
    : Math.max(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.rightBar))
          .map(d => d.rightBar as number),
      );
  const xMinValueRightBar = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.rightBar))
          .map(d => d.rightBar as number),
      ) >= 0
    ? 0
    : Math.min(
        ...data
          .filter(d => !checkIfNullOrUndefined(d.rightBar))
          .map(d => d.rightBar as number),
      );
  const minParam =
    xMinValueLeftBar < xMinValueRightBar ? xMinValueLeftBar : xMinValueRightBar;
  const maxParam =
    xMaxValueLeftBar > xMaxValueRightBar ? xMaxValueLeftBar : xMaxValueRightBar;
  const xRightBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([0, (graphWidth - centerGap) / 2])
    .nice();
  const xRightTicks = xRightBar.ticks(5);
  const xLeftBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([(graphWidth - centerGap) / 2, 0])
    .nice();
  const xLeftTicks = xLeftBar.ticks(5);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g transform={`translate(${0},${0})`}>
            {showTicks
              ? xLeftTicks.map((d, i) => (
                  <g key={i}>
                    <line
                      x1={xLeftBar(d)}
                      x2={xLeftBar(d)}
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom + topMargin}
                      style={{
                        stroke:
                          UNDPColorModule[mode || 'light'].grays['gray-500'],
                      }}
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      className={`opacity-${d === 0 ? 0 : 100}`}
                    />
                    <text
                      x={xLeftBar(d)}
                      y={0 - margin.top}
                      dy={10}
                      dx={-3}
                      style={{
                        fill: UNDPColorModule[mode || 'light'].grays[
                          'gray-500'
                        ],
                        textAnchor: 'end',
                      }}
                      className={`text-xs opacity-${d === 0 ? 0 : 100}`}
                    >
                      {numberFormattingFunction(d, prefix, suffix)}
                    </text>
                  </g>
                ))
              : null}
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
                        if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                      } else {
                        setMouseClickData(d);
                        if (onSeriesMouseClick) onSeriesMouseClick(d);
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
                  {d.leftBar ? (
                    <rect
                      x={d.leftBar < 0 ? xLeftBar(0) : xLeftBar(d.leftBar)}
                      y={y(`${i}`)}
                      width={
                        d.leftBar < 0
                          ? xLeftBar(d.leftBar) - xLeftBar(0)
                          : xLeftBar(0) - xLeftBar(d.leftBar)
                      }
                      style={{
                        fill: barColors[0],
                      }}
                      height={y.bandwidth()}
                    />
                  ) : null}
                  {showValues ? (
                    <text
                      x={
                        d.leftBar
                          ? xLeftBar(d.leftBar)
                          : xLeftBar(
                              xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar,
                            )
                      }
                      y={(y(`${i}`) as number) + y.bandwidth() / 2}
                      style={{
                        fill: barColors[0],
                        textAnchor: d.rightBar
                          ? d.rightBar > 0
                            ? 'end'
                            : 'start'
                          : 'start',
                      }}
                      dx={d.rightBar ? (d.rightBar > 0 ? -5 : 5) : 5}
                      dy={5}
                      className='text-sm'
                    >
                      {numberFormattingFunction(d.rightBar, prefix, suffix)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <line
              x1={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              x2={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              y1={-2.5}
              y2={graphHeight + 2.5}
              style={{
                stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
              }}
              strokeWidth={1}
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
                      x1={xLeftBar(el.value as number)}
                      x2={xLeftBar(el.value as number)}
                    />
                    <text
                      y={0 - margin.top}
                      x={xLeftBar(el.value as number) as number}
                      style={{
                        fill:
                          el.color ||
                          UNDPColorModule[mode || 'light'].grays['gray-700'],
                        textAnchor: 'end',
                      }}
                      className='text-xs font-bold'
                      dy={12.5}
                      dx={-5}
                    >
                      {el.text}
                    </text>
                  </g>
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${(graphWidth + centerGap) / 2},${0})`}>
            {showTicks
              ? xRightTicks.map((d, i) => (
                  <g key={i}>
                    <line
                      x1={xRightBar(d)}
                      x2={xRightBar(d)}
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom + topMargin}
                      style={{
                        stroke:
                          UNDPColorModule[mode || 'light'].grays['gray-500'],
                      }}
                      strokeWidth={1}
                      strokeDasharray='4,8'
                      className={`opacity-${d === 0 ? 0 : 100}`}
                    />
                    <text
                      x={xRightBar(d)}
                      y={0 - margin.top}
                      dy={10}
                      dx={3}
                      style={{
                        fill: UNDPColorModule[mode || 'light'].grays[
                          'gray-500'
                        ],
                        textAnchor: 'start',
                      }}
                      className={`text-xs opacity-${d === 0 ? 0 : 100}`}
                    >
                      {numberFormattingFunction(d, prefix, suffix)}
                    </text>
                  </g>
                ))
              : null}
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
                        if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                      } else {
                        setMouseClickData(d);
                        if (onSeriesMouseClick) onSeriesMouseClick(d);
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
                  {d.rightBar ? (
                    <rect
                      x={d.rightBar >= 0 ? xRightBar(0) : xRightBar(d.rightBar)}
                      y={y(`${i}`)}
                      width={
                        d.rightBar >= 0
                          ? xRightBar(d.rightBar) - xRightBar(0)
                          : xRightBar(0) - xRightBar(d.rightBar)
                      }
                      style={{
                        fill: barColors[1],
                      }}
                      height={y.bandwidth()}
                    />
                  ) : null}
                  {showValues ? (
                    <text
                      x={
                        d.rightBar
                          ? xRightBar(d.rightBar)
                          : xRightBar(
                              xMinValueRightBar < 0 ? 0 : xMinValueRightBar,
                            )
                      }
                      y={(y(`${i}`) as number) + y.bandwidth() / 2}
                      style={{
                        fill: barColors[1],
                        textAnchor: d.rightBar
                          ? d.rightBar < 0
                            ? 'end'
                            : 'start'
                          : 'start',
                      }}
                      className='text-sm'
                      dx={d.rightBar ? (d.rightBar < 0 ? -5 : 5) : 5}
                      dy={5}
                    >
                      {numberFormattingFunction(d.rightBar, prefix, suffix)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <line
              x1={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              x2={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              y1={-2.5}
              y2={graphHeight + 2.5}
              style={{
                stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
              }}
              strokeWidth={1}
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
                      x1={xRightBar(el.value as number)}
                      x2={xRightBar(el.value as number)}
                    />
                    <text
                      y={0 - margin.top}
                      x={xRightBar(el.value as number) as number}
                      style={{
                        fill:
                          el.color ||
                          UNDPColorModule[mode || 'light'].grays['gray-700'],
                        textAnchor: 'start',
                      }}
                      className='text-xs font-bold'
                      dy={12.5}
                      dx={5}
                    >
                      {el.text}
                    </text>
                  </g>
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${graphWidth / 2},${0})`}>
            {dataWithId.map((d, i) => {
              return (
                <text
                  style={{
                    fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                    textAnchor: 'middle',
                  }}
                  className='text-xs'
                  key={i}
                  x={0}
                  y={(y(`${i}`) as number) + y.bandwidth() / 2}
                  dy={5}
                >
                  {`${d.label}`.length < truncateBy
                    ? `${d.label}`
                    : `${`${d.label}`.substring(0, truncateBy)}...`}
                </text>
              );
            })}
          </g>

          <g transform={`translate(${0},${graphHeight})`}>
            <text
              style={{
                fill: barColors[0],
                textAnchor: 'end',
              }}
              className='text-base'
              x={graphWidth / 2 - centerGap / 2}
              y={0}
              dx={-5}
              dy={20}
            >
              {axisTitles[0]}
            </text>
            <text
              style={{
                fill: barColors[1],
                textAnchor: 'start',
              }}
              className='text-base'
              x={graphWidth / 2 + centerGap / 2}
              y={0}
              dx={5}
              dy={20}
            >
              {axisTitles[1]}
            </text>
          </g>
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          mode={mode}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          isOpen={mouseClickData !== undefined}
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
