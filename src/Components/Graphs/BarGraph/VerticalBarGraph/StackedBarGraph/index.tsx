import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import {
  ReferenceDataType,
  VerticalGroupedBarGraphDataType,
} from '../../../../../Types';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { ColorLegend } from '../../../../Elements/ColorLegend';

interface Props {
  data: VerticalGroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string;
  width?: number;
  height?: number;
  source?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  barPadding?: number;
  showBarLabel?: boolean;
  showYTicks?: boolean;
  colorDomain: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  showValues?: boolean;
  suffix?: string;
  prefix?: string;
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
}

export function VerticalStackedBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    barPadding,
    showBarLabel,
    showYTicks,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    truncateBy,
    padding,
    backgroundColor,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    relativeHeight,
    prefix,
    showValues,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
  } = props;

  const barColors = colors || UNDPColorModule.categoricalColors.colors;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);
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
      ref={graphParentDiv}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription || graphDownload || dataDownload ? (
          <GraphHeader
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
          />
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
          <ColorLegend
            colorDomain={colorDomain}
            colors={barColors}
            colorLegendTitle={colorLegendTitle}
          />
          <div
            style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
            ref={graphDiv}
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                barColors={barColors}
                width={width || svgWidth}
                height={
                  height ||
                  (relativeHeight
                    ? (width || svgWidth) * relativeHeight
                    : svgHeight)
                }
                barPadding={
                  checkIfNullOrUndefined(barPadding)
                    ? 0.25
                    : (barPadding as number)
                }
                showBarLabel={
                  checkIfNullOrUndefined(showBarLabel)
                    ? true
                    : (showBarLabel as boolean)
                }
                showYTicks={
                  checkIfNullOrUndefined(showYTicks)
                    ? true
                    : (showYTicks as boolean)
                }
                truncateBy={
                  checkIfNullOrUndefined(truncateBy)
                    ? 999
                    : (truncateBy as number)
                }
                leftMargin={
                  checkIfNullOrUndefined(leftMargin)
                    ? 20
                    : (leftMargin as number)
                }
                rightMargin={
                  checkIfNullOrUndefined(rightMargin)
                    ? 20
                    : (rightMargin as number)
                }
                topMargin={
                  checkIfNullOrUndefined(topMargin) ? 20 : (topMargin as number)
                }
                bottomMargin={
                  checkIfNullOrUndefined(bottomMargin)
                    ? 25
                    : (bottomMargin as number)
                }
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                showValues={showValues}
                suffix={suffix || ''}
                prefix={prefix || ''}
                refValues={refValues}
                maxValue={maxValue}
                onSeriesMouseClick={onSeriesMouseClick}
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
