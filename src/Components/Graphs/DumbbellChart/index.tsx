import UNDPColorModule from 'undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { DumbbellChartDataType } from '../../../Types';
import { GraphHeader } from '../../Elements/GraphHeader';
import { GraphFooter } from '../../Elements/GraphFooter';
import { ColorLegend } from '../../Elements/ColorLegend';

interface Props {
  data: DumbbellChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  barPadding?: number;
  showDotValue?: boolean;
  showXTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  dotRadius?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

export function DumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    graphDescription,
    sourceLink,
    barPadding,
    showDotValue,
    showXTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    dotRadius,
    tooltip,
    onSeriesMouseOver,
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

  const dotColors = colors || UNDPColorModule.categoricalColors.colors;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
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
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
          />
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--spacing-04)',
            width: '100%',
          }}
        >
          <ColorLegend
            colorDomain={colorDomain}
            colors={dotColors}
            colorLegendTitle={colorLegendTitle}
          />
          <div
            style={{
              flexGrow: 1,
              width: '100%',
              lineHeight: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
            ref={graphDiv}
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                dotColors={dotColors}
                width={width || svgWidth}
                height={height || svgHeight}
                suffix={suffix || ''}
                prefix={prefix || ''}
                barPadding={barPadding === undefined ? 0.25 : barPadding}
                dotRadius={!dotRadius ? 3 : dotRadius}
                showDotValue={showDotValue === undefined ? true : showDotValue}
                showXTicks={showXTicks === undefined ? true : showXTicks}
                leftMargin={leftMargin === undefined ? 100 : leftMargin}
                rightMargin={rightMargin === undefined ? 40 : rightMargin}
                topMargin={topMargin === undefined ? 20 : topMargin}
                bottomMargin={bottomMargin === undefined ? 10 : bottomMargin}
                truncateBy={truncateBy === undefined ? 999 : truncateBy}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
              />
            ) : null}
          </div>
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
          />
        ) : null}
      </div>
    </div>
  );
}
