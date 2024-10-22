import { useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleBand, scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import isEqual from 'lodash.isequal';
import { ParetoChartDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { UNDPColorModule } from '../../ColorPalette';

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
  sameAxes?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  barPadding: number;
  truncateBy: number;
  showLabels: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
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
    rtl,
    language,
    mode,
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
    .defined((d: any) => d.line !== undefined && d.line !== null)
    .x((d: any) => (x(d.id) as number) + x.bandwidth() / 2)
    .y((d: any) => y2(d.line))
    .curve(curveMonotoneX);
  const y1Ticks = y1.ticks(5);
  const y2Ticks = y2.ticks(5);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
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
                  stroke={barColor}
                  strokeWidth={1}
                />
                <text
                  x={-25}
                  y={y1(d)}
                  fill={barColor}
                  textAnchor='end'
                  fontSize={12}
                  dy={3}
                  style={{
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                >
                  {numberFormattingFunction(d, '', '')}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={-15}
              x2={-15}
              stroke={barColor}
              strokeWidth={1}
            />
            <text
              className='undp-viz-label-text'
              transform={`translate(-60, ${graphHeight / 2}) rotate(-90)`}
              fill={barColor}
              textAnchor='middle'
              fontSize={12}
              style={{
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
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
                  stroke={lineColor}
                  strokeWidth={1}
                />
                <text
                  x={graphWidth + 25}
                  y={y2(d)}
                  fill={lineColor}
                  textAnchor='start'
                  fontSize={12}
                  dy={3}
                  dx={-2}
                  style={{
                    fontFamily: rtl
                      ? language === 'he'
                        ? 'Noto Sans Hebrew, sans-serif'
                        : 'Noto Sans Arabic, sans-serif'
                      : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  }}
                >
                  {numberFormattingFunction(d, '', '')}
                </text>
              </g>
            ))}
            <line
              y1={0}
              y2={graphHeight}
              x1={graphWidth + 15}
              x2={graphWidth + 15}
              stroke={lineColor}
              strokeWidth={1}
            />
            <text
              className='undp-viz-label-text'
              transform={`translate(${graphWidth + 65}, ${
                graphHeight / 2
              }) rotate(-90)`}
              fill={lineColor}
              textAnchor='middle'
              fontSize={12}
              style={{
                fontFamily: rtl
                  ? language === 'he'
                    ? 'Noto Sans Hebrew, sans-serif'
                    : 'Noto Sans Arabic, sans-serif'
                  : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              }}
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
              style={{
                stroke: UNDPColorModule[mode || 'light'].grays['gray-500'],
              }}
              strokeWidth={1}
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
                      fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
                      fontSize: '0.75rem',
                      textAnchor: 'middle',
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    dy='15px'
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
            fill='none'
            style={{
              stroke: lineColor,
            }}
            strokeWidth={2}
          />
          {dataWithId.map((d, i) => (
            <g key={i}>
              {d.line !== undefined ? (
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
                    cy={y2(d.line)}
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
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          mode={mode}
        />
      ) : null}
    </>
  );
}
