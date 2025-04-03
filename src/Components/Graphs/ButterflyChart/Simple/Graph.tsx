import { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import isEqual from 'lodash.isequal';
import { cn, Modal } from '@undp-data/undp-design-system-react';
import {
  ButterflyChartDataType,
  ClassNameObject,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { string2HTML } from '@/Utils/string2HTML';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

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
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  noOfTicks: number;
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
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    noOfTicks,
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
  const xRightTicks = xRightBar.ticks(noOfTicks);
  const xLeftBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([(graphWidth - centerGap) / 2, 0])
    .nice();
  const xLeftTicks = xLeftBar.ticks(noOfTicks);
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
            {showTicks ? (
              <XTicksAndGridLines
                values={xLeftTicks.filter(d => d !== 0)}
                x={xLeftTicks.filter(d => d !== 0).map(d => xLeftBar(d))}
                y1={0 - topMargin}
                y2={graphHeight + margin.bottom}
                styles={{
                  gridLines: styles?.xAxis?.gridLines,
                  labels: styles?.xAxis?.labels,
                }}
                classNames={{
                  gridLines: classNames?.xAxis?.gridLines,
                  labels: classNames?.xAxis?.labels,
                }}
                suffix={suffix}
                prefix={prefix}
                labelType='secondary'
                showGridLines
                leftLabel
              />
            ) : null}
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
                        ...(styles?.graphObjectValues || {}),
                      }}
                      dx={d.rightBar ? (d.rightBar > 0 ? -5 : 5) : 5}
                      dy={5}
                      className={cn(
                        'graph-value text-sm',
                        classNames?.graphObjectValues,
                      )}
                    >
                      {numberFormattingFunction(d.rightBar, prefix, suffix)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <Axis
              y1={-2.5}
              y2={graphHeight + margin.bottom}
              x1={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              x2={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              classNames={{
                axis: classNames?.yAxis?.axis,
              }}
              styles={{
                axis: styles?.yAxis?.axis,
              }}
            />
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <RefLineX
                    key={i}
                    text={el.text}
                    color={el.color}
                    x={xLeftBar(el.value as number)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    textSide='left'
                    classNames={el.classNames}
                    styles={el.styles}
                  />
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${(graphWidth + centerGap) / 2},${0})`}>
            {showTicks ? (
              <XTicksAndGridLines
                values={xRightTicks.filter(d => d !== 0)}
                x={xRightTicks.filter(d => d !== 0).map(d => xRightBar(d))}
                y1={0 - topMargin}
                y2={graphHeight + margin.bottom}
                styles={{
                  gridLines: styles?.xAxis?.gridLines,
                  labels: styles?.xAxis?.labels,
                }}
                classNames={{
                  gridLines: classNames?.xAxis?.gridLines,
                  labels: classNames?.xAxis?.labels,
                }}
                suffix={suffix}
                prefix={prefix}
                labelType='secondary'
                showGridLines
              />
            ) : null}
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
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn(
                        'graph-value text-sm',
                        classNames?.graphObjectValues,
                      )}
                      dx={d.rightBar ? (d.rightBar < 0 ? -5 : 5) : 5}
                      dy={5}
                    >
                      {numberFormattingFunction(d.rightBar, prefix, suffix)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <Axis
              y1={-2.5}
              y2={graphHeight + margin.bottom}
              x1={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              x2={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              classNames={{
                axis: classNames?.yAxis?.axis,
              }}
              styles={{
                axis: styles?.yAxis?.axis,
              }}
            />
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <RefLineX
                    key={i}
                    text={el.text}
                    color={el.color}
                    x={xRightBar(el.value as number)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    textSide='right'
                    classNames={el.classNames}
                    styles={el.styles}
                  />
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${graphWidth / 2},${0})`}>
            {dataWithId.map((d, i) => (
              <YAxesLabels
                key={i}
                value={
                  `${d.label}`.length < truncateBy
                    ? `${d.label}`
                    : `${`${d.label}`.substring(0, truncateBy)}...`
                }
                y={y(`${d.id}`) as number}
                x={0 - centerGap / 2}
                width={centerGap}
                height={y.bandwidth()}
                alignment='center'
                style={styles?.yAxis?.labels}
                className={classNames?.yAxis?.labels}
              />
            ))}
          </g>

          <g transform={`translate(${0},${graphHeight})`}>
            <text
              style={{
                fill: barColors[0],
                textAnchor: 'end',
                ...styles?.yAxis?.title,
              }}
              className={cn('text-base', classNames?.yAxis?.title)}
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
                ...styles?.yAxis?.title,
              }}
              className={cn('text-base', classNames?.yAxis?.title)}
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
