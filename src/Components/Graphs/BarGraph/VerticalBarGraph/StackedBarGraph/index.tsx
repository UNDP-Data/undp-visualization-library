import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { VerticalGroupedBarGraphDataType } from '../../../../../Types';
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
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
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
  } = props;
  const barColors = colors || UNDPColorModule.categoricalColors.colors;

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
                height={height || svgHeight}
                barPadding={barPadding === undefined ? 0.25 : barPadding}
                showBarLabel={showBarLabel === undefined ? true : showBarLabel}
                showYTicks={showYTicks === undefined ? true : showYTicks}
                truncateBy={truncateBy === undefined ? 999 : truncateBy}
                leftMargin={leftMargin === undefined ? 20 : leftMargin}
                rightMargin={rightMargin === undefined ? 20 : rightMargin}
                topMargin={topMargin === undefined ? 20 : topMargin}
                bottomMargin={bottomMargin === undefined ? 25 : bottomMargin}
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
