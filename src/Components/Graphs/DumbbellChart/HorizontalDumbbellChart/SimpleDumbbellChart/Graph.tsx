import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { CSSObject, DumbbellChartDataType } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';
import { string2HTML } from '../../../../../Utils/string2HTML';
import { Modal } from '../../../../Elements/Modal';

interface Props {
  data: DumbbellChartDataType[];
  dotColors: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showValues: boolean;
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  radius: number;
  showLabels: boolean;
  selectedColor?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxPositionValue?: number;
  minPositionValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  arrowConnector: boolean;
  connectorStrokeWidth: number;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
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
    dotColors,
    suffix,
    prefix,
    barPadding,
    showValues,
    showTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    rightMargin,
    topMargin,
    bottomMargin,
    radius,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    selectedColor,
    arrowConnector,
    connectorStrokeWidth,
    rtl,
    language,
    mode,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    valueColor,
  } = props;
  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);

  const xMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(...data.map(d => max(d.x) || 0)) < 0
    ? 0
    : Math.max(...data.map(d => max(d.x) || 0));
  const xMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(...data.map(d => min(d.x) || 0)) > 0
    ? 0
    : Math.min(...data.map(d => min(d.x) || 0));

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const x = scaleLinear()
    .domain([xMinValue, xMaxValue])
    .range([0, graphWidth])
    .nice();
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([
      0,
      minBarThickness
        ? Math.max(graphHeight, minBarThickness * dataWithId.length)
        : maxBarThickness
        ? Math.min(graphHeight, maxBarThickness * dataWithId.length)
        : graphHeight,
    ])
    .paddingInner(barPadding);
  const xTicks = x.ticks(noOfTicks);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        {arrowConnector ? (
          <defs>
            <marker
              id='arrow'
              viewBox='0 0 10 10'
              refX='10'
              refY='5'
              markerWidth='6'
              markerHeight='6'
              orient='auto-start-reverse'
            >
              <path
                d='M 0 0 L 10 5 L 0 10 z'
                fill={UNDPColorModule[mode || 'light'].grays['gray-600']}
              />
            </marker>
          </defs>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {showTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={0 - topMargin}
                    y2={graphHeight + margin.bottom}
                    style={{
                      stroke:
                        UNDPColorModule[mode || 'light'].grays['gray-500'],
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    className={`opacity-${d === 0 ? 0 : 100}`}
                  />
                  <text
                    x={x(d)}
                    y={0 - topMargin}
                    textAnchor='start'
                    dy={10}
                    dx={3}
                    className={`${
                      rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                    } text-xs opacity-${d === 0 ? 0 : 100}`}
                    style={{
                      fill: UNDPColorModule[mode || 'light'].grays['gray-550'],
                    }}
                  >
                    {numberFormattingFunction(d, prefix, suffix)}
                  </text>
                </g>
              ))
            : null}
          {barAxisTitle ? (
            <text
              transform={`translate(${graphWidth / 2}, ${0 - margin.top})`}
              style={{
                fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
              }}
              textAnchor='middle'
              dy={15}
              className={`${
                rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
              } text-xs`}
            >
              {barAxisTitle}
            </text>
          ) : null}
          {data.map((d, i) => (
            <g
              className='undp-viz-low-opacity undp-viz-g-with-hover'
              key={i}
              transform={`translate(0,${
                (y(`${i}`) as number) + y.bandwidth() / 2
              })`}
            >
              {showLabels ? (
                <text
                  style={{
                    fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                    textAnchor: 'end',
                  }}
                  className={`${
                    rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                  } text-xs`}
                  x={0}
                  y={0}
                  dx={-10}
                  dy={4}
                >
                  {`${d.label}`.length < truncateBy
                    ? d.label
                    : `${`${d.label}`.substring(0, truncateBy)}...`}
                </text>
              ) : null}
              <line
                x1={0}
                x2={graphWidth}
                y1={0}
                y2={0}
                style={{
                  stroke: UNDPColorModule[mode || 'light'].grays['gray-400'],
                }}
                strokeWidth={1}
                strokeDasharray='4,8'
              />
              <line
                x1={x(min(d.x) as number) + radius}
                x2={x(max(d.x) as number) - radius}
                y1={0}
                y2={0}
                style={{
                  stroke: UNDPColorModule[mode || 'light'].grays['gray-600'],
                  strokeWidth: connectorStrokeWidth,
                }}
                opacity={selectedColor ? 0.3 : 1}
                markerEnd={
                  arrowConnector && d.x.indexOf(min(d.x) as number) === 0
                    ? 'url(#arrow)'
                    : ''
                }
                markerStart={
                  arrowConnector &&
                  d.x.indexOf(min(d.x) as number) === d.x.length - 1
                    ? 'url(#arrow)'
                    : ''
                }
              />
              {d.x.map((el, j) => (
                <g
                  key={j}
                  opacity={
                    selectedColor
                      ? dotColors[j] === selectedColor
                        ? 1
                        : 0.3
                      : 1
                  }
                  onMouseEnter={(event: any) => {
                    setMouseOverData({ ...d, xIndex: j });
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver({ ...d, xIndex: j });
                    }
                  }}
                  onClick={() => {
                    if (onSeriesMouseClick || detailsOnClick) {
                      if (
                        isEqual(mouseClickData, { ...d, xIndex: j }) &&
                        resetSelectionOnDoubleClick
                      ) {
                        setMouseClickData(undefined);
                        if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                      } else {
                        setMouseClickData({ ...d, xIndex: j });
                        if (onSeriesMouseClick)
                          onSeriesMouseClick({ ...d, xIndex: j });
                      }
                    }
                  }}
                  onMouseMove={(event: any) => {
                    setMouseOverData({ ...d, xIndex: j });
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
                  {checkIfNullOrUndefined(el) ? null : (
                    <>
                      <circle
                        cx={x(el || 0)}
                        cy={0}
                        r={radius}
                        opacity={checkIfNullOrUndefined(el) ? 0 : 1}
                        style={{
                          fill: dotColors[j],
                          fillOpacity: 0.85,
                          stroke: dotColors[j],
                          strokeWidth: 1,
                          opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                        }}
                      />
                      {showValues ? (
                        <text
                          x={x(el || 0)}
                          y={0}
                          style={{
                            fill: valueColor || dotColors[j],
                            textAnchor: 'middle',
                            opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                          }}
                          dx={0}
                          dy={0 - radius - 3}
                          className={`${
                            rtl ? `font-sans-${language || 'ar'}` : 'font-sans'
                          } text-sm font-bold`}
                        >
                          {numberFormattingFunction(el, prefix, suffix)}
                        </text>
                      ) : null}
                    </>
                  )}
                </g>
              ))}
            </g>
          ))}
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
