import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { MultiLineChartDataType, ReferenceDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegend } from '../../../Elements/ColorLegend';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: MultiLineChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  noOfXTicks?: number;
  dateFormat?: string;
  suffix?: string;
  prefix?: string;
  labels: string[];
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  showValues?: boolean;
  relativeHeight?: number;
  showColorLegendAtTop?: boolean;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | null, number | null];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  highlightedLines?: (string | number)[];
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
}

export function MultiLineChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    noOfXTicks,
    dateFormat,
    labels,
    padding,
    showValues,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorLegendAtTop,
    refValues,
    highlightAreaSettings,
    graphID,
    minValue,
    maxValue,
    highlightedLines,
    graphDownload,
    dataDownload,
    highlightAreaColor,
  } = props;

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
        height: 'inherit',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
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
          padding: backgroundColor
            ? padding || 'var(--spacing-05)'
            : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
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
            {showColorLegendAtTop ? (
              <ColorLegend
                colorDomain={labels}
                colors={colors || UNDPColorModule.categoricalColors.colors}
              />
            ) : null}
            <div
              style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  colors={colors || UNDPColorModule.categoricalColors.colors}
                  width={width || svgWidth}
                  height={
                    height ||
                    (relativeHeight
                      ? (width || svgWidth) * relativeHeight
                      : svgHeight)
                  }
                  dateFormat={dateFormat || 'yyyy'}
                  noOfXTicks={
                    checkIfNullOrUndefined(noOfXTicks)
                      ? 10
                      : (noOfXTicks as number)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 50
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 30
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 20
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 25
                      : (bottomMargin as number)
                  }
                  labels={labels}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showColorLegendAtTop={showColorLegendAtTop}
                  showValues={showValues}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  highlightAreaSettings={highlightAreaSettings || [null, null]}
                  refValues={refValues}
                  minValue={minValue}
                  maxValue={maxValue}
                  highlightedLines={highlightedLines || []}
                  highlightAreaColor={highlightAreaColor || 'var(--gray-300)'}
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
    </div>
  );
}
