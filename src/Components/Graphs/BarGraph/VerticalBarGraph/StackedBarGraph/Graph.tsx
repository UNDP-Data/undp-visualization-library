import { scaleLinear, scaleBand } from 'd3-scale';
import sum from 'lodash.sum';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import {
  CSSObject,
  GroupedBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '../../../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../../../ColorPalette';
import { string2HTML } from '../../../../../Utils/string2HTML';
import { Modal } from '../../../../Elements/Modal';

interface Props {
  data: GroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  barPadding: number;
  showLabels: boolean;
  showTicks: boolean;
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  refValues?: ReferenceDataType[];
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  labelOrder?: string[];
  mode: 'light' | 'dark';
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    barPadding,
    showLabels,
    showTicks,
    truncateBy,
    leftMargin,
    topMargin,
    bottomMargin,
    rightMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showValues,
    refValues,
    maxValue,
    onSeriesMouseClick,
    selectedColor,
    rtl,
    language,
    labelOrder,
    mode,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
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
          d => sum(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0,
        ),
      );

  const y = scaleLinear().domain([0, xMaxValue]).range([graphHeight, 0]).nice();
  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const allLabelInData = data.map(d => `${d.label}`);
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const x = scaleBand()
    .domain(barOrder)
    .range([
      0,
      minBarThickness
        ? Math.max(graphWidth, minBarThickness * barOrder.length)
        : maxBarThickness
        ? Math.min(graphWidth, maxBarThickness * barOrder.length)
        : graphWidth,
    ])
    .paddingInner(barPadding);
  const yTicks = y.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line
            y1={y(0)}
            y2={y(0)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            style={{
              stroke: UNDPColorModule[mode || 'light'].grays['gray-700'],
            }}
            strokeWidth={1}
          />
          <text
            x={0 - leftMargin + 2}
            y={y(0)}
            style={{
              fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
            }}
            textAnchor='start'
            className={`${
              rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
            } text-xs`}
            dy={-3}
          >
            0
          </text>
          {showTicks
            ? yTicks.map((d, i) => (
                <g key={i}>
                  <line
                    key={i}
                    y1={y(d)}
                    y2={y(d)}
                    x1={0 - leftMargin}
                    x2={graphWidth + margin.right}
                    style={{
                      stroke:
                        UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    className={`opacity-${d === 0 ? 0 : 100}`}
                  />
                  <text
                    x={0 - leftMargin + 2}
                    y={y(d)}
                    textAnchor='start'
                    dy={-3}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-550'],
                    }}
                    className={`${
                      rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                    } text-xs opacity-${d === 0 ? 0 : 100}`}
                  >
                    {numberFormattingFunction(d, prefix, suffix)}
                  </text>
                </g>
              ))
            : null}
          {barAxisTitle ? (
            <text
              transform={`translate(${0 - leftMargin - 15}, ${
                graphHeight / 2
              }) rotate(-90)`}
              style={{
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
              }}
              textAnchor='middle'
              className={`${
                rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
              } text-xs`}
            >
              {barAxisTitle}
            </text>
          ) : null}
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(x(d.id)) ? (
              <g
                className='undp-viz-low-opacity undp-viz-g-with-hover'
                key={i}
                transform={`translate(${x(`${d.id}`)},0)`}
              >
                {d.size.map((el, j) => (
                  <g
                    key={j}
                    opacity={
                      selectedColor
                        ? barColors[j] === selectedColor
                          ? 1
                          : 0.3
                        : 1
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
                          if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
                          if (onSeriesMouseClick)
                            onSeriesMouseClick({ ...d, sizeIndex: j });
                        }
                      }
                    }}
                  >
                    <rect
                      x={0}
                      y={y(
                        sum(d.size.filter((element, k) => k <= j && element)),
                      )}
                      width={x.bandwidth()}
                      style={{
                        fill: barColors[j],
                      }}
                      height={Math.abs(
                        y(
                          sum(d.size.filter((element, k) => k <= j && element)),
                        ) -
                          y(
                            sum(
                              d.size.filter((element, k) => k < j && element),
                            ),
                          ),
                      )}
                    />
                    {showValues &&
                    el &&
                    Math.abs(
                      y(sum(d.size.filter((element, k) => k <= j && element))) -
                        y(sum(d.size.filter((element, k) => k < j && element))),
                    ) > 20 ? (
                      <text
                        x={x.bandwidth() / 2}
                        y={
                          y(
                            sum(
                              d.size.filter((element, k) => k <= j && element),
                            ),
                          ) +
                          Math.abs(
                            y(
                              sum(
                                d.size.filter(
                                  (element, k) => k <= j && element,
                                ),
                              ),
                            ) -
                              y(
                                sum(
                                  d.size.filter(
                                    (element, k) => k < j && element,
                                  ),
                                ),
                              ),
                          ) /
                            2
                        }
                        style={{
                          fill: getTextColorBasedOnBgColor(barColors[j]),
                          textAnchor: 'middle',
                        }}
                        className={`${
                          rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                        } text-sm`}
                        dy={5}
                      >
                        {numberFormattingFunction(el, prefix, suffix)}
                      </text>
                    ) : null}
                  </g>
                ))}
                {showLabels ? (
                  <text
                    x={x.bandwidth() / 2}
                    y={y(0)}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      textAnchor: 'middle',
                    }}
                    className={`${
                      rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                    } text-xs`}
                    dy='15px'
                  >
                    {`${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </text>
                ) : null}
                {showValues ? (
                  <text
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      textAnchor: 'middle',
                    }}
                    y={y(sum(d.size.map(el => el || 0)))}
                    x={x.bandwidth() / 2}
                    dy={-10}
                    className={`${
                      rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                    } text-sm`}
                  >
                    {numberFormattingFunction(
                      sum(d.size.filter(element => element)),
                      prefix,
                      suffix,
                    )}
                  </text>
                ) : null}
              </g>
            ) : null,
          )}
          {labelOrder && (showLabels || showValues)
            ? labelOrder
                .filter(d => allLabelInData.indexOf(d) === -1)
                .map((d, i) =>
                  !checkIfNullOrUndefined(x(d)) ? (
                    <g className='undp-viz-g-with-hover' key={i}>
                      {showLabels ? (
                        <text
                          x={(x(`${d}`) as number) + x.bandwidth() / 2}
                          y={y(0)}
                          style={{
                            fill: UNDPColorModule[mode || 'light'].grays[
                              'gray-700'
                            ],
                            textAnchor: 'middle',
                          }}
                          dy='15px'
                          className={`${
                            rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                          } text-xs`}
                        >
                          {`${d}`.length < truncateBy
                            ? `${d}`
                            : `${`${d}`.substring(0, truncateBy)}...`}
                        </text>
                      ) : null}
                      {showValues ? (
                        <text
                          x={(x(`${d}`) as number) + x.bandwidth() / 2}
                          y={y(0)}
                          style={{
                            fill:
                              valueColor ||
                              UNDPColorModule[mode || 'light'].grays[
                                'gray-700'
                              ],
                            textAnchor: 'middle',
                          }}
                          className={`${
                            rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                          } text-sm`}
                          dy='-5px'
                        >
                          {numberFormattingFunction(0, prefix, suffix)}
                        </text>
                      ) : null}
                    </g>
                  ) : null,
                )
            : null}
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
                    y1={y(el.value as number)}
                    y2={y(el.value as number)}
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                  />
                  <text
                    x={graphWidth + margin.right}
                    y={y(el.value as number)}
                    style={{
                      fill:
                        el.color ||
                        UNDPColorModule[mode || 'light'].grays['gray-700'],
                      textAnchor: 'end',
                    }}
                    className={`${
                      rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                    } text-xs font-bold`}
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
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          rtl={rtl}
          language={language}
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
