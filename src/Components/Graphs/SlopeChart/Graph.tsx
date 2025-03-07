import { useState } from 'react';
import maxBy from 'lodash.maxby';
import { scaleLinear } from 'd3-scale';
import minBy from 'lodash.minby';
import isEqual from 'lodash.isequal';
import { Modal } from '@undp-data/undp-design-system-react';
import { CSSObject, SlopeChartDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../ColorPalette';
import { string2HTML } from '../../../Utils/string2HTML';

interface Props {
  data: SlopeChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  radius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  axisTitle: [string, string];
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    showLabels,
    colors,
    colorDomain,
    radius,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    axisTitle,
    highlightedDataPoints,
    selectedColor,
    minValue,
    maxValue,
    onSeriesMouseClick,
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
  const minY = Math.min(
    minBy(data, 'y1')?.y1 as number,
    minBy(data, 'y2')?.y2 as number,
  );
  const maxY = Math.max(
    maxBy(data, 'y1')?.y1 as number,
    maxBy(data, 'y2')?.y2 as number,
  );
  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue)
        ? minY > 0
          ? 0
          : minY
        : (minValue as number),
      checkIfNullOrUndefined(maxValue)
        ? maxY > 0
          ? maxY
          : 0
        : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        className='mx-auto'
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            <line
              y1={0}
              y2={graphHeight}
              x1={radius + 5}
              x2={radius + 5}
              className='stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-550'
            />
            <text
              x={radius + 5}
              y={graphHeight}
              style={{
                textAnchor: 'middle',
              }}
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
              dy={15}
            >
              {axisTitle[0]}
            </text>
          </g>
          <g>
            <line
              y1={0}
              y2={graphHeight}
              x1={graphWidth - (radius + 5)}
              x2={graphWidth - (radius + 5)}
              className='stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-550'
            />
            <text
              x={graphWidth - (radius + 5)}
              y={graphHeight}
              style={{
                textAnchor: 'middle',
              }}
              className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
              dy={15}
            >
              {axisTitle[1]}
            </text>
          </g>
          {data.map((d, i) => {
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? colors[colorDomain.indexOf(`${d.color}`)] ===
                        selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : mouseOverData
                    ? mouseOverData.label === d.label
                      ? 1
                      : 0.3
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf(d.label) !== -1
                      ? 1
                      : 0.3
                    : 1
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={event => {
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
              >
                <circle
                  cx={radius + 5}
                  cy={y(d.y1)}
                  r={radius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    fillOpacity: 0.6,
                  }}
                />
                {showLabels ? (
                  <text
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule[mode].graphGray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                      textAnchor: 'end',
                    }}
                    className='text-[10px]'
                    y={y(d.y1)}
                    x={5}
                    dy={4}
                    dx={-3}
                  >
                    {d.label}
                  </text>
                ) : highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule[mode].graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        textAnchor: 'end',
                      }}
                      className='text-[10px]'
                      y={y(d.y1)}
                      x={5}
                      dy={4}
                      dx={-3}
                    >
                      {d.label}
                    </text>
                  ) : null
                ) : null}
                <circle
                  cx={graphWidth - (radius + 5)}
                  cy={y(d.y2)}
                  r={radius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    fillOpacity: 0.6,
                  }}
                />
                {showLabels ? (
                  <text
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule[mode].graphGray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                      textAnchor: 'start',
                    }}
                    className='text-[10px]'
                    y={y(d.y2)}
                    x={graphWidth - 5}
                    dy={4}
                    dx={3}
                  >
                    {d.label}
                  </text>
                ) : highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                            ? UNDPColorModule[mode].graphGray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                        textAnchor: 'start',
                      }}
                      className='text-[10px]'
                      y={y(d.y2)}
                      x={graphWidth - 5}
                      dy={4}
                      dx={3}
                    >
                      {d.label}
                    </text>
                  ) : null
                ) : null}
                <line
                  x1={radius + 5}
                  x2={graphWidth - (radius + 5)}
                  y1={y(d.y1)}
                  y2={y(d.y2)}
                  style={{
                    fill: 'none',
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                        ? UNDPColorModule[mode].graphGray
                        : colors[colorDomain.indexOf(`${d.color}`)],
                    strokeWidth: 1,
                  }}
                />
              </g>
            );
          })}
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
