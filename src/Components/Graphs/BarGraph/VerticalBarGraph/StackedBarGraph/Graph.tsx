import { scaleLinear, scaleBand } from 'd3-scale';
import sum from 'lodash.sum';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import {
  GroupedBarGraphDataType,
  ReferenceDataType,
} from '../../../../../Types';
import { Tooltip } from '../../../../Elements/Tooltip';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '../../../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: GroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  barPadding: number;
  showBarLabel: boolean;
  showTicks: boolean;
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  refValues?: ReferenceDataType[];
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    barPadding,
    showBarLabel,
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
  } = props;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
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
    : Math.max(...data.map(d => sum(d.size.filter(l => l !== undefined)) || 0));

  const y = scaleLinear().domain([0, xMaxValue]).range([graphHeight, 0]).nice();

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
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
              fontFamily:
                'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      fill: UNDPColorModule.grays['gray-500'],
                    }}
                  >
                    {numberFormattingFunction(d, '', '')}
                  </text>
                </g>
              ))
            : null}
          {data.map((d, i) => {
            return (
              <g
                className='undp-viz-low-opacity undp-viz-g-with-hover'
                key={i}
                transform={`translate(${x(`${i}`)},0)`}
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
                      if (onSeriesMouseClick) {
                        if (isEqual(mouseClickData, { ...d, sizeIndex: j })) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
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
                          fontSize: '1rem',
                          textAnchor: 'middle',
                          fontFamily:
                            'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        }}
                        dy={5}
                      >
                        {numberFormattingFunction(
                          el,
                          prefix || '',
                          suffix || '',
                        )}
                      </text>
                    ) : null}
                  </g>
                ))}
                {showBarLabel ? (
                  <text
                    x={x.bandwidth() / 2}
                    y={y(0)}
                    style={{
                      fill: UNDPColorModule.grays['gray-700'],
                      fontSize: '0.75rem',
                      textAnchor: 'middle',
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
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
                      fill: UNDPColorModule.grays['gray-700'],
                      fontSize: '1rem',
                      textAnchor: 'middle',
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                    }}
                    y={y(sum(d.size))}
                    x={x.bandwidth() / 2}
                    dy={-10}
                  >
                    {numberFormattingFunction(
                      sum(d.size.filter(element => element)),
                      prefix || '',
                      suffix || '',
                    )}
                  </text>
                ) : null}
              </g>
            );
          })}
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <g key={i}>
                  <line
                    style={{
                      stroke: el.color || UNDPColorModule.grays['gray-700'],
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
                    fontWeight='bold'
                    y={y(el.value as number)}
                    style={{
                      fill: el.color || UNDPColorModule.grays['gray-700'],
                      fontFamily:
                        'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                      textAnchor: 'end',
                    }}
                    fontSize={12}
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
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
        />
      ) : null}
    </>
  );
}
