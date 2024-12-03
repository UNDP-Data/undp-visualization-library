import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import { Graph } from './Graph';
import { GraphHeader } from '../../Elements/GraphHeader';
import {
  BackgroundStyleDataType,
  NodesLinkDataType,
  SankeyDataType,
  SourcesDataType,
} from '../../../Types';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { GraphFooter } from '../../Elements/GraphFooter';
import { UNDPColorModule } from '../../ColorPalette';
import { generateRandomString } from '../../../Utils/generateRandomString';

interface Props {
  data: SankeyDataType[];
  sourceColors?: string[] | string;
  targetColors?: string[] | string;
  sourceColorDomain?: (string | number)[];
  targetColorDomain?: (string | number)[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  showLabels?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  fillContainer?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  nodePadding?: number;
  nodeWidth?: number;
  highlightedSourceDataPoints?: (string | number)[];
  highlightedTargetDataPoints?: (string | number)[];
  defaultLinkOpacity?: number;
  sourceTitle?: string;
  targetTitle?: string;
  animateLinks?: boolean | number;
  sortNodes?: 'asc' | 'desc' | 'mostReadable' | 'none';
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
}
export function SankeyChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    showLabels,
    leftMargin,
    rightMargin,
    truncateBy,
    height,
    width,
    footNote,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    relativeHeight,
    showValues,
    graphID,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    fillContainer,
    rtl,
    language,
    minHeight,
    mode,
    ariaLabel,
    sourceColors,
    targetColors,
    sourceColorDomain,
    targetColorDomain,
    nodePadding,
    nodeWidth,
    highlightedSourceDataPoints,
    highlightedTargetDataPoints,
    defaultLinkOpacity,
    sourceTitle,
    targetTitle,
    animateLinks,
    sortNodes,
    backgroundStyle,
    resetSelectionOnDoubleClick,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [sankeyData, setSankeyData] = useState<NodesLinkDataType | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sourceNodes = uniqBy(data, 'source').map(d => ({
      name: `source_${d.source}`,
      type: 'source' as const,
      label: `${d.source}`,
      color:
        typeof sourceColors === 'string' || !sourceColors
          ? sourceColors || UNDPColorModule[mode || 'light'].graphMainColor
          : sourceColors[
              (
                sourceColorDomain ||
                uniqBy(data, 'source').map(el => `${el.source}`)
              ).findIndex(el => `${el}` === `${d.source}`) > sourceColors.length
                ? sourceColors.length - 1
                : (
                    sourceColorDomain ||
                    uniqBy(data, 'source').map(el => `${el.source}`)
                  ).findIndex(el => `${el}` === `${d.source}`)
            ],
      totalValue: sum(
        data.filter(el => `${el.source}` === `${d.source}`).map(el => el.value),
      ),
    }));
    const sourceNodesSorted =
      sortNodes === 'asc'
        ? sortBy(sourceNodes, d => d.totalValue)
        : sortNodes === 'desc'
        ? sortBy(sourceNodes, d => d.totalValue).reverse()
        : sourceNodes;
    const targetNodes = uniqBy(data, 'target').map(d => ({
      name: `target_${d.target}`,
      type: 'target' as const,
      label: `${d.target}`,
      color:
        typeof targetColors === 'string' || !targetColors
          ? targetColors || UNDPColorModule[mode || 'light'].graphMainColor
          : targetColors[
              (
                targetColorDomain ||
                uniqBy(data, 'target').map(el => `${el.target}`)
              ).findIndex(el => `${el}` === `${d.target}`) > targetColors.length
                ? targetColors.length - 1
                : (
                    targetColorDomain ||
                    uniqBy(data, 'target').map(el => `${el.target}`)
                  ).findIndex(el => `${el}` === `${d.target}`)
            ],
      totalValue: sum(
        data.filter(el => `${el.target}` === `${d.target}`).map(el => el.value),
      ),
    }));
    const targetNodesSorted =
      sortNodes === 'asc'
        ? sortBy(targetNodes, d => d.totalValue)
        : sortNodes === 'desc'
        ? sortBy(targetNodes, d => d.totalValue).reverse()
        : targetNodes;

    const nodes = [...sourceNodesSorted, ...targetNodesSorted];
    setSankeyData({
      nodes,
      links: data.map(d => ({
        source: nodes.findIndex(el => el.name === `source_${d.source}`),
        target: nodes.findIndex(el => el.name === `target_${d.target}`),
        value: d.value,
        data: { ...d },
      })),
    });
  }, [data]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, width, height]);

  return (
    <div
      style={{
        ...(backgroundStyle || {}),
        display: 'flex',
        flexDirection: 'column',
        width: fillContainer === false ? 'fit-content' : '100%',
        height: 'inherit',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a sankey chart showing flow. ${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
    >
      <div
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {graphTitle || graphDescription || graphDownload || dataDownload ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
                  : null
              }
              mode={mode || 'light'}
            />
          ) : null}
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
            }}
          >
            <div
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                lineHeight: 0,
              }}
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) && sankeyData ? (
                <Graph
                  data={sankeyData}
                  width={width || svgWidth}
                  nodePadding={
                    checkIfNullOrUndefined(nodePadding)
                      ? 5
                      : (nodePadding as number)
                  }
                  nodeWidth={
                    checkIfNullOrUndefined(nodeWidth)
                      ? 5
                      : (nodeWidth as number)
                  }
                  height={Math.max(
                    minHeight || 0,
                    height ||
                      (relativeHeight
                        ? minHeight
                          ? (width || svgWidth) * relativeHeight > minHeight
                            ? (width || svgWidth) * relativeHeight
                            : minHeight
                          : (width || svgWidth) * relativeHeight
                        : svgHeight),
                  )}
                  showLabels={
                    checkIfNullOrUndefined(showLabels)
                      ? true
                      : (showLabels as boolean)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 75
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 75
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 30
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 10
                      : (bottomMargin as number)
                  }
                  truncateBy={
                    checkIfNullOrUndefined(truncateBy)
                      ? 999
                      : (truncateBy as number)
                  }
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showValues={showValues}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  onSeriesMouseClick={onSeriesMouseClick}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  mode={mode || 'light'}
                  id={generateRandomString(8)}
                  highlightedSourceDataPoints={(
                    highlightedSourceDataPoints || []
                  ).map(d => `${d}`)}
                  highlightedTargetDataPoints={(
                    highlightedTargetDataPoints || []
                  ).map(d => `${d}`)}
                  defaultLinkOpacity={defaultLinkOpacity || 0.3}
                  sourceTitle={sourceTitle}
                  targetTitle={targetTitle}
                  animateLinks={animateLinks}
                  sortNodes={sortNodes || 'mostReadable'}
                  resetSelectionOnDoubleClick={
                    checkIfNullOrUndefined(resetSelectionOnDoubleClick)
                      ? true
                      : (resetSelectionOnDoubleClick as boolean)
                  }
                />
              ) : null}
            </div>
          </div>
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
