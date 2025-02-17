import { useEffect, useState } from 'react';
import isEqual from 'lodash.isequal';
import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey';
import { useAnimate, useInView } from 'framer-motion';
import { CSSObject, NodeDataType, NodesLinkDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../Elements/Tooltip';
import { UNDPColorModule } from '../../ColorPalette';
import { string2HTML } from '../../../Utils/string2HTML';
import { Modal } from '../../Elements/Modal';

interface Props {
  data: NodesLinkDataType;
  showLabels: boolean;
  leftMargin: number;
  truncateBy: number;
  defaultLinkOpacity: number;
  width: number;
  height: number;
  nodePadding: number;
  nodeWidth: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
  id: string;
  highlightedSourceDataPoints: string[];
  highlightedTargetDataPoints: string[];
  sourceTitle?: string;
  targetTitle?: string;
  animateLinks?: boolean | number;
  sortNodes: 'asc' | 'desc' | 'mostReadable' | 'none';
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
}

export function Graph(props: Props) {
  const {
    data,
    showLabels,
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
    onSeriesMouseClick,
    rtl,
    language,
    mode,
    nodePadding,
    nodeWidth,
    id,
    highlightedSourceDataPoints,
    highlightedTargetDataPoints,
    defaultLinkOpacity,
    sourceTitle,
    targetTitle,
    animateLinks,
    sortNodes,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
  } = props;
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView && data) {
      animate(
        'path',
        { pathLength: [0, 1] },
        {
          duration: animateLinks === true ? 5 : animateLinks || 0,
        },
      );
    }
  }, [isInView, data]);
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [selectedNode, setSelectedNode] = useState<any>(undefined);
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
  const sankeyGenerator =
    sortNodes === 'mostReadable'
      ? sankey()
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .size([graphWidth, graphHeight])
          .nodeAlign(sankeyCenter)
      : sortNodes === 'none'
      ? sankey()
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .size([graphWidth, graphHeight])
          .nodeAlign(sankeyCenter)
          .nodeSort(() => null)
          .linkSort(() => null)
      : sankey()
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .size([graphWidth, graphHeight])
          .nodeAlign(sankeyCenter)
          .nodeSort(
            sortNodes === 'desc'
              ? (a, b) => (b.value || 0) - (a.value || 0)
              : (a, b) => (a.value || 0) - (b.value || 0),
          );
  const { nodes, links } = sankeyGenerator(data as any);
  const linkPathGenerator = sankeyLinkHorizontal();
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      >
        {sourceTitle ? (
          <text
            x={margin.left}
            y={margin.top - 10}
            style={{
              fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
              fontFamily: rtl
                ? language === 'he'
                  ? 'Noto Sans Hebrew, sans-serif'
                  : 'Noto Sans Arabic, sans-serif'
                : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              textAnchor: 'start',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {sourceTitle}
          </text>
        ) : null}
        {targetTitle ? (
          <text
            x={width - margin.right}
            y={margin.top - 10}
            style={{
              fill: UNDPColorModule[mode || 'light'].grays['gray-700'],
              fontFamily: rtl
                ? language === 'he'
                  ? 'Noto Sans Hebrew, sans-serif'
                  : 'Noto Sans Arabic, sans-serif'
                : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
              textAnchor: 'end',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {targetTitle}
          </text>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {nodes
            .filter((d: any) => d.type === 'source')
            .map((d, i) => (
              <g
                key={i}
                onMouseEnter={() => {
                  setSelectedNode(d);
                }}
                onMouseLeave={() => {
                  setSelectedNode(undefined);
                }}
              >
                <g transform={`translate(${d.x0},${d.y0})`}>
                  <rect
                    x={0}
                    y={0}
                    width={(d.x1 || 0) - (d.x0 || 0)}
                    height={(d.y1 || 0) - (d.y0 || 0)}
                    style={{
                      fill: (d as NodeDataType).color,
                    }}
                  />
                  {showLabels || showValues ? (
                    <foreignObject
                      y={0 - nodePadding / 2}
                      x={0 - leftMargin}
                      width={leftMargin}
                      height={(d.y1 || 0) - (d.y0 || 0) + nodePadding}
                    >
                      <div
                        style={{
                          color: (d as NodeDataType).color,
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
                          height: `${
                            (d.y1 || 0) - (d.y0 || 0) + nodePadding
                          }px`,
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
                              fontSize: '14px',
                              hyphens: 'auto',
                              marginBottom: showValues ? '0.5rem' : 0,
                              textAlign: 'right',
                              lineHeight: '1',
                              color: (d as NodeDataType).color,
                            }}
                          >
                            {`${(d as NodeDataType).label}`.length < truncateBy
                              ? `${(d as NodeDataType).label}`
                              : `${`${(d as NodeDataType).label}`.substring(
                                  0,
                                  truncateBy,
                                )}...`}
                          </p>
                        ) : null}
                        {showValues ? (
                          <p
                            className={`${
                              rtl
                                ? `undp-viz-typography-${language || 'ar'} `
                                : ''
                            }undp-viz-typography`}
                            style={{
                              fontSize: '14px',
                              hyphens: 'auto',
                              marginBottom: 0,
                              textAlign: 'right',
                              fontWeight: 'bold',
                              lineHeight: '1',
                              color: (d as any).color,
                            }}
                          >
                            {numberFormattingFunction(d.value, prefix, suffix)}
                          </p>
                        ) : null}
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              </g>
            ))}
          {nodes
            .filter((d: any) => d.type === 'target')
            .map((d, i) => (
              <g
                key={i}
                onMouseEnter={() => {
                  setSelectedNode(d);
                }}
                onMouseLeave={() => {
                  setSelectedNode(undefined);
                }}
              >
                <g transform={`translate(${d.x0},${d.y0})`}>
                  <rect
                    x={0}
                    y={0}
                    width={(d.x1 || 0) - (d.x0 || 0)}
                    height={(d.y1 || 0) - (d.y0 || 0)}
                    style={{
                      fill: (d as NodeDataType).color,
                    }}
                  />
                  {showLabels || showValues ? (
                    <foreignObject
                      y={0 - nodePadding / 2}
                      x={nodeWidth}
                      width={rightMargin - nodeWidth}
                      height={(d.y1 || 0) - (d.y0 || 0) + nodePadding}
                    >
                      <div
                        style={{
                          color: (d as any).color,
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
                          height: `${
                            (d.y1 || 0) - (d.y0 || 0) + nodePadding
                          }px`,
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
                              fontSize: '14px',
                              hyphens: 'auto',
                              marginBottom: showValues ? '0.5rem' : 0,
                              textAlign: 'left',
                              lineHeight: '1',
                              color: (d as any).color,
                            }}
                          >
                            {`${(d as NodeDataType).label}`.length < truncateBy
                              ? `${(d as NodeDataType).label}`
                              : `${`${(d as NodeDataType).label}`.substring(
                                  0,
                                  truncateBy,
                                )}...`}
                          </p>
                        ) : null}
                        {showValues ? (
                          <p
                            className={`${
                              rtl
                                ? `undp-viz-typography-${language || 'ar'} `
                                : ''
                            }undp-viz-typography`}
                            style={{
                              fontSize: '14px',
                              hyphens: 'auto',
                              marginBottom: 0,
                              textAlign: 'left',
                              fontWeight: 'bold',
                              lineHeight: '1',
                              color: (d as NodeDataType).color,
                            }}
                          >
                            {numberFormattingFunction(d.value, prefix, suffix)}
                          </p>
                        ) : null}
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              </g>
            ))}
          <defs>
            {links.map((d, i) => (
              <linearGradient
                id={`${id}-gradient-${i}`}
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
                key={i}
                gradientUnits='userSpaceOnUse'
              >
                <stop
                  offset='0%'
                  style={{
                    stopColor: (d.source as NodeDataType).color,
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset='100%'
                  style={{
                    stopColor: (d.target as NodeDataType).color,
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            ))}
          </defs>
          <g ref={scope}>
            {links.map((d, i) => (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                onMouseEnter={(event: any) => {
                  setMouseOverData((d as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver((d as any).data);
                  }
                }}
                onMouseMove={(event: any) => {
                  setMouseOverData((d as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onClick={() => {
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (
                      isEqual(mouseClickData, (d as any).data) &&
                      resetSelectionOnDoubleClick
                    ) {
                      setMouseClickData(undefined);
                      if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData((d as any).data);
                      if (onSeriesMouseClick)
                        onSeriesMouseClick((d as any).data);
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
                opacity={
                  selectedNode
                    ? (d.source as any).name === selectedNode.name ||
                      (d.target as any).name === selectedNode.name
                      ? 0.85
                      : defaultLinkOpacity
                    : highlightedSourceDataPoints.length !== 0 ||
                      highlightedTargetDataPoints.length !== 0
                    ? highlightedSourceDataPoints.indexOf(
                        (d.source as any).label,
                      ) !== -1 ||
                      highlightedTargetDataPoints.indexOf(
                        (d.target as any).label,
                      ) !== -1
                      ? 0.85
                      : defaultLinkOpacity
                    : defaultLinkOpacity
                }
              >
                <path
                  d={linkPathGenerator(d) || ''}
                  style={{
                    stroke: `url(#${id}-gradient-${i})`,
                    strokeWidth: d.width,
                    fill: 'none',
                  }}
                />
              </g>
            ))}
          </g>
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
}
