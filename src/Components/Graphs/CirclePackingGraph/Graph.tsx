import { useEffect, useState } from 'react';
import {
  forceCollide,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import orderBy from 'lodash.orderby';
import { scaleSqrt } from 'd3-scale';
import maxBy from 'lodash.maxby';
import { TreeMapDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../ColorPalette';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabels: boolean;
  showValues: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  maxRadiusValue?: number;
  radius: number;
}
interface TreeMapDataTypeForBubbleChart extends TreeMapDataType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    leftMargin,
    width,
    height,
    colorDomain,
    selectedColor,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    showValues,
    suffix,
    prefix,
    highlightedDataPoints,
    onSeriesMouseClick,
    rtl,
    language,
    mode,
    maxRadiusValue,
    radius,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const [finalData, setFinalData] = useState<
    TreeMapDataTypeForBubbleChart[] | null
  >(null);

  const dataOrdered =
    data.filter(d => d.size !== undefined).length === 0
      ? data
      : orderBy(
          data.filter(d => d.size !== undefined),
          'radius',
          'asc',
        );
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const radiusScale =
    data.filter(d => d.size === undefined).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(maxRadiusValue)
              ? (maxBy(data, 'size')?.size as number)
              : (maxRadiusValue as number),
          ])
          .range([0.25, radius])
          .nice()
      : undefined;
  useEffect(() => {
    setFinalData(null);
    const dataTemp = [...dataOrdered];
    forceSimulation(dataTemp as any)
      .force('y', forceY(_d => graphHeight / 2).strength(1))
      .force('x', forceX(_d => graphWidth / 2).strength(1))
      .force(
        'collide',
        forceCollide((d: any) =>
          radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1,
        ),
      )
      .force('charge', forceManyBody().strength(-15))
      .on('end ', () => {
        setFinalData(dataTemp as TreeMapDataTypeForBubbleChart[]);
      });
  }, [data, radius, graphHeight, graphWidth]);
  return (
    <>
      {finalData ? (
        <svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {finalData.map((d, i) => {
              return (
                <g
                  className='undp-viz-g-with-hover'
                  key={i}
                  opacity={
                    selectedColor
                      ? d.color
                        ? colors[colorDomain.indexOf(d.color)] === selectedColor
                          ? 1
                          : 0.3
                        : 0.3
                      : highlightedDataPoints.length !== 0
                      ? highlightedDataPoints.indexOf(d.label) !== -1
                        ? 0.85
                        : 0.3
                      : 0.85
                  }
                  transform={`translate(${d.x},${d.y})`}
                  onMouseEnter={(event: any) => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(d);
                    }
                  }}
                  onMouseMove={(event: any) => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                  }}
                  onClick={() => {
                    if (onSeriesMouseClick) {
                      if (mouseClickData === d.label) {
                        setMouseClickData(undefined);
                        onSeriesMouseClick(undefined);
                      } else {
                        setMouseClickData(d.label);
                        onSeriesMouseClick(d);
                      }
                    }
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
                    key={i}
                    cx={0}
                    cy={0}
                    r={radiusScale ? radiusScale(d.size || 0) : radius}
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                          ? UNDPColorModule[mode || 'light'].graphGray
                          : colors[colorDomain.indexOf(d.color)],
                    }}
                  />
                  {(radiusScale ? radiusScale(d.size || 0) : radius) > 20 &&
                  (showLabels || showValues) ? (
                    <foreignObject
                      y={0 - (radiusScale ? radiusScale(d.size || 0) : radius)}
                      x={0 - (radiusScale ? radiusScale(d.size || 0) : radius)}
                      width={
                        2 * (radiusScale ? radiusScale(d.size || 0) : radius)
                      }
                      height={
                        2 * (radiusScale ? radiusScale(d.size || 0) : radius)
                      }
                    >
                      <div
                        style={{
                          color: getTextColorBasedOnBgColor(
                            data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                              ? UNDPColorModule[mode || 'light'].graphGray
                              : colors[colorDomain.indexOf(d.color)],
                          ),
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
                          alignItems: 'center',
                          height: 'inherit',
                          padding: '0 0.375rem',
                        }}
                      >
                        {showLabels ? (
                          <p
                            className={`${
                              rtl
                                ? `undp-viz-typography-${language || 'ar'} `
                                : ''
                            }undp-viz-typography`}
                            style={{
                              fontSize: `${Math.min(
                                Math.max(
                                  Math.round(
                                    (radiusScale
                                      ? radiusScale(d.size || 0)
                                      : radius) / 4,
                                  ),
                                  9,
                                ),
                                Math.max(
                                  Math.round(
                                    ((radiusScale
                                      ? radiusScale(d.size || 0)
                                      : radius) *
                                      12) /
                                      `${d.label}`.length,
                                  ),
                                  9,
                                ),
                                20,
                              )}px`,
                              marginBottom: 0,
                              textAlign: 'center',
                              lineHeight: '1',
                              color: getTextColorBasedOnBgColor(
                                data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                  ? UNDPColorModule[mode || 'light'].graphGray
                                  : colors[colorDomain.indexOf(d.color)],
                              ),
                              hyphens: 'auto',
                            }}
                          >
                            {d.label}
                          </p>
                        ) : null}
                        {showValues ? (
                          <p
                            className='undp-viz-typography'
                            style={{
                              fontSize: `${Math.min(
                                Math.max(
                                  Math.round(
                                    (radiusScale
                                      ? radiusScale(d.size || 0)
                                      : radius) / 4,
                                  ),
                                  9,
                                ),
                                20,
                              )}px`,
                              textAlign: 'center',
                              marginBottom: 0,
                              color: getTextColorBasedOnBgColor(
                                data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                  ? UNDPColorModule[mode || 'light'].graphGray
                                  : colors[colorDomain.indexOf(d.color)],
                              ),
                            }}
                          >
                            {numberFormattingFunction(
                              d.size,
                              prefix || '',
                              suffix || '',
                            )}
                          </p>
                        ) : null}
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              );
            })}
          </g>
        </svg>
      ) : (
        <div style={{ width: `${width}px`, height: `${height}px` }}>
          <div
            style={{
              display: 'flex',
              margin: 'auto',
              alignItems: 'center',
              justifyContent: 'center',
              height: '10rem',
              fontSize: '1rem',
              lineHeight: 1.4,
              padding: 0,
            }}
          >
            <div className='undp-viz-loader' />
          </div>
        </div>
      )}
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
