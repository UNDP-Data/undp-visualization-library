 
import { memo, useCallback, useMemo, useEffect, useState } from 'react';
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
import { extent } from 'd3-array';
import { cn, Modal, Spinner } from '@undp/design-system-react';

import { ClassNameObject, StyleObject, TreeMapDataType } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { Colors } from '@/Components/ColorPalette';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { string2HTML } from '@/Utils/string2HTML';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  theme: 'light' | 'dark';
  maxRadiusValue?: number;
  radius: number;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
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
    maxRadiusValue,
    radius,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [viewPortDimensions, setViewPortDimensions] = useState<
    [number, number, number, number] | undefined
  >(undefined);
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
      data.filter(d => !checkIfNullOrUndefined(d.size)).length === 0
        ? data
        : orderBy(
          data.filter(d => !checkIfNullOrUndefined(d.size)),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const simulation = forceSimulation(dataTemp as any)
        .force('y', forceY(_d => graphHeight / 2).strength(1))
        .force('x', forceX(_d => graphWidth / 2).strength(1))
        .force(
          'collide',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          const xMinExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d =>
                d.x - (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[0] || 0;
          const yMinExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d =>
                d.y - (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[0] || 0;
          const xMaxExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d =>
                d.x + (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[1] || 0;
          const yMaxExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d =>
                d.y + (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[1] || 0;
          setViewPortDimensions([
            xMinExtent,
            yMinExtent,
            xMinExtent < 0 ? xMaxExtent - xMinExtent : xMaxExtent,
            yMinExtent < 0 ? yMaxExtent - yMinExtent : yMaxExtent,
          ]);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = useCallback((event: any, d: any) => {
    setMouseOverData(d);
    setEventY(event.clientY);
    setEventX(event.clientX);
  }, []);

  const handleClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any) => {
      if (onSeriesMouseClick || detailsOnClick) {
        if (mouseClickData === d.label && resetSelectionOnDoubleClick) {
          setMouseClickData(undefined);
          onSeriesMouseClick?.(undefined);
        } else {
          setMouseClickData(d.label);
          onSeriesMouseClick?.(d);
        }
      }
    },
    [onSeriesMouseClick, detailsOnClick, mouseClickData, resetSelectionOnDoubleClick],
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any) =>
      data.filter(el => el.color).length === 0
        ? colors[0]
        : !d.color
          ? Colors.gray
          : colors[colorDomain.indexOf(d.color)],
    [data, colors, colorDomain],
  );

  const getOpacity = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <div className='flex m-auto items-center justify-center p-0 leading-none text-base h-40'>
          <Spinner />
        </div>
      </div>
    );
  }
  if (viewPortDimensions) {
    return (
      <>
        <svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`${viewPortDimensions[0] > 0 ? 0 : viewPortDimensions[0]} ${
            viewPortDimensions[1] > 0 ? 0 : viewPortDimensions[1]
          } ${width < viewPortDimensions[2] ? viewPortDimensions[2] : width} ${
            height < viewPortDimensions[3] ? viewPortDimensions[3] : height
          }`}
          direction='ltr'
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
                      <div className='flex flex-col justify-center items-center h-full py-0 px-3'>
                        {showLabels && (
                          <p
                            className={cn(
                              'text-center leading-tight overflow-hidden m-0 circle-packing-label',
                              classNames?.graphObjectValues,
                            )}
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
                              WebkitLineClamp:
                                bubbleRadius * 2 < 60
                                  ? 1
                                  : bubbleRadius * 2 < 75
                                    ? 2
                                    : bubbleRadius * 2 < 100
                                      ? 3
                                      : undefined,
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              color: getTextColorBasedOnBgColor(circleColor),
                              hyphens: 'auto',
                              ...(styles?.graphObjectValues || {}),
                            }}
                          >
                            {d.label}
                          </p>
                        )}
                        {showValues && (
                          <p
                            className='text-center font-bold leading-tight w-full m-0 circle-packing-value'
                            style={{
                              fontSize: `${Math.min(
                                Math.max(Math.round(bubbleRadius / 4), 14),
                                14,
                              )}px`,
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
            data={mouseOverData}
            body={tooltip}
            xPos={eventX}
            yPos={eventY}
            backgroundStyle={styles?.tooltip}
            className={classNames?.tooltip}
          />
        )}
        {detailsOnClick ? (
          <Modal
            open={mouseClickData !== undefined}
            onClose={() => {
              setMouseClickData(undefined);
            }}
          >
            <div
              className='graph-modal-content m-0'
              dangerouslySetInnerHTML={{ __html: string2HTML(detailsOnClick, mouseClickData) }}
            />
          </Modal>
        ) : null}
      </>
    );
  }
  return null;
});

Graph.displayName = 'BubbleChart';
