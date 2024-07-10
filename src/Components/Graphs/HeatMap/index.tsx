import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { GraphHeader } from '../../Elements/GraphHeader';
import { HeatMapDataType, ScaleDataType } from '../../../Types';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { GraphFooter } from '../../Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '../../Elements/ColorLegendWithMouseOver';
import { LinearColorLegend } from '../../Elements/LinearColorLegend';
import { ThresholdColorLegendWithMouseOver } from '../../Elements/ThresholdColorLegendWithMouseOver';

interface Props {
  data: HeatMapDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  scaleType?: ScaleDataType;
  domain: number[] | string[];
  showXTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  showYTicks?: boolean;
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  noDataColor?: string;
  showColorScale?: boolean;
}

export function HeatMap(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    showXTicks,
    leftMargin,
    rightMargin,
    truncateBy,
    height,
    width,
    scaleType,
    domain,
    footNote,
    colorLegendTitle,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showYTicks,
    relativeHeight,
    showValues,
    graphID,
    noDataColor,
    showColorScale,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);
  const scale =
    scaleType ||
    (typeof domain[0] === 'string'
      ? 'categorical'
      : domain.length === 2
      ? 'linear'
      : 'threshold');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-05)',
          width: '100%',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
          />
        ) : null}
        {showColorScale !== false ? (
          scale === 'categorical' ? (
            <div style={{ marginBottom: '-12px' }}>
              <ColorLegendWithMouseOver
                width={width}
                colorLegendTitle={colorLegendTitle}
                colors={
                  colors ||
                  (typeof domain[0] === 'string'
                    ? UNDPColorModule.categoricalColors.colors
                    : domain.length === 2
                    ? [
                        UNDPColorModule.sequentialColors.neutralColorsx09[0],
                        UNDPColorModule.sequentialColors.neutralColorsx09[8],
                      ]
                    : UNDPColorModule.sequentialColors[
                        `neutralColorsx0${
                          (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                        }`
                      ])
                }
                colorDomain={domain.map(d => `${d}`)}
                setSelectedColor={setSelectedColor}
                showNAColor
              />
            </div>
          ) : scale === 'threshold' ? (
            <div style={{ marginBottom: '-12px' }}>
              <ThresholdColorLegendWithMouseOver
                width={width}
                colorLegendTitle={colorLegendTitle}
                colors={
                  colors ||
                  (typeof domain[0] === 'string'
                    ? UNDPColorModule.categoricalColors.colors
                    : domain.length === 2
                    ? [
                        UNDPColorModule.sequentialColors.neutralColorsx09[0],
                        UNDPColorModule.sequentialColors.neutralColorsx09[8],
                      ]
                    : UNDPColorModule.sequentialColors[
                        `neutralColorsx0${
                          (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                        }`
                      ])
                }
                colorDomain={domain as number[]}
                setSelectedColor={setSelectedColor}
                naColor={noDataColor || UNDPColorModule.graphGray}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '-12px' }}>
              <LinearColorLegend
                width={width}
                colorLegendTitle={colorLegendTitle}
                colors={
                  colors || [
                    UNDPColorModule.sequentialColors.neutralColorsx09[0],
                    UNDPColorModule.sequentialColors.neutralColorsx09[8],
                  ]
                }
                colorDomain={domain as number[]}
              />
            </div>
          )
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-04)',
            width: '100%',
          }}
        >
          <div
            style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
            ref={graphDiv}
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                domain={domain}
                width={width || svgWidth}
                colors={
                  colors ||
                  (typeof domain[0] === 'string'
                    ? UNDPColorModule.categoricalColors.colors
                    : domain.length === 2
                    ? [
                        UNDPColorModule.sequentialColors.neutralColorsx09[0],
                        UNDPColorModule.sequentialColors.neutralColorsx09[8],
                      ]
                    : UNDPColorModule.sequentialColors[
                        `neutralColorsx0${
                          (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                        }`
                      ])
                }
                noDataColor={noDataColor || UNDPColorModule.graphGray}
                scaleType={scale}
                height={
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                showXTicks={
                  checkIfNullOrUndefined(showXTicks)
                    ? true
                    : (showXTicks as boolean)
                }
                leftMargin={
                  checkIfNullOrUndefined(leftMargin)
                    ? 100
                    : (leftMargin as number)
                }
                rightMargin={
                  checkIfNullOrUndefined(rightMargin)
                    ? 40
                    : (rightMargin as number)
                }
                topMargin={
                  checkIfNullOrUndefined(topMargin) ? 30 : (topMargin as number)
                }
                bottomMargin={
                  checkIfNullOrUndefined(bottomMargin)
                    ? 10
                    : (bottomMargin as number)
                }
                selectedColor={selectedColor}
                truncateBy={
                  checkIfNullOrUndefined(truncateBy)
                    ? 999
                    : (truncateBy as number)
                }
                showYTicks={
                  checkIfNullOrUndefined(showYTicks)
                    ? true
                    : (showYTicks as boolean)
                }
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                showValues={showValues}
                suffix={suffix || ''}
                prefix={prefix || ''}
              />
            ) : null}
          </div>
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
            width={width}
          />
        ) : null}
      </div>
    </div>
  );
}
