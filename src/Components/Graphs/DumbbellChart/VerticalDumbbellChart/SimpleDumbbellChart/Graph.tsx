import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { DumbbellChartDataType } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: DumbbellChartDataType[];
  dotColors: string[];
  barPadding: number;
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
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxPositionValue?: number;
  minPositionValue?: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  selectedColor?: string;
  onSeriesMouseClick?: (_d: any) => void;
  arrowConnector: boolean;
  connectorStrokeWidth: number;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
}

export function Graph(props: Props) {
  const {
    data,
    dotColors,
    barPadding,
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
    showValues,
    suffix,
    prefix,
    selectedColor,
    arrowConnector,
    connectorStrokeWidth,
    rtl,
    language,
  } = props;
  const margin = {
    top: topMargin,
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

  const yMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(...data.map(d => max(d.x) || 0)) < 0
    ? 0
    : Math.max(...data.map(d => max(d.x) || 0));
  const yMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(...data.map(d => min(d.x) || 0)) > 0
    ? 0
    : Math.min(...data.map(d => min(d.x) || 0));

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const y = scaleLinear()
    .domain([yMinValue, yMaxValue])
    .range([graphHeight, 0])
    .nice();
  const x = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([0, graphWidth])
    .paddingInner(barPadding);
  const yTicks = y.ticks(5);

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
                fill={UNDPColorModule.grays['gray-600']}
              />
            </marker>
          </defs>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line
            y1={y(0)}
            y2={y(0)}
            x1={0 - margin.left}
            x2={graphWidth + margin.right}
            style={{
              stroke: UNDPColorModule.grays['gray-700'],
            }}
            strokeWidth={1}
          />
          <text
            x={0 - margin.left + 2}
            y={y(0)}
            style={{
              fill: UNDPColorModule.grays['gray-700'],
              fontFamily: rtl
                ? language === 'he'
                  ? 'Noto Sans Hebrew, sans-serif'
                  : 'Noto Sans Arabic, sans-serif'
                : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
            }}
            textAnchor='start'
            fontSize={12}
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
                    x1={0 - margin.left}
                    x2={graphWidth + margin.right}
                    style={{
                      stroke: UNDPColorModule.grays['gray-500'],
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
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      fill: UNDPColorModule.grays['gray-500'],
                    }}
                  >
                    {numberFormattingFunction(d, '', '')}
                  </text>
                </g>
              ))
            : null}
          {data.map((d: DumbbellChartDataType, i) => (
            <g
              className='undp-viz-low-opacity undp-viz-g-with-hover'
              key={i}
              transform={`translate(${
                (x(`${i}`) as number) + x.bandwidth() / 2
              },0)`}
            >
              {showLabels ? (
                <text
                  style={{
                    fill: UNDPColorModule.grays['gray-700'],
                    fontSize: '0.75rem',
                    textAnchor: 'middle',
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                  x={0}
                  y={graphHeight}
                  dy='15px'
                >
                  {`${d.label}`.length < truncateBy
                    ? d.label
                    : `${`${d.label}`.substring(0, truncateBy)}...`}
                </text>
              ) : null}
              <line
                y1={y(min(d.x) as number) - radius}
                y2={y(max(d.x) as number) + radius}
                x1={0}
                x2={0}
                style={{
                  stroke: UNDPColorModule.grays['gray-600'],
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
                    if (onSeriesMouseClick) {
                      if (isEqual(mouseClickData, { ...d, xIndex: j })) {
                        setMouseClickData(undefined);
                        onSeriesMouseClick(undefined);
                      } else {
                        setMouseClickData({ ...d, xIndex: j });
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
                  <circle
                    cy={y(el || 0)}
                    cx={0}
                    r={radius}
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
                      y={y(el || 0)}
                      x={0}
                      style={{
                        fill: dotColors[j],
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        textAnchor: 'start',
                        opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      }}
                      dx={radius + 3}
                      dy={4.5}
                    >
                      {numberFormattingFunction(el, prefix || '', suffix || '')}
                    </text>
                  ) : null}
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
        />
      ) : null}
    </>
  );
}
