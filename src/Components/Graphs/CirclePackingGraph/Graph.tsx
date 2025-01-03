import React, { memo, useCallback, useMemo, useEffect, useState } from 'react';

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

// Assuming these are imported from correct paths
import { CSSObject, TreeMapDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../ColorPalette';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { string2HTML } from '../../../Utils/string2HTML';
import { Modal } from '../../Elements/Modal';

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
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
}

interface TreeMapDataTypeForBubbleChart extends TreeMapDataType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const Graph = memo((props: Props) => {
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
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
  } = props;

  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const [finalData, setFinalData] = useState<
    TreeMapDataTypeForBubbleChart[] | null
  >(null);

  // Memoize expensive calculations
  const margin = useMemo(
    () => ({
      top: topMargin,
      bottom: bottomMargin,
      left: leftMargin,
      right: rightMargin,
    }),
    [topMargin, bottomMargin, leftMargin, rightMargin],
  );

  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  // Memoize data ordering and radius scale
  const dataOrdered = useMemo(
    () =>
      data.filter(d => d.size !== undefined).length === 0
        ? data
        : orderBy(
            data.filter(d => d.size !== undefined),
            'radius',
            'asc',
          ),
    [data],
  );

  const radiusScale = useMemo(() => {
    return data.filter(d => d.size === undefined).length !== data.length
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
  }, [data, maxRadiusValue, radius]);

  // Memoize simulation setup
  useEffect(() => {
    const setupSimulation = () => {
      const dataTemp = [...dataOrdered];
      const simulation = forceSimulation(dataTemp as any)
        .force('y', forceY(_d => graphHeight / 2).strength(1))
        .force('x', forceX(_d => graphWidth / 2).strength(1))
        .force(
          'collide',
          forceCollide((d: any) =>
            radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1,
          ),
        )
        .force('charge', forceManyBody().strength(-15))
        .alphaDecay(0.05)
        .tick(10000);

      simulation
        .on('tick', () => {
          setFinalData(dataTemp as TreeMapDataTypeForBubbleChart[]);
        })
        .on('end', () => {
          setFinalData(dataTemp as TreeMapDataTypeForBubbleChart[]);
        });
    };

    setupSimulation();
  }, [
    data,
    radius,
    graphHeight,
    graphWidth,
    maxRadiusValue,
    dataOrdered,
    radiusScale,
  ]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback(
    (event: any, d: any) => {
      setMouseOverData(d);
      setEventY(event.clientY);
      setEventX(event.clientX);
      if (onSeriesMouseOver) {
        onSeriesMouseOver(d);
      }
    },
    [onSeriesMouseOver],
  );

  const handleMouseMove = useCallback((event: any, d: any) => {
    setMouseOverData(d);
    setEventY(event.clientY);
    setEventX(event.clientX);
  }, []);

  const handleClick = useCallback(
    (d: any) => {
      if (onSeriesMouseClick || detailsOnClick) {
        if (mouseClickData === d.label && resetSelectionOnDoubleClick) {
          setMouseClickData(undefined);
          if (onSeriesMouseClick) onSeriesMouseClick(undefined);
        } else {
          setMouseClickData(d.label);
          if (onSeriesMouseClick) onSeriesMouseClick(d);
        }
      }
    },
    [onSeriesMouseClick, mouseClickData, resetSelectionOnDoubleClick],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseOverData(undefined);
    setEventX(undefined);
    setEventY(undefined);
    if (onSeriesMouseOver) {
      onSeriesMouseOver(undefined);
    }
  }, [onSeriesMouseOver]);

  // Memoize color and opacity calculations
  const getCircleColor = useCallback(
    (d: any) =>
      data.filter(el => el.color).length === 0
        ? colors[0]
        : !d.color
        ? UNDPColorModule[mode || 'light'].graphGray
        : colors[colorDomain.indexOf(d.color)],
    [data, colors, mode, colorDomain],
  );

  const getOpacity = useCallback(
    (d: any) =>
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
        : 0.85,
    [selectedColor, colors, colorDomain, highlightedDataPoints],
  );

  // Render loading state
  if (!finalData) {
    return (
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
    );
  }

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {finalData.map((d, i) => {
            const circleColor = getCircleColor(d);
            const opacity = getOpacity(d);
            const bubbleRadius = radiusScale
              ? radiusScale(d.size || 0)
              : radius;
            const showLabel = bubbleRadius > 20 && (showLabels || showValues);

            return (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={opacity}
                transform={`translate(${d.x},${d.y})`}
                onMouseEnter={event => handleMouseEnter(event, d)}
                onMouseMove={event => handleMouseMove(event, d)}
                onClick={() => handleClick(d)}
                onMouseLeave={handleMouseLeave}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={bubbleRadius}
                  style={{ fill: circleColor }}
                />
                {showLabel && (
                  <foreignObject
                    y={0 - bubbleRadius}
                    x={0 - bubbleRadius}
                    width={2 * bubbleRadius}
                    height={2 * bubbleRadius}
                  >
                    <div
                      style={{
                        color: getTextColorBasedOnBgColor(circleColor),
                        fontFamily: rtl
                          ? language === 'he'
                            ? 'Noto Sans Hebrew, sans-serif'
                            : 'Noto Sans Arabic, sans-serif'
                          : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        padding: '0 0.75rem',
                      }}
                    >
                      {showLabels && (
                        <p
                          className={`${
                            rtl
                              ? `undp-viz-typography-${language || 'ar'} `
                              : ''
                          }undp-viz-typography`}
                          style={{
                            fontSize: `${Math.min(
                              Math.max(Math.round(bubbleRadius / 4), 12),
                              Math.max(
                                Math.round(
                                  (bubbleRadius * 12) / `${d.label}`.length,
                                ),
                                12,
                              ),
                              14,
                            )}px`,
                            marginBottom: 0,
                            textAlign: 'center',
                            lineHeight: '1.25',
                            WebkitLineClamp:
                              bubbleRadius * 2 < 60
                                ? 1
                                : bubbleRadius * 2 < 75
                                ? 2
                                : bubbleRadius * 2 < 100
                                ? 3
                                : undefined,
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            color: getTextColorBasedOnBgColor(circleColor),
                            hyphens: 'auto',
                          }}
                        >
                          {d.label}
                        </p>
                      )}
                      {showValues && (
                        <p
                          className='undp-viz-typography'
                          style={{
                            fontSize: `${Math.min(
                              Math.max(Math.round(bubbleRadius / 4), 14),
                              14,
                            )}px`,
                            width: '100%',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            marginBottom: 0,
                            color: getTextColorBasedOnBgColor(circleColor),
                          }}
                        >
                          {numberFormattingFunction(d.size, prefix, suffix)}
                        </p>
                      )}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY && (
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
      )}
      {detailsOnClick ? (
        <Modal
          isOpen={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            style={{ margin: 0 }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: string2HTML(detailsOnClick, mouseClickData),
            }}
          />
        </Modal>
      ) : null}
    </>
  );
});

Graph.displayName = 'BubbleChart';
