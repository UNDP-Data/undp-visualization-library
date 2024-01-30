import UNDPColorModule from 'undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { MultiLineChartDataType } from '../../../../Types';
import { Source } from '../../../Typography/Source';
import { GraphTitle } from '../../../Typography/GraphTitle';
import { GraphDescription } from '../../../Typography/GraphDescription';
import { FootNote } from '../../../Typography/FootNote';

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
  labels: string[];
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  tooltip?: (_d: any) => JSX.Element;
  hoveredDataPoint?: (_d: any) => void;
}

export function MultiLineChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    noOfXTicks,
    dateFormat,
    labels,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    hoveredDataPoint,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        flexGrow: 1,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-100)'
          : backgroundColor,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <div>
            {graphTitle ? <GraphTitle text={graphTitle} /> : null}
            {graphDescription ? (
              <GraphDescription text={graphDescription} />
            ) : null}
          </div>
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
              colors={colors || UNDPColorModule.categoricalColors.colors}
              width={width || svgWidth}
              height={height || svgHeight}
              noOfXTicks={noOfXTicks === undefined ? 10 : noOfXTicks}
              dateFormat={dateFormat || 'yyyy'}
              leftMargin={leftMargin === undefined ? 50 : leftMargin}
              rightMargin={rightMargin === undefined ? 30 : rightMargin}
              topMargin={topMargin === undefined ? 20 : topMargin}
              bottomMargin={bottomMargin === undefined ? 25 : bottomMargin}
              labels={labels}
              tooltip={tooltip}
              hoveredDataPoint={hoveredDataPoint}
            />
          ) : null}
        </div>
        {source || footNote ? (
          <div>
            {source ? <Source text={source} link={sourceLink} /> : null}
            {footNote ? <FootNote text={footNote} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
