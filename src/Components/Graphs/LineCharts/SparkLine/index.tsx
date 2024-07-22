import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { LineChartDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';

interface Props {
  data: LineChartDataType[];
  color?: string;
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  dateFormat?: string;
  areaId?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
}

export function SparkLine(props: Props) {
  const {
    data,
    graphTitle,
    color,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    dateFormat,
    areaId,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
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
        width: width
          ? 'fit-content'
          : backgroundColor
          ? `calc(100% - 2*${padding || 'var(--spacing-05)'})`
          : `calc(100% - 2*${padding || 0})`,
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
              dateFormat={dateFormat || 'yyyy'}
              areaId={areaId}
              leftMargin={
                checkIfNullOrUndefined(leftMargin) ? 5 : (leftMargin as number)
              }
              rightMargin={
                checkIfNullOrUndefined(rightMargin)
                  ? 5
                  : (rightMargin as number)
              }
              topMargin={
                checkIfNullOrUndefined(topMargin) ? 10 : (topMargin as number)
              }
              bottomMargin={
                checkIfNullOrUndefined(bottomMargin)
                  ? 20
                  : (bottomMargin as number)
              }
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
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
