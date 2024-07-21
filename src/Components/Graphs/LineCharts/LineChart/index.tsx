import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { LineChartDataType, ReferenceDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: LineChartDataType[];
  graphID?: string;
  color?: string;
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  noOfXTicks?: number;
  dateFormat?: string;
  showValues?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | null, number | null];
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
}

export function SimpleLineChart(props: Props) {
  const {
    data,
    graphTitle,
    color,
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
    showValues,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    highlightAreaSettings,
    graphID,
    minValue,
    maxValue,
    graphDownload,
    dataDownload,
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
            lineHeight: 0,
          }}
          ref={graphDiv}
        >
          {(width || svgWidth) && (height || svgHeight) ? (
            <Graph
              data={data}
              color={color || 'var(--blue-600)'}
              width={width || svgWidth}
              height={
                height ||
                (relativeHeight
                  ? (width || svgWidth) * relativeHeight
                  : svgHeight)
              }
              suffix={suffix || ''}
              prefix={prefix || ''}
              dateFormat={dateFormat || 'yyyy'}
              showValues={showValues}
              noOfXTicks={
                checkIfNullOrUndefined(noOfXTicks) ? 10 : (noOfXTicks as number)
              }
              leftMargin={
                checkIfNullOrUndefined(leftMargin) ? 50 : (leftMargin as number)
              }
              rightMargin={
                checkIfNullOrUndefined(rightMargin)
                  ? 30
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
              highlightAreaSettings={highlightAreaSettings || [null, null]}
              onSeriesMouseOver={onSeriesMouseOver}
              refValues={refValues}
              minValue={minValue}
              maxValue={maxValue}
            />
          ) : null}
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
