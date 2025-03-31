import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { cn, Modal } from '@undp-data/undp-design-system-react';
import { numberFormattingFunction } from '../../../../../../Utils/numberFormattingFunction';
import {
  ReferenceDataType,
  GroupedBarGraphDataType,
  StyleObject,
  ClassNameObject,
} from '../../../../../../Types';
import { Tooltip } from '../../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../../Utils/checkIfNullOrUndefined';
import { string2HTML } from '../../../../../../Utils/string2HTML';
import { AxisTitle } from '../../../../../Elements/Axes/AxisTitle';
import { YTicksAndGridLines } from '../../../../../Elements/Axes/yTicksAndGridLines';
import { Axis } from '../../../../../Elements/Axes/Axis';
import { XAxesLabels } from '../../../../../Elements/Axes/XAxesLabels';
import { RefLineY } from '../../../../../Elements/ReferenceLine';

interface Props {
  data: GroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showLabels: boolean;
  showValues: boolean;
  showTicks: boolean;
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  refValues?: ReferenceDataType[];
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  labelOrder?: string[];
  maxBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    suffix,
    prefix,
    barPadding,
    showLabels,
    showValues,
    showTicks,
    truncateBy,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    onSeriesMouseClick,
    selectedColor,
    labelOrder,
    maxBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
    styles,
    classNames,
  } = props;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: barAxisTitle ? leftMargin + 30 : leftMargin,
    right: rightMargin,
  };
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
        ...data.map(
          d => max(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      ) < 0
    ? 0
    : Math.max(
        ...data.map(
          d => max(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      );

  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
        ...data.map(
          d => min(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      ) >= 0
    ? 0
    : Math.min(
        ...data.map(
          d => min(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      );

  const y = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([graphHeight, 0])
    .nice();

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const x = scaleBand()
    .domain(barOrder)
    .range([
      0,
      maxBarThickness
        ? Math.min(graphWidth, maxBarThickness * barOrder.length)
        : graphWidth,
    ])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].size.map((_d, i) => `${i}`))
    .range([0, x.bandwidth()])
    .paddingInner(0.1);
  const yTicks = y.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Axis
            y1={y(xMinValue < 0 ? 0 : xMinValue)}
            y2={y(xMinValue < 0 ? 0 : xMinValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              xMinValue < 0 ? 0 : xMinValue,
              prefix,
              suffix,
            )}
            labelPos={{
              x: 0 - leftMargin,
              y: xMaxValue < 0 ? -15 : y(xMinValue < 0 ? 0 : xMinValue) - 5,
            }}
            classNames={{
              axis: classNames?.xAxis?.axis,
              label: classNames?.yAxis?.labels,
            }}
            styles={{ axis: styles?.xAxis?.axis, label: styles?.yAxis?.labels }}
          />
          {showTicks ? (
            <YTicksAndGridLines
              values={yTicks.filter(d => d !== 0)}
              y={yTicks.filter(d => d !== 0).map(d => y(d))}
              x1={0 - leftMargin}
              x2={graphHeight + margin.bottom + margin.top}
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
          ) : null}
          <AxisTitle
            x={0 - leftMargin - 15}
            y={graphHeight / 2}
            style={styles?.yAxis?.title}
            className={classNames?.yAxis?.title}
            text={barAxisTitle}
            rotate90
          />
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(x(d.id)) ? (
              <g key={i} transform={`translate(${x(`${d.id}`)},0)`}>
                {d.size.map((el, j) => (
                  <g
                    className='undp-viz-g-with-hover'
                    key={j}
                    opacity={
                      selectedColor
                        ? barColors[j] === selectedColor
                          ? 1
                          : 0.3
                        : 0.85
                    }
                    onMouseEnter={(event: any) => {
                      setMouseOverData({ ...d, sizeIndex: j });
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      if (onSeriesMouseOver) {
                        onSeriesMouseOver({ ...d, sizeIndex: j });
                      }
                    }}
                    onMouseMove={(event: any) => {
                      setMouseOverData({ ...d, sizeIndex: j });
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
                          isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick?.(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
                          if (onSeriesMouseClick)
                            onSeriesMouseClick({ ...d, sizeIndex: j });
                        }
                      }
                    }}
                  >
                    {!checkIfNullOrUndefined(el) ? (
                      <rect
                        x={subBarScale(`${j}`)}
                        y={(el as number) > 0 ? y(el as number) : y(0)}
                        width={subBarScale.bandwidth()}
                        style={{
                          fill: barColors[j],
                        }}
                        height={Math.abs(y(el as number) - y(0))}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={
                          (subBarScale(`${j}`) as number) +
                          subBarScale.bandwidth() / 2
                        }
                        y={y(el || 0)}
                        style={{
                          fill: valueColor || barColors[j],
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-sm',
                          classNames?.graphObjectValues,
                        )}
                        dy={el ? (el >= 0 ? '-5px' : '15px') : '-5px'}
                      >
                        {numberFormattingFunction(el, prefix, suffix)}
                      </text>
                    ) : null}
                  </g>
                ))}
                {showLabels ? (
                  <XAxesLabels
                    value={
                      `${d.label}`.length < truncateBy
                        ? `${d.label}`
                        : `${`${d.label}`.substring(0, truncateBy)}...`
                    }
                    y={y(0) + 5}
                    x={x(`${d.id}`) as number}
                    width={x.bandwidth()}
                    height={margin.bottom}
                    style={styles?.xAxis?.labels}
                    className={classNames?.xAxis?.labels}
                    alignment='top'
                  />
                ) : null}
              </g>
            ) : null,
          )}
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <RefLineY
                  key={i}
                  text={el.text}
                  color={el.color}
                  y={y(el.value as number)}
                  x1={0 - leftMargin}
                  x2={graphWidth + margin.right}
                  classNames={el.classNames}
                  styles={el.styles}
                />
              ))}
            </>
          ) : null}
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
