import { scaleLinear, scaleBand, scaleOrdinal, scaleThreshold } from 'd3-scale';
import { useState } from 'react';
import uniqBy from 'lodash.uniqby';
import isEqual from 'lodash.isequal';
import { HeatMapDataType, ScaleDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { getTextColorBasedOnBgColor } from '../../../Utils/getTextColorBasedOnBgColor';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: HeatMapDataType[];
  domain: string[] | number[];
  colors: string[];
  noDataColor: string;
  scaleType: ScaleDataType;
  showColumnLabels: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin: number;
  topMargin: number;
  showRowLabels: boolean;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  selectedColor?: string;
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
}

export function Graph(props: Props) {
  const {
    data,
    showColumnLabels,
    leftMargin,
    rightMargin,
    truncateBy,
    width,
    height,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showValues,
    domain,
    colors,
    noDataColor,
    scaleType,
    showRowLabels,
    selectedColor,
    onSeriesMouseClick,
    rtl,
    language,
    mode,
  } = props;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [mouseOverData, setMouseOverData] = useState<
    HeatMapDataType | undefined
  >(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const columns = uniqBy(data, d => d.column).map(d => d.column);
  const rows = uniqBy(data, d => d.row).map(d => d.row);
  const y = scaleBand().domain(rows).range([0, graphHeight]);
  const barHeight = y.bandwidth();
  const x = scaleBand().domain(columns).range([0, graphWidth]);
  const barWidth = x.bandwidth();
  const colorScale =
    scaleType === 'categorical'
      ? scaleOrdinal<number | string, string>().domain(domain).range(colors)
      : scaleType === 'threshold'
      ? scaleThreshold<number, string>()
          .domain(domain as number[])
          .range(colors)
      : scaleLinear<string, string>()
          .domain(domain as number[])
          .range(colors);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        <g transform={`translate(${margin.left},${0})`}>
          {showColumnLabels
            ? columns.map((d, i) => (
                <foreignObject
                  key={i}
                  y={0}
                  x={x(d)}
                  width={barWidth}
                  height={margin.top}
                >
                  <div
                    className={`${
                      rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                    }undp-viz-typography`}
                    style={{
                      textAnchor: 'middle',
                      whiteSpace: 'normal',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 'inherit',
                      padding: '4px',
                    }}
                  >
                    <p
                      className={`${
                        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                      }undp-viz-typography`}
                      style={{
                        fontSize: '16px',
                        textAlign: 'center',
                        lineHeight: '1.15',
                        marginBottom: 0,
                        color:
                          UNDPColorModule[mode || 'light'].grays['gray-600'],
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      }}
                    >
                      {`${d}`.length < truncateBy
                        ? `${d}`
                        : `${`${d}`.substring(0, truncateBy)}...`}
                    </p>
                  </div>
                </foreignObject>
              ))
            : null}
        </g>
        <g transform={`translate(${0},${margin.top})`}>
          {showRowLabels
            ? rows.map((d, i) => (
                <foreignObject
                  key={i}
                  y={y(d)}
                  x={0}
                  width={margin.left}
                  height={barHeight}
                >
                  <div
                    style={{
                      fontFamily: rtl
                        ? language === 'he'
                          ? 'Noto Sans Hebrew, sans-serif'
                          : 'Noto Sans Arabic, sans-serif'
                        : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      textAnchor: 'middle',
                      whiteSpace: 'normal',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      height: 'inherit',
                      padding: '4px 8px 4px 4px',
                    }}
                  >
                    <p
                      className={`${
                        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                      }undp-viz-typography`}
                      style={{
                        fontSize: '16px',
                        textAlign: 'right',
                        lineHeight: '1.15',
                        marginBottom: 0,
                        color:
                          UNDPColorModule[mode || 'light'].grays['gray-600'],
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      }}
                    >
                      {`${d}`.length < truncateBy
                        ? `${d}`
                        : `${`${d}`.substring(0, truncateBy)}...`}
                    </p>
                  </div>
                </foreignObject>
              ))
            : null}
        </g>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {rows.map((d, i) => (
            <g key={i} transform={`translate(0,${y(d)})`}>
              {columns.map((el, j) => (
                <rect
                  key={j}
                  x={x(el)}
                  y={0}
                  width={barWidth}
                  height={barHeight}
                  fill={noDataColor}
                  strokeWidth={1}
                  stroke={UNDPColorModule[mode || 'light'].grays.white}
                />
              ))}
            </g>
          ))}
          {data
            .filter(d => !checkIfNullOrUndefined(d.value))
            .map((d, i) => {
              const color =
                d.value !== undefined
                  ? colorScale(d.value as any)
                  : noDataColor;
              return (
                <g
                  key={i}
                  transform={`translate(${x(d.column)},${y(d.row)})`}
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
                  opacity={
                    selectedColor ? (selectedColor === color ? 1 : 0.3) : 1
                  }
                >
                  <rect
                    x={0}
                    y={0}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    strokeWidth={1}
                    stroke={UNDPColorModule[mode || 'light'].grays.white}
                  />
                  {showValues && !checkIfNullOrUndefined(d.value) ? (
                    <foreignObject
                      key={i}
                      y={0}
                      x={0}
                      width={barWidth}
                      height={barHeight}
                    >
                      <div
                        style={{
                          fill: UNDPColorModule[mode || 'light'].grays[
                            'gray-600'
                          ],
                          fontFamily: rtl
                            ? language === 'he'
                              ? 'Noto Sans Hebrew, sans-serif'
                              : 'Noto Sans Arabic, sans-serif'
                            : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                          textAnchor: 'middle',
                          whiteSpace: 'normal',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 'inherit',
                          padding: '2px',
                        }}
                      >
                        <p
                          className='undp-viz-typography'
                          style={{
                            fontSize: `12px`,
                            textAlign: 'center',
                            lineHeight: '1.15',
                            marginBottom: 0,
                            color: getTextColorBasedOnBgColor(color),
                          }}
                        >
                          {typeof d.value === 'string'
                            ? `${prefix} ${d.value} ${suffix}`
                            : numberFormattingFunction(d.value, prefix, suffix)}
                        </p>
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              );
            })}
          {mouseOverData ? (
            <rect
              x={x(mouseOverData.column)}
              y={y(mouseOverData.row)}
              width={barWidth}
              height={barHeight}
              fill='none'
              fillOpacity={0}
              strokeWidth={1.5}
              stroke={UNDPColorModule[mode || 'light'].grays['gray-700']}
            />
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
        />
      ) : null}
    </>
  );
}
