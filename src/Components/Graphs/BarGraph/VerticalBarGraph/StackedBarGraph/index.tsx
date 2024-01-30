import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { VerticalGroupedBarGraphDataType } from '../../../../../Types';
import { Source } from '../../../../Typography/Source';
import { GraphTitle } from '../../../../Typography/GraphTitle';
import { GraphDescription } from '../../../../Typography/GraphDescription';
import { FootNote } from '../../../../Typography/FootNote';

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
  hoveredDataPoint?: (_d: any) => void;
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
    hoveredDataPoint,
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
          gap: 'var(--spacing-05)',
          width: '100%',
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
            gap: 'var(--spacing-02)',
            width: '100%',
          }}
        >
          <div
            style={{
              lineHeight: 0,
            }}
          >
            {colorLegendTitle ? (
              <p
                className='undp-typography'
                style={{ fill: 'var(--gray-700)', fontSize: '0.875rem' }}
              >
                {colorLegendTitle}
              </p>
            ) : null}
            <div className='flex-div margin-bottom-00 flex-wrap'>
              {colorDomain.map((d, i) => (
                <div className='flex-div gap-03 flex-vert-align-center' key={i}>
                  <div
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '1rem',
                      backgroundColor: barColors[i],
                    }}
                  />
                  <p className='undp-typography margin-bottom-00 small-font'>
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
                hoveredDataPoint={hoveredDataPoint}
              />
            ) : null}
          </div>
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
